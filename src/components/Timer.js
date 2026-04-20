/**
 * Timer.js
 * --------
 * Displays a circular countdown timer with a progress ring.
 * Shows mm:ss remaining until the next reminder.
 *
 * Props:
 *   @param {number}  secondsLeft   – Seconds remaining in the countdown.
 *   @param {number}  totalSeconds  – Total seconds for the full interval (used for ring progress).
 *   @param {boolean} isActive      – Whether the timer is currently running.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Timer({ secondsLeft, totalSeconds, isActive }) {
  // ── Format seconds into MM:SS ──
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // ── Progress percentage (1 = full, 0 = complete) ──
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  // Circle dimensions for the SVG-like ring
  const size = 220;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      {/* Outer glow */}
      <View style={[styles.glowRing, isActive && styles.glowRingActive]}>

        {/* Background track ring */}
        <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>

          {/* The timer content */}
          <View style={styles.innerCircle}>
            <Text style={[styles.time, isActive && styles.timeActive]}>
              {display}
            </Text>
            <Text style={styles.label}>
              {isActive ? 'until next reminder' : 'paused'}
            </Text>
          </View>

          {/* Decorative rotating dash border (progress indication) */}
          <View
            style={[
              styles.progressOverlay,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: isActive ? '#38BDF8' : '#1E293B',
                borderWidth: strokeWidth,
                // Use opacity to simulate progress
                opacity: isActive ? 0.15 + progress * 0.85 : 0.2,
              },
            ]}
          />
        </View>
      </View>

      {/* Status badge below the timer */}
      <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusStopped]}>
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

  // Outer glow effect
  glowRing: {
    borderRadius: 130,
    padding: 10,
  },
  glowRingActive: {
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 12,
  },

  // The circle track
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1E293B',
  },

  // Inner content
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 52,
    fontWeight: '200',
    color: '#475569',
    fontVariant: ['tabular-nums'],
    letterSpacing: 4,
  },
  timeActive: {
    color: '#F1F5F9',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // SVG-like progress overlay
  progressOverlay: {
    position: 'absolute',
  },

  // Status badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  statusStopped: {
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    borderColor: 'rgba(100, 116, 139, 0.25)',
  },

  // Status dot
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dotActive: {
    backgroundColor: '#38BDF8',
  },
  dotStopped: {
    backgroundColor: '#64748B',
  },

  // Status text
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statusTextActive: {
    color: '#38BDF8',
  },
  statusTextStopped: {
    color: '#64748B',
  },
});
