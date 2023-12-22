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

async function updateReferenceFiles(rl, readSpecificFiles, specificFiles, baseDir, openai, messages) {
  console.log('Updating reference files...');

  // Read the contents of the specific files
  let updatedContent = readSpecificFiles(specificFiles.map(file => path.join(baseDir, file)));

  // Check if there is content to update
  if (!updatedContent.trim()) {
    console.log('No content to update.');
    return;
  }

  // Add the updated content as a message to the chat history
  messages.push({
    role: 'user',
    content: `Updated reference content:\n${updatedContent}`
  });

  console.log('Reference files content added to the chat history.');

}

module.exports = {
  askQuestion, writeContentFile, updateReferenceFiles
}