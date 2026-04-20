/**
 * StorageHelper.js
 * ----------------
 * Thin wrapper around AsyncStorage for saving / loading
 * the user's selected interval and reminder state.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  INTERVAL: '@hydro_interval',
  IS_ACTIVE: '@hydro_active',
};

/**
 * Save the selected interval (in minutes) to local storage.
 * @param {number} minutes
 */
export async function saveInterval(minutes) {
  try {
    await AsyncStorage.setItem(KEYS.INTERVAL, String(minutes));
  } catch (err) {
    console.error('Failed to save interval:', err);
  }
}

/**
 * Load the previously saved interval.
 * @returns {number|null} Minutes, or null if nothing was saved.
 */
export async function loadInterval() {
  try {
    const value = await AsyncStorage.getItem(KEYS.INTERVAL);
    return value !== null ? Number(value) : null;
  } catch (err) {
    console.error('Failed to load interval:', err);
    return null;
  }
}

/**
 * Save the reminder active state.
 * @param {boolean} isActive
 */
export async function saveActiveState(isActive) {
  try {
    await AsyncStorage.setItem(KEYS.IS_ACTIVE, JSON.stringify(isActive));
  } catch (err) {
    console.error('Failed to save active state:', err);
  }
}

/**
 * Load the reminder active state.
 * @returns {boolean}
 */
export async function loadActiveState() {
  try {
    const value = await AsyncStorage.getItem(KEYS.IS_ACTIVE);
    return value !== null ? JSON.parse(value) : false;
  } catch (err) {
    console.error('Failed to load active state:', err);
    return false;
  }
}
