const fs = require('fs');
const path = require('path');

async function askQuestion(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt.blue, (input) => {
      resolve(input);
    });
  });
}

function parseCommandAndWriteToFile(userMessage, gptResponse, baseDir) {
  if (userMessage.toLowerCase().startsWith('gpt write to file:')) {
    const commandParts = userMessage.slice(19).trim().split(',');
    if (commandParts.length >= 2) {
      const writeToFilePath = commandParts[0].trim();
      const contentToWrite = gptResponse;
      
      // Overwrite the file with the new content
      fs.writeFileSync(path.join(baseDir, writeToFilePath), contentToWrite + '\n');
      return `GPT response written to ${writeToFilePath}.`;
    }
  }
  return null;
}


module.exports = {
  askQuestion, parseCommandAndWriteToFile
}