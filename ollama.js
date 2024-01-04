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
  {
    role: 'assistant',
    content:
      'when asked for a code reference, please provide only the code with no commentary or explanation just the code. No commentary or explanation. NO COMMENTARY OR EXPLANATION',
  },
  {
    role: 'user',
    content:
      'how can I most effectively persist chat history with you? Is every conversation then dependent on a finding a way to persist history by sending along the ongoing chat for you to continually reference context?',
  },
];
let model = 'mistral';

async function ollamaChatCompletion(ai, messages, model) {
  if (ai === 'ollama') {
    let data = {
      messages,
      model,
      stream: false,
    };

    fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(data, 'data baby')) // or process the data as needed
      .catch((error) => console.error('Error:', error));
  }
}

// ollamaChatCompletion(ai, messages, model);

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
    } else if (aiService === 'ollama') {
      console.log('ollama service');
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
    } else {
      throw new Error('Invalid AI service');
    }
    console.log(response.message.content)
    return response.message.content;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// chatCompletion(ai, messages, model);

module.exports = chatCompletion;
