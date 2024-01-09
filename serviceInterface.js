import path from 'path';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import MistralClient from '@mistralai/mistralai';

const configPath = path.join(process.cwd(), 'interintel.config.js');

let config;
try {
  const importedModule = await import(configPath);
  config = importedModule.default;
} catch (error) {
  console.error('Failed to import config:', error);
}

let mistralClient;
if (config.aiService === 'mistral') {
  mistralClient = new MistralClient(config.apiKey);
}

const openai = new OpenAI({
  apiKey: config.apiKey,
  model: config.aiVersion,
});

async function chatCompletion(aiService, messages, model) {
  try {
    let response;

    if (aiService === 'openai') {
      response = await openai.chat.completions.create({
        messages: messages,
        model: model,
        stream: false,
      });

      return response;
    } else if (aiService === 'mistral') {
      let chatResponse;

      chatResponse = await mistralClient.chat({
        model: model, // or a specific model you wish to use
        messages: messages,
      });

      return chatResponse;
    } else if (aiService === 'ollama') {
      // Ollama specific code
      let data = {
        messages,
        model,
        stream: false,
      };
      const fetchResponse = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Properly resolve the response
      response = await fetchResponse.json();
      return response.message.content;
    } else {
      throw new Error('Invalid AI service');
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export { chatCompletion };
