const express = require("express");
const bodyParser = require("body-parser");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const readline = require("readline");
const path = require("path");

const app = express();

const MODEL_NAME = "gemini-pro";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const genAI = new GoogleGenerativeAI("AIzaSyBJxBigB97ZkVn5V55OR6w0BU6M6-zjajk");
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 1,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const chat = model.startChat({
  generationConfig,
  safetySettings,
  history: [],
});

app.use(bodyParser.json());

app.post("/send-message", async (req, res) => {
  const userInput = req.body.userInput;

  try {
    const result = await chat.sendMessage(userInput);
    const response = result.response;
    res.json({ response: response.text() });
  } catch (error) {
    console.error("Error during chat:", error.message);
    res.status(500).json({ error: "Error during chat" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function cleanup() {
  rl.close();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
