# 🎧 AudioTruyen — Backend REST API

This is the backend server for the **AudioTruyen** platform, developed with **Node.js**, **Express.js 5**, and native **MongoDB**. It provides complete RESTful endpoints for reading novels, streaming audio chapters, community interactions, an administrative dashboard, and an intelligent **Google Gemini 2.5 Flash** chatbot assistant.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: [Express.js 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using native `mongodb` driver v6)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Google OAuth 2.0](https://cloud.google.com/)
- **Password Encryption**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **AI Engine**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Google Gemini 2.5 Flash)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` using `.env.example`:

```bash
cp .env.example .env
```

Ensure the following variables are specified:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/audiotruyen
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_API_KEY=your_gemini_api_key
```

### 3. Database Indexes

Indexes are automatically verified and created when starting the server. You can also run them manually:

```bash
# Create indexes
npm run indexes:create

# Reset all indexes
npm run indexes:reset

# Drop indexes
npm run indexes:drop
```

### 4. Run Development Server

```bash
npm start
```

Server will run at `http://localhost:3000`.

---

## 📁 Key Directories

- `app/controllers/`: Route handlers and HTTP logic.
- `app/services/`: Business logic, database queries, and data processing.
- `app/services/chatbot_services/`: Gemini AI integration and RAG synchronization service.
- `app/routes/`: Express modular route definitions.
- `app/middlewares/`: JWT authentication, role verification, and Multer file upload pipelines.
- `app/utils/create-indexes.js`: Database indexing setup (TTL, compound, full-text search).
- `chatbot_data/`: Text corpora synchronized for Gemini context retrieval.
- `public/`: Storage directory for uploaded audio, cover images, avatars, banners, and ads.

