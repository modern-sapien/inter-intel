require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  filePaths: ['./functions/file-functions.js', './functions/chat-functions.js', 'index.js', './reference.txt'],
};

module.exports = config;