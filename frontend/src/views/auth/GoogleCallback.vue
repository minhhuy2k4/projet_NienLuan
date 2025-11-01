<template>
  <div class="callback-container">
    <div v-if="loading" class="loading">
      <p>Đang xử lý đăng nhập Google...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>Lỗi đăng nhập: {{ error }}</p>
      <router-link to="/login" class="back-link">Quay lại trang đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import googleAuthService from '@/services/google-auth.service';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    // Lấy authorization code từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      error.value = 'Đăng nhập Google bị hủy';
      loading.value = false;
      return;
    }

    if (!code) {
      error.value = 'Không nhận được mã xác thực từ Google';
      loading.value = false;
      return;
    }

    // Gửi code về backend để xử lý
    const result = await googleAuthService.handleCallback(code);

    if (result && result.user && result.token) {
      // Lưu vào localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Update auth store
      authStore.login(result.user, result.token);

      // Redirect theo role
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      error.value = 'Không thể xác thực người dùng';
    }
  } catch (err) {
    console.error('Callback processing error:', err);
    error.value = err.response?.data?.message || 'Lỗi xử lý đăng nhập Google';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
}

.loading,
.error {
  padding: 2rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #4285f4;
  text-decoration: none;
}
</style>