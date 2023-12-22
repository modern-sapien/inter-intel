const fs = require('fs');
const path = require('path');

// READING FOR INITAL REFERENCE
function readSpecificFiles(filePaths) {
  let allContent = "";

  filePaths.forEach(filePath => {
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
}

// LOG FILE NAMES
function logFileNames(filePaths) {
  let fileNames = [];

  console.log("GPT Reading Reference Files:".green.bold);
  filePaths.forEach(filePath => {
    const fileName = path.basename(filePath);
    fileNames.push(fileName); // Add the file name to the array
  });

  return fileNames; // Return the array of file names
}

function appendToFile(filePath, data) {
  fs.appendFileSync(filePath, data + '\n');
}

// Example usage
const specificFiles = ['./google.spec.ts', './reference.txt']; // Replace with actual file paths
// const titles = logFileNames(specificFiles)

console.log("...".green.bold)
console.log("...".green.bold)
console.log("...".green.bold)
console.log("Files we're referencing during our interaction".green.bold, logFileNames(specificFiles))

// Export the function and the array
module.exports = {
  appendToFile,
  readSpecificFiles,
  specificFiles
};