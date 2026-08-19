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
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.firstName || '',
      data.lastName || '',
      data.phone || '',
      data.email || '',
      data.practiceArea || '',
      data.message || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.message }))
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
