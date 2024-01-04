require('dotenv').config();

const config = {
  // this is service dependent
  apiKey: `${process.env.OPENAI_API_KEY}`,
  // openai || ollama
  aiService: 'ONE_OF_THE_ABOVE',
  // only open ai or ollama models for now
  aiVersion: `ONLY_USE_OPENAI_OR_OLLAMA_MODELS`,
  // These filepaths are relative to where your config is created
  filePaths: ['interintel/interintelReadMe.md'],
};

module.exports = config;
