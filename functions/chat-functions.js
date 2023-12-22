const fs = require('fs');
const path = require('path');

async function askQuestion(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt.blue, (input) => {
      resolve(input);
    });
  });
}

function writeContentFile(writeToFilePath, contentToWrite, baseDir) {
  try {
    // Ensure the directory path is correctly set
    const directoryPath = path.join(baseDir, 'inter-intel/');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true }); // Create directory if it doesn't exist
    }

    // Ensure filePath is correctly formatted
    if (!writeToFilePath.startsWith('/')) {
      writeToFilePath = '/' + writeToFilePath;
    }
    const fullPath = path.join(directoryPath, writeToFilePath);

    // Use a relative path for logging and returning
    const relativePath = path.relative(baseDir, fullPath);
    console.log(`Writing to: ${relativePath}`.bgYellow); // Debug: Log the relative file path
    
    fs.writeFileSync(fullPath, contentToWrite + '\n');
    return `GPT response written to ${relativePath}.`; // Return the relative path
    
  } catch (error) {
    console.error(`Error in writeContentFile: ${error}`); // Log any errors
  }
  return null;
}


module.exports = {
  askQuestion, writeContentFile
}