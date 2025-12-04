<template>
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="loading-spinner"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-xl p-8 rounded-lg border shadow-lg"
                style="color: var(--color-danger); background-color: var(--bg-secondary); border-color: var(--border-color);">
                {{ error }}</div>
        </div>

        <!-- Story Content -->
        <div v-else-if="story" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            <!-- Breadcrumb -->
            <nav class="text-sm mb-6 animate-fade-in">
                <router-link to="/" style="color: var(--text-secondary);" class="transition duration-300"
                    @mouseover="$event.target.style.color = 'var(--color-primary)'"
                    @mouseleave="$event.target.style.color = 'var(--text-secondary)'">
                    Trang chủ
                </router-link>
                <span style="color: var(--text-tertiary);" class="mx-2">/</span>
                <span style="color: var(--text-primary);" class="font-semibold">{{ story.name }}</span>
            </nav>

            <!-- Hero Section -->
            <div class="hero-gradient rounded-2xl shadow-2xl overflow-hidden mb-8 animate-slide-up">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
                    <!-- Cover Image -->
                    <div class="md:col-span-3">
                        <div class="relative group">
                            <img v-if="story.image" :src="getStoryImageUrl(story.image)" :alt="story.name"
                                class="w-full rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-300 aspect-[2/3] object-cover" />
                            <div v-else
                                class="w-full aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-xl">
                                <svg class="w-20 h-20 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Story Info -->
                    <div class="md:col-span-9 space-y-4">
                        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                            style="color: var(--hero-text-color);">{{ story.name }}</h1>

                        <!-- Author & Status -->
                        <div class="flex flex-wrap items-center gap-4 text-sm md:text-base">
                            <div class="flex items-center gap-2 px-4 py-2 rounded-full"
                                style="background-color: rgba(100, 116, 139, 0.3); backdrop-filter: blur(4px);">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                <span>{{ getAuthors() }}</span>
                            </div>
                            <div class="px-4 py-2 rounded-full font-semibold"
                                :class="story.status === 'hoàn thành' ? 'bg-green-500' : 'bg-yellow-500'">
                                {{ story.status }}
                            </div>
                        </div>

                        <!-- Rating -->
                        <div class="flex items-center gap-3">
                            <div class="flex gap-1">
                                <span v-for="i in 5" :key="i" class="text-2xl"
                                    :style="{ color: i <= Math.round(story.averageRating || 0) ? '#fbbf24' : 'rgba(148, 163, 184, 0.4)' }">
                                    ★
                                </span>
                            </div>
                            <span class="text-xl font-bold" style="color: var(--hero-text-color);">{{
                                (story.averageRating || 0).toFixed(1) }}</span>
                            <span style="color: var(--hero-text-secondary);">/ {{ story.totalRatings || 0 }} đánh
                                giá</span>
                        </div>

                        <!-- Stats -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                            <div class="rounded-lg p-3 text-center" style="background-color: rgba(71, 85, 105, 0.35);">
                                <div class="text-2xl font-bold" style="color: var(--hero-text-color);">{{
                                    story.chapterCount || 0 }}</div>
                                <div class="text-xs mt-1" style="color: var(--hero-text-secondary);">Chương</div>
                            </div>
                            <div class="rounded-lg p-3 text-center" style="background-color: rgba(71, 85, 105, 0.35);">
                                <div class="text-2xl font-bold" style="color: var(--hero-text-color);">{{
                                    formatViews(story.totalViews) }}</div>
                                <div class="text-xs mt-1" style="color: var(--hero-text-secondary);">Lượt xem</div>
                            </div>
                            <div class="rounded-lg p-3 text-center" style="background-color: rgba(71, 85, 105, 0.35);">
                                <div class="text-2xl font-bold" style="color: var(--hero-text-color);">{{
                                    story.categoryDetails?.length || 0 }}</div>
                                <div class="text-xs mt-1" style="color: var(--hero-text-secondary);">Thể loại</div>
                            </div>
                            <div class="rounded-lg p-3 text-center" style="background-color: rgba(71, 85, 105, 0.35);">
                                <div class="text-2xl font-bold" style="color: var(--hero-text-color);">{{
                                    formatDate(story.updatedAt) }}</div>
                                <div class="text-xs mt-1" style="color: var(--hero-text-secondary);">Cập nhật</div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-3 pt-2">
                            <router-link v-if="story.chapters && story.chapters.length > 0"
                                :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: story.chapters[0].chapterNumber || 1 } }"
                                class="px-6 py-3 bg-white font-bold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                style="color: var(--color-primary);">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clip-rule="evenodd" />
                                </svg>
                                Đọc ngay
                            </router-link>
                            <button @click="toggleFavorite"
                                class="px-6 py-3 font-bold rounded-lg transition transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                :class="isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/50'">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path v-if="isFavorite" fill-rule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clip-rule="evenodd" />
                                    <path v-else
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        fill="none" stroke="currentColor" stroke-width="2" />
                                </svg>
                                {{ isFavorite ? 'Đã thích' : 'Yêu thích' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Description & Categories -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Description -->
                    <div class="rounded-xl p-6 shadow-md animate-slide-up animation-delay-100"
                        style="background-color: var(--bg-card);">
                        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
                            <svg class="w-6 h-6" style="color: var(--color-primary);" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clip-rule="evenodd" />
                            </svg>
                            Giới thiệu
                        </h2>
                        <div class="leading-relaxed space-y-3" style="color: var(--text-primary);">
                            <p class="text-justify">{{ truncatedDescription }}</p>
                        </div>
                        <button v-if="story.description && story.description.length > 250" @click="toggleDescription"
                            class="mt-4 transition font-semibold text-sm flex items-center gap-1"
                            style="color: var(--color-primary);">
                            {{ isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm' }}
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path v-if="isDescriptionExpanded" fill-rule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clip-rule="evenodd" />
                                <path v-else fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <!-- Categories -->
                    <div class="rounded-xl p-6 shadow-md animate-slide-up animation-delay-150"
                        style="background-color: var(--bg-card);">
                        <h3 class="text-xl font-bold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
                            <svg class="w-6 h-6" style="color: var(--color-accent);" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            Thể loại
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <router-link v-for="cat in story.categoryDetails" :key="cat._id"
                                :to="`/category/${cat.slug}`" class="category-badge">
                                {{ cat.name }}
                            </router-link>
                        </div>
                    </div>

                    <!-- Chapters List -->
                    <div class="rounded-xl shadow-md animate-slide-up animation-delay-200 overflow-hidden"
                        style="background-color: var(--bg-card);">
                        <div class="p-6"
                            style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent));">
                            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                Danh sách chương
                                <span class="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">{{
                                    story.chapters?.length || 0 }} chương</span>
                            </h2>
                        </div>

                        <div v-if="story.chapters && story.chapters.length > 0">
                            <div v-for="(chapter, index) in paginatedChapters" :key="chapter._id"
                                class="group transition-all duration-200"
                                style="border-bottom: 1px solid var(--border-color);">
                                <router-link
                                    :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: chapter.chapterNumber || (index + 1) } }"
                                    class="block p-4">
                                    <div class="flex items-center justify-between gap-4">
                                        <div class="flex-1 min-w-0">
                                            <p class="font-semibold transition truncate"
                                                style="color: var(--text-primary);">
                                                Chương {{ chapter.chapterNumber || (index + 1) }}: {{ chapter.title }}
                                            </p>
                                            <div class="flex items-center gap-3 mt-1.5 text-xs"
                                                style="color: var(--text-secondary);">
                                                <span class="flex items-center gap-1">
                                                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fill-rule="evenodd"
                                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    {{ chapter.views || 0 }}
                                                </span>
                                                <span class="flex items-center gap-1">
                                                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                    {{ formatDate(chapter.createdAt) }}
                                                </span>
                                                <span v-if="chapter.audioUrl"
                                                    class="font-medium flex items-center gap-1 px-2 py-0.5 rounded-full"
                                                    style="color: var(--color-success); background-color: var(--bg-secondary);">
                                                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                    </svg>
                                                    Audio
                                                </span>
                                            </div>
                                        </div>

                                        <button v-if="chapter.audioUrl" @click.prevent.stop="playChapter(chapter)"
                                            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md flex-shrink-0 text-white"
                                            :style="isPlaying && currentChapter?._id === chapter._id
                                                ? { background: 'linear-gradient(135deg, var(--color-success), #059669)' }
                                                : { background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }">
                                            <svg v-if="isPlaying && currentChapter?._id === chapter._id" class="w-5 h-5"
                                                fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </router-link>
                            </div>

                            <!-- Pagination for chapters -->
                            <div v-if="totalChapterPages > 1"
                                class="flex items-center justify-center gap-2 p-4 border-t"
                                style="border-color: var(--border-color);">
                                <button @click="goToChapterPage(chapterPage - 1)" :disabled="chapterPage === 1"
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                                    :class="chapterPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
                                    style="color: var(--text-primary); background-color: var(--bg-secondary);">
                                    ←
                                </button>
                                <span class="text-sm font-medium px-3" style="color: var(--text-secondary);">
                                    {{ chapterPage }} / {{ totalChapterPages }}
                                </span>
                                <button @click="goToChapterPage(chapterPage + 1)"
                                    :disabled="chapterPage === totalChapterPages"
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                                    :class="chapterPage === totalChapterPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
                                    style="color: var(--text-primary); background-color: var(--bg-secondary);">
                                    →
                                </button>
                            </div>
                        </div>
                        <div v-else class="text-center py-12"
                            style="background-color: var(--bg-secondary); color: var(--text-secondary);">
                            <svg class="w-16 h-16 mx-auto mb-3" style="color: var(--text-secondary); opacity: 0.5;"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            <p class="font-medium">Chưa có chương nào được cập nhật</p>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Sidebar -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Quick Actions -->
                    <div class="rounded-xl p-6 shadow-md animate-slide-up animation-delay-250 sticky top-6"
                        style="background-color: var(--bg-card);">
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
                            <svg class="w-5 h-5" style="color: var(--color-accent);" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                    clip-rule="evenodd" />
                            </svg>
                            Hành động nhanh
                        </h3>
                        <div class="space-y-3">
                            <router-link v-if="story.chapters && story.chapters.length > 0"
                                :to="{ name: 'chapter.detail', params: { storySlug: story.slug, chapterNumber: story.chapters[story.chapters.length - 1].chapterNumber || story.chapters.length } }"
                                class="w-full px-4 py-3 text-white font-semibold rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                                style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent));">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                Chương mới nhất
                            </router-link>
                        </div>
                    </div>

                    <!-- Ad Display -->
                    <div class="rounded-xl overflow-hidden shadow-md animate-slide-up animation-delay-300"
                        style="background-color: var(--bg-secondary);">
                        <AdDisplay position="story-detail" />
                    </div>
                </div>
            </div>

            <!-- Rating Section -->
            <div class="mt-10 animate-slide-up animation-delay-400">
                <div class="rounded-xl shadow-md overflow-hidden" style="background-color: var(--bg-card);">
                    <div class="p-6" style="background: linear-gradient(135deg, #fbbf24, var(--color-accent));">
                        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Đánh giá & Nhận xét
                        </h2>
                    </div>
                    <div class="p-6">
                        <RatingSection :storyId="story?._id" :averageRating="story?.averageRating || 0"
                            :totalRatings="story?.totalRatings || 0" @rating-updated="reloadStory" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Sticky Audio Player -->
        <transition name="slide-up">
            <div v-if="currentChapter && currentChapter.audioUrl"
                class="fixed bottom-0 left-0 right-0 backdrop-blur-sm shadow-2xl z-50"
                style="background-color: var(--bg-card); opacity: 0.98; border-top: 1px solid var(--border-color);">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div class="flex flex-col md:flex-row items-center gap-4">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <div class="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 shadow-sm"
                                style="border: 1px solid var(--border-color);">
                                <img v-if="story.image" :src="getStoryImageUrl(story.image)" :alt="story.name"
                                    class="w-full h-full object-cover" />
                                <div v-else class="w-full h-full flex items-center justify-center text-2xl"
                                    style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-hover));">
                                    <svg class="w-8 h-8" style="color: var(--text-secondary);" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-semibold truncate" style="color: var(--text-primary);">{{
                                    currentChapter.title }}</h4>
                                <p class="text-sm" style="color: var(--text-secondary);">Chương {{
                                    currentChapter.chapterNumber }}</p>
                            </div>
                        </div>

                        <audio ref="audioPlayer" :src="getAudioUrl(currentChapter.audioUrl)" controls
                            @play="isPlaying = true" @pause="isPlaying = false" @ended="onAudioEnded"
                            @timeupdate="updateProgress"
                            class="w-full md:w-auto md:flex-1 max-w-2xl h-12 rounded-lg"></audio>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import StoryService from '@/services/story.service';
import ChapterService from '@/services/chapter.service';
import FavoriteService from '@/services/favorite.service';
import HistoryService from '@/services/history.service';
import RatingSection from '@/components/RatingSection.vue';
import AdDisplay from '@/components/AdDisplay.vue';
import { useAuthStore } from '@/stores/auth.store';
import { getStoryImageUrl, getAudioUrl } from '@/utils/media';

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
    slug: { type: String, required: true }
});

const story = ref(null);
const loading = ref(true);
const error = ref(null);
const currentChapter = ref(null);
const isPlaying = ref(false);
const audioPlayer = ref(null);
const playProgress = ref(0);
const isFavorite = ref(false);
const isDescriptionExpanded = ref(false);

// Phân trang cho chương
const chapterPage = ref(1);
const chaptersPerPage = 5;

const paginatedChapters = computed(() => {
    if (!story.value?.chapters) return [];
    const start = (chapterPage.value - 1) * chaptersPerPage;
    const end = start + chaptersPerPage;
    return story.value.chapters.slice(start, end);
});

const totalChapterPages = computed(() => {
    if (!story.value?.chapters) return 0;
    return Math.ceil(story.value.chapters.length / chaptersPerPage);
});

const goToChapterPage = (page) => {
    if (page >= 1 && page <= totalChapterPages.value) {
        chapterPage.value = page;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const getAuthors = () => {
    if (!story.value?.authorDetails || story.value.authorDetails.length === 0) {
        return 'Không xác định';
    }
    return story.value.authorDetails.map(author => author.fullName).join(', ');
};

const statusDisplay = computed(() => {
    if (!story.value) return { text: '', class: '' };
    switch (story.value.status) {
        case 'ONGOING':
            return { text: 'Đang tiến hành', class: 'bg-green-100 text-green-800' };
        case 'COMPLETED':
            return { text: 'Đã hoàn thành', class: 'bg-blue-100 text-blue-800' };
        case 'DROPPED':
            return { text: 'Đã tạm dừng', class: 'bg-red-100 text-red-800' };
        default:
            return { text: 'Không xác định', class: 'bg-gray-100 text-gray-800' };
    }
});

const truncatedDescription = computed(() => {
    const desc = story.value?.description || 'Truyện này chưa có mô tả.';
    if (story.value?.description && story.value.description.length > 250 && !isDescriptionExpanded.value) {
        return story.value.description.substring(0, 250) + '...';
    }
    return desc;
});

const toggleDescription = () => {
    isDescriptionExpanded.value = !isDescriptionExpanded.value;
};

const playChapter = async (chapter) => {
    if (!chapter.audioUrl) {
        alert('Chương này chưa có audio');
        return;
    }

    if (currentChapter.value?._id === chapter._id && isPlaying.value) {
        audioPlayer.value?.pause();
    } else {
        currentChapter.value = chapter;
        saveHistory(chapter._id);
        try {
            await ChapterService.get(chapter._id);
        } catch (err) {
            console.error('Error incrementing chapter view:', err);
        }
        setTimeout(() => {
            audioPlayer.value?.play();
        }, 100);
    }
};

const updateProgress = () => {
    if (audioPlayer.value) {
        const progress = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
        playProgress.value = progress || 0;
    }
};

const onAudioEnded = () => {
    const currentIndex = story.value.chapters.findIndex(c => c._id === currentChapter.value._id);
    if (currentIndex < story.value.chapters.length - 1) {
        const nextChapter = story.value.chapters[currentIndex + 1];
        if (nextChapter.audioUrl) {
            playChapter(nextChapter);
        }
    }
};

const toggleFavorite = async () => {
    if (!authStore.isLoggedIn) {
        alert('⚠️ Vui lòng đăng nhập để thêm vào yêu thích');
        router.push('/login');
        return;
    }

    try {
        const result = await FavoriteService.toggleFavorite(story.value._id);
        isFavorite.value = result.isFavorite;
    } catch (err) {
        console.error('Toggle favorite error:', err);
        alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
    }
};

const checkFavoriteStatus = async () => {
    if (authStore.isLoggedIn && story.value) {
        try {
            const result = await FavoriteService.checkFavorite(story.value._id);
            isFavorite.value = result.isFavorite;
        } catch (err) {
            console.error('Check favorite error:', err);
        }
    }
};

const saveHistory = async (chapterId = null) => {
    if (authStore.isLoggedIn && story.value) {
        try {
            await HistoryService.addHistory(story.value._id, chapterId);
        } catch (err) {
            console.error('Save history error:', err);
        }
    }
};

const reloadStory = async () => {
    try {
        const updatedStory = await StoryService.getBySlug(props.slug);
        story.value.averageRating = updatedStory.averageRating;
        story.value.totalRatings = updatedStory.totalRatings;
    } catch (err) {
        console.error('Reload story error:', err);
    }
};

onMounted(async () => {
    try {
        story.value = await StoryService.getBySlug(props.slug);
        await checkFavoriteStatus();
        await saveHistory();
    } catch (err) {
        error.value = 'Không tìm thấy truyện này hoặc đã có lỗi xảy ra.';
        console.error(err);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Animations */
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
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
    animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
    animation: slide-up 0.7s ease-out forwards;
}

.animation-delay-100 {
    animation-delay: 100ms;
}

.animation-delay-200 {
    animation-delay: 200ms;
}

.animation-delay-400 {
    animation-delay: 400ms;
}

/* Slide up transition for audio player */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}

/* Add some style for prose */
.prose p {
    margin-bottom: 1rem;
}
</style>