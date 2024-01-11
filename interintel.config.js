import dotenv from 'dotenv';
dotenv.config();

const config = {
  apiKey: `${process.env.MISTRAL_API_KEY}`,
  aiService: 'ollama',
  aiVersion: `mistral:instruct`,
  filePaths: [
    'resources/reference.txt'  
  ],
};

export default config;
