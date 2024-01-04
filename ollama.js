const path = require('path');
const fetch = require('node-fetch');
const OpenAI = require('openai');
const configPath = path.join(process.cwd(), 'interintel.config.js');
const config = require(configPath);

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
      console.log('openai service');

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

      console.log(data.messages, 'messages');
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

module.exports = chatCompletion;
