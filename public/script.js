const chatOutput = document.getElementById("chat-output");
const userInputText = document.getElementById("user-input-text");

async function sendMessage() {
  const userInput = userInputText.value.trim();
  if (!userInput) return;

  appendMessage("You", userInput, "user");

  userInputText.value = "";

  const response = await fetch("/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userInput }),
  });

  const responseData = await response.json();
  appendMessage("TonyGPT", responseData.response, "bot");
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

userInputText.addEventListener("keypress", handleKeyPress);

function appendMessage(sender, message, className) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${className}-message`;
  messageElement.innerHTML = `
    <div class="message-bubble ${className}-bubble">
      <strong>${sender}:</strong> ${message}
    </div>
  `;
  chatOutput.appendChild(messageElement);

  chatOutput.scrollTop = chatOutput.scrollHeight;
}
