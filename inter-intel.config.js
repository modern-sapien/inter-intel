require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiVersion: `gpt-3.5-turbo`,
  filePaths: ['index.js', 'reference.txt'],
};

module.exports = config;