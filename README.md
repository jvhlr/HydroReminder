# HydroReminder 💧

A simple, reliable hydration reminder app built with **React Native + Expo** in pure JavaScript. Sends recurring local notifications at customizable intervals and displays a live countdown timer.

---

## Features

- **Preset intervals**: 30 min · 1 hour · 2 hours
- **Custom interval**: Enter any value in minutes
- **Live countdown timer** with animated progress ring
- **Local notifications** that fire in the background
- **Persistent state**: Remembers your settings across restarts
- **Dark theme** with a clean, minimal UI

---

## Project Structure

```
HydroReminder/
├── App.js                          # Main entry — state, countdown, rendering
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel preset
├── package.json                    # Dependencies
└── src/
    ├── components/
    │   ├── Timer.js                # Circular countdown display
    │   └── Controls.js             # Interval buttons, custom input, start/stop
    └── services/
        ├── NotificationHelper.js   # Expo Notifications scheduling/cancellation
        └── StorageHelper.js        # AsyncStorage persistence layer
```

---

## Prerequisites

- **Node.js** ≥ 18 — [Download here](https://nodejs.org/)
- **Expo Go** app installed on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

## Setup Instructions

### 1. Install Node.js

Download and install from [https://nodejs.org/](https://nodejs.org/). Verify:

```bash
node --version   # Should be ≥ 18
npm --version    # Comes with Node
```

### 2. Navigate to the project

```bash
cd HydroReminder
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npx expo start
```

### 5. Run on your phone

1. Open the **Expo Go** app on your device
2. Scan the QR code shown in the terminal
3. The app will load on your phone

> **Note:** Notifications only work on **physical devices**, not on emulators/simulators.

---

## How It Works

| Layer              | File                      | Responsibility                          |
|--------------------|---------------------------|-----------------------------------------|
| **UI**             | `Timer.js`                | Countdown display with progress ring    |
| **UI**             | `Controls.js`             | Interval selection & start/stop buttons |
| **Business Logic** | `App.js`                  | State management, countdown tick        |
| **Service**        | `NotificationHelper.js`   | Schedule/cancel Expo notifications      |
| **Service**        | `StorageHelper.js`        | Persist interval & state via AsyncStorage|

---

## Technologies

- **React Native** via Expo SDK 52
- **expo-notifications** — Local notification scheduling
- **expo-device** — Device detection for permission handling
- **@react-native-async-storage/async-storage** — Persistent key-value storage
- **react-native-safe-area-context** — Safe area insets

---

## License

This project is for educational purposes.
