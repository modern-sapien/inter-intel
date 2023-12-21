const fs = require('fs');
const path = require('path');

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

function logFileNames(filePaths) {
  let fileNames = [];

  console.log("Reading files:".bgGreen);
  filePaths.forEach(filePath => {
    const fileName = path.basename(filePath);
    console.log(fileName);
    fileNames.push(fileName); // Add the file name to the array
  });

  return fileNames; // Return the array of file names
}


// Example usage
const specificFiles = ['./google.spec.ts', 'chat-functions.js', 'openai-test.js', './reference.txt']; // Replace with actual file paths
// const titles = logFileNames(specificFiles)
console.log("Files we're referencing during our interaction", logFileNames(specificFiles))

// Export the function and the array
module.exports = {
  readSpecificFiles,
  specificFiles
};