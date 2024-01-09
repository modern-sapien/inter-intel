import dotenv from 'dotenv';
dotenv.config();

const config = {
  apiKey: `${process.env.OPENAI_API_KEY}`,
  aiService: 'ollama',
  aiVersion: `mistral`,
  filePaths: ['serviceInterface.js'],
};

export default config;
