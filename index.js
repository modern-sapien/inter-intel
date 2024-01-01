// This is the index.js file of inter-intel
const path = require('path')
const OpenAI = require('openai');
const readline = require('readline');
const configPath = path.join(process.cwd(), 'interintel.config.js');
const config = require(configPath);
require('dotenv').config();
require('colors');

const { readSpecificFiles, writeFileFromPrompt } = require('./functions/file-functions.js');
const { askQuestion } = require('./functions/chat-functions.js');
const { aiChatCompletion } = require('./functions/openai-functions.js');

const { handleWriteFile } = require('./functions/handleWriteFile.js');

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
  // const specificFiles = ['./interintel.config.js'];
  let initialContent = readSpecificFiles(configPath);
  let messages = [{ role: 'system', content: initialContent }];

  let currentState = null;
  let promptFileName = '';
  let contentToWrite = '';

  while (true) {
    const userMessage = await askQuestion(rl, 'You: '.blue.bold);
    let response = ''; // Add a variable to capture the response message

    // Exit condition
    if (userMessage.toLowerCase() === 'exit') {
      console.log('Exiting chat...'.bgRed);
      rl.close();
      break;
    }

    if (userMessage.toLowerCase().startsWith('//writefile') && currentState === null) {
      ({ currentState, messages, promptFileName, response } = await handleWriteFile(
        openai,
        config,
        messages,
        currentState,
        ''
      ));
      console.log(response.yellow);
    } else if (currentState === 'awaitingFileName') {
      ({ currentState, messages, promptFileName, response } = await handleWriteFile(
        openai,
        config,
        messages,
        currentState,
        userMessage,
        promptFileName
      ));
      console.log(response.yellow);
    } else if (currentState === 'awaitingGPTPrompt') {
      ({ currentState, messages, promptFileName, response } = await handleWriteFile(
        openai,
        config,
        messages,
        currentState,
        userMessage,
        promptFileName
      ));
      console.log(response.yellow);
    } else if (currentState === null && userMessage.toLowerCase() === '//readrefs') {
      console.log('System message:'.bgYellow);
      console.log('Processing //readRefs command...'.yellow);

      let content = readSpecificFiles(configPath);
      messages.push({
        role: 'user',
        content: `please just acknowledge you have read the name and the content of the files I have provided ${content}`,
      });
      const completion = await aiChatCompletion(openai, messages, config.aiVersion);

      const botMessage = completion.choices[0].message.content;
      console.log('chatGPT message:'.bgGreen, botMessage);
      console.log('----------------'.bgGreen);
    } else {
      // Regular message processing and interaction with GPT model
      messages.push({ role: 'user', content: userMessage });

      const completion = await aiChatCompletion(openai, messages, config.aiVersion);

      const botMessage = completion.choices[0].message.content;
      console.log('chatGPT message:'.bgGreen, botMessage);
      console.log('----------------'.bgGreen);
    }
  }
}

exports.main = function() {
  main()
}

