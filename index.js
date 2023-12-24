const OpenAI = require('openai');
const readline = require('readline');
const config = require('./inter-intel.config.js');
require('dotenv').config();
require('colors');

const {
  readSpecificFiles,
  writeFileFromPrompt,
} = require('./functions/file-functions.js');
const { askQuestion } = require('./functions/chat-functions.js');
const { aiChatCompletion } = require('./functions/openai-functions.js');

const openai = new OpenAI({
  apiKey: config.apiKey,
  model: config.aiVersion,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  // Provides initial context for session
  const specificFiles = ['./.config.js'];
  let initialContent = readSpecificFiles(specificFiles);
  let messages = [
    {
      role: 'system',
      content: initialContent,
    },
  ];

  let currentState = null;
  let promptFileName = '';
  let contentToWrite = '';

  while (true) {
    const userMessage = await askQuestion(rl, 'You: '.blue.bold);

    // Exit condition
    if (userMessage.toLowerCase() === 'exit') {
      console.log('Exiting chat...'.bgRed);
      rl.close();
      break;
    }
    if (userMessage.toLowerCase() === '//writefile' && currentState === null) {
      currentState = 'awaitingFileName';
      console.log('Please provide a name of the session file'.yellow);
      continue; // Skip the rest of the loop and start the next iteration
    } else if (currentState === 'awaitingFileName') {
      promptFileName = userMessage;
      currentState = 'awaitPrompt';
      console.log(
        'Please provide the prompt that will help the AI write'.yellow
      );
      continue; // Skip the rest of the loop and start the next iteration
    } else if (currentState === 'awaitPrompt') {
      contentToWrite = userMessage;
      console.log('here is some result'.yellow);

      console.log(
        writeFileFromPrompt(promptFileName, contentToWrite, __dirname),
        'result'.bgGreen
      );
      currentState = null; // Reset state after getting the prompt
      continue; // Skip the rest of the loop and start the next iteration
    }

    if (userMessage.startsWith('//')) {
      let currentState = null;

      if (userMessage.startsWith('//readRefs')) {
        console.log('System message:'.bgYellow);
        console.log('Processing //readRefs command...'.yellow);
        const specificFiles = ['./.config.js'];
        const content = readSpecificFiles(specificFiles);
        messages.push({
          role: 'user',
          content: `please just acknowledge you have read the files and their names ${content}`,
        });
        const completion = await aiChatCompletion(
          openai,
          messages,
          config.aiVersion
        );

        const botMessage = completion.choices[0].message.content;
        console.log('chatGPT message:'.bgGreen, botMessage);
        console.log('----------------'.bgGreen);
      }
    } else {
      // Regular message processing and interaction with GPT model
      messages.push({ role: 'user', content: userMessage });

      const completion = await aiChatCompletion(
        openai,
        messages,
        config.aiVersion
      );

      const botMessage = completion.choices[0].message.content;
      console.log('chatGPT message:'.bgGreen, botMessage);
      console.log('----------------'.bgGreen);
    }
  }
}

main();
