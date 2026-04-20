/**
 * Controls.js
 * ------------
 * Renders the interval-selection buttons, custom interval input,
 * and Start / Stop action buttons.
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
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* ── Section Label ── */}
      <Text style={styles.sectionLabel}>Interval</Text>

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
                isActive && styles.presetDisabled,
              ]}
              onPress={() => onSelectInterval(preset.value)}
              disabled={isActive}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.presetText,
                  isSelected && styles.presetTextSelected,
                  isActive && !isSelected && styles.presetTextDisabled,
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
          placeholder="Custom (min)"
          placeholderTextColor="#475569"
          keyboardType="number-pad"
          returnKeyType="done"
          value={customValue}
          onChangeText={onCustomChange}
          onSubmitEditing={onCustomSubmit}
          editable={!isActive}
          maxLength={4}
        />
        <TouchableOpacity
          style={[styles.customButton, isActive && styles.customButtonDisabled]}
          onPress={onCustomSubmit}
          disabled={isActive}
          activeOpacity={0.7}
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
          >
            <Text style={styles.startText}>Start Reminder</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={onStop}
            activeOpacity={0.8}
          >
            <Text style={styles.stopText}>Stop Reminder</Text>
          </TouchableOpacity>
        )}
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
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 2,
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
    borderColor: '#1E293B',
    backgroundColor: '#0F172A',
    alignItems: 'center',
  },
  presetSelected: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  presetDisabled: {
    opacity: 0.5,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  presetTextSelected: {
    color: '#38BDF8',
  },
  presetTextDisabled: {
    color: '#334155',
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
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#F1F5F9',
    backgroundColor: '#0F172A',
  },
  inputDisabled: {
    opacity: 0.4,
  },
  customButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonDisabled: {
    borderColor: '#1E293B',
    opacity: 0.4,
  },
  customButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38BDF8',
  },
  customButtonTextDisabled: {
    color: '#334155',
  },

  // ── Current Interval ──
  currentInterval: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.1)',
    marginBottom: 28,
  },
  currentLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  currentValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38BDF8',
  },

  // ── Action Buttons ──
  actionRow: {
    marginBottom: 16,
  },
  startButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  startText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A0E1A',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  stopButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
  },
  stopText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
