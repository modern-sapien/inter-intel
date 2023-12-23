const fs = require('fs');
const path = require('path');

// READING FOR INITAL REFERENCE
function readSpecificFiles(filePaths) {
  const configFilePath = path.join(__dirname, '../inter-intel.config.js');
  
  try {
    // Read the content of the config file
    const configContent = fs.readFileSync(configFilePath, 'utf8');    
    // Parse the config file content as JavaScript
    const config = eval(configContent);
    // Extract the file paths from the config object
    const filePaths = config.filePaths;
    
    let allContent = '';
  
    filePaths.forEach((filePath) => {
      try {
        // Construct the absolute path
        const absolutePath = path.resolve(filePath);
  
        // Read the file content and append it to allContent
        allContent += fs.readFileSync(absolutePath, 'utf8') + '\n';
      } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
      }
    });
  
    return allContent;
  } catch (error) {
    console.error(`Error reading config file: ${error.message}`);
    return '';
  }
}
// Get files from user
function getFilePathsFromUser(rl) {
  return new Promise((resolve) => {
    rl.question('Enter comma-separated file paths: ', (input) => {
      const filePaths = input.split(',').map((filePath) => filePath.trim());
      resolve(filePaths);
    });
  });
}

// LOG FILE NAMES
function logFileNames(filePaths) {
  let fileNames = [];

  console.log('GPT Reading Reference Files:'.green.bold);
  filePaths.forEach((filePath) => {
    const fileName = path.basename(filePath);
    fileNames.push(fileName); // Add the file name to the array
  });

  return fileNames; // Return the array of file names
}

function appendToFile(filePath, data) {
  fs.appendFileSync(filePath, data + '\n');
}

// Example usage
const specificFiles = [
  './functions/file-functions.js',
  './functions/chat-functions.js',
  'index.js',
  './reference.txt',
]; // Replace with actual file paths
// const titles = logFileNames(specificFiles)

console.log('...'.green.bold);
console.log('...'.green.bold);
console.log('...'.green.bold);
console.log(
  'Files content that will guide our interactions moving forward'.green.bold,
  logFileNames(specificFiles)
);

// Export the function and the array
module.exports = {
  appendToFile,
  readSpecificFiles,
  specificFiles,
  getFilePathsFromUser
};
