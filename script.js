const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");

function getBotReply(message) {
    const text = message.toLowerCase().trim();

    // التحية
    if (
        text.includes("مرحبا") ||
        text.includes("مرحب") ||
        text.includes("اهلا") ||
        text.includes("أهلا") ||
        text.includes("السلام عليكم")
    ) {
        return "أهلاً بيك 👋 أنا Dino AI 🤖 إزاي أقدر أساعدك؟";
    }

    // اسم الذكاء الاصطناعي
    if (
        text.includes("اسمك") ||
        text.includes("اسمك ايه") ||
        text.includes("اسمك إيه")
    ) {
        return "اسمي Dino AI 🤖";
    }

    // المطور
    if (
        text.includes("مين صنعك") ||
        text.includes("مين عملك") ||
        text.includes("مين مطورك") ||
        text.includes("من صنعك")
    ) {
        return "أنا Dino AI، وتم تطويري بواسطة Mohamed Reda.";
    }

    // المالك
    if (
        text.includes("مين مالكك") ||
        text.includes("من مالكك") ||
        text.includes("مالكك")
    ) {
        return "Dino AI هو مشروع تابع لـ Mohamed Reda.";
    }

    // حقوق الطبع والنشر
    if (
        text.includes("حقوق") ||
        text.includes("الطبع والنشر") ||
        text.includes("copyright")
    ) {
        return "© 2026 Mohamed Reda — All Rights Reserved.";
    }

    // الألعاب
    if (
        text.includes("العاب") ||
        text.includes("ألعاب") ||
        text.includes("لعبة") ||
        text.includes("لعبه") ||
        text.includes("game") ||
        text.includes("games")
    ) {
        return "🎮 أقدر أساعدك في معلومات عن الألعاب، مثل الشخصيات، القصة، طريقة اللعب، الأجهزة والمنصات، وتاريخ الإصدار.";
    }

    // سؤال عن المساعدة
    if (
        text.includes("تقدر تعمل ايه") ||
        text.includes("تقدر تعمل إيه") ||
        text.includes("ماذا تستطيع")
    ) {
        return "🤖 أقدر أجاوب على الأسئلة الموجودة في قاعدة معلوماتي، وأساعدك في مواضيع مختلفة مثل الألعاب والمعلومات العامة.";
    }

    // رد افتراضي
    return "🤖 لسه بتعلم. جرّب تسألني عن اسمي، مين صنعني، مالكي، حقوق الطبع والنشر، أو الألعاب.";
}

function sendMessage() {
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

    // رد Dino AI
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = getBotReply(message);
    chatBox.appendChild(botMessage);

    // النزول لآخر رسالة
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
