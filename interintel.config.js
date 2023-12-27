require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiVersion: `gpt-4`,
  filePaths: ['./inter-intel/training/reference.txt', './readme.md'],
};

module.exports = config;
