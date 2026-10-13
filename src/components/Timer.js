/**
 * Timer.js
 * --------
 * Displays the countdown as a glass that fills up while you wait
 * for your next sip. Shows mm:ss remaining until the next reminder.
 *
 * Props:
 *   @param {number}  secondsLeft   – Seconds remaining in the countdown.
 *   @param {number}  totalSeconds  – Total seconds for the full interval.
 *   @param {boolean} isActive      – Whether the timer is currently running.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  bg: '#0C1D15',
  surface: '#14261E',
  border: '#234034',
  accent: '#2FA89C',
  text: '#F5F0E8',
  muted: '#8A9B94',
  dim: '#5C6F66',
};

export default function Timer({ secondsLeft, totalSeconds, isActive }) {
  // ── Format seconds into MM:SS ──
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Fraction of the interval that has elapsed (0 = just started, 1 = reminder due).
  // The glass fills up as the next sip approaches.
  const elapsed = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;
  const fillPct = Math.max(0, Math.min(1, elapsed));

  return (
    <View style={styles.container}>
      <Text
        style={[styles.time, isActive ? styles.timeActive : styles.timePaused]}
        accessibilityLabel={`Timer, ${display} until your next sip`}
      >
        {display}
      </Text>
      <Text style={styles.label}>
        {isActive ? 'until your next sip' : 'paused'}
      </Text>

      {/* The glass */}
      <View style={styles.glass}>
        <View
          style={[
            styles.fill,
            { height: `${fillPct * 100}%` },
            isActive ? styles.fillActive : styles.fillPaused,
          ]}
        />
      </View>

      {/* Status line (plain text, no pill badge) */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, isActive ? styles.dotActive : styles.dotStopped]} />
        <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextStopped]}>
          {isActive ? 'Running' : 'Stopped'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },

  // Countdown digits
  time: {
    fontSize: 52,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  timeActive: {
    color: COLORS.text,
  },
  timePaused: {
    color: COLORS.muted,
  },
  label: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
    letterSpacing: 0.5,
  },

  // The glass
  glass: {
    width: 150,
    height: 190,
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fill: {
    width: '100%',
  },
  fillActive: {
    backgroundColor: COLORS.accent,
  },
  fillPaused: {
    backgroundColor: COLORS.dim,
  },

  // Status line
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
  },
  dotStopped: {
    backgroundColor: COLORS.dim,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statusTextActive: {
    color: COLORS.accent,
  },
  statusTextStopped: {
    color: COLORS.muted,
  },
});
