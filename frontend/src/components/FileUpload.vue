<template>
    <div class="file-upload">
        <div class="upload-area" :class="{ 'drag-over': isDragOver }" @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false" @drop.prevent="handleDrop">
            <input type="file" :id="inputId" :accept="accept" @change="handleFileSelect" class="file-input"
                ref="fileInput">
            <label :for="inputId" class="upload-label">
                <div class="upload-icon">📁</div>
                <p v-if="!selectedFile">{{ placeholder }}</p>
                <p v-else class="selected-file">{{ selectedFile.name }}</p>
                <small>{{ acceptText }}</small>
            </label>
        </div>

        <div v-if="selectedFile" class="file-preview">
            <div class="file-info">
                <strong>{{ selectedFile.name }}</strong>
                <span>{{ formatFileSize(selectedFile.size) }}</span>
            </div>
            <button @click="removeFile" class="remove-btn">❌</button>
        </div>

        <div v-if="uploadProgress > 0" class="upload-progress">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <span>{{ uploadProgress }}%</span>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    accept: {
        type: String,
        default: '*/*'
    },
    placeholder: {
        type: String,
        default: 'Chọn file hoặc kéo thả vào đây'
    },
    maxSize: {
        type: Number,
        default: 100 * 1024 * 1024 // 100MB
    },
    inputId: {
        type: String,
        default: () => `file-input-${Math.random().toString(36).substr(2, 9)}`
    }
});

const emit = defineEmits(['file-selected', 'file-removed']);

const selectedFile = ref(null);
const isDragOver = ref(false);
const uploadProgress = ref(0);
const error = ref('');
const success = ref('');
const fileInput = ref(null);

const acceptText = computed(() => {
    if (props.accept.includes('image')) return 'Chỉ chấp nhận file ảnh';
    if (props.accept.includes('audio')) return 'Chỉ chấp nhận file âm thanh';
    return 'Chọn file phù hợp';
});

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        validateAndSetFile(file);
    }
};

const handleDrop = (event) => {
    isDragOver.value = false;
    const file = event.dataTransfer.files[0];
    if (file) {
        validateAndSetFile(file);
    }
};

const validateAndSetFile = (file) => {
    error.value = '';
    success.value = '';

    // Kiểm tra kích thước
    if (file.size > props.maxSize) {
        error.value = `File quá lớn. Tối đa ${formatFileSize(props.maxSize)}`;
        return;
    }

    selectedFile.value = file;
    emit('file-selected', file);
};

const removeFile = () => {
    selectedFile.value = null;
    uploadProgress.value = 0;
    error.value = '';
    success.value = '';
    if (fileInput.value) {
        fileInput.value.value = '';
    }
    emit('file-removed');
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const setProgress = (progress) => {
    uploadProgress.value = progress;
};

const setError = (message) => {
    error.value = message;
    uploadProgress.value = 0;
};

const setSuccess = (message) => {
    success.value = message;
    uploadProgress.value = 100;
};

defineExpose({
    setProgress,
    setError,
    setSuccess,
    removeFile
});
</script>

<style scoped>
.file-upload {
    width: 100%;
}

.upload-area {
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-area:hover,
.upload-area.drag-over {
    border-color: var(--primary-blue);
    background-color: #f8f9fa;
}

.file-input {
    display: none;
}

.upload-label {
    display: block;
    cursor: pointer;
}

.upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.selected-file {
    color: var(--primary-blue);
    font-weight: 500;
}

.file-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 5px;
    margin-top: 1rem;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
}

.upload-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

.progress-bar {
    flex: 1;
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary-blue);
    transition: width 0.3s ease;
}

.error-message {
    color: #dc3545;
    margin-top: 0.5rem;
    font-size: 0.9rem;
}

.success-message {
    color: #28a745;
    margin-top: 0.5rem;
    font-size: 0.9rem;
}
</style>