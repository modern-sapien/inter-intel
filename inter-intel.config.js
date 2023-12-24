require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiVersion: `gpt-3.5-turbo`,
  filePaths: ['index.js', 'reference.txt', 'inter-intel.config.js'],
  // filePaths: ['index.js,','reference.txt', 'functions/chat-functions.js', 'functions/file-functions.js'],
};

module.exports = config;