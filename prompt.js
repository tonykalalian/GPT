const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const dotenv = require("dotenv");
const readline = require("readline");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

// Validate required environment variables
if (!API_KEY) {
  console.error("API_KEY is not set. Exiting...");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 1,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const chat = model.startChat({
  generationConfig,
  safetySettings,
  history: [],
});

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ error: "Something went wrong" });
});

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

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
