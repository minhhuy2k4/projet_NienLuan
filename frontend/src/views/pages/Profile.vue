<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">Trang Cá Nhân</h1>
                <p class="text-gray-600">Quản lý thông tin và cài đặt tài khoản</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>

            <!-- Profile Content -->
            <div v-else class="space-y-6">
                <!-- Avatar Section -->
                <div class="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Ảnh Đại Diện</h2>
                    <div class="flex items-center gap-6">
                        <div class="relative animate-fade-in">
                            <img :src="displayAvatar" alt="Avatar"
                                class="w-32 h-32 rounded-full object-cover border-4 border-blue-200 transition-transform hover:scale-105">
                            <label for="avatar-file"
                                class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </label>
                            <input id="avatar-file" type="file" accept="image/*" @change="handleFileUpload"
                                class="hidden">
                        </div>
                        <div class="flex-1 space-y-4">
                            <!-- Upload từ máy -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Upload từ máy</label>
                                <div class="flex gap-3">
                                    <label for="avatar-file-input"
                                        class="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
                                        <span class="text-gray-600">{{ selectedFileName || 'Chọn ảnh từ máy' }}</span>
                                    </label>
                                    <input id="avatar-file-input" type="file" accept="image/*"
                                        @change="handleFileUpload" class="hidden">
                                    <button @click="uploadAvatarFile" :disabled="updating || !avatarFile"
                                        class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                                        {{ updating ? 'Đang tải...' : 'Upload' }}
                                    </button>
                                </div>
                            </div>

                            <!-- Hoặc dùng URL -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Hoặc dùng URL từ
                                    internet</label>
                                <div class="flex gap-3">
                                    <input v-model="newAvatarUrl" type="text"
                                        placeholder="Nhập URL ảnh từ internet (https://...)"
                                        class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                                    <button @click="updateAvatarUrl" :disabled="updating || !newAvatarUrl.trim()"
                                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                                        {{ updating ? 'Đang lưu...' : 'Cập nhật' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile Info Section -->
                <div class="bg-white rounded-xl shadow-lg p-6 animate-slide-up" style="animation-delay: 0.1s;">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Thông Tin Cá Nhân</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tên hiển thị</label>
                            <div class="flex gap-3">
                                <input v-model="profileForm.name" type="text"
                                    class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                                <button @click="updateProfile" :disabled="updating"
                                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                                    {{ updating ? 'Đang lưu...' : 'Lưu' }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input v-model="user.email" type="email" disabled
                                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                            <p class="text-sm text-gray-500 mt-1">Email không thể thay đổi</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                            <input :value="user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'" disabled
                                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                        </div>
                        <div v-if="user.provider">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Đăng nhập bằng</label>
                            <input :value="user.provider === 'google' ? 'Google' : 'Email & Password'" disabled
                                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                        </div>
                    </div>
                </div>

                <!-- Change Password Section (only for local users) -->
                <div v-if="user.provider !== 'google'" class="bg-white rounded-xl shadow-lg p-6 animate-slide-up"
                    style="animation-delay: 0.2s;">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Đổi Mật Khẩu</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                            <input v-model="passwordForm.currentPassword" type="password"
                                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                            <input v-model="passwordForm.newPassword" type="password"
                                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                            <input v-model="passwordForm.confirmPassword" type="password"
                                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                        </div>
                        <button @click="changePassword" :disabled="updating"
                            class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                            {{ updating ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
                        </button>
                    </div>
                </div>

                <!-- Success/Error Messages -->
                <div v-if="message" class="fixed bottom-4 right-4 z-50 animate-slide-up">
                    <div :class="[
                        'px-6 py-4 rounded-lg shadow-lg',
                        messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    ]">
                        {{ message }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import UserService from '@/services/user.service';
import { getAvatarUrl } from '@/utils/media';

const authStore = useAuthStore();
const user = ref({});
const loading = ref(true);
const updating = ref(false);
const message = ref('');
const messageType = ref('success');

const avatarUrl = ref('');
const newAvatarUrl = ref('');
const avatarPreview = ref('');
const avatarFile = ref(null);
const selectedFileName = ref('');
const profileForm = ref({
    name: ''
});
const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff&size=128';

// Computed properties
const displayAvatar = computed(() => {
    // Nếu có preview (đang upload hoặc đang nhập URL)
    if (avatarPreview.value) {
        // Nếu là data URL (base64 từ FileReader), dùng trực tiếp
        if (avatarPreview.value.startsWith('data:')) {
            return avatarPreview.value;
        }
        // Nếu là URL bình thường, dùng getAvatarUrl
        return getAvatarUrl(avatarPreview.value);
    }

    // Nếu user có avatar
    if (user.value.avatar) {
        return getAvatarUrl(user.value.avatar);
    }

    // Default avatar
    return defaultAvatar;
});

const avatarDisplayName = computed(() => {
    if (!user.value.avatar) return 'Chưa có avatar';

    // Nếu là URL từ /avatars/ thì chỉ lấy tên file
    if (user.value.avatar.includes('/avatars/')) {
        const parts = user.value.avatar.split('/');
        return parts[parts.length - 1];
    }

    // Nếu là URL bên ngoài, hiển thị "Avatar từ URL"
    if (user.value.avatar.startsWith('http')) {
        return 'Avatar từ URL bên ngoài';
    }

    return 'Avatar hiện tại';
});

const canUpdateUrl = computed(() => {
    return avatarUrl.value && avatarUrl.value.trim() !== '';
});

// Load user data
const loadProfile = async () => {
    try {
        loading.value = true;
        user.value = await UserService.getProfile();
        profileForm.value.name = user.value.name;
        avatarUrl.value = user.value.avatar || '';
        avatarPreview.value = user.value.avatar || '';
        newAvatarUrl.value = ''; // Clear input URL
    } catch (error) {
        console.error('Error loading profile:', error);
        showMessage('Không thể tải thông tin cá nhân', 'error');
    } finally {
        loading.value = false;
    }
};

// Handle file selection
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Vui lòng chọn file ảnh', 'error');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showMessage('Kích thước ảnh không được vượt quá 5MB', 'error');
        return;
    }

    avatarFile.value = file;
    selectedFileName.value = file.name;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
        avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Upload avatar file
const uploadAvatarFile = async () => {
    if (!avatarFile.value) {
        showMessage('Vui lòng chọn ảnh', 'error');
        return;
    }

    try {
        updating.value = true;
        const result = await UserService.uploadAvatar(avatarFile.value);
        user.value = result.user;
        avatarUrl.value = result.user.avatar;

        // Update auth store
        authStore.user.avatar = result.user.avatar;

        // Clear file input and preview
        avatarFile.value = null;
        selectedFileName.value = '';
        avatarPreview.value = result.user.avatar; // Update preview với URL mới từ server

        showMessage('Upload avatar thành công!', 'success');
    } catch (error) {
        console.error('Error uploading avatar:', error);
        showMessage('Không thể upload avatar', 'error');
    } finally {
        updating.value = false;
    }
};

// Update avatar URL
const updateAvatarUrl = async () => {
    if (!newAvatarUrl.value.trim()) {
        showMessage('Vui lòng nhập URL avatar', 'error');
        return;
    }

    try {
        updating.value = true;
        const result = await UserService.updateAvatar(newAvatarUrl.value);
        user.value = result.user;
        avatarPreview.value = newAvatarUrl.value;
        avatarUrl.value = result.user.avatar;

        // Update auth store
        authStore.user.avatar = newAvatarUrl.value;

        // Clear input
        newAvatarUrl.value = '';

        showMessage('Cập nhật avatar thành công!', 'success');
    } catch (error) {
        console.error('Error updating avatar:', error);
        showMessage('Không thể cập nhật avatar', 'error');
    } finally {
        updating.value = false;
    }
};

// Update profile
const updateProfile = async () => {
    if (!profileForm.value.name.trim()) {
        showMessage('Tên không được để trống', 'error');
        return;
    }

    try {
        updating.value = true;
        const result = await UserService.updateProfile({ name: profileForm.value.name });
        user.value = result.user;

        // Update auth store
        authStore.user.name = profileForm.value.name;

        showMessage('Cập nhật thông tin thành công!', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Không thể cập nhật thông tin', 'error');
    } finally {
        updating.value = false;
    }
};

// Change password
const changePassword = async () => {
    if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
        showMessage('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        showMessage('Mật khẩu mới không khớp', 'error');
        return;
    }

    if (passwordForm.value.newPassword.length < 6) {
        showMessage('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
        return;
    }

    try {
        updating.value = true;
        await UserService.changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword);

        // Clear form
        passwordForm.value = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        showMessage('Đổi mật khẩu thành công!', 'success');
    } catch (error) {
        console.error('Error changing password:', error);
        showMessage(error.response?.data?.message || 'Không thể đổi mật khẩu', 'error');
    } finally {
        updating.value = false;
    }
};

// Show message helper
const showMessage = (msg, type = 'success') => {
    message.value = msg;
    messageType.value = type;
    setTimeout(() => {
        message.value = '';
    }, 3000);
};

onMounted(() => {
    loadProfile();
});
</script>

<style scoped>
/* Animation for message */
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.fixed>div {
    animation: slideIn 0.3s ease-out;
}
</style>
