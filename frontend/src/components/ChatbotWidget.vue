<template>
    <div class="chatbot-widget">
        <transition name="chat-window">
            <div v-if="isOpen" class="chat-container">
                <header class="chat-header">
                    <h3>AudioBot Assistant</h3>
                    <button @click="toggleChat" class="close-btn">&times;</button>
                </header>
                <div class="chat-messages" ref="messagesContainer">
                    <div v-for="(msg, index) in messages" :key="index" class="message" :class="`message-${msg.sender}`">
                        <div class="message-bubble">{{ msg.text }}</div>
                    </div>
                    <div v-if="isLoading" class="message message-bot">
                        <div class="message-bubble typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
                <footer class="chat-input-area">
                    <form @submit.prevent="sendMessage">
                        <input type="text" v-model="userInput" placeholder="Hỏi AudioBot điều gì đó..."
                            :disabled="isLoading" />
                        <button type="submit" :disabled="isLoading || !userInput">Gửi</button>
                    </form>
                </footer>
            </div>
        </transition>

        <button @click="toggleChat" class="chat-toggle-button">
            <span v-if="!isOpen">🤖</span>
            <span v-else>✕</span>
        </button>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import chatbotService from '@/services/chatbot.service';

const isOpen = ref(false);
const userInput = ref('');
const messages = ref([]);
const isLoading = ref(false);
const messagesContainer = ref(null);

onMounted(() => {
    messages.value.push({ sender: 'bot', text: 'Chào bạn! Tôi là AudioBot. Tôi có thể giúp gì cho bạn về việc tìm kiếm truyện audio?' });
});

const toggleChat = () => {
    isOpen.value = !isOpen.value;
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    const userMessage = userInput.value;
    messages.value.push({ sender: 'user', text: userMessage });
    userInput.value = '';
    isLoading.value = true;
    scrollToBottom();

    try {
        const response = await chatbotService.sendMessage(userMessage);
        messages.value.push({ sender: 'bot', text: response.reply });
    } catch (error) {
        console.error("Chatbot error:", error);
        messages.value.push({ sender: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố nhỏ. Vui lòng thử lại sau.' });
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
};
</script>

<style scoped>
/* General Widget Styles */
.chatbot-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.chat-toggle-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.chat-toggle-button:hover {
    transform: scale(1.1);
}

/* Chat Window */
.chat-container {
    width: 350px;
    height: 500px;
    background: #f9f9f9;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

/* Messages Area */
.chat-messages {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message {
    display: flex;
    max-width: 80%;
}

.message-bubble {
    padding: 10px 15px;
    border-radius: 18px;
    line-height: 1.4;
}

.message-user {
    align-self: flex-end;
}

.message-user .message-bubble {
    background: #3498db;
    color: white;
    border-bottom-right-radius: 4px;
}

.message-bot {
    align-self: flex-start;
}

.message-bot .message-bubble {
    background: #e9ecef;
    color: #333;
    border-bottom-left-radius: 4px;
}

/* Input Area */
.chat-input-area {
    padding: 10px;
    border-top: 1px solid #ddd;
}

.chat-input-area form {
    display: flex;
    gap: 10px;
}

.chat-input-area input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
}

.chat-input-area button {
    padding: 10px 15px;
    border: none;
    background: #3498db;
    color: white;
    border-radius: 20px;
    cursor: pointer;
}

.chat-input-area button:disabled {
    background: #a9a9a9;
    cursor: not-allowed;
}

/* Typing Indicator */
.typing-indicator span {
    height: 8px;
    width: 8px;
    background-color: #999;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.3s infinite;
}

.typing-indicator span:nth-of-type(2) {
    animation-delay: 0.15s;
}

.typing-indicator span:nth-of-type(3) {
    animation-delay: 0.3s;
}

@keyframes bounce {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-6px);
    }
}

/* Transitions */
.chat-window-enter-active,
.chat-window-leave-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-window-enter-from,
.chat-window-leave-to {
    transform: translateY(50px) scale(0.5);
    opacity: 0;
}
</style>
