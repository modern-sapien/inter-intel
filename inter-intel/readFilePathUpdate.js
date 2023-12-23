function readSpecificFiles() {
  const configFilePath = path.join(__dirname, '../.config.js');
  try {
    const configContent = fs.readFileSync(configFilePath, 'utf8');
    const config = eval(configContent);
    const filePaths = config.filePaths;
    let allContent = '';
    filePaths.forEach((filePath) => {
      try {
        const absolutePath = path.resolve(filePath);
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
