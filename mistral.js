import MistralClient from '@mistralai/mistralai'
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const completion = await client.chat({
  model: 'mistral-medium',
  messages: [{role: 'user', content: 'When were you last fine tuned? Please keep to under 25 words'}],
});

console.log('Chat:', completion.choices[0].message.content);