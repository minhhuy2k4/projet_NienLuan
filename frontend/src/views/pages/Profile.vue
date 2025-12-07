<template>
    <div class="page-gradient" style="padding: 3rem 0;">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="page-title">Trang Cá Nhân</h1>
                <p class="page-subtitle">Quản lý thông tin và cài đặt tài khoản</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="loading-spinner"></div>
            </div>

            <!-- Profile Content -->
            <div v-else class="space-y-6">
                <!-- Avatar Section -->
                <div class="rounded-xl shadow-lg p-6 animate-slide-up" style="background-color: var(--bg-card);">
                    <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Ảnh Đại Diện</h2>
                    <div class="flex items-center gap-6">
                        <div class="relative animate-fade-in">
                            <img :src="displayAvatar" alt="Avatar"
                                class="w-32 h-32 rounded-full object-cover border-4 transition-transform hover:scale-105"
                                style="border-color: var(--color-primary);">
                            <label for="avatar-file"
                                class="absolute bottom-0 right-0 text-white p-2 rounded-full cursor-pointer transition-all hover:scale-110"
                                style="background-color: var(--color-primary);">
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
                                <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Upload
                                    từ máy</label>
                                <div class="flex gap-3">
                                    <label for="avatar-file-input"
                                        class="flex-1 px-4 py-2 border-2 border-dashed rounded-lg text-center cursor-pointer transition"
                                        style="border-color: var(--border-color); color: var(--text-secondary);">
                                        <span>{{ selectedFileName || 'Chọn ảnh từ máy' }}</span>
                                    </label>
                                    <input id="avatar-file-input" type="file" accept="image/*"
                                        @change="handleFileUpload" class="hidden">
                                    <button @click="uploadAvatarFile" :disabled="updating || !avatarFile"
                                        class="px-6 py-2 font-semibold rounded-lg transition"
                                        style="background-color: var(--color-success); color: white;"
                                        :style="{ opacity: (updating || !avatarFile) ? '0.5' : '1', cursor: (updating || !avatarFile) ? 'not-allowed' : 'pointer' }">
                                        {{ updating ? 'Đang tải...' : 'Upload' }}
                                    </button>
                                </div>
                            </div>

                            <!-- Hoặc dùng URL -->
                            <div>
                                <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Hoặc
                                    dùng URL từ
                                    internet</label>
                                <div class="flex gap-3">
                                    <input v-model="newAvatarUrl" type="text"
                                        placeholder="Nhập URL ảnh từ internet (https://...)"
                                        class="form-input-themed flex-1">
                                    <button @click="updateAvatarUrl" :disabled="updating || !newAvatarUrl.trim()"
                                        class="btn-action-primary"
                                        :style="{ opacity: (updating || !newAvatarUrl.trim()) ? '0.5' : '1', cursor: (updating || !newAvatarUrl.trim()) ? 'not-allowed' : 'pointer' }">
                                        {{ updating ? 'Đang lưu...' : 'Cập nhật' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile Info Section -->
                <div class="rounded-xl shadow-lg p-6 animate-slide-up"
                    style="animation-delay: 0.1s; background-color: var(--bg-card);">
                    <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Thông Tin Cá Nhân</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Tên hiển
                                thị</label>
                            <div class="flex gap-3">
                                <input v-model="profileForm.name" type="text" class="form-input-themed flex-1">
                                <button @click="updateProfile" :disabled="updating" class="btn-action-primary">
                                    {{ updating ? 'Đang lưu...' : 'Lưu' }}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2"
                                style="color: var(--text-primary);">Email</label>
                            <input v-model="user.email" type="email" disabled class="form-input-themed w-full"
                                style="opacity: 0.6; cursor: not-allowed;">
                            <p class="text-sm mt-1" style="color: var(--text-secondary);">Email không thể thay đổi</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Vai
                                trò</label>
                            <input :value="user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'" disabled
                                class="form-input-themed w-full" style="opacity: 0.6; cursor: not-allowed;">
                        </div>
                        <div v-if="user.provider">
                            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Đăng nhập
                                bằng</label>
                            <input :value="user.provider === 'google' ? 'Google' : 'Email & Password'" disabled
                                class="form-input-themed w-full" style="opacity: 0.6; cursor: not-allowed;">
                        </div>
                    </div>
                </div>

                <!-- Change Password Section (only for local users) -->
                <div v-if="user.provider !== 'google'" class="rounded-xl shadow-lg p-6 animate-slide-up"
                    style="animation-delay: 0.2s; background-color: var(--bg-card);">
                    <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Đổi Mật Khẩu</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Mật khẩu
                                hiện tại</label>
                            <div class="password-input-wrapper">
                                <input v-model="passwordForm.currentPassword"
                                    :type="showCurrentPassword ? 'text' : 'password'" class="form-input-themed w-full"
                                    style="padding-right: 2.5rem;">
                                <button v-if="passwordForm.currentPassword" type="button"
                                    @click="showCurrentPassword = !showCurrentPassword" class="password-toggle-btn">
                                    <svg v-if="!showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Mật khẩu
                                mới</label>
                            <div class="password-input-wrapper">
                                <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'"
                                    class="form-input-themed w-full" style="padding-right: 2.5rem;">
                                <button v-if="passwordForm.newPassword" type="button"
                                    @click="showNewPassword = !showNewPassword" class="password-toggle-btn">
                                    <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Xác nhận
                                mật khẩu mới</label>
                            <div class="password-input-wrapper">
                                <input v-model="passwordForm.confirmPassword"
                                    :type="showConfirmPassword ? 'text' : 'password'" class="form-input-themed w-full"
                                    style="padding-right: 2.5rem;">
                                <button v-if="passwordForm.confirmPassword" type="button"
                                    @click="showConfirmPassword = !showConfirmPassword" class="password-toggle-btn">
                                    <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button @click="changePassword" :disabled="updating" class="btn-action-danger w-full">
                            {{ updating ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
                        </button>
                    </div>
                </div>

                <!-- Success/Error Messages -->
                <div v-if="message" class="fixed bottom-4 right-4 z-50 animate-slide-up">
                    <div :class="[
                        'px-6 py-4 rounded-lg shadow-lg text-white',
                        messageType === 'success' ? '' : ''
                    ]"
                        :style="{ backgroundColor: messageType === 'success' ? 'var(--color-success)' : 'var(--color-danger)' }">
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

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

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

        // Update auth store và localStorage
        authStore.updateUser({ avatar: result.user.avatar });

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

        // Update auth store và localStorage
        authStore.updateUser({ avatar: result.user.avatar });

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
/* Password input wrapper */
.password-input-wrapper {
    position: relative;
}

.password-toggle-btn {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.password-toggle-btn:hover {
    color: var(--color-primary);
    background: none !important;
    border: none !important;
}

.password-toggle-btn:focus {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}

.password-toggle-btn:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}

.password-toggle-btn:active {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
}

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
