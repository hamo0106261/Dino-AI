const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");

function getBotReply(message) {
    const text = message.toLowerCase();

    if (text.includes("مين صنعك") || text.includes("مين عملك")) {
        return "أنا Dino AI، وتم تطويري بواسطة Mohamed Reda.";
    }

    if (text.includes("مين مالكك") || text.includes("مالكك")) {
        return "Dino AI هو مشروع تابع لـ Mohamed Reda.";
    }

    if (text.includes("حقوق") || text.includes("الطبع والنشر")) {
        return "© 2026 Mohamed Reda — All Rights Reserved.";
    }

    if (text.includes("اسمك")) {
        return "اسمي Dino AI 🤖";
    }

    if (text.includes("مرحبا") || text.includes("اهلا") || text.includes("أهلا")) {
        return "أهلاً بيك 👋 أنا Dino AI. إزاي أقدر أساعدك؟";
    }

    if (text.includes("العاب") || text.includes("ألعاب") || text.includes("game")) {
        return "أقدر أساعدك في معلومات عن الألعاب والشخصيات وطريقة اللعب والمنصات.";
    }

    return "أنا لسه بتعلم 🤖 جرّب تسألني عن اسمي، مين صنعني، حقوق الطبع والنشر، أو الألعاب.";
}

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
    botMessage.textContent = getBotReply(message);
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
