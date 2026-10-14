/**
 * =========================================================================
 * VENTHULIR LIVE LEAD SYNC TO GOOGLE SHEETS / LIVE EXCEL
 * =========================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new) or your existing Leads sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any default code and paste this entire code below.
 * 4. Click "Save" (Floppy disk icon).
 * 5. Click the blue "Deploy" button (top right) > "New deployment".
 * 6. Under "Select type" (gear icon) -> select "Web app".
 * 7. Set:
 *    - Description: Venthulir Leads Sync
 *    - Execute as: Me (your Google email)
 *    - Who has access: Anyone  <-- (VERY IMPORTANT!)
 * 8. Click "Deploy", authorize permissions when prompted.
 * 9. Copy the "Web App URL" (looks like: https://script.google.com/macros/s/.../exec).
 * 10. Add that URL to your .env.local file:
 *     GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create Header row if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date",
        "Time",
        "Customer Name",
        "Mobile / WhatsApp",
        "District / Location",
        "Lead Source",
        "Timestamp"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1B5E2F");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Parse the JSON payload received from Venthulir website
    var data = JSON.parse(e.postData.contents);

    var date = data.date || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MMM-yyyy");
    var time = data.time || Utilities.formatDate(new Date(), "Asia/Kolkata", "hh:mm a");
    var name = data.name || "Unknown";
    var phone = "'" + (data.phone || ""); // Single quote prevents Excel from stripping leading zeros
    var location = data.location || "Not specified";
    var source = data.source || "Website Visitor Popup";
    var timestamp = data.timestamp || new Date().toISOString();

    // Append new lead as row
    sheet.appendRow([date, time, name, phone, location, source, timestamp]);

    
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Lead added successfully" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "active", message: "Venthulir Google Sheet Webhook is running." })
  ).setMimeType(ContentService.MimeType.JSON);
}
