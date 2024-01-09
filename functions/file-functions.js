import fs from 'fs';
import path from 'path';

// READING FOR INITAL REFERENCE
async function readSpecificFiles(configFilePath) {
  try {
    // Dynamically import the config file
    const absoluteConfigPath = path.resolve(configFilePath);
    const configModule = await import('file://' + absoluteConfigPath);
    const config = configModule.default;

    const filePaths = config.filePaths;
    let allContent = 'I am sharing information from my file system for reference in our chat.\n';

    for (const filePath of filePaths) {
      try {
        // Construct the absolute path
        const absolutePath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(absolutePath, 'utf8');

        // Read the file content and add it to allContent
        allContent += `\nStart File Name: ${filePath}\n File Content:\n${fileContent}\n End File Name: ${filePath}`;
      } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
      }
    }

    // Add console.log statements to communicate to the user
    console.log(
      `${config.aiVersion} sent reference files:`.yellow,
      `${logFileNames(filePaths)}`.yellow
    );
    return allContent;
  } catch (error) {
    console.error(`Error reading config file: ${error.message}`);
    return '';
  }
}

function writeFileFromPrompt(promptFileName, contentToWrite, baseDir) {
  try {
    if (!promptFileName.includes('.')) {
      throw new Error(
        "Invalid file name. Please include a file name with an extension (e.g., 'output.txt')."
      );
    }

    const projectRoot = process.cwd();
    const fullPath = path.join(projectRoot, `interintel/session-samples/${promptFileName}`);
    const directoryPath = path.dirname(fullPath);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, contentToWrite + '\n');
    console.log(`Content written to ${fullPath}`.yellow);
    return true;
  } catch (error) {
    console.error(`Error writing file: ${error.message}`.bgRed);
    return false;
  }
}

// LOG FILE NAMES
function logFileNames(filePaths) {
  let fileNames = [];

  console.log('');
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
export { readSpecificFiles, writeFileFromPrompt };
