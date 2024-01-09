import dotenv from 'dotenv';
dotenv.config();

const config = {
  apiKey: `${process.env.MISTRAL_API_KEY}`,
  aiService: 'mistral',
  aiVersion: `mistral-tiny`,
  filePaths: ['serviceInterface.js'],
};

export default config;
