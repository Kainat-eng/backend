import { db } from '../firebase.js';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

// Reference to the collection
const notificationSettingsCollection = collection(db, 'notificationSettings');

/**
 * Create or update a user's notification setting
 */
export const setNotificationSetting = async (userId, settings) => {
  try {
    const settingRef = doc(notificationSettingsCollection, userId); // use userId as doc ID
    await setDoc(settingRef, {
      userId,
      emailNotifications: settings.emailNotifications ?? true,
      smsNotifications: settings.smsNotifications ?? false,
      alertTypes: settings.alertTypes ?? []
    }, { merge: true });

    console.log('✅ Notification settings saved for user:', userId);
  } catch (err) {
    console.error('❌ Failed to save notification settings:', err);
    throw err;
  }
};

/**
 * Get a user's notification setting
 */
export const getNotificationSetting = async (userId) => {
  try {
    const settingRef = doc(notificationSettingsCollection, userId);
    const settingSnap = await getDoc(settingRef);

    if (settingSnap.exists()) {
      return settingSnap.data();
    } else {
      return null; // No settings found
    }
  } catch (err) {
    console.error('❌ Failed to get notification settings:', err);
    throw err;
  }
};
