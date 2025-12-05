<script>
export default {
    props: {
        modelValue: { type: String, default: "" },
    },
    emits: ["submit", "update:modelValue"],
    methods: {
        updateModelValue(e) {
            this.$emit("update:modelValue", e.target.value);
        },
        submit() {
            this.$emit("submit");
        },
    },
};
</script>

<template>
    <div class="input-group">
        <input type="text" class="form-control" placeholder="Nhập thông tin cần tìm" :value="modelValue"
            @input="updateModelValue" @keyup.enter="submit" />
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="submit" aria-label="Tìm kiếm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
                    stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true" focusable="false" style="vertical-align: middle; margin-right: 6px;">
                    <circle cx="7" cy="7" r="3.5"></circle>
                    <line x1="11.5" y1="11.5" x2="15" y2="15"></line>
                </svg>
                <span>Tìm kiếm</span>
            </button>
        </div>
    </div>
</template>
