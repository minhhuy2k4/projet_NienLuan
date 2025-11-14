<template>
    <main class="main-content">
        <header class="content-header animate-fade-in">
            <h2>Quản lý Người dùng</h2>
        </header>
        <div class="main-data-grid">
            <!-- Form thêm/sửa người dùng -->
            <div class="data-card animate-slide-up">
                <h3>{{ editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới' }}</h3>
                <form @submit.prevent="handleSubmit" class="form-simple">
                    <div class="form-group">
                        <label for="name">Tên người dùng <span class="required">*</span></label>
                        <input type="text" id="name" v-model="formData.name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email <span class="required">*</span></label>
                        <input type="email" id="email" v-model="formData.email" required>
                    </div>
                    <div class="form-group" v-if="!editingUser">
                        <label for="password">Mật khẩu <span class="required">*</span></label>
                        <input type="password" id="password" v-model="formData.password" required minlength="6">
                        <small>Mật khẩu phải có ít nhất 6 ký tự</small>
                    </div>
                    <div class="form-group">
                        <label for="role">Vai trò</label>
                        <select id="role" v-model="formData.role">
                            <option value="user">Người dùng</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <p v-if="error" class="error-message">{{ error }}</p>
                    <div class="button-group">
                        <button type="submit" class="submit-button transform hover:scale-105 transition"
                            :disabled="loading">
                            {{ loading ? 'Đang lưu...' : (editingUser ? 'Cập nhật' : 'Tạo mới') }}
                        </button>
                        <button v-if="editingUser" type="button"
                            class="cancel-button transform hover:scale-105 transition" @click="cancelEdit">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>

            <!-- Danh sách người dùng -->
            <div class="data-card list-card animate-slide-up" style="animation-delay: 0.1s">
                <h3>Danh sách người dùng</h3>

                <!-- Search Box -->
                <div class="search-filter-section">
                    <div class="search-box">
                        <input v-model="searchQuery" @input="handleSearch" type="text"
                            placeholder="🔍 Tìm kiếm theo tên hoặc email..." class="search-input" />
                    </div>
                    <div class="filter-info">
                        Tổng: <strong>{{ total }}</strong> người dùng
                    </div>
                </div>

                <div v-if="userList.length > 0" class="user-table-wrapper">
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Loại tài khoản</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in userList" :key="user._id"
                                class="animate-chapter-in hover:bg-gray-50 transition-all duration-300"
                                :style="{ animationDelay: `${index * 50}ms` }">
                                <td>
                                    <img :src="getUserAvatar(user.avatar)" :alt="user.name" class="user-avatar"
                                        @error="handleImageError">
                                </td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <span :class="['role-badge', user.role === 'admin' ? 'role-admin' : 'role-user']">
                                        {{ user.role === 'admin' ? 'Admin' : 'Người dùng' }}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        :class="['provider-badge', user.provider === 'google' ? 'provider-google' : 'provider-local']">
                                        {{ user.provider === 'google' ? '🌐 Google' : '🔐 Local' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button @click="editUser(user)" class="edit-btn" title="Sửa">
                                            ✏️
                                        </button>
                                        <button v-if="user.provider === 'local'" @click="showResetPasswordModal(user)"
                                            class="reset-btn" title="Reset mật khẩu">
                                            🔑
                                        </button>
                                        <button @click="deleteUser(user._id)" class="delete-btn" title="Xóa">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else-if="searchQuery">Không tìm thấy người dùng nào phù hợp với "{{ searchQuery }}"</p>
                <p v-else>Chưa có người dùng nào.</p>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
                        ← Trước
                    </button>
                    <span class="page-info">
                        Trang {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="page-btn">
                        Sau →
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Reset Password -->
        <div v-if="showResetModal" class="modal-overlay" @click.self="closeResetModal">
            <div class="modal-content animate-slide-up">
                <h3>Reset mật khẩu cho {{ resetUser?.name }}</h3>
                <form @submit.prevent="handleResetPassword" class="form-simple">
                    <div class="form-group">
                        <label for="newPassword">Mật khẩu mới <span class="required">*</span></label>
                        <input type="password" id="newPassword" v-model="newPassword" required minlength="6">
                        <small>Mật khẩu phải có ít nhất 6 ký tự</small>
                    </div>
                    <p v-if="resetError" class="error-message">{{ resetError }}</p>
                    <div class="button-group">
                        <button type="submit" class="submit-button" :disabled="resetLoading">
                            {{ resetLoading ? 'Đang reset...' : 'Reset mật khẩu' }}
                        </button>
                        <button type="button" class="cancel-button" @click="closeResetModal">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import userService from '@/services/user.service';
import { getAvatarUrl } from '@/utils/media';

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
const itemsPerPage = 5;
const total = ref(0);
const totalPages = ref(1);

// Default avatar cho trường hợp không có avatar
const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23e0e0e0"/%3E%3Cpath fill="%23999" d="M50 45c8.3 0 15-6.7 15-15s-6.7-15-15-15-15 6.7-15 15 6.7 15 15 15zm0 5c-13.8 0-25 8.3-25 18.5V75h50v-6.5C75 58.3 63.8 50 50 50z"/%3E%3C/svg%3E';

// Reset password modal
const showResetModal = ref(false);
const resetUser = ref(null);
const newPassword = ref('');
const resetLoading = ref(false);
const resetError = ref(null);

// Get user avatar with fallback
const getUserAvatar = (avatarPath) => {
    const url = getAvatarUrl(avatarPath);
    return url || DEFAULT_AVATAR;
};

// Handle image error
const handleImageError = (event) => {
    event.target.src = DEFAULT_AVATAR;
};

// Lấy danh sách người dùng
async function fetchUsers() {
    try {
        loading.value = true;
        const result = await userService.getAllUsers(currentPage.value, itemsPerPage, searchQuery.value);
        userList.value = result.users;
        total.value = result.total;
        totalPages.value = result.totalPages;
    } catch (err) {
        console.error('Error fetching users:', err);
        error.value = 'Lỗi khi tải danh sách người dùng.';
    } finally {
        loading.value = false;
    }
}

onMounted(fetchUsers);

// Handle search
const handleSearch = () => {
    currentPage.value = 1;
    fetchUsers();
};

// Change page
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchUsers();
    }
};

// Submit form (create or update)
const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
        if (editingUser.value) {
            // Cập nhật người dùng
            const updates = {
                name: formData.value.name,
                email: formData.value.email,
                role: formData.value.role,
            };

            await userService.updateUser(editingUser.value, updates);
            alert('✅ Cập nhật người dùng thành công!');
            editingUser.value = null;
        } else {
            // Tạo người dùng mới
            await userService.createUser(formData.value);
            alert('✅ Tạo người dùng thành công!');
        }

        formData.value = { name: '', email: '', password: '', role: 'user' };
        fetchUsers();
    } catch (err) {
        console.error('Error saving user:', err);
        if (err.response?.data?.message) {
            error.value = err.response.data.message;
        } else {
            error.value = 'Lỗi khi lưu người dùng.';
        }
    } finally {
        loading.value = false;
    }
};

// Edit user
const editUser = (user) => {
    editingUser.value = user._id;
    formData.value = {
        name: user.name,
        email: user.email,
        role: user.role,
        password: '' // Không hiển thị password khi edit
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Cancel edit
const cancelEdit = () => {
    editingUser.value = null;
    formData.value = { name: '', email: '', password: '', role: 'user' };
    error.value = null;
};

// Delete user
const deleteUser = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        return;
    }

    try {
        await userService.deleteUser(id);
        alert('✅ Xóa người dùng thành công!');

        if (editingUser.value === id) {
            cancelEdit();
        }

        fetchUsers();
    } catch (err) {
        console.error('Error deleting user:', err);
        let errorMessage = 'Lỗi khi xóa người dùng.';
        if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        alert('❌ ' + errorMessage);
    }
};

// Show reset password modal
const showResetPasswordModal = (user) => {
    resetUser.value = user;
    newPassword.value = '';
    resetError.value = null;
    showResetModal.value = true;
};

// Close reset password modal
const closeResetModal = () => {
    showResetModal.value = false;
    resetUser.value = null;
    newPassword.value = '';
    resetError.value = null;
};

// Handle reset password
const handleResetPassword = async () => {
    resetLoading.value = true;
    resetError.value = null;

    try {
        await userService.resetPassword(resetUser.value._id, newPassword.value);
        alert('✅ Reset mật khẩu thành công!');
        closeResetModal();
    } catch (err) {
        console.error('Error resetting password:', err);
        if (err.response?.data?.message) {
            resetError.value = err.response.data.message;
        } else {
            resetError.value = 'Lỗi khi reset mật khẩu.';
        }
    } finally {
        resetLoading.value = false;
    }
};
</script>

<style scoped>
.required {
    color: #f44336;
}

.button-group {
    display: flex;
    gap: 1rem;
}

.cancel-button {
    padding: 0.75rem 1.5rem;
    background-color: #999;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.cancel-button:hover {
    background-color: #777;
}

/* Search and Filter Section */
.search-filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.search-box {
    flex: 1;
    min-width: 200px;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border-light);
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filter-info {
    padding: 0.75rem 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--text-secondary);
    white-space: nowrap;
}

/* User Table */
.user-table-wrapper {
    overflow-x: auto;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.user-table th,
.user-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

.user-table th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: var(--text-primary);
}

.user-table tbody tr:hover {
    background-color: #f9f9f9;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.role-badge,
.provider-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    display: inline-block;
}

.role-admin {
    background-color: #ff5722;
    color: white;
}

.role-user {
    background-color: #4CAF50;
    color: white;
}

.provider-google {
    background-color: #4285f4;
    color: white;
}

.provider-local {
    background-color: #757575;
    color: white;
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
}

.edit-btn,
.delete-btn,
.reset-btn {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s;
    background: transparent;
}

.edit-btn:hover {
    transform: scale(1.2);
}

.delete-btn:hover {
    transform: scale(1.2);
}

.reset-btn:hover {
    transform: scale(1.2);
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding: 1rem 0;
}

.page-btn {
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.page-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

.page-info {
    font-weight: 600;
    color: var(--text-primary);
    min-width: 120px;
    text-align: center;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content h3 {
    margin-bottom: 1.5rem;
    color: var(--text-primary);
}

/* Form styles */
.form-simple small {
    display: block;
    margin-top: 0.25rem;
    color: #666;
    font-size: 0.85rem;
}
</style>
