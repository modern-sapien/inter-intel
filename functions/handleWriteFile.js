const path = require('path');
const { aiChatCompletion } = require('./openai-functions.js');
const chatCompletion = require('../ollama.js');
const { writeFileFromPrompt } = require('./file-functions.js');
const configPath = path.join(process.cwd(), 'interintel.config.js');
const config = require(configPath);

async function handleWriteFile(config, messages, currentState, userInput, promptFileName) {
  let contentToWrite = '';

  if (currentState === null) {
    currentState = 'awaitingFileName';
    return {
      currentState,
      messages,
      promptFileName,
      response: 'Please provide a name for the session file:',
    };
  } else if (currentState === 'awaitingFileName') {
    promptFileName = userInput;
    currentState = 'awaitingAIprompt';
    return {
      currentState,
      messages,
      promptFileName,
      response: `Please provide a prompt for ${config.aiVersion}:`,
    };
  } else if (currentState === 'awaitingAIprompt') {
    const promptForAI = userInput;
    try {
      let completionResponse = await chatCompletion(
        config.aiService,
        [{ role: 'user', content: promptForAI }],
        config.aiVersion
      );

      let contentToWrite;
      if (config.aiService === 'openai') {
        contentToWrite = completionResponse.choices[0].message.content;
      } else if (config.aiService === 'ollama') {
        // Adjust this based on how Ollama's response is structured
        console.log(config.aiService, 'aisservice')
        contentToWrite = completionResponse;
      }

      await writeFileFromPrompt(promptFileName, contentToWrite, __dirname); // Assuming this function handles file writing

      currentState = null; // Reset state after completing the operation
      return {
        currentState,
        messages,
        promptFileName,
        contentToWrite,
        response: `Content written to ${promptFileName}`.yellow,
      };
    } catch (error) {
      console.error('Error in handleWriteFile:', error);
      return {
        currentState,
        messages,
        promptFileName,
        contentToWrite,
        response: 'An error occurred while writing the file.',
      };
    }
  }

  // Return default state if none of the conditions are met
  return { currentState, messages, promptFileName, contentToWrite, response: '' };
}

module.exports = { handleWriteFile };
