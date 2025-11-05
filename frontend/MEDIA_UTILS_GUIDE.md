# Media Utilities Guide - Hướng dẫn sử dụng Media Utils

## 📁 Vị trí

`frontend/src/utils/media.js`

## 🎯 Mục đích

Utility functions để xử lý đường dẫn hình ảnh và audio một cách nhất quán trong toàn bộ ứng dụng.

## 🔧 Các hàm có sẵn

### 1. `getImageUrl(imagePath)`

Hàm chung để xử lý đường dẫn hình ảnh.

**Sử dụng:**

```javascript
import { getImageUrl } from '@/utils/media';

// Trong template
<img :src="getImageUrl(image)" />
```

### 2. `getAudioUrl(audioPath)`

Hàm xử lý đường dẫn audio.

**Sử dụng:**

```javascript
import { getAudioUrl } from '@/utils/media';

// Trong template
<audio :src="getAudioUrl(audioUrl)" controls />
```

### 3. `getStoryImageUrl(imagePath)`

Alias cho hình ảnh truyện (wrapper của getImageUrl).

**Sử dụng:**

```javascript
import { getStoryImageUrl } from '@/utils/media';

<img :src="getStoryImageUrl(story.image)" />
```

### 4. `getBannerUrl(bannerPath)`

Alias cho banner.

**Sử dụng:**

```javascript
import { getBannerUrl } from '@/utils/media';

<img :src="getBannerUrl(banner.image)" />
```

### 5. `getAdUrl(adPath)`

Alias cho quảng cáo.

**Sử dụng:**

```javascript
import { getAdUrl } from '@/utils/media';

<img :src="getAdUrl(ad.image)" />
```

## 💡 Tính năng

### Tự động xử lý các trường hợp:

1. **URL tuyệt đối** (http/https) → Trả về nguyên bản
2. **Đường dẫn có /public** → Loại bỏ /public
3. **Đường dẫn tương đối** (bắt đầu bằng /) → Thêm API_URL
4. **Không có /** → Thêm / và API_URL

### Ví dụ:

```javascript
// Input: "http://example.com/image.jpg"
// Output: "http://example.com/image.jpg"

// Input: "/public/audio/123/file.mp3"
// Output: "http://localhost:3000/audio/123/file.mp3"

// Input: "/audio/123/file.mp3"
// Output: "http://localhost:3000/audio/123/file.mp3"

// Input: "audio/123/file.mp3"
// Output: "http://localhost:3000/audio/123/file.mp3"
```

## 📝 Danh sách các file đã cập nhật

### Components:

- ✅ `BannerSlider.vue` - getBannerUrl()
- ✅ `AdDisplay.vue` - getAdUrl()
- ✅ `StoryCard.vue` - getStoryImageUrl()

### Admin Pages:

- ✅ `BannerManagement.vue` - getBannerUrl()
- ✅ `AdManagement.vue` - getAdUrl()
- ✅ `AdminStoryList.vue` - getStoryImageUrl()
- ✅ `StoryAdd.vue` - getStoryImageUrl()
- ✅ `StoryEdit.vue` - getStoryImageUrl()
- ✅ `ChapterManage.vue` - getStoryImageUrl() + getAudioUrl()
- ✅ `AdminRating.vue` - getStoryImageUrl()

### User Pages:

- ✅ `Home.vue` - (dùng StoryCard)
- ✅ `StoryDetail.vue` - getStoryImageUrl() + getAudioUrl()
- ✅ `ChapterDetail.vue` - getStoryImageUrl() + getAudioUrl()
- ✅ `Favorite.vue` - getStoryImageUrl()
- ✅ `History.vue` - getStoryImageUrl()

## 🌐 Environment Variables

Đảm bảo file `.env` có biến:

```env
VITE_API_URL=http://localhost:3000
```

**Production:**

```env
VITE_API_URL=https://your-production-domain.com
```

## ✅ Lợi ích

1. **Tái sử dụng**: Chỉ cần import 1 hàm
2. **Bảo trì dễ**: Chỉ sửa 1 file nếu thay đổi logic
3. **Nhất quán**: Tất cả URL được xử lý giống nhau
4. **Tương thích**: Hỗ trợ cả URL cũ và mới
5. **Production-ready**: Tự động dùng đúng domain

## 🚀 Cách sử dụng trong component mới

```vue
<template>
  <div>
    <!-- Hình ảnh -->
    <img :src="getStoryImageUrl(story.image)" :alt="story.name" />

    <!-- Audio -->
    <audio :src="getAudioUrl(chapter.audioUrl)" controls />

    <!-- Banner -->
    <img :src="getBannerUrl(banner.image)" />

    <!-- Quảng cáo -->
    <img :src="getAdUrl(ad.image)" />
  </div>
</template>

<script setup>
import {
  getStoryImageUrl,
  getAudioUrl,
  getBannerUrl,
  getAdUrl,
} from "@/utils/media";

// Hoặc chỉ import những gì cần
import { getStoryImageUrl } from "@/utils/media";
</script>
```

## 📌 Lưu ý

- **Không cần** kiểm tra null/undefined, hàm đã xử lý
- **Không cần** thêm API_URL thủ công
- **Không cần** lo lắng về /public trong URL cũ
- **Luôn luôn** sử dụng các hàm này thay vì concat URL thủ công

## 🔄 Migration từ code cũ

**Trước:**

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}${image}`;
};
```

**Sau:**

```javascript
import { getImageUrl } from '@/utils/media';

// Sử dụng trực tiếp
<img :src="getImageUrl(image)" />
```

---

**Cập nhật:** November 5, 2025
**Tác giả:** Development Team
