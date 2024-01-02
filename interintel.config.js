require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiVersion: `gpt-3.5-turbo`,
  filePaths: ['./resources/reference.txt', './README.md'],
};

module.exports = config;