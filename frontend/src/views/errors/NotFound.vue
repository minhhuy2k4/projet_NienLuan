<template>
    <div class="not-found-container">
        <h1>404</h1>
        <p>Trang bạn tìm kiếm không tồn tại.</p>
        <router-link to="/">Quay về trang chủ</router-link>
    </div>
</template>

<style scoped>
.not-found-container {
    text-align: center;
    padding: 100px 20px;
    min-height: 50vh;
    background-color: var(--bg-primary);
}

h1 {
    font-size: 6rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
}

p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: var(--text-secondary);
}

a {
    font-weight: 700;
    color: var(--color-primary);
    padding: 1rem 2rem;
    border: 2px solid var(--color-primary);
    border-radius: var(--radius-lg);
    display: inline-block;
    transition: all var(--transition-base);
}

a:hover {
    background-color: var(--color-primary);
    color: white;
    transform: scale(1.05);
}
</style>