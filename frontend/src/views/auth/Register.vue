<template>
    <div class="form-container">
        <div class="form-box animate-slide-up">
            <h2 class="animate-fade-in">Đăng ký</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group animate-slide-up animation-delay-100">
                    <label>Tên:</label>
                    <input type="text" v-model="name" required :disabled="loading"
                        class="focus:ring-2 focus:ring-blue-500 transition">
                </div>

                <div class="form-group animate-slide-up animation-delay-200">
                    <label>Email:</label>
                    <input type="email" v-model="email" required :disabled="loading"
                        class="focus:ring-2 focus:ring-blue-500 transition">
                </div>

                <div class="form-group animate-slide-up animation-delay-300">
                    <label>Mật khẩu:</label>
                    <input type="password" v-model="password" required :disabled="loading"
                        class="focus:ring-2 focus:ring-blue-500 transition">
                </div>

                <button type="submit"
                    class="submit-btn transform hover:scale-105 transition animate-slide-up animation-delay-400"
                    :disabled="loading">
                    {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
                </button>

                <div v-if="errorMessage" class="error-message animate-fade-in">
                    {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="success-message animate-fade-in">
                    {{ successMessage }}
                </div>
            </form>

            <p class="text-center animate-fade-in animation-delay-500">
                Đã có tài khoản?
                <router-link to="/login" class="hover:text-blue-700 transition">Đăng nhập</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    console.log('Attempting to register:', { name: name.value, email: email.value });

    const result = await authStore.register(name.value, email.value, password.value);

    console.log('Register result:', result);

    loading.value = false;

    if (result.success) {
        successMessage.value = result.message + ' Đang chuyển đến trang đăng nhập...';
        setTimeout(() => router.push('/login'), 2000);
    } else {
        errorMessage.value = result.message;
    }
};
</script>

<style scoped>
/* Existing styles */
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
    min-height: 70vh;
}

.form-box {
    background: var(--white-color);
    padding: 2rem 2.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    color: var(--primary-text);
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;
}

.submit-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary-blue);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 1rem;
}

.submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.error-message {
    color: red;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1rem;
}

.success-message {
    color: green;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1rem;
}

.text-center {
    text-align: center;
    margin-top: 1rem;
}

.text-center a {
    color: var(--primary-blue);
    text-decoration: none;
}

.text-center a:hover {
    text-decoration: underline;
}
</style>