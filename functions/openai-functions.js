const OpenAI = require('openai');

async function aiChatCompletion(openai, messages, model) {
  try {
    const response = await openai.chat.completions.create({
      messages: messages,
      model: model,
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

module.exports.aiChatCompletion = aiChatCompletion;
