```javascript
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

            link.style.display = "inline-block";
            link.style.marginTop = "8px";

            element.appendChild(link);
        } else {
            element.appendChild(document.createTextNode(part));
        }
    });
}

async function sendMessage() {
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
                "❌ خطأ: " + (data.error || "خطأ غير معروف");
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
            "❌ حصل خطأ في الاتصال: " + error.message;
    }

    chatBox.scrollTop = chatBox.scrollHeight;

    // يرجع المؤشر لخانة الكتابة بعد كل رسالة
    userInput.focus();
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// التركيز على خانة الكتابة تلقائيًا عند فتح الموقع
window.addEventListener("load", function() {
    userInput.focus();
});
```
