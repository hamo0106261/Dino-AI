const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");

const API_URL = "https://dino-ai-api.mmaojmmmoh.workers.dev";

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    // رسالة المستخدم
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    // مسح خانة الكتابة
    userInput.value = "";

    // رسالة مؤقتة
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = "🤖 جاري التفكير...";
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "حدث خطأ");
        }

        botMessage.textContent = data.reply || "لم يصل رد من Dino AI.";
    } catch (error) {
        console.error(error);
        botMessage.textContent = "❌ الخدمة غير متاحة مؤقتًا. حاول مرة أخرى.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// زر الإرسال
sendButton.addEventListener("click", sendMessage);

// زر Enter
userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
