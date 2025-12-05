<template>
    <div class="chatbot-widget">
        <transition name="chat-window">
            <div v-if="isOpen" class="chat-container">
                <header class="chat-header">
                    <div class="header-content">
                        <div class="bot-avatar">
                            <img src="/ChatBot.png" alt="ChatBot" />
                        </div>
                        <div class="header-info">
                            <h3>AudioBot</h3>
                            <span class="status-indicator">
                                <span class="status-dot"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <button @click="toggleChat" class="close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <!-- Quick Actions -->
                <div v-if="messages.length === 1" class="quick-actions">
                    <button v-for="action in quickActions" :key="action.text" @click="sendQuickMessage(action.text)"
                        class="quick-action-btn">
                        {{ action.icon }} {{ action.text }}
                    </button>
                </div>

                <div class="chat-messages" ref="messagesContainer">
                    <div v-for="(msg, index) in messages" :key="index" class="message" :class="`message-${msg.sender}`"
                        :style="{ animationDelay: `${index * 0.1}s` }">
                        <div v-if="msg.sender === 'bot'" class="message-avatar">
                            <img src="/ChatBot.png" alt="ChatBot" />
                        </div>
                        <div class="message-bubble">
                            <div class="message-text" v-html="formatMessage(msg.text)"></div>
                            <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
                        </div>
                    </div>
                    <div v-if="isLoading" class="message message-bot">
                        <div class="message-avatar">
                            <img src="/ChatBot.png" alt="ChatBot" />
                        </div>
                        <div class="message-bubble typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>

                <footer class="chat-input-area">
                    <form @submit.prevent="sendMessage">
                        <input type="text" v-model="userInput" placeholder="Nhập tin nhắn của bạn..."
                            :disabled="isLoading" @focus="inputFocused = true" @blur="inputFocused = false" />
                        <button type="submit" :disabled="isLoading || !userInput.trim()" class="send-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </footer>
            </div>
        </transition>

        <button @click="toggleChat" class="chat-toggle-button" :class="{ 'is-open': isOpen }">
            <transition name="icon-fade" mode="out-in">
                <img v-if="!isOpen" key="chat" src="/ChatBot.png" alt="ChatBot" class="chat-toggle-icon" />
                <svg v-else key="close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </transition>
            <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
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
const inputFocused = ref(false);
const unreadCount = ref(0);

const quickActions = [
    { icon: '🔥', text: 'Truyện hot nhất' },
    { icon: '✨', text: 'Truyện mới cập nhật' },
    { icon: '📚', text: 'Thể loại truyện' },
    { icon: '❓', text: 'Hướng dẫn sử dụng' }
];

onMounted(() => {
    messages.value.push({
        sender: 'bot',
        text: 'Xin chào! 👋 Tôi là AudioBot, trợ lý ảo của bạn. Tôi có thể giúp bạn tìm kiếm truyện audio, giới thiệu truyện hay, và trả lời các câu hỏi về website. Bạn cần hỗ trợ gì không?',
        timestamp: new Date()
    });
});

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        unreadCount.value = 0;
    }
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const formatMessage = (text) => {
    // Convert URLs to links
    let formatted = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    // Convert bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return formatted;
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const sendQuickMessage = (text) => {
    userInput.value = text;
    sendMessage();
};

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    const userMessage = userInput.value;
    messages.value.push({
        sender: 'user',
        text: userMessage,
        timestamp: new Date()
    });
    userInput.value = '';
    isLoading.value = true;
    scrollToBottom();

    try {
        const response = await chatbotService.sendMessage(userMessage);
        messages.value.push({
            sender: 'bot',
            text: response.reply,
            timestamp: new Date()
        });

        if (!isOpen.value) {
            unreadCount.value++;
        }
    } catch (error) {
        console.error("Chatbot error:", error);
        messages.value.push({
            sender: 'bot',
            text: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ. 😔',
            timestamp: new Date()
        });
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-toggle-button {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(13, 148, 136, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.chat-toggle-button svg {
    width: 32px;
    height: 32px;
}

.chat-toggle-button .chat-toggle-icon {
    width: 42px;
    height: 42px;
    object-fit: cover;
    border-radius: 50%;
    display: block;
}

.chat-toggle-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(13, 148, 136, 0.5);
}

.chat-toggle-button.is-open {
    background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary) 100%);
}

.unread-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--color-danger);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

