```javascript
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// معلومات المطور
const developerName = "Mohamed Reda";

// تحويل الروابط إلى روابط قابلة للضغط
function makeLinksClickable(text) {
    const urlRegex = /(https?:\/\/[^\s<]+)/g;

    return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

// إضافة رسالة إلى المحادثة
function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = `message ${type}`;

    const name = type === "ai" ? "Dino AI" : "أنت";

    message.innerHTML = `
        <strong>${name}</strong>
        <p>${makeLinksClickable(text)}</p>
    `;

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// الرد على الأسئلة المعروفة
function getLocalAnswer(question) {
    const q = question.toLowerCase();

    // المطور
    if (
        q.includes("مين صنعك") ||
        q.includes("من صنعك") ||
        q.includes("مين المطور") ||
        q.includes("من المطور") ||
        q.includes("مين عملك") ||
        q.includes("من عملك")
    ) {
        return `تم تطوير Dino AI بواسطة ${developerName}.`;
    }

    // المالك
    if (
        q.includes("مين مالكك") ||
        q.includes("من مالكك") ||
        q.includes("مين صاحبك") ||
        q.includes("من صاحبك")
    ) {
        return `مالك ومطور Dino AI هو ${developerName}.`;
    }

    // حقوق النشر
    if (
        q.includes("حقوق الطبع") ||
        q.includes("حقوق النشر") ||
        q.includes("copyright") ||
        q.includes("حقوقك")
    ) {
        return `© 2026 ${developerName} — All Rights Reserved.`;
    }

    // اسم التطبيق
    if (
        q.includes("اسمك") ||
        q.includes("ما اسمك") ||
        q.includes("مين انت") ||
        q.includes("من انت")
    ) {
        return "أنا Dino AI، مساعد ذكي للمعلومات والأسئلة.";
    }

    // الألعاب
    if (
        q.includes("لعبة") ||
        q.includes("العاب") ||
        q.includes("gaming") ||
        q.includes("game")
    ) {
        return `أقدر أساعدك في أسئلة كثيرة عن الألعاب، مثل معلومات اللعبة، الشخصيات، طريقة اللعب، المنصات والإصدارات. اسألني عن اسم اللعبة التي تريدها.`;
    }

    return null;
}

// إرسال الرسالة
function sendMessage() {
    const question = userInput.value.trim();

    if (question === "") {
        return;
    }

    addMessage(question, "user");
    userInput.value = "";

    const localAnswer = getLocalAnswer(question);

    if (localAnswer) {
        setTimeout(() => {
            addMessage(localAnswer, "ai");
        }, 300);

        return;
    }

    setTimeout(() => {
        addMessage(
            "أقدر أساعدك، لكن خدمة الذكاء الاصطناعي غير متصلة حاليًا. جرّب سؤالي عن اسم المطور أو حقوق النشر أو لعبة معينة.",
            "ai"
        );
    }, 300);
}

// زر الإرسال
sendButton.addEventListener("click", sendMessage);

// زر Enter
userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
```
