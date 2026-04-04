// config/firebase.js - Firebase Admin SDK for push notifications
const admin = require('firebase-admin');
require('dotenv').config();

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK with service account credentials.
 * Gracefully skips if credentials are not configured (local dev without FCM).
 */
const initializeFirebase = () => {
  if (firebaseInitialized) return;

  try {
    // Check if Firebase credentials are properly set
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      process.env.FIREBASE_PROJECT_ID === 'your-firebase-project-id'
    ) {
      console.warn('[Firebase] Credentials not configured — push notifications disabled.');
      console.warn('[Firebase] Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL in .env');
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    firebaseInitialized = true;
    console.log('[Firebase] Admin SDK initialized successfully');
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err.message);
  }
};

/**
 * Send a push notification to a specific device via FCM.
 * @param {string} token - FCM device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {object} data - Optional data payload
 * @returns {Promise<string|null>} Message ID or null on failure
 */
const sendPushNotification = async (token, title, body, data = {}) => {
  if (!firebaseInitialized) {
    console.warn('[Firebase] Not initialized — skipping notification');
    return null;
  }

  if (!token) {
    console.warn('[Firebase] No device token provided — skipping');
    return null;
  }

  const message = {
    token,
    notification: { title, body },
    data: {
      ...data,
      click_action: 'OPEN_APP',
    },
    // Android-specific: high priority for timely delivery
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'liferemind_reminders',
      },
    },
    // iOS-specific: badge and sound
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('[Firebase] Notification sent:', response);
    return response;
  } catch (err) {
    console.error('[Firebase] Send failed:', err.message);
    return null;
  }
};

module.exports = { initializeFirebase, sendPushNotification };
