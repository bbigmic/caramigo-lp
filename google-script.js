function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Sprawdź czy nagłówki istnieją, jeśli nie - dodaj je
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data', 'Kierunkowy', 'Numer telefonu', 'Zgoda na powiadomienia']);
  }
  
  const data = JSON.parse(e.postData.contents);
  
  // Dodaj timestamp
  const timestamp = new Date();
  
  // Zapisz dane do arkusza: timestamp, kierunkowy, numer telefonu, zgoda
  sheet.appendRow([timestamp, data.prefix, data.phone, data.consent ? 'Tak' : 'Nie']);
  
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'success',
    'row': sheet.getLastRow()
  })).setMimeType(ContentService.MimeType.JSON);
} 