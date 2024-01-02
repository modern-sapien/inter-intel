const path = require('path')
const { aiChatCompletion } = require('./openai-functions.js');
const { writeFileFromPrompt } = require('./file-functions.js');
const configPath = path.join(process.cwd(), 'interintel.config.js');
const config = require(configPath);


async function handleWriteFile(openai, config, messages, currentState, userInput, promptFileName) {
  let contentToWrite = '';

  if (currentState === null) {
    currentState = 'awaitingFileName';
    return { currentState, messages, promptFileName, response: 'Please provide a name for the session file:' };
  } else if (currentState === 'awaitingFileName') {
    promptFileName = userInput;
    currentState = 'awaitingGPTPrompt';
    return { currentState, messages, promptFileName, response: `Please provide a prompt for ${config.aiVersion}:` };
  } else if (currentState === 'awaitingGPTPrompt') {
    const promptForGPT = userInput;
    try {
      let gptResponse = await aiChatCompletion(openai, [{ role: 'user', content: promptForGPT }], config.aiVersion);
      contentToWrite = gptResponse.choices[0].message.content;
      await writeFileFromPrompt(promptFileName, contentToWrite, __dirname); // Assuming this function handles file writing

      currentState = null; // Reset state after completing the operation
      return { currentState, messages, promptFileName, contentToWrite, response: `Content written to ${promptFileName}`.yellow };
    } catch (error) {
      console.error('Error in handleWriteFile:', error);
      return { currentState, messages, promptFileName, contentToWrite, response: 'An error occurred while writing the file.' };
    }
  }

  // Return default state if none of the conditions are met
  return { currentState, messages, promptFileName, contentToWrite, response: '' };
}

module.exports = { handleWriteFile };
