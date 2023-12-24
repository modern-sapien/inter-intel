require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiVersion: `gpt-3.5-turbo`,
  // filePaths: ['index.js', './inter-intel/training/defaults/reference.txt', 'inter-intel.config.js'],
  filePaths: ['inter-intel/training/defaults/reference.txt', 'index.js'],
};

module.exports = config;
