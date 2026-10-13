/**
 * Controls.js
 * ------------
 * Renders the interval-selection buttons, custom interval input,
 * glasses-today tracker, and Start / Stop action buttons.
 *
 * Props:
 *   @param {number}   selectedInterval   – Currently selected interval in minutes.
 *   @param {function} onSelectInterval   – Callback when a preset button is tapped.
 *   @param {boolean}  isActive           – Whether the reminder is currently running.
 *   @param {function} onStart            – Callback to start the reminder.
 *   @param {function} onStop             – Callback to stop the reminder.
 *   @param {string}   customValue        – Current value of the custom input field.
 *   @param {function} onCustomChange     – Callback when custom input text changes.
 *   @param {function} onCustomSubmit     – Callback when custom interval is submitted.
 *   @param {number}   glassesToday       – Glasses of water logged today.
 *   @param {function} onLogGlass         – Callback when "Log a glass" is tapped.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const COLORS = {
  bg: '#0C1D15',
  surface: '#14261E',
  border: '#234034',
  accent: '#2FA89C',
  text: '#F5F0E8',
  muted: '#8A9B94',
  dim: '#5C6F66',
  danger: '#E0654F',
};

// Preset intervals in minutes
const PRESETS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
];

export default function Controls({
  selectedInterval,
  onSelectInterval,
  isActive,
  onStart,
  onStop,
  customValue,
  onCustomChange,
  onCustomSubmit,
  glassesToday,
  onLogGlass,
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* ── Section Label ── */}
      <Text style={styles.sectionLabel}>Remind me every</Text>

      {/* ── Preset Buttons ── */}
      <View style={styles.presetsRow}>
        {PRESETS.map((preset) => {
          const isSelected = selectedInterval === preset.value;
          return (
            <TouchableOpacity
              key={preset.value}
              style={[
                styles.presetButton,
                isSelected && styles.presetSelected,
                isActive && !isSelected && styles.presetDimmed,
              ]}
              onPress={() => onSelectInterval(preset.value)}
              disabled={isActive}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Set interval to ${preset.label}`}
              accessibilityState={{ selected: isSelected, disabled: isActive }}
            >
              <Text
                style={[
                  styles.presetText,
                  isSelected && styles.presetTextSelected,
                  isActive && !isSelected && styles.presetTextDimmed,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Custom Interval Input ── */}
      <View style={styles.customRow}>
        <TextInput
          style={[styles.customInput, isActive && styles.inputDisabled]}
          placeholder="Custom minutes"
          placeholderTextColor={COLORS.dim}
          keyboardType="number-pad"
          returnKeyType="done"
          value={customValue}
          onChangeText={onCustomChange}
          onSubmitEditing={onCustomSubmit}
          editable={!isActive}
          maxLength={4}
          accessibilityLabel="Custom interval in minutes"
        />
        <TouchableOpacity
          style={[styles.customButton, isActive && styles.customButtonDisabled]}
          onPress={onCustomSubmit}
          disabled={isActive}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Set custom interval"
        >
          <Text style={[styles.customButtonText, isActive && styles.customButtonTextDisabled]}>
            Set
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Current Interval Display ── */}
      <View style={styles.currentInterval}>
        <Text style={styles.currentLabel}>Current interval</Text>
        <Text style={styles.currentValue}>
          {selectedInterval >= 60
            ? `${selectedInterval / 60} hour${selectedInterval > 60 ? 's' : ''}`
            : `${selectedInterval} min`}
        </Text>
      </View>

      {/* ── Start / Stop Buttons ── */}
      <View style={styles.actionRow}>
        {!isActive ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={onStart}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Start reminders"
          >
            <Text style={styles.startText}>Start reminders</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={onStop}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Stop reminders"
          >
            <Text style={styles.stopText}>Stop reminders</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Glasses Today ── */}
      <View style={styles.glassesRow}>
        <View>
          <Text style={styles.glassesLabel}>Glasses today</Text>
          <Text style={styles.glassesCount}>{glassesToday}</Text>
        </View>
        <TouchableOpacity
          style={styles.logButton}
          onPress={onLogGlass}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Log a glass of water"
        >
          <Text style={styles.logButtonText}>Log a glass</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    width: '100%',
  },

  // Section label
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
    letterSpacing: 0.3,
    marginBottom: 12,
  },

  // ── Presets ──
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  presetSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(47, 168, 156, 0.1)',
  },
  // Only unselected presets dim while running; the selected one stays readable.
  presetDimmed: {
    opacity: 0.65,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.muted,
  },
  presetTextSelected: {
    color: COLORS.accent,
  },
  presetTextDimmed: {
    color: COLORS.dim,
  },

  // ── Custom Input ──
  customRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  customInput: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputDisabled: {
    opacity: 0.4,
  },
  customButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonDisabled: {
    borderColor: COLORS.border,
    opacity: 0.4,
  },
  customButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
  },
  customButtonTextDisabled: {
    color: COLORS.dim,
  },

  // ── Current Interval ──
  currentInterval: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(47, 168, 156, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(47, 168, 156, 0.12)',
    marginBottom: 28,
  },
  currentLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },
  currentValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
  },

  // ── Action Buttons ──
  actionRow: {
    marginBottom: 16,
  },
  startButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: COLORS.accent,
  },
  startText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.bg,
    letterSpacing: 0.5,
  },
  stopButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.danger,
    backgroundColor: 'rgba(224, 101, 79, 0.06)',
  },
  stopText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.danger,
    letterSpacing: 0.5,
  },

  // ── Glasses Today ──
  glassesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  glassesLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },
  glassesCount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  logButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
  },
});
