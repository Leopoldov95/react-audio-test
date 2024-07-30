// Main function to handle POST requests
function doPost(e) {
  const req = JSON.parse(e.postData.contents);
  return handleRequest(req);
}

// Function to handle the request
function handleRequest(req) {
  try {
    const tokenData = verifyOAuthToken(req.token);
    if (!tokenData) {
      return createErrorResponse(401, "Invalid Token, Please Sign In Again");
    }

    const { email, expires_in } = tokenData;
    if (expires_in <= 0) {
      return createErrorResponse(401, "Token has expired");
    }

    // if (!email.includes("@frequence.com")) {
    //   // invalid email
    //   return createErrorResponse(403, "Unauthorized");
    // }

    const sheetData = getSheetData(req.sheetId);
    const jsonData = convertToJSON(sheetData);

    return createSuccessResponse(jsonData, email);
  } catch (error) {
    Logger.log("Error: " + error.message);
    return createErrorResponse(
      500,
      "Something went wrong, please contact ICT Team"
    );
  }
}

// Function to verify OAuth token
function verifyOAuthToken(token) {
  const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`;
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const clientId =
    PropertiesService.getScriptProperties().getProperty("CLOUD_ID");
  if (data && data.aud === clientId) {
    return data;
  }
  return null;
}

// Function to get data from the sheet
function getSheetData(sheetId) {
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  return sheet.getDataRange().getValues();
}

// Helper function to convert 2D array to JSON
function convertToJSON(data) {
  const headers = data[0];
  const jsonArray = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }

    jsonArray.push(obj);
  }

  return jsonArray;
}

// Function to create a success response
function createSuccessResponse(data, email) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 200,
      data: {
        data: data,
        email: email,
      },
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Function to create an error response
function createErrorResponse(statusCode, message) {
  const response = {
    status: statusCode,
    message: message,
  };
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}
