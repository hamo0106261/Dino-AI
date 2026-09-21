const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");

function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    userInput.value = "";

    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = "وصلت رسالتك ✅";
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
