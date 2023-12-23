require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  filePaths: ['index.js', 'reference.txt'],
};

module.exports = config;