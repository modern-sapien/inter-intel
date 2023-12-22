const OpenAI = require('openai');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('colors');

const {
  readSpecificFiles,
  specificFiles,
  appendToFile,
} = require('./file-functions.js');
const { askQuestion } = require('./chat-functions');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  // Use readDirRecursively to get all file contents
  let directoryContent = readSpecificFiles(specificFiles);

  let messages = [
    {
      role: 'system',
      content: directoryContent,
    },
  ];

  while (true) {
    const userMessage = await askQuestion(rl, 'You: ');

    // Exit condition
    if (userMessage.toLowerCase() === 'exit') {
      console.log('Exiting chat...'.red);
      rl.close();
      break;
    }

    if (userMessage.toLowerCase().startsWith('update file: ')) {
      const updateContent = userMessage.slice(13); // Remove 'update file: ' part
      appendToFile(path.join(__dirname, 'reference.txt'), updateContent);
      console.log('File updated.'.bgYellow);
      continue; // Skip sending this to GPT
    }

    messages.push({ role: 'user', content: userMessage });

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
    });

    const botMessage = completion.choices[0].message.content;
    console.log('ChatGPT:'.green, botMessage.green);

    messages.push({ role: 'assistant', content: botMessage });
  }
}

main();
