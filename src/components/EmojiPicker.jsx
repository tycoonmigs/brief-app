// src/components/EmojiPicker.jsx
import { EMOJI_LIST } from '../utils/emojiList.js';

const EmojiPicker = ({ onSelect, onClose }) => {
  return (
    <div className="emoji-picker-overlay" onClick={onClose}>
      <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
        {EMOJI_LIST.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="emoji-option"
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;