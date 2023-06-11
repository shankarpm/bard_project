// Function to generate a response from ChatGPT
function generateChatResponse(inputText) {
  var apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key
  var apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // Replace with the appropriate API endpoint

  // Set the request payload
  var payload = {
    'prompt': inputText,
    'max_tokens': 50, // Adjust the number of tokens based on your needs
    'temperature': 0.7, // Adjust the temperature for generating more or less creative responses
  };

  // Make a POST request to the ChatGPT API
  var response = UrlFetchApp.fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload),
  });

  // Parse the response and extract the generated text
  var responseData = JSON.parse(response.getContentText());
  var generatedText = responseData.choices[0].text.trim();

  return generatedText;
}

// Function to handle user input and generate a response
function handleUserInput(input) {
  var response = generateChatResponse(input);
  return response;
}

// Function to run when a user submits a chat message in the sheet
function onChatMessageSubmit(e) {
  var sheet = e.source.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var userInput = sheet.getRange('A' + lastRow).getValue();
  var response = handleUserInput(userInput);
  sheet.getRange('B' + lastRow).setValue(response);
}

// Function to set up the onEdit trigger
function setUpOnEditTrigger() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onChatMessageSubmit')
    .forSpreadsheet(sheet)
    .onEdit()
    .create();
}
