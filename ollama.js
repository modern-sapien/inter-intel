const fetch = require('node-fetch');

let ai = 'ollama';
let messages = [
  {
    role: 'user',
    content: 'please share our conversation history',
  },
];
let model = 'llama2';

async function ollamaChatCompletion(ai, messages, model) {
  if (ai === 'ollama') {
    // Transform messages into the templated format required by Ollama
    const templatedHistory = messages.map((msg, index) => 
      `[INST] ${msg.role}: ${msg.content} [/INST]`).join(' ');

    let data = {
      template: templatedHistory,
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

ollamaChatCompletion(ai, messages, model);
