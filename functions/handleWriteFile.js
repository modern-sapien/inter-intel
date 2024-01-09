import path from 'path';
import { fileURLToPath } from 'url';
import { chatCompletion } from '../serviceInterface.js';
import { writeFileFromPrompt } from './file-functions.js';

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

    let updatedMessages = [...messages, { role: 'user', content: promptForAI }];

    try {
      let completionResponse = await chatCompletion(
        config.aiService,
        updatedMessages,
        config.aiVersion
      );

      // Extract the response content
      let contentToWrite =
        config.aiService === 'openai'
          ? completionResponse.choices[0].message.content
          : completionResponse;

      const __dirname = path.dirname(fileURLToPath(import.meta.url));

      await writeFileFromPrompt(promptFileName, contentToWrite, __dirname); // Assuming this function handles file writing

      currentState = null; // Reset state after completing the operation
      return {
        currentState,
        messages: updatedMessages,
        promptFileName,
        contentToWrite,
        response: `Content written to ${promptFileName}`.yellow,
      };
    } catch (error) {
      console.error('Error in handleWriteFile:', error);
      return {
        currentState,
        messages: updatedMessages, // Return the updated messages array
        promptFileName,
        contentToWrite,
        response: 'An error occurred while writing the file.',
      };
    }
  }

  // Return default state if none of the conditions are met
  return { currentState, messages, promptFileName, contentToWrite, response: '' };
}

export { handleWriteFile };
