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
}

h1 {
    font-size: 6rem;
    font-weight: 700;
    color: var(--primary-blue);
    margin: 0;
}

p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
}

a {
    font-weight: 700;
    color: var(--primary-blue);
}
</style>