const OpenAI = require('openai');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('colors');

const {
  readSpecificFiles,
  specificFiles,
} = require('./functions/file-functions.js');
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
      console.log('Exiting chat...'.bgRed);
      rl.close();
      break;
    }

    // Check for the command to update reference files
    if (userMessage.toLowerCase() === '//updatereference') {
      await updateReferenceFiles(
        rl,
        readSpecificFiles,
        specificFiles,
        __dirname,
        openai,
        messages
      );
      continue; // Continue to the next iteration of the loop
    }

    if (currentState === null && userMessage.toLowerCase() === '//updatefile') {
      currentState = 'awaitingFileName';
      console.log('Please provide file name to work with:'.yellow);
      continue;
    }

    if (currentState === 'awaitingFileName') {
      tempFilePath = userMessage;
      currentState = 'awaitingPrompt';
      console.log('Please provide prompt on what to update:'.yellow);
      continue;
    }

    if (currentState === 'awaitingPrompt') {
      const codeFocusedPrompt = `${userMessage} Please provide the response as code only. NO need to use code blocks.
      If there is any commentary, include it as comments // LIKE THIS in the code only.
      Your response is being ported directly to a file, so any superflous commentary outside of code is unnecessary
      Your entire response is code so no use for 'javascript' demarcation, nothing outside of that`;

      messages.push({ role: 'user', content: codeFocusedPrompt });
      currentState = null; // Reset state after getting the prompt
    } else {
      messages.push({ role: 'user', content: userMessage });
    }

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-4',
    });

    const botMessage = completion.choices[0].message.content;
    console.log('ChatGPT:'.green, botMessage.green);

    if (currentState === null && tempFilePath) {
      writeContentFile(tempFilePath, botMessage, __dirname);
      console.log(`File at ${tempFilePath} updated.`.bgYellow);
      tempFilePath = ''; // Clear tempFilePath after use
    }

    messages.push({ role: 'assistant', content: botMessage });
  }
}

main();
