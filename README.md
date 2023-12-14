# Gemini Text Generation

Gemini is a powerful text generation tool provided by Google that enables you to create diverse content using various input methods. This repository demonstrates how to leverage the Gemini API for different scenarios.

## Generate Text from Text-Only Input

When the prompt input includes only text, you can use the `gemini-pro` model. To generate text output, run:

```bash
nodemon index.js
```
## Generate Text from Text-and-Image Input (Multimodal)
Gemini also provides a multimodal model (gemini-pro-vision), allowing input of both text and images. Ensure you review the image requirements for prompts. To generate text output from text-and-image input, run:

```bash
nodemon app.js
```
## Build Multi-turn Conversations (Chat)
Gemini facilitates the creation of freeform conversations across multiple turns. The SDK simplifies the process by managing the conversation state, eliminating the need to store the history manually.

To build a multi-turn conversation using the gemini-pro model, initialize the chat by calling startChat(). Then, use sendMessage() to send a new user message, which will also append the message and the response to the chat history.

There are two possible roles associated with the content in a conversation:

user: The role providing the prompts (default for sendMessage calls).
model: The role providing the responses. This role can be used when calling startChat() with existing history.
To build a multi-turn conversation, run:
```bash
nodemon server.js
```
Feel free to explore and adapt the provided examples to suit your specific use case.
## Follow the prompts to interact with the generative model. Type "exit" to end the chat.

### Configuration
1. You can customize the chat behavior by modifying the generationConfig and safetySettings in the script:

2. generationConfig: Adjust temperature, topK, topP, and maxOutputTokens for model output.
3. safetySettings: Configure safety settings for blocking harmful content.
```bash
nodemon prompt.js
```
## Requirements
1. Node.js
2. Gemini API Key (set as an environment variable)
## License
This project is licensed under the MIT License.
