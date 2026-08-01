// src/components/SettingsPanel.jsx
import { useState } from 'react';
import { isNotificationSoundEnabled, setNotificationSoundEnabled } from '../utils/notificationSound.js';

const SettingsPanel = ({ onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(isNotificationSoundEnabled());

  const handleToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    setNotificationSoundEnabled(newValue);
  };

  return (
    <div className="settings-overlay modal-fade-in" onClick={onClose}>
      <div className="settings-panel modal-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>settings</h3>
          <button type="button" className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-row">
          <span>notification sound</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={soundEnabled} onChange={handleToggle} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;