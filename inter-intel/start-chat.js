
function readSpecificFiles(filePaths) {
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
}

function getFilePathsFromUser(rl) {
  return new Promise((resolve) => {
    rl.question('Enter comma-separated file paths: ', (input) => {
      const filePaths = input.split(',').map((filePath) => filePath.trim());
      resolve(filePaths);
    });
  });
}

async function main() {
  const userFilePaths = await getFilePathsFromUser(rl);

  // Use the provided file paths
  const specificFiles = userFilePaths;
  const directoryContent = readSpecificFiles(specificFiles);
  // ... Rest of the code
}