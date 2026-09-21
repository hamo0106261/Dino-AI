```javascript
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

const developerName = "Mohamed Reda";

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function makeLinksClickable(text) {
    const safeText = escapeHTML(text);

    return safeText.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = "message " + type;

    const name = type === "ai" ? "Dino AI" : "أنت";

    message.innerHTML = `
        <strong>${name}</strong>
        <p>${makeLinksClickable(text)}</p>
    `;

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getAnswer(question) {
    const q = question.toLowerCase().trim();

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
        return "أنا Dino AI، مساعدك الذكي.";
    }

    // سؤال عن الألعاب
    if (
        q.includes("لعبة") ||
        q.includes("العاب") ||
        q.includes("ألعاب") ||
        q.includes("game") ||
        q.includes("gaming")
    ) {
        return "أقدر أساعدك في معلومات الألعاب والشخصيات وطريقة اللعب والمنصات والإصدارات. اكتب اسم اللعبة وسؤالك عنها.";
    }

    return "أنا Dino AI. حاليًا أقدر أجاوب على الأسئلة الأساسية. سنضيف الاتصال بالذكاء الاصطناعي ومعلومات الألعاب في الخطوة التالية.";
}

function sendMessage() {
    const question = userInput.value.trim();

    if (question === "") {
        return;
    }

    addMessage(question, "user");

    userInput.value = "";
    userInput.focus();

    setTimeout(() => {
        const answer = getAnswer(question);
        addMessage(answer, "ai");
    }, 300);
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
```
