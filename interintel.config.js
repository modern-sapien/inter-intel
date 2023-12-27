require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiVersion: `gpt-3.5-turbo`,
  filePaths: ['./inter-intel/training/reference.txt', './readme.md'],
};

module.exports = config;
