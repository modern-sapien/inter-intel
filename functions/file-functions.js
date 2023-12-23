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
        console.error(`Error reading file ${filePath}: ${error.message}`.bgRed);
      }
    });

    // Add console.log statements to communicate to the user
    console.log(`AI Reading Reference Files:`.yellow, logFileNames(filePaths));
  
  
    return allContent;
  } catch (error) {
    console.error(`Error reading config file: ${error.message}`.bgRed);
    return '';
  }
}

// LOG FILE NAMES
function logFileNames(filePaths) {
  let fileNames = [];

  console.log("")
  console.log(`System message`.bgYellow + `: `.yellow);
  filePaths.forEach((filePath) => {
    const fileName = path.basename(filePath);
    fileNames.push(fileName); // Add the file name to the array
  });

  return fileNames; // Return the array of file names
}

function appendToFile(filePath, data) {
  fs.appendFileSync(filePath, data + '\n');
}

// Export the function and the array
module.exports = {
  readSpecificFiles,
};
