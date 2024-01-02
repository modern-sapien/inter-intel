## INTERINTEL

The application `interintel` is a command line interface (CLI) application implemented in Node.js. It essentially is an interactive communication tool between the user and an AI model, only GPTs for now.

Here's a brief overview of the main functionalities, as contained in the index.js file:

- The application starts an interactive session with the user. It does this by invoking the readline module, which reads user inputs line by line from the terminal.

-- 'node index.js' will start the app
  
- The OpenAI's API is accessed using API keys, and the version of AI being used is specified via a config. 

### //writeFile
- If a user types '//writefile', the application prompts the user to provide a name for the file and then a prompt for the AI. It then automatically generates some text (by communicating with OpenAI's GPT-3 model), writes this to a file and stores it in the application's directory. 
  
### //readRefs
- If a user writes '//readRefs', the application reads the content of the specified files in the interintel.config.js (in the current implementation) and uses this as part of the conversation with the AI.
- So as you work on your project and files change or you move to other parts of the code base you can adjust where interintel points and what is referenced by AI conversation.

### everything else
- For all user inputs outside of these special keywords, the chat conversation is simply updated with the user's message and a call is made to the OpenAI API to generate the AI's response. This is then displayed on the console. 

The application relies heavily on async-await pattern for handling the asynchronicity associated with reading user inputs and waiting for responses from the OpenAI 'aiChatCompletion' function. 

Keep in mind that this is a high level overview and each functionality has its own level of implementation detail.

File Structure

project/
├── functions/
│   ├── chat-functions.js
│   ├── file-functions.js
│   ├── openai-functions.js
│   ├── messageUtils.js
│   ├── writeFileHandler.js
│   └── readRefsHandler.js
├── interintel.config.js
└── index.js