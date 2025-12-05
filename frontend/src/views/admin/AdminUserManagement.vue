<template>
    <div class="main-content">
        <div class="content-header animate-fade-in">
            <h2>Quản lý Người dùng</h2>
            <button @click="openAddUserModal()"
                class="px-6 py-3 !bg-green-600 hover:!bg-green-700 !text-white font-bold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm người dùng
            </button>
        </div>

        <!-- Modal Thêm/Sửa người dùng -->
        <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
            <div class="modal-content animate-slide-up">
                <h3 class="text-xl font-bold mb-6 text-center text-gray-800">{{ editingUser ? 'Sửa thông tin người dùng'
                    : 'Thêm người dùng mới' }}</h3>
                <form @submit.prevent="handleSubmit" class="form-simple">
                    <div class="form-group">
                        <label for="name">Tên người dùng <span class="text-red-500">*</span></label>
                        <input type="text" id="name" v-model="formData.name" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="email">Email <span class="text-red-500">*</span></label>
                        <input type="email" id="email" v-model="formData.email" required class="form-input">
                    </div>
                    <div class="form-group" v-if="!editingUser">
                        <label for="password">Mật khẩu <span class="text-red-500">*</span></label>
                        <input type="password" id="password" v-model="formData.password" required minlength="6"
                            class="form-input">
                        <small class="text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</small>
                    </div>
                    <div class="form-group" v-if="editingUser">
                        <label for="password">Mật khẩu mới (để trống nếu không đổi)</label>
                        <input type="password" id="password" v-model="formData.password" minlength="6"
                            class="form-input">
                        <small class="text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</small>
                    </div>
                    <div class="form-group">
                        <label for="role">Vai trò</label>
                        <select id="role" v-model="formData.role" class="form-input">
                            <option value="user">Người dùng</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <p v-if="error" class="text-red-500 text-center my-3">{{ error }}</p>
                    <div class="flex justify-center gap-4 mt-6">
                        <button type="submit"
                            class="px-6 py-3 !bg-green-600 hover:!bg-green-700 !text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                            :disabled="loading">
                            {{ loading ? 'Đang lưu...' : (editingUser ? 'Cập nhật' : 'Tạo mới') }}
                        </button>
                        <button type="button"
                            class="px-6 py-3 !bg-gray-600 hover:!bg-gray-700 !text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                            @click="closeUserModal">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Reset Password -->
        <div v-if="showResetModal" class="modal-overlay" @click.self="closeResetModal">
            <div class="modal-content animate-slide-up">
                <h3 class="text-xl font-bold mb-6 text-center text-gray-800">Reset mật khẩu cho {{ resetUser?.name }}
                </h3>
                <form @submit.prevent="handleResetPassword" class="form-simple">
                    <div class="form-group">
                        <label for="newPassword">Mật khẩu mới <span class="text-red-500">*</span></label>
                        <input type="password" id="newPassword" v-model="newPassword" required minlength="6"
                            class="form-input">
                        <small class="text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</small>
                    </div>
                    <p v-if="resetError" class="text-red-500 text-center my-3">{{ resetError }}</p>
                    <div class="flex justify-center gap-4 mt-6">
                        <button type="submit"
                            class="px-6 py-3 !bg-blue-600 hover:!bg-blue-700 !text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                            :disabled="resetLoading">
                            {{ resetLoading ? 'Đang reset...' : 'Reset mật khẩu' }}
                        </button>
                        <button type="button"
                            class="px-6 py-3 !bg-gray-600 hover:!bg-gray-700 !text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                            @click="closeResetModal">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Danh sách người dùng -->
        <div class="data-card animate-slide-up">
            <h3 class="text-xl font-bold text-gray-800 mb-6">Danh sách người dùng</h3>

            <!-- Search Box -->
            <div class="flex justify-between items-center gap-4 mb-6 flex-wrap">
                <div class="relative flex-grow min-w-[250px]">
                    <input v-model="searchQuery" @input="handleSearch" type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div class="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium">
                    Tổng: <strong>{{ total }}</strong> người dùng
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 w-1/12">Avatar</th>
                            <th scope="col" class="px-6 py-3 w-2/12">Tên</th>
                            <th scope="col" class="px-6 py-3 w-4/12">Email</th>
                            <th scope="col" class="px-6 py-3 w-2/12">Vai trò</th>
                            <th scope="col" class="px-6 py-3 w-2/12">Loại tài khoản</th>
                            <th scope="col" class="px-6 py-3 w-1/12 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in userList" :key="user._id" class="bg-white border-b hover:bg-gray-50"
                            :style="{ animationDelay: `${index * 50}ms` }">
                            <td class="px-6 py-4">
                                <img :src="getUserAvatar(user.avatar)" :alt="user.name"
                                    class="w-10 h-10 rounded-full object-cover" @error="handleImageError">
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ user.name }}</td>
                            <td class="px-6 py-4">{{ user.email }}</td>
                            <td class="px-6 py-4">
                                <span
                                    :class="['px-2 py-1 rounded-full text-xs font-semibold', user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800']">
                                    {{ user.role === 'admin' ? 'Admin' : 'Người dùng' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="['px-2 py-1 rounded-full text-xs font-semibold', user.provider === 'google' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800']">
                                    {{ user.provider === 'google' ? 'Google' : 'Local' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900"
                                        title="Sửa">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fill-rule="evenodd"
                                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <button v-if="user.provider === 'local'" @click="showResetPasswordModal(user)"
                                        class="text-yellow-600 hover:text-yellow-900" title="Reset mật khẩu">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <button @click="deleteUser(user._id)" class="text-red-600 hover:text-red-900"
                                        title="Xóa">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-if="userList.length === 0 && searchQuery" class="text-center text-gray-500 mt-6">Không tìm thấy người
                dùng nào phù hợp với "{{ searchQuery }}"</p>
            <p v-else-if="userList.length === 0" class="text-center text-gray-500 mt-6">Chưa có người dùng nào.</p>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                    ← Trước
                </button>
                <div class="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">
                    Trang {{ currentPage }} / {{ totalPages }}
                </div>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Sau →
                </button>
            </div>

            <!-- Displaying info -->
            <div v-if="userList.length > 0" class="mt-4 text-center text-sm text-gray-600">
                Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, total)
                }} trên tổng số {{ total }} người dùng
            </div>
        </div>

        <!-- Confirm Dialog -->
        <ConfirmDialog v-model="showDialog" :title="dialogConfig.title" :message="dialogConfig.message"
            :type="dialogConfig.type" @confirm="dialogConfig.onConfirm" />

        <!-- Toast Notification -->
        <Toast v-model="showToast" :message="toastConfig.message" :type="toastConfig.type" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import userService from '@/services/user.service';
import { getAvatarUrl } from '@/utils/media';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Toast from '@/components/Toast.vue';

const userList = ref([]);
const formData = ref({
    name: '',
    email: '',
    password: '',
    role: 'user'
});
const editingUser = ref(null);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const total = ref(0);

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage));

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23e0e0e0"/%3E%3Cpath fill="%23999" d="M50 45c8.3 0 15-6.7 15-15s-6.7-15-15-15-15 6.7-15 15 6.7 15 15 15zm0 5c-13.8 0-25 8.3-25 18.5V75h50v-6.5C75 58.3 63.8 50 50 50z"/%3E%3C/svg%3E';

const showResetModal = ref(false);
const resetUser = ref(null);
const newPassword = ref('');
const resetLoading = ref(false);
const resetError = ref(null);

// Dialog state
const showDialog = ref(false);
const dialogConfig = ref({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
});

// Toast state
const showToast = ref(false);
const toastConfig = ref({
    message: '',
    type: 'success'
});

const getUserAvatar = (avatarPath) => {
    return getAvatarUrl(avatarPath) || DEFAULT_AVATAR;
};

const handleImageError = (event) => {
    event.target.src = DEFAULT_AVATAR;
};

const showUserModal = ref(false);

function openAddUserModal() {
    editingUser.value = null;
    formData.value = { name: '', email: '', password: '', role: 'user' };
    error.value = null;
    showUserModal.value = true;
}

function closeUserModal() {
    showUserModal.value = false;
    editingUser.value = null;
    error.value = null;
}

async function fetchUsers() {
    try {
        loading.value = true;
        const result = await userService.getAllUsers(currentPage.value, itemsPerPage, searchQuery.value);
        userList.value = result.users;
        total.value = result.total;
    } catch (err) {
        console.error('Error fetching users:', err);
        toastConfig.value = {
            message: 'Lỗi khi tải danh sách người dùng.',
            type: 'error'
        };
        showToast.value = true;
    } finally {
        loading.value = false;
    }
}

