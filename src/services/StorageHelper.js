/**
 * StorageHelper.js
 * ----------------
 * Thin wrapper around AsyncStorage for saving / loading
 * the user's selected interval, reminder state, and
 * glasses-of-water count for the current day.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  INTERVAL: '@hydro_interval',
  IS_ACTIVE: '@hydro_active',
  GLASSES: '@hydro_glasses',
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

/**
 * Local-date key (YYYY-MM-DD) so the glasses count resets each day.
 * @returns {string}
 */
function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Save the number of glasses logged today.
 * @param {number} count
 */
export async function saveGlassesToday(count) {
  try {
    await AsyncStorage.setItem(
      KEYS.GLASSES,
      JSON.stringify({ date: todayKey(), count }),
    );
  } catch (err) {
    console.error('Failed to save glasses count:', err);
  }
}

/**
 * Load the number of glasses logged today.
 * Returns 0 when nothing is saved or the saved entry is from another day.
 * @returns {number}
 */
export async function loadGlassesToday() {
  try {
    const value = await AsyncStorage.getItem(KEYS.GLASSES);
    if (value === null) {
      return 0;
    }
    const parsed = JSON.parse(value);
    if (parsed.date !== todayKey()) {
      return 0;
    }
    return typeof parsed.count === 'number' ? parsed.count : 0;
  } catch (err) {
    console.error('Failed to load glasses count:', err);
    return 0;
  }
}
