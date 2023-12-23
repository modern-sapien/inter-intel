const OpenAI = require('openai');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('colors');

const { readSpecificFiles } = require('./functions/file-functions.js');
const {
  askQuestion,
  writeContentFile,
  updateReferenceFiles,
} = require('./functions/chat-functions.js');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  let currentState = null; // Initialize currentState
  let tempFilePath = '';
  // Use readDirRecursively to get all file contents
  const specificFiles = ['./.config.js'];
  let directoryContent = readSpecificFiles(specificFiles);

  let messages = [
    {
      role: 'system',
      content: directoryContent,
    },
  ];

  while (true) {
    const userMessage = await askQuestion(rl, 'You: '.blue.bold);

    // Exit condition
    if (userMessage.toLowerCase() === 'exit') {
      console.log('Exiting chat...'.bgRed);
      rl.close();
      break;
    }

    if (userMessage.startsWith('//')) {
      console.log('cool guy no gpt');

      if (userMessage.startsWith('//readRefs')) {
        console.log('Processing //readReference command...'.yellow);
        const specificFiles = ['./.config.js'];
        const content = readSpecificFiles(specificFiles);
        messages.push({
          role: 'user',
          content: `please just acknowledge you have read the files and their names ${content}`,
        });
        const completion = await openai.chat.completions.create({
          messages: messages,
          model: 'gpt-3.5-turbo',
        });
  
        const botMessage = completion.choices[0].message.content;
        console.log('chatGPT message:'.bgGreen, botMessage);
        console.log('----------------'.bgGreen);  
      }
    } else {
      // Regular message processing and interaction with GPT model
      messages.push({ role: 'user', content: userMessage });

      const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
      });

      const botMessage = completion.choices[0].message.content;
      console.log('chatGPT message:'.bgGreen, botMessage);
      console.log('----------------'.bgGreen);
    }
  }
}

main();
