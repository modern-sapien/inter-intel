const fs = require('fs');
const path = require('path');

async function askQuestion(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt.blue, (input) => {
      resolve(input);
    });
  });
}

function writeContentFile(writeToFilePath, contentToWrite) {
  try {
    const directoryPath = path.join(__dirname, 'inter-intel/session-samples');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const fullPath = path.join(directoryPath, writeToFilePath);

    fs.writeFileSync(fullPath, contentToWrite + '\n');

    const relativePath = path.relative(__dirname, fullPath);
    console.log(`Content written to ${relativePath}`);
    return true;
  } catch (error) {
    console.error(`Error in writeContentFile: ${error.message}`.bgRed);
    return false;
  }
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