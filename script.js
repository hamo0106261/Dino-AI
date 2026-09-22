const API_URL = "https://dino-ai-api.mmaojmmmoh.workers.dev";

const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const attachButton = document.getElementById("attachButton");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

const audioButton = document.getElementById("audioButton");
const audioInput = document.getElementById("audioInput");
const audioPreview = document.getElementById("audioPreview");

const chatBox = document.getElementById("chatBox");

let selectedImage = null;
let selectedAudio = null;

// ===============================
// الذاكرة
// ===============================

let dinoMemory = JSON.parse(
    localStorage.getItem("dinoMemory") || "[]"
);

// ===============================
// المحادثات
// ===============================

let dinoChats = JSON.parse(
    localStorage.getItem("dinoChats") || "[]"
);

let currentChat = {
    id: Date.now(),
    messages: []
};

// ===============================
// إضافة رسالة للشاشة
// ===============================

function addMessage(text, type) {
    const message = document.createElement("div");

    message.className = "message " + type;

    message.textContent = text;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

    return message;
}

// ===============================
// إظهار رسالة تحميل
// ===============================

function addLoadingMessage() {
    const message = document.createElement("div");

    message.className = "message bot";
    message.id = "loadingMessage";

    message.textContent = "🦖 Dino AI يفكر...";

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

    return message;
}

// ===============================
// إزالة رسالة التحميل
// ===============================

function removeLoadingMessage() {
    const loading = document.getElementById("loadingMessage");

    if (loading) {
        loading.remove();
    }
}

// ===============================
// تحويل الروابط إلى روابط قابلة للضغط
// ===============================

function formatLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">🔗 فتح الرابط</a>`;
    });
}

// ===============================
// إضافة رد Dino AI
// ===============================

function addBotMessage(text) {
    const message = document.createElement("div");

    message.className = "message bot";

    message.innerHTML = formatLinks(
        text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>")
            .replace(
                /&lt;a href=/g,
                "<a href="
            )
    );

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

    return message;
}

// ===============================
// حفظ المحادثة
// ===============================

function saveCurrentChat() {
    if (!currentChat.messages.length) {
        return;
    }

    const index = dinoChats.findIndex(
        chat => chat.id === currentChat.id
    );

    if (index >= 0) {
        dinoChats[index] = currentChat;
    } else {
        dinoChats.unshift(currentChat);
    }

    localStorage.setItem(
        "dinoChats",
        JSON.stringify(dinoChats)
    );
}

// ===============================
// بدء محادثة جديدة
// ===============================

function newChat() {
    saveCurrentChat();

    currentChat = {
        id: Date.now(),
        messages: []
    };

    chatBox.innerHTML = `
        <div class="welcome">
            <h1>أهلاً بك في Dino AI 🦖</h1>
            <p>اسألني أي سؤال وسأحاول مساعدتك.</p>
        </div>
    `;
}

// ===============================
// إرسال الرسالة
// ===============================

async function sendMessage() {
    const text = userInput.value.trim();

    if (
        !text &&
        !selectedImage &&
        !selectedAudio
    ) {
        return;
    }

    let displayText = text;

    if (selectedImage) {
        displayText +=
            (displayText ? "\n" : "") +
            "🖼️ صورة مرفقة: " +
            selectedImage.name;
    }

    if (selectedAudio) {
        displayText +=
            (displayText ? "\n" : "") +
            "🎵 ملف صوتي مرفق: " +
            selectedAudio.name;
    }

    addMessage(displayText, "user");

    currentChat.messages.push({
        role: "user",
        content: displayText
    });

    userInput.value = "";

    const loadingMessage = addLoadingMessage();

    try {
        let response;

        // ==========================================
        // إذا يوجد صوت: نرسل FormData
        // ==========================================

        if (selectedAudio) {
            const formData = new FormData();

            formData.append(
                "message",
                text
            );

            formData.append(
                "audio",
                selectedAudio,
                selectedAudio.name
            );

            response = await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );
        }

        // ==========================================
        // رسالة عادية
        // ==========================================

        else {
            response = await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        message: text
                    })
                }
            );
        }

        const data = await response.json();

        removeLoadingMessage();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "حدث خطأ أثناء الاتصال بـ Dino AI"
            );
        }

        // ==========================================
        // رد Dino AI
        // ==========================================

        const reply =
            data.reply ||
            "لم يصل رد من Dino AI.";

        addBotMessage(reply);

        currentChat.messages.push({
            role: "assistant",
            content: reply
        });

        // ==========================================
        // لو الصوت تم تحويله إلى نص
        // ==========================================

        if (data.transcript) {
            currentChat.messages.push({
                role: "system",
                content:
                    "🎙️ النص المستخرج من الصوت: " +
                    data.transcript
            });
        }

        saveCurrentChat();

    } catch (error) {
        removeLoadingMessage();

        const errorMessage =
            "❌ حدث خطأ: " +
            error.message;

        addBotMessage(errorMessage);

        currentChat.messages.push({
            role: "assistant",
            content: errorMessage
        });

        saveCurrentChat();
    }

    // إزالة الملفات بعد الإرسال
    selectedImage = null;
    selectedAudio = null;

    if (imageInput) {
        imageInput.value = "";
    }

    if (audioInput) {
        audioInput.value = "";
    }

    if (imagePreview) {
        imagePreview.innerHTML = "";
    }

    if (audioPreview) {
        audioPreview.innerHTML = "";
    }
}

// ===============================
// زر الإرسال
// ===============================

if (sendButton) {
    sendButton.addEventListener(
        "click",
        sendMessage
    );
}

// ===============================
// Enter لإرسال الرسالة
// ===============================

if (userInput) {
    userInput.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {
                event.preventDefault();

                sendMessage();
            }
        }
    );
}

// ===============================
// الصور
// ===============================

if (attachButton && imageInput) {
    attachButton.addEventListener(
        "click",
        function () {
            imageInput.click();
        }
    );
}

if (imageInput) {
    imageInput.addEventListener(
        "change",
        function () {
            const file =
                imageInput.files[0];

            if (!file) {
                return;
            }

            selectedImage = file;

            if (imagePreview) {
                imagePreview.innerHTML = `
                    <div class="attachment-item">
                        🖼️ ${file.name}
                        <button
                            type="button"
                            id="removeImageButton"
                        >
                            ×
                        </button>
                    </div>
                `;

                const removeButton =
                    document.getElementById(
                        "removeImageButton"
                    );

                if (removeButton) {
                    removeButton.addEventListener(
                        "click",
                        function () {
                            selectedImage = null;

                            imageInput.value = "";

                            imagePreview.innerHTML = "";
                        }
                    );
                }
            }
        }
    );
}

// ===============================
// الصوت
// ===============================

if (audioButton && audioInput) {
    audioButton.addEventListener(
        "click",
        function () {
            audioInput.click();
        }
    );
}

if (audioInput) {
    audioInput.addEventListener(
        "change",
        function () {
            const file =
                audioInput.files[0];

            if (!file) {
                return;
            }

            selectedAudio = file;

            if (audioPreview) {
                const audioURL =
                    URL.createObjectURL(file);

                audioPreview.innerHTML = `
                    <div class="attachment-item">
                        🎵 ${file.name}

                        <button
                            type="button"
                            id="removeAudioButton"
                        >
                            ×
                        </button>
                    </div>

                    <audio
                        controls
                        style="
                            width:100%;
                            margin-top:8px;
                        "
                    >
                        <source
                            src="${audioURL}"
                        >
                    </audio>
                `;

                const removeButton =
                    document.getElementById(
                        "removeAudioButton"
                    );

                if (removeButton) {
                    removeButton.addEventListener(
                        "click",
                        function () {
                            selectedAudio = null;

                            audioInput.value = "";

                            audioPreview.innerHTML = "";

                            URL.revokeObjectURL(
                                audioURL
                            );
                        }
                    );
                }
            }
        }
    );
}

// ===============================
// الذاكرة
// ===============================

function saveMemory(text) {
    if (!text.trim()) {
        return;
    }

    dinoMemory.push(text.trim());

    localStorage.setItem(
        "dinoMemory",
        JSON.stringify(dinoMemory)
    );

    renderMemory();
}

function deleteMemory(index) {
    dinoMemory.splice(index, 1);

    localStorage.setItem(
        "dinoMemory",
        JSON.stringify(dinoMemory)
    );

    renderMemory();
}

function renderMemory() {
    const memoryList =
        document.getElementById(
            "memoryList"
        );

    if (!memoryList) {
        return;
    }

    memoryList.innerHTML = "";

    if (!dinoMemory.length) {
        memoryList.innerHTML =
            `<div class="empty-memory">
                لا توجد معلومات محفوظة.
            </div>`;

        return;
    }

    dinoMemory.forEach(
        function (item, index) {
            const div =
                document.createElement("div");

            div.className =
                "memory-item";

            div.innerHTML = `
                <span>${item}</span>

                <button
                    type="button"
                    data-index="${index}"
                >
                    ×
                </button>
            `;

            div.querySelector(
                "button"
            ).addEventListener(
                "click",
                function () {
                    deleteMemory(index);
                }
            );

            memoryList.appendChild(div);
        }
    );
}

// ===============================
// حفظ الذاكرة
// ===============================

const saveMemoryButton =
    document.getElementById(
        "saveMemoryButton"
    );

const memoryInput =
    document.getElementById(
        "memoryInput"
    );

if (
    saveMemoryButton &&
    memoryInput
) {
    saveMemoryButton.addEventListener(
        "click",
        function () {
            saveMemory(
                memoryInput.value
            );

            memoryInput.value = "";
        }
    );
}

if (memoryInput) {
    memoryInput.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Enter"
            ) {
                event.preventDefault();

                saveMemory(
                    memoryInput.value
                );

                memoryInput.value = "";
            }
        }
    );
}

// ===============================
// فتح الذاكرة
// ===============================

const memoryButton =
    document.getElementById(
        "memoryButton"
    );

const memoryPanel =
    document.getElementById(
        "memoryPanel"
    );

const closeMemoryButton =
    document.getElementById(
        "closeMemoryButton"
    );

if (
    memoryButton &&
    memoryPanel
) {
    memoryButton.addEventListener(
        "click",
        function () {
            memoryPanel.classList.add(
                "open"
            );

            renderMemory();
        }
    );
}

if (
    closeMemoryButton &&
    memoryPanel
) {
    closeMemoryButton.addEventListener(
        "click",
        function () {
            memoryPanel.classList.remove(
                "open"
            );
        }
    );
}

// ===============================
// المحادثات
// ===============================

function renderChats() {
    const chatList =
        document.getElementById(
            "chatList"
        );

    if (!chatList) {
        return;
    }

    chatList.innerHTML = "";

    if (!dinoChats.length) {
        chatList.innerHTML =
            `<div class="empty-memory">
                لا توجد محادثات محفوظة.
            </div>`;

        return;
    }

    dinoChats.forEach(
        function (chat) {
            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "sidebar-item";

            const firstUserMessage =
                chat.messages.find(
                    message =>
                        message.role ===
                        "user"
                );

            button.textContent =
                firstUserMessage
                    ? firstUserMessage.content.slice(
                          0,
                          35
                      )
                    : "محادثة جديدة";

            button.addEventListener(
                "click",
                function () {
                    loadChat(chat.id);
                }
            );

            chatList.appendChild(
                button
            );
        }
    );
}

function loadChat(chatId) {
    const chat =
        dinoChats.find(
            chat =>
                chat.id === chatId
        );

    if (!chat) {
        return;
    }

    currentChat = chat;

    chatBox.innerHTML = "";

    currentChat.messages.forEach(
        function (message) {
            if (
                message.role ===
                "user"
            ) {
                addMessage(
                    message.content,
                    "user"
                );
            }

            if (
                message.role ===
                "assistant"
            ) {
                addBotMessage(
                    message.content
                );
            }
        }
    );

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    if (sidebar) {
        sidebar.classList.remove(
            "open"
        );
    }
}

// ===============================
// زر محادثة جديدة
// ===============================

const newChatButton =
    document.getElementById(
        "newChatButton"
    );

if (newChatButton) {
    newChatButton.addEventListener(
        "click",
        newChat
    );
}

// ===============================
// زر المحادثات
// ===============================

const conversationsButton =
    document.getElementById(
        "conversationsButton"
    );

if (conversationsButton) {
    conversationsButton.addEventListener(
        "click",
        renderChats
    );
}

// ===============================
// القائمة الجانبية
// ===============================

const menuButton =
    document.getElementById(
        "menuButton"
    );

const closeSidebar =
    document.getElementById(
        "closeSidebar"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

if (
    menuButton &&
    sidebar
) {
    menuButton.addEventListener(
        "click",
        function () {
            sidebar.classList.add(
                "open"
            );
        }
    );
}

if (
    closeSidebar &&
    sidebar
) {
    closeSidebar.addEventListener(
        "click",
        function () {
            sidebar.classList.remove(
                "open"
            );
        }
    );
}

// ===============================
// تشغيل أولي
// ===============================

renderMemory();
renderChats();
