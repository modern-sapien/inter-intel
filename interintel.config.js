require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  hosted: 'public',
  aiVersion: `gpt-3.5-turbo`,
  filePaths: ['./interintel/session-samples/updatedReadSpecificFiles.js', './functions/file-functions.js'],
};

module.exports = config;