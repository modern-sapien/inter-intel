import MistralClient from '@mistralai/mistralai'
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const chatResponse = await client.chat({
  model: 'mistral-tiny',
  messages: [{role: 'user', content: 'When were you last fine tuned? Please keep to under 25 words'}],
});

console.log('Chat:', chatResponse.choices[0].message.content);