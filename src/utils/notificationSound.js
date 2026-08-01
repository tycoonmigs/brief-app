// src/utils/notificationSound.js
const NOTIFICATION_SOUND_KEY = 'brief_notification_sound_enabled';

export const isNotificationSoundEnabled = () => {
  const stored = localStorage.getItem(NOTIFICATION_SOUND_KEY);
  return stored === null ? true : stored === 'true'; // default: on
};

export const setNotificationSoundEnabled = (enabled) => {
  localStorage.setItem(NOTIFICATION_SOUND_KEY, String(enabled));
};

export const playNotificationSound = () => {
  if (!isNotificationSoundEnabled()) return;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // a short "blip" tone
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (error) {
    console.error('Could not play notification sound:', error);
  }
};