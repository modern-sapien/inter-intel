import path from 'path';
import fetch from 'node-fetch';
import OpenAI from 'openai';

const configPath = path.join(process.cwd(), 'interintel.config.js');

let config;
try {
  const importedModule = await import(configPath);
  config = importedModule.default;
} catch (error) {
  console.error('Failed to import config:', error);
}

const openai = new OpenAI({
  apiKey: config.apiKey,
  model: config.aiVersion,
});

let ai = 'ollama';
let messages = [
  {
    role: 'assistant',
    content: 'please use a respectful tone',
  },
];
let model = 'mistral';

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
