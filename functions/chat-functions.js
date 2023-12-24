const fs = require('fs');
const path = require('path');

async function askQuestion(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt.blue, (input) => {
      resolve(input);
    });
  });
}

module.exports = {
  askQuestion,
}