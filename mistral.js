import MistralClient from '@mistralai/mistralai'
const dotenv = await import('dotenv');
dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

console.log(apiKey, 'apiKEY')
const client = new MistralClient(apiKey);

const chatResponse = await client.chat({
  model: 'mistral-tiny',
  messages: [{role: 'user', content: 'What is the best French cheese?'}],
});

console.log('Chat:', chatResponse.choices[0].message.content);