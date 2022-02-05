require('dotenv').config()

module.exports = {
  reactStrictMode: true,
  env: {
    MONGO_URI: process.env.MONGO_URI,
    RAPID_API_KEY: process.env.RAPID_API_KEY,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
}
