/**
 * App.js
 * ------
 * Root component for HydroReminder.
 *
 * Orchestrates:
 *  - Loading saved interval / state from AsyncStorage
 *  - Managing the countdown timer via useEffect
 *  - Starting / stopping scheduled notifications
 *  - Rendering the Timer and Controls components
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Services
import {
  scheduleReminder,
  cancelAllReminders,
  requestPermissions,
} from './src/services/NotificationHelper';
import {
  saveInterval,
  loadInterval,
  saveActiveState,
  loadActiveState,
} from './src/services/StorageHelper';

// Components
import Timer from './src/components/Timer';
import Controls from './src/components/Controls';

// ── Default interval: 60 minutes ──
const DEFAULT_INTERVAL = 60;

export default function App() {
  // ─── State ────────────────────────────────────────────
  const [interval, setInterval_] = useState(DEFAULT_INTERVAL);  // in minutes
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_INTERVAL * 60);
  const [customValue, setCustomValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Ref to hold the countdown interval ID so we can clear it
  const countdownRef = useRef(null);

  // ─── Load saved state on mount ────────────────────────
  useEffect(() => {
    (async () => {
      const savedInterval = await loadInterval();
      const savedActive = await loadActiveState();

      if (savedInterval && savedInterval > 0) {
        setInterval_(savedInterval);
        setSecondsLeft(savedInterval * 60);
      }

      // If the app was active before it was killed, restart the reminder
      if (savedActive && savedInterval && savedInterval > 0) {
        const success = await startReminder(savedInterval);
        if (success) {
          setIsActive(true);
        }
      }

      setIsLoading(false);
    })();

    // Cleanup on unmount
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Countdown tick ───────────────────────────────────
  useEffect(() => {
    if (isActive) {
      // Clear any existing countdown
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Reset the countdown to the full interval
            return interval * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Not active → stop the countdown
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isActive, interval]);

  // ─── Helpers ──────────────────────────────────────────

  /**
   * Actually schedule the notification. Returns true on success.
   */
  const startReminder = async (minutes) => {
    const id = await scheduleReminder(minutes);
    if (!id) {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to use HydroReminder.',
      );
      return false;
    }
    return true;
  };

  // ─── Handlers ─────────────────────────────────────────

  /** Select a preset or custom interval */
  const handleSelectInterval = useCallback((minutes) => {
    setInterval_(minutes);
    setSecondsLeft(minutes * 60);
    saveInterval(minutes);
  }, []);

  /** Start the reminder */
  const handleStart = useCallback(async () => {
    const success = await startReminder(interval);
    if (success) {
      setIsActive(true);
      setSecondsLeft(interval * 60);
      saveActiveState(true);
    }
  }, [interval]);

  /** Stop the reminder */
  const handleStop = useCallback(async () => {
    await cancelAllReminders();
    setIsActive(false);
    setSecondsLeft(interval * 60);
    saveActiveState(false);
  }, [interval]);

  /** Custom interval text change */
  const handleCustomChange = useCallback((text) => {
    // Allow only digits
    setCustomValue(text.replace(/[^0-9]/g, ''));
  }, []);

  /** Submit custom interval */
  const handleCustomSubmit = useCallback(() => {
    const parsed = parseInt(customValue, 10);
    if (!parsed || parsed < 1) {
      Alert.alert('Invalid Interval', 'Please enter a number greater than 0.');
      return;
    }
    if (parsed > 1440) {
      Alert.alert('Too Long', 'Maximum interval is 1440 minutes (24 hours).');
      return;
    }
    handleSelectInterval(parsed);
    setCustomValue('');
  }, [customValue, handleSelectInterval]);

  // ─── Loading screen ───────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />
        <Text style={styles.loadingEmoji}>💧</Text>
        <Text style={styles.loadingText}>HydroReminder</Text>
      </View>
    );
  }

  // ─── Main render ──────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>💧</Text>
          <View>
            <Text style={styles.headerTitle}>HydroReminder</Text>
            <Text style={styles.headerSubtitle}>Stay hydrated, stay healthy</Text>
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Timer ── */}
        <Timer
          secondsLeft={secondsLeft}
          totalSeconds={interval * 60}
          isActive={isActive}
        />

        {/* ── Controls ── */}
        <Controls
          selectedInterval={interval}
          onSelectInterval={handleSelectInterval}
          isActive={isActive}
          onStart={handleStart}
          onStop={handleStop}
          customValue={customValue}
          onCustomChange={handleCustomChange}
          onCustomSubmit={handleCustomSubmit}
        />

        {/* ── Footer ── */}
        <Text style={styles.footer}>
          Notifications will fire even when the app is backgrounded.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 14,
  },
  headerEmoji: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginHorizontal: 24,
    marginBottom: 8,
  },

  // ── Footer ──
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#334155',
    marginTop: 24,
    paddingHorizontal: 24,
  },

  // ── Loading ──
  loadingScreen: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1,
  },
});
