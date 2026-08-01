// src/components/MessageBubble.jsx
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { QUICK_REACTIONS } from '../utils/emojiList.js';

const LONG_PRESS_MS = 450;

const getFileIcon = (fileName = '') => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['xls', 'xlsx'].includes(ext)) return '📊';
  if (ext === 'zip') return '🗜️';
  if (ext === 'txt') return '📃';
  return '📎';
};

const MessageBubble = ({ message, isOwn, currentAlias, onReact, onOpenFullPicker, showSeen }) => {
  const [showQuickBar, setShowQuickBar] = useState(false);
  const bubbleRef = useRef(null);
  const pressTimerRef = useRef(null);

  useEffect(() => {
    if (!showQuickBar) return;

    const handleOutsideClick = (e) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
        setShowQuickBar(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showQuickBar]);

  if (message.type === 'system') {
    return <div className="system-message">{message.content}</div>;
  }

  const reactions = message.reactions || [];
  const grouped = reactions.reduce((acc, r) => {
    acc[r.emoji] = acc[r.emoji] || [];
    acc[r.emoji].push(r.alias);
    return acc;
  }, {});

  const handleTouchStart = () => {
    pressTimerRef.current = setTimeout(() => setShowQuickBar(true), LONG_PRESS_MS);
  };

  const clearPressTimer = () => {
    clearTimeout(pressTimerRef.current);
  };

  const handleQuickReact = (emoji) => {
    onReact(message.id, emoji);
    setShowQuickBar(false);
  };

  const fileAttachmentElement =
    message.type === 'file'
      ? React.createElement(
          'a',
          {
            href: message.content,
            download: message.fileName || 'file',
            className: 'file-attachment',
          },
          React.createElement('span', { className: 'file-icon' }, getFileIcon(message.fileName)),
          React.createElement('span', { className: 'file-name' }, message.fileName || 'file')
        )
      : null;

  return (
    <div className={`message-group ${isOwn ? 'own' : 'other'}`}>
      <div
        ref={bubbleRef}
        className={`message-bubble-wrapper ${isOwn ? 'own' : 'other'}`}
        onMouseEnter={() => setShowQuickBar(true)}
        onMouseLeave={() => setShowQuickBar(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={clearPressTimer}
        onTouchMove={clearPressTimer}
      >
        {showQuickBar && (
          <div className={`quick-reaction-bar ${isOwn ? 'align-right' : 'align-left'}`}>
            {QUICK_REACTIONS.map((emoji) => (
              <button key={emoji} type="button" className="quick-reaction-btn" onClick={() => handleQuickReact(emoji)}>
                {emoji}
              </button>
            ))}
            <button
              type="button"
              className="quick-reaction-more"
              onClick={() => {
                onOpenFullPicker(message.id);
                setShowQuickBar(false);
              }}
            >
              +
            </button>
          </div>
        )}

        <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
          <span className="alias">{message.alias}</span>

          {message.type === 'image' && (
            <img
              src={message.content}
              alt="shared"
              className="message-image"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          )}

          {message.type === 'file' && fileAttachmentElement}

          {message.type === 'text' && <p className="content">{message.content}</p>}

          {Object.keys(grouped).length > 0 && (
            <div className="reaction-summary">
              {Object.entries(grouped).map(([emoji, aliases]) => (
                <button
                  key={emoji}
                  type="button"
                  className={`reaction-chip ${aliases.includes(currentAlias) ? 'active' : ''}`}
                  onClick={() => onReact(message.id, emoji)}
                >
                  {emoji} <span className="reaction-count">{aliases.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSeen && <div className="seen-label">seen</div>}
    </div>
  );
};

export default MessageBubble;