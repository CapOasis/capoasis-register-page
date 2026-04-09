# 📊 Connecting to Google Sheets (For Free)

To connect your masterclass form to Google Sheets without paying for any third-party tools, follow these 5 simple steps:

### 1. Create a New Google Sheet
- Create a new Google Sheet.
- In the first row, add these exact headers (must match the form names):
  **Full Name | Email | Phone | City | Timestamp**

### 2. Open the Script Editor
- Go to **Extensions** → **Apps Script**.
- Delete any existing code and paste this script:

```javascript
/* 
  Paste this into Google Apps Script Editor 
*/
const SHEET_NAME = 'Sheet1'; // Default name is Sheet1

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = e.parameter;
    
    // Add a new row with the data
    sheet.appendRow([
      data.name, 
      data.email, 
      data.phone, 
      data.city, 
      new Date()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. Deploy as a Web App
- Click **Deploy** → **New Deployment**.
- Select Type: **Web App**.
- Description: `Masterclass Leads`
- Execute as: **Me**.
- Who has access: **Anyone** (This is required for the form to submit).
- Click **Deploy**.
- **COPY THE WEB APP URL** (Looks like `https://script.google.com/macros/s/.../exec`).

### 4. Update Your Code
- Open `script.js` in your workspace.
- Replace `YOUR_GOOGLE_SCRIPT_URL` with the URL you just copied.

### 5. Test It!
- Open your website, fill out the form, and click submit.
- The data will instantly appear in your Google Sheet! 🚀

---

> [!TIP]
> This method is completely free and supports unlimited submissions. Just ensure the column headers in your Google Sheet match the names used in your input fields (`name`, `email`, `phone`, `city`).
