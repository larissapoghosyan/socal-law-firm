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
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();

    if (data.type === "CLIENT_REVIEW") {
      var sheet = ss.getSheetByName("Testimonials");
      if (!sheet) sheet = ss.insertSheet("Testimonials");

      sheet.appendRow([
        timestamp,
        data.clientName || "Anonymous Client",
        data.matter || "General Legal Service",
        data.rating || 5,
        data.quote || "",
        "Pending Approval", // Column F (Status)
        false               // Column G (Approve Checkbox)
      ]);
    } else {
      var sheet = ss.getSheetByName("Leads");
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

// 2. Returns ONLY Approved Reviews to the Website
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Testimonials");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getDataRange().getValues();
    var approvedReviews = [];

    // Loop through rows (skip header row 1)
    for (var i = 1; i < rows.length; i++) {
      var status = rows[i][5];     // Column F (Status)
      var isApproved = rows[i][6]; // Column G (Approve Checkbox)

      // Publish ONLY if Approved is checked (TRUE) or status is "Approved"
      if (isApproved === true || isApproved === "TRUE" || status === "Approved") {
        approvedReviews.push({
          client: rows[i][1],
          matter: rows[i][2],
          rating: Number(rows[i][3]) || 5,
          quote: rows[i][4]
        });
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
