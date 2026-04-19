// ══════════════════════════════════════════════════
//  Google Apps Script — BOT NHẬP LIỆU Landing Page
//  Dán toàn bộ code này vào Apps Script, deploy → Web App
// ══════════════════════════════════════════════════

var SHEET_ID = '1OS4iCH-UKOkOfp7QHvuTwIRTC3t4-0mwR9ObypU9Ad4';

function doPost(e) {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Leads') || ss.getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    // Tạo header nếu sheet còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Thời gian', 'Họ tên', 'Số điện thoại', 'Ngành', 'Nguồn form',
        'utm_source', 'utm_medium', 'utm_campaign'
      ]);
    }

    sheet.appendRow([
      new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      data.name         || '',
      data.phone        || '',
      data.business     || '',
      data.source       || 'hero-form',
      data.utm_source   || 'direct',
      data.utm_medium   || '',
      data.utm_campaign || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test bằng cách chạy hàm này trong editor
function testSetup() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getActiveSheet();
  Logger.log('Connected: ' + sheet.getName());
}
