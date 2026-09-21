```javascript
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

const developerName = "Mohamed Reda";

function makeLinksClickable(text) {
    return text.replace(
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

    if (
        q.includes("مين صنعك") ||
        q.includes("من صنعك") ||
        q.includes("مين المطور") ||
        q.includes("من المطور") ||
        q.includes("مين عملك") ||
        q.includes("من عملك")
    ) {
        return "تم تطوير Dino AI بواسطة Mohamed Reda.";
    }

    if (
        q.includes("مين مالكك") ||
        q.includes("من مالكك") ||
        q.includes("مين صاحبك") ||
        q.includes("من صاحبك")
    ) {
        return "مالك ومطور Dino AI هو Mohamed Reda.";
    }

    if (
        q.includes("حقوق الطبع") ||
        q.includes("حقوق النشر") ||
        q.includes("copyright") ||
        q.includes("حقوقك")
    ) {
        return "© 2026 Mohamed Reda — All Rights Reserved.";
    }

    if (
        q.includes("اسمك") ||
        q.includes("ما اسمك") ||
        q.includes("مين انت") ||
        q.includes("من انت")
    ) {
        return "أنا Dino AI، مساعد ذكي للمعلومات والأسئلة.";
    }

    if (
        q.includes("لعبة") ||
        q.includes("العاب") ||
        q.includes("game") ||
        q.includes("gaming")
    ) {
        return "أقدر أساعدك في معلومات الألعاب والشخصيات وطريقة اللعب والمنصات والإصدارات. اكتب اسم اللعبة التي تريد معرفة معلومات عنها.";
    }

    return "أنا Dino AI. اسألني عن المطور أو حقوق النشر أو عن لعبة معينة.";
}

function sendMessage() {
    const question = userInput.value.trim();

    if (!question) {
        return;
    }

    addMessage(question, "user");
    userInput.value = "";

    setTimeout(function () {
        const answer = getAnswer(question);
        addMessage(answer, "ai");
    }, 300);
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
```
