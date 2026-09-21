const WORKER_URL = "https://still-disk-8324.mmaojmmmoh.workers.dev/";

const input =
  document.querySelector("#messageInput") ||
  document.querySelector("#userInput") ||
  document.querySelector("#chatInput") ||
  document.querySelector("textarea") ||
  document.querySelector("input[type='text']");

const sendButton =
  document.querySelector("#sendButton") ||
  document.querySelector("#sendBtn") ||
  document.querySelector("#send") ||
  document.querySelector("button");

const messages =
  document.querySelector("#messages") ||
  document.querySelector("#chatMessages") ||
  document.querySelector("#chat") ||
  document.querySelector(".messages") ||
  document.querySelector(".chat-messages");

function addMessage(text, type) {
  if (!messages) return;

  const message = document.createElement("div");

  message.className =
    type === "user"
      ? "message user-message"
      : "message ai-message";

  message.textContent = text;

  messages.appendChild(message);

  messages.scrollTop = messages.scrollHeight;
}

function isOwnerQuestion(text) {
  const message = text.toLowerCase();

  const questions = [
    "مين صنعك",
    "من صنعك",
    "مين عملك",
    "من عملك",
    "مين برمجك",
    "من برمجك",
    "مين أنشأك",
    "من أنشأك",
    "مين اللي صنعك",
    "مين اللي عملك",
    "مين اللي برمجك",
    "مين اللي أنشأك",
    "مين صاحبك",
    "مين صاحب dino",
    "مين مؤسس dino",
    "حقوق الطبع والنشر",
    "حقوق النشر",
    "copyright",
    "owner",
    "creator",
    "developer"
  ];

  return questions.some(function(question) {
    return message.includes(question);
  });
}

async function sendMessage() {
  if (!input) {
    console.error("لم يتم العثور على مربع الكتابة.");
    return;
  }

  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");

  input.value = "";

  // سؤال صاحب Dino AI لا يحتاج OpenAI
  if (isOwnerQuestion(text)) {
    addMessage(
      "أنا Dino AI 🦖، والمشروع أنشأه Mohamed Reda.\n\nصاحب مشروع Dino AI هو Mohamed Reda.",
      "ai"
    );
    return;
  }

  addMessage("جاري التفكير... 🦖", "ai");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    // إزالة رسالة جاري التفكير
    const aiMessages = messages.querySelectorAll(".ai-message");

    if (aiMessages.length > 0) {
      const lastMessage = aiMessages[aiMessages.length - 1];

      if (lastMessage.textContent === "جاري التفكير... 🦖") {
        lastMessage.remove();
      }
    }

    if (data.reply) {
      addMessage(data.reply, "ai");
    } else if (data.error) {
      addMessage(data.error, "ai");
    } else {
      addMessage("حدث خطأ ولم يصلني رد.", "ai");
    }

  } catch (error) {

    const aiMessages = messages.querySelectorAll(".ai-message");

    if (aiMessages.length > 0) {
      const lastMessage = aiMessages[aiMessages.length - 1];

      if (lastMessage.textContent === "جاري التفكير... 🦖") {
        lastMessage.remove();
      }
    }

    addMessage(
      "تعذر الاتصال بـ Dino AI. تأكد من اتصال الإنترنت.",
      "ai"
    );

    console.error(error);
  }
}

if (sendButton) {
  sendButton.addEventListener("click", sendMessage);
}

if (input) {
  input.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

  });
}

console.log("Dino AI connected 🦖");
