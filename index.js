const OpenAI = require('openai');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const config = require('./inter-intel.config.js');
require('dotenv').config();
require('colors');

const { readSpecificFiles } = require('./functions/file-functions.js');
const {
  askQuestion,
  writeContentFile,
} = require('./functions/chat-functions.js');

const openai = new OpenAI({
  apiKey: config.apiKey,
  model: config.aiVersion
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
      if (userMessage.startsWith('//readRefs')) {
        console.log('System message:'.bgYellow);
        console.log('Processing //readRefs command...'.yellow);
        const specificFiles = ['./.config.js'];
        const content = readSpecificFiles(specificFiles);
        messages.push({
          role: 'user',
          content: `please just acknowledge you have read the files and their names ${content}`,
        });
        const completion = await openai.chat.completions.create({
          messages: messages,
          model: config.aiVersion,
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
        model: config.aiVersion,
      });

      const botMessage = completion.choices[0].message.content;
      console.log('chatGPT message:'.bgGreen, botMessage);
      console.log('----------------'.bgGreen);
    }
  }
}

main();