onMounted(fetchUsers);

let searchTimeout;
const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchUsers();
    }, 300);
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchUsers();
    }
};

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
        if (editingUser.value) {
            const updates = {
                name: formData.value.name,
                email: formData.value.email,
                role: formData.value.role,
            };
            if (formData.value.password) {
                if (formData.value.password.length < 6) {
                    error.value = 'Mật khẩu phải có ít nhất 6 ký tự.';
                    loading.value = false;
                    return;
                }
                updates.password = formData.value.password;
            }
            await userService.updateUser(editingUser.value, updates);
            toastConfig.value = {
                message: 'Cập nhật người dùng thành công!',
                type: 'success'
            };
            showToast.value = true;
        } else {
            await userService.createUser(formData.value);
            toastConfig.value = {
                message: 'Tạo người dùng thành công!',
                type: 'success'
            };
            showToast.value = true;
        }
        closeUserModal();
        fetchUsers();
    } catch (err) {
        console.error('Error saving user:', err);
        error.value = err.response?.data?.message || 'Lỗi khi lưu người dùng.';
    } finally {
        loading.value = false;
    }
};

const editUser = (user) => {
    editingUser.value = user._id;
    formData.value = {
        name: user.name,
        email: user.email,
        role: user.role,
        password: ''
    };
    error.value = null;
    showUserModal.value = true;
};

const deleteUser = async (id) => {
    dialogConfig.value = {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.',
        type: 'danger',
        onConfirm: async () => {
            try {
                await userService.deleteUser(id);
                toastConfig.value = {
                    message: 'Xóa người dùng thành công!',
                    type: 'success'
                };
                showToast.value = true;
                if (userList.value.length === 1 && currentPage.value > 1) {
                    currentPage.value--;
                }
                fetchUsers();
            } catch (err) {
                console.error('Error deleting user:', err);
                toastConfig.value = {
                    message: err.response?.data?.message || 'Lỗi khi xóa người dùng.',
                    type: 'error'
                };
                showToast.value = true;
            }
        }
    };
    showDialog.value = true;
};

const showResetPasswordModal = (user) => {
    resetUser.value = user;
    newPassword.value = '';
    resetError.value = null;
    showResetModal.value = true;
};

const closeResetModal = () => {
    showResetModal.value = false;
    resetUser.value = null;
    newPassword.value = '';
    resetError.value = null;
};

const handleResetPassword = async () => {
    if (newPassword.value.length < 6) {
        resetError.value = "Mật khẩu phải có ít nhất 6 ký tự.";
        return;
    }
    resetLoading.value = true;
    resetError.value = null;

    try {
        await userService.resetPassword(resetUser.value._id, newPassword.value);
        toastConfig.value = {
            message: 'Reset mật khẩu thành công!',
            type: 'success'
        };
        showToast.value = true;
        closeResetModal();
    } catch (err) {
        console.error('Error resetting password:', err);
        resetError.value = err.response?.data?.message || 'Lỗi khi reset mật khẩu.';
    } finally {
        resetLoading.value = false;
    }
};
</script>

<style scoped>
/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    max-width: 450px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Form styles */
.form-simple .form-group {
    margin-bottom: 1.25rem;
}

.form-simple label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #334155;
}

.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    background: #f8fafc;
    transition: all 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* General Button Styles */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary {
    background-color: #2563eb;
    color: white;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
}

.btn-primary:hover:not(:disabled) {
    background-color: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
    background-color: #e2e8f0;
    color: #334155;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #cbd5e1;
}

/* Animations */
.animate-slide-up {
    animation: slide-up 0.4s ease-out forwards;
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
