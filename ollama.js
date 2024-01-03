const fetch = require('node-fetch');

let ai = 'ollama';
let messages = [
  {
    role: 'assistant',
    content: 'please use a respectful tone',
  },
  {
    role: 'assistant',
    content: 'when asked for a code reference, please provide only the code with no commentary or explanation just the code. No commentary or explanation. NO COMMENTARY OR EXPLANATION',
  },
  {
    role: 'user',
    content: 'how can I most effectively persist chat history with you? Is every conversation then dependent on a finding a way to persist history by sending along the ongoing chat for you to continually reference context?',
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

ollamaChatCompletion(ai, messages, model);