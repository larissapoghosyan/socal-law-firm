# Connecting Form Submissions to Google Sheets

This website is fully static and hosted on GitHub Pages. Contact form submissions are sent directly to your Google Sheet via Google Apps Script (no backend server required).

---

## 1-Minute Setup Instructions

### Step 1: Open Google Sheets
1. Create a new sheet at [sheets.google.com](https://sheets.google.com).
2. Set the top row header columns (Row 1):
   - **Column A**: `Timestamp`
   - **Column B**: `First Name`
   - **Column C**: `Last Name`
   - **Column D**: `Phone`
   - **Column E**: `Email`
   - **Column F**: `Practice Area`
   - **Column G**: `Message`

### Step 2: Add Google Apps Script
1. In Google Sheets, click **Extensions** > **Apps Script**.
2. Replace all existing code in the editor with the following:

```javascript
// 1. Handles Incoming Submissions (Leads & Testimonials)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "No active spreadsheet found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var rawData = (e && e.postData && e.postData.contents) ? e.postData.contents : null;
    var data = rawData ? JSON.parse(rawData) : (e ? e.parameter : {});
    var timestamp = new Date();

    // Check if review or lead
    var isReview = (data.type === "CLIENT_REVIEW" || data.quote || data.clientName);

    if (isReview) {
      var sheet = ss.getSheetByName("Testimonials");
      if (!sheet) {
        var sheets = ss.getSheets();
        for (var s = 0; s < sheets.length; s++) {
          if (sheets[s].getName().trim().toLowerCase().includes("testimonial")) {
            sheet = sheets[s];
            break;
          }
        }
      }
      if (!sheet) sheet = ss.insertSheet("Testimonials");

      sheet.appendRow([
        timestamp,
        data.clientName || data.client || "Anonymous Client",
        data.matter || data.practiceArea || "General Legal Service",
        data.rating || 5,
        data.quote || data.message || "",
        "Pending Approval", // Column F (Status)
        false               // Column G (Approve Checkbox)
      ]);
    } else {
      var sheet = ss.getSheetByName("Leads");
      if (!sheet) {
        var sheets = ss.getSheets();
        for (var s = 0; s < sheets.length; s++) {
          if (sheets[s].getName().trim().toLowerCase().includes("lead")) {
            sheet = sheets[s];
            break;
          }
        }
      }
      if (!sheet) sheet = ss.insertSheet("Leads");

      sheet.appendRow([
        timestamp,
        data.firstName || "",
        data.lastName || "",
        data.phone || "",
        data.email || "",
        data.practiceArea || "",
        data.message || ""
      ]);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. Returns ONLY Approved Reviews to the Website (Header-Smart Scanner)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Find sheet matching Testimonials (case-insensitive & trimmed)
    var sheets = ss.getSheets();
    var sheet = null;
    for (var s = 0; s < sheets.length; s++) {
      var name = sheets[s].getName().trim().toLowerCase();
      if (name === "testimonials" || name === "testimonial" || name.includes("testimonial")) {
        sheet = sheets[s];
        break;
      }
    }
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }

    // Dynamic Column Index Finder from Row 1 Header
    var header = rows[0].map(function(h) { return String(h).trim().toLowerCase(); });
    var colClient = header.findIndex(function(h) { return h.includes("client") || h.includes("name"); });
    var colMatter = header.findIndex(function(h) { return h.includes("matter") || h.includes("practice") || h.includes("area"); });
    var colRating = header.findIndex(function(h) { return h.includes("rating") || h.includes("star"); });
    var colQuote  = header.findIndex(function(h) { return h.includes("review") || h.includes("quote") || h.includes("text"); });
    var colStatus = header.findIndex(function(h) { return h.includes("status"); });
    var colApprove = header.findIndex(function(h) { return h.includes("approve") || h.includes("publish"); });

    // Fallbacks if header labels vary
    if (colClient === -1) colClient = 1;
    if (colMatter === -1) colMatter = 2;
    if (colRating === -1) colRating = 3;
    if (colQuote === -1) colQuote = 4;
    if (colStatus === -1) colStatus = 5;
    if (colApprove === -1) colApprove = 6;

    var approvedReviews = [];

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var statusVal = String(row[colStatus] || "").trim().toLowerCase();
      var approveVal = row[colApprove];

      var isApproved = (approveVal === true || String(approveVal).trim().toUpperCase() === "TRUE" || statusVal === "approved");

      if (isApproved) {
        var clientVal = String(row[colClient] || "Verified Client").trim();
        var matterVal = String(row[colMatter] || "Legal Services").trim();
        var ratingVal = Number(row[colRating]) || 5;
        var quoteVal  = String(row[colQuote] || "").trim();

        if (quoteVal.length > 0) {
          approvedReviews.push({
            client: clientVal,
            clientName: clientVal,
            matter: matterVal,
            rating: ratingVal,
            quote: quoteVal
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify(approvedReviews))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy as Web App
1. Click **Deploy** > **New deployment** (top right).
2. Select type: **Web app** (click cog icon next to "Select type").
3. Configuration:
   - **Description**: `SoCal Legal Group Contact Form`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Important: Must be 'Anyone' so static site form submissions can send data)*
4. Click **Deploy** and authorize permissions when prompted.
5. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

### Step 4: Add URL to Frontend
In `frontend/.env` (or in repository GitHub Secrets as `VITE_GOOGLE_SHEETS_URL`):

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

That's it! Every contact submission on your GitHub Pages site will instantly populate a new row in your Google Sheet.
