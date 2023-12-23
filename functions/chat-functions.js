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
    const directoryPath = path.join(baseDir, 'inter-intel/session-samples');
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
    console.log(`System message`.yellow)
    console.log(`Writing to: -> --> ->  `.yellow + `${relativePath}`); // Debug: Log the relative file path
    
    fs.writeFileSync(fullPath, contentToWrite + '\n');
    return 
    
  } catch (error) {
    console.error(`Error in writeContentFile: ${error}`.bgRed); // Log any errors
  }
  return null;
}

async function updateReferenceFiles(rl, readSpecificFiles, specificFiles, baseDir, openai, messages) {
  console.log('Updating reference files...'.yellow);

  let updatedContent = '';

  for (const file of specificFiles) {
    // Construct the full path of the file
    const fullPath = path.join(baseDir, file);

    // Log the name of the file
    console.log(`Reading file: ${fullPath}`.yellow);

    try {
      // Read the file content
      const content = fs.readFileSync(fullPath, 'utf8');
      updatedContent += content + '\n';
    } catch (error) {
      console.error(`Error reading file ${fullPath}: ${error.message}`.bgRed);
    }
  }

  // Check if there is content to update
  if (!updatedContent.trim()) {
    console.log('No content to update.'.bgRed);
    return;
  }

  // Add the updated content as a message to the chat history
  messages.push({
    role: 'user',
    content: `Updated reference content:\n${updatedContent}`
  });

  console.log('Reference files content added to the chat history.'.bgYellow);

}

module.exports = {
  askQuestion, writeContentFile, updateReferenceFiles
}