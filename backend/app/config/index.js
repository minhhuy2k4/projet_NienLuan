const config = {
  app: {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "12345678",
    googleClientId:
      process.env.GOOGLE_CLIENT_ID ||
      "480259065941-5n0gj7jrfqrcsbsqkm7pf8f598l49e2e.apps.googleusercontent.com",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },

  db: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contactbook",
  },
};
module.exports = config;
