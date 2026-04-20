/**
 * NotificationHelper.js
 * ---------------------
 * Centralizes all Expo Notifications logic:
 *  - Requesting permissions
 *  - Scheduling repeating local notifications
 *  - Cancelling scheduled notifications
 *
 * Uses expo-notifications and expo-device.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// ──────────────────────────────────────────────
// Configure how notifications behave when the
// app is in the foreground.
// ──────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions from the OS.
 * On Android 13+ this shows a system dialog.
 * On iOS it always shows a dialog.
 *
 * @returns {boolean} Whether permission was granted.
 */
export async function requestPermissions() {
  // Notifications only work on real devices
  if (!Device.isDevice) {
    console.warn('Notifications require a physical device.');
    return false;
  }

  // Check current permission status first
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If we don't have permission yet, ask the user
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  // Android requires a notification channel (Android 8+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('hydro-reminders', {
      name: 'Hydration Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#38BDF8',
      sound: 'default',
    });
  }

  return true;
}

/**
 * Schedule a repeating notification at a fixed interval.
 *
 * Because Expo's `repeat` only supports predefined intervals
 * (minute, hour, day, etc.), we schedule a one-shot notification
 * and re-schedule it each time it fires — giving us full control
 * over custom intervals.
 *
 * @param {number} intervalMinutes – Interval in minutes.
 * @returns {string|null} The notification identifier, or null on failure.
 */
export async function scheduleReminder(intervalMinutes) {
  // Cancel any existing reminders first
  await cancelAllReminders();

  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    return null;
  }

  const intervalSeconds = intervalMinutes * 60;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'HydroReminder 💧',
      body: 'Time to drink water 💧',
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' && { channelId: 'hydro-reminders' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: intervalSeconds,
      repeats: true,
    },
  });

  return id;
}

/**
 * Cancel every scheduled notification.
 */
export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Return all currently scheduled notifications (useful for debugging).
 */
export async function getScheduledReminders() {
  return Notifications.getAllScheduledNotificationsAsync();
}
