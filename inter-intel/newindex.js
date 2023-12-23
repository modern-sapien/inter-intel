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
  // Prompt the user to enter the file paths
  const userFilePaths = await getFilePathsFromUser(rl);

  // Use the provided file paths
  const specificFiles = userFilePaths;
  const directoryContent = readSpecificFiles(specificFiles);

  let currentState = null;
  let tempFilePath = '';
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
      If there is any commentary you feel is necessary, include it as comments // like this in the code only.
      Your response is being ported directly to a file, so any superflous commentary outside of code is unnecessary
      Your entire response is code being received in a FILE, so any commentary without // breaks the code`;

      messages.push({ role: 'user', content: codeFocusedPrompt });
      currentState = null; // Reset state after getting the prompt
    } else {
      messages.push({ role: 'user', content: userMessage });
    }

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
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
```

In the updated `index.js`, we prompt the user to enter the file paths before starting the chat session. The provided file paths are used to populate the `specificFiles` array. The `readSpecificFiles` function is updated to read the content of the user-provided files.

The rest of the code remains the same, with the chat functionality and file updating logic intact.
