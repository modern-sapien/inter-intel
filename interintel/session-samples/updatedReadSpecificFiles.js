// role: 'system',
// content: `I am sharing information from my file system for reference in our chat.\n
// File Name: ${fileMsg.fileName}\nContent:\n${fileMsg.content}
// \n Content for File Name: ${fileMsg.fileName}`


function readSpecificFiles(configFilePath) {
  try {
    const configContent = fs.readFileSync(configFilePath, 'utf8');    
    const config = eval(configContent);
    const filePaths = config.filePaths;
    const configDir = path.dirname(configFilePath);

    let allContent = 'I am sharing information from my file system for reference in our chat.\n';

    filePaths.forEach((filePath) => {
      try {
        const absolutePath = path.resolve(configDir, filePath);
        const fileContent = fs.readFileSync(absolutePath, 'utf8');

        allContent += `\nFile Name: ${filePath}\nContent:\n${fileContent}\n`;
      } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`.bgRed);
      }
    });

    return allContent;
  } catch (error) {
    console.error(`Error reading config file: ${error.message}`.bgRed);
    return '';
  }
}