/* Chat Window */
.chat-container {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 380px;
    height: 600px;
    background: var(--bg-primary, #ffffff);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color, #e0e0e0);
}

.chat-header {
    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.bot-avatar {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}

.bot-avatar img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
}

.header-info h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    opacity: 0.9;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: var(--color-success);
    border-radius: 50%;
    animation: blink 2s infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
}

.close-btn svg {
    width: 18px;
    height: 18px;
}

/* Quick Actions */
.quick-actions {
    padding: 15px;
    background: var(--bg-secondary, #f8f9fa);
    border-bottom: 1px solid var(--border-color, #e0e0e0);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.quick-action-btn {
    padding: 8px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    color: var(--text-primary, #333);
}

.quick-action-btn:hover {
    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

/* Messages Area */
.chat-messages {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--bg-secondary, #f8f9fa);
}

.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: var(--text-tertiary);
    border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
}

.message {
    display: flex;
    gap: 10px;
    max-width: 85%;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-avatar {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.message-avatar img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
}

.message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    line-height: 1.5;
    position: relative;
}

.message-text {
    word-wrap: break-word;
}

.message-text :deep(a) {
    color: inherit;
    text-decoration: underline;
}

.message-text :deep(strong) {
    font-weight: 600;
}

.message-time {
    display: block;
    font-size: 0.7rem;
    opacity: 0.6;
    margin-top: 4px;
}

.message-user {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.message-user .message-bubble {
    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
}

.message-bot {
    align-self: flex-start;
}

.message-bot .message-bubble {
    background: var(--bg-card);
    color: var(--text-primary, #333);
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px var(--shadow-color);
    border: 1px solid var(--border-color, #e0e0e0);
}

/* Input Area */
.chat-input-area {
    padding: 16px;
    border-top: 1px solid var(--border-color, #e0e0e0);
    background: var(--bg-primary, white);
}

.chat-input-area form {
    display: flex;
    gap: 10px;
    align-items: center;
}

.chat-input-area input {
    flex-grow: 1;
    padding: 12px 16px;
    border: 2px solid var(--border-color, #e0e0e0);
    border-radius: 25px;
    outline: none;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    background: var(--bg-secondary, #f8f9fa);
    color: var(--text-primary, #333);
}

.chat-input-area input:focus {
    border-color: var(--color-primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
}

.send-btn {
    width: 44px;
    height: 44px;
    border: none;
    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.send-btn svg {
    width: 20px;
    height: 20px;
}

.send-btn:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(13, 148, 136, 0.4);
}

.send-btn:disabled {
    background: var(--bg-hover);
    cursor: not-allowed;
    opacity: 0.5;
}

/* Typing Indicator */
.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 16px 20px;
}

.typing-indicator span {
    height: 8px;
    width: 8px;
    background-color: var(--text-tertiary);
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
        transform: translateY(-8px);
    }
}

/* Transitions */
.chat-window-enter-active,
.chat-window-leave-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-window-enter-from,
.chat-window-leave-to {
    transform: translateY(30px) scale(0.9);
    opacity: 0;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
    transition: all 0.2s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
    opacity: 0;
    transform: scale(0.8) rotate(90deg);
}

/* Responsive */
@media (max-width: 480px) {
    .chat-container {
        width: calc(100vw - 40px);
        height: calc(100vh - 140px);
        bottom: 80px;
        right: 0;
    }
}
</style>
