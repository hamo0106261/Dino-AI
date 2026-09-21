const WORKER_URL =
  "https://still-disk-8324.mmaojmmmoh.workers.dev/";

const input =
  document.getElementById("messageInput");

const button =
  document.getElementById("sendButton");

const chat =
  document.getElementById("chat");

function addMessage(text, type) {
  if (!chat) return;

  const message =
    document.createElement("div");

  message.className =
    "message " + type;

  message.textContent =
    text;

  chat.appendChild(message);

  chat.scrollTop =
    chat.scrollHeight;

  return message;
}

async function sendMessage() {

  if (!input) return;

  const message =
    input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  const aiMessage =
    addMessage(
      "Dino AI يفكر... 🦖",
      "ai"
    );

  try {

    const response =
      await fetch(
        WORKER_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            message: message
          })
        }
      );

    const data =
      await response.json();

    const errorText =
      String(data.error || "")
        .toLowerCase();

    if (
      response.status === 429 ||
      errorText.includes("rate limit") ||
      errorText.includes("requests per day") ||
      errorText.includes("rpd")
    ) {

      aiMessage.textContent =
        "خدمة Dino AI وصلت للحد المؤقت 🦖. جرّب بعد ما يتجدد الحد.";

      return;
    }

    if (data.reply) {

      aiMessage.textContent =
        data.reply;

      return;
    }

    aiMessage.textContent =
      "حصلت مشكلة مؤقتة في Dino AI 🦖.";

  } catch (error) {

    aiMessage.textContent =
      "مش قادر أتصل بـ Dino AI حاليًا 🦖.";

    console.error(error);
  }
}

if (button) {
  button.addEventListener(
    "click",
    sendMessage
  );
}

if (input) {

  input.addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
      }

    }
  );
}
