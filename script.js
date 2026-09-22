const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");

const API_URL = "https://dino-ai-api.mmaojmmmoh.workers.dev";

function displayBotReply(element, text) {
    const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
    const parts = text.split(urlRegex);

    parts.forEach((part) => {
        if (/^https?:\/\//i.test(part)) {
            const link = document.createElement("a");

            link.href = part;
            link.textContent = "🔗 فتح الرابط";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            element.appendChild(link);
        } else {
            element.appendChild(
                document.createTextNode(part)
            );
        }
    });
}

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

    // تفريغ خانة الكتابة
    userInput.value = "";

    // رسالة مؤقتة من Dino AI
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
            botMessage.textContent =
                "❌ خطأ: " +
                (data.error || "حدث خطأ غير معروف");

            return;
        }

        botMessage.textContent = "";

        displayBotReply(
            botMessage,
            data.reply || "لم يصل رد من Dino AI."
        );

    } catch (error) {

        console.error(error);

        botMessage.textContent =
            "❌ حصل خطأ في الاتصال بـ Dino AI.";

    }

    chatBox.scrollTop = chatBox.scrollHeight;

    // رجوع المؤشر لخانة الكتابة
    userInput.focus();
}

// زر الإرسال
sendButton.addEventListener("click", function () {
    sendMessage();
});

// زر Enter
userInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }

});
