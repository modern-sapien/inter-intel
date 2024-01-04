require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiService: 'ollama',
  aiVersion: `mistral`,
  filePaths: ['./functions/openai-functions.js', './README.md'],
};

module.exports = config;