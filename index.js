import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import colors from 'colors';
const configPath = path.join(process.cwd(), 'interintel.config.js');

import config from './interintel.config.js';
import { readSpecificFiles } from './functions/file-functions.js';
import { askQuestion } from './functions/chat-functions.js';
import { handleWriteFile } from './functions/handleWriteFile.js';
import { chatCompletion } from './serviceInterface.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  let initialContent = await readSpecificFiles(configPath);
  let messages = [{ role: 'system', content: initialContent }];

  let currentState = null;
  let promptFileName = '';

  while (true) {
    const userMessage = await askQuestion(rl, 'You: '.blue.bold);
    let response = '';

    // Exit condition
    if (userMessage.toLowerCase() === 'exit') {
      console.log('Exiting chat...'.bgRed);
      rl.close();
      break;
    }

    if (userMessage.toLowerCase().startsWith('//writefile') && currentState === null) {
      let result = await handleWriteFile(config, messages, currentState, '');
      ({ currentState, messages, promptFileName, response } = result); // Update messages array
      console.log(response.yellow);
    } else if (currentState === 'awaitingFileName') {
      ({ currentState, messages, promptFileName, response } = await handleWriteFile(
        config,
        messages,
        currentState,
        userMessage,
        promptFileName
      ));
      console.log(response.yellow);
    } else if (currentState === 'awaitingAIprompt') {
      ({ currentState, messages, promptFileName, response } = await handleWriteFile(
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
        content: `please just acknowledge you have read the name and the content of the files I have provided. once you have done this a single time you do not need to do it again. ${content}`,
      });
      const completion = await chatCompletion(config.aiService, messages, config.aiVersion);

      let botMessage = '';

      if (config.aiService === 'openai' || config.aiService === 'mistral') {
        botMessage = completion.choices[0].message.content;
      } else if (config.aiService === 'ollama') {
        // Adjust this line based on how Ollama's response is structured
        botMessage = completion;
      }
    } else {
      // Regular message processing and interaction with GPT model
      messages.push({ role: 'user', content: userMessage });

      const completion = await chatCompletion(config.aiService, messages, config.aiVersion);

      let botMessage;
      if (config.aiService === 'openai' || config.aiService === 'mistral') {
        botMessage = completion.choices[0].message.content;
      } else if (config.aiService === 'ollama') {
        // Adjust based on Ollama's response format
        botMessage = completion; // Example - replace with actual response structure for Ollama
      }

      console.log(`${config.aiVersion}`.bgGreen, botMessage.green);
      console.log('----------------'.bgGreen);
    }
  }
}

export { main };

main();
