require('dotenv').config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  // only open ai models for now
  aiVersion: `ONLY_USE_OPENAI_MODEL`,
  // These filepaths are relative to where your config is created
  filePaths: ['interintel/interintelReadMe.md'],
};

module.exports = config;
