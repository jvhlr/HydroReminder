# HydroReminder

<p align="center">
  <img src="assets/icon.png" width="120" alt="HydroReminder app icon, a half-full glass of water">
</p>

A hydration reminder app built with React Native + Expo in pure JavaScript. Pick an interval, start the timer, and get a local notification when it is time to drink. The glass on screen fills up as your next sip approaches.

## Features

- **Preset intervals**: 30 min, 1 hour, 2 hours
- **Custom interval**: any value in minutes
- **Filling glass display**: the glass fills as the reminder approaches, and the selected interval stays readable while the timer runs
- **Glasses today counter**: log each glass you drink; the count is saved and resets daily
- **Sticky Android notification**: the reminder stays in the notification bar until you tap it; tapping opens the app and clears it
- **Persistent state**: settings and progress survive restarts (AsyncStorage)
- **Theme**: deep green-black with teal accents and warm cream text

## Run it

You need Node.js 18 or newer and the Expo Go app on your phone.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. Notifications only work on a physical device, not on emulators or the web preview.

## How it works

| Layer | File | Responsibility |
|---|---|---|
| UI | `src/components/Timer.js` | Filling glass and countdown display |
| UI | `src/components/Controls.js` | Interval selection, custom input, start and stop |
| Logic | `App.js` | State management and countdown tick |
| Service | `src/services/NotificationHelper.js` | Schedules and cancels Expo notifications |
| Service | `src/services/StorageHelper.js` | AsyncStorage persistence layer |

## Notes

- The sticky, cannot-be-swiped-away notification behavior is Android only. iOS does not allow truly unswipeable notifications.
- The sticky behavior applies to newly scheduled reminders. If a reminder is already running, stop and start it once after updating.
