// src/components/ChatRoom.jsx
import { useEffect, useState, useRef } from 'react';
import useSocket from '../hooks/useSocket.js';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import Countdown from './Countdown.jsx';
import RoomExpired from './RoomExpired.jsx';
import CopyLinkButton from './CopyLinkButton.jsx';
import Footer from './Footer.jsx';
import ConnectionStatus from './ConnectionStatus.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import EmojiPicker from './EmojiPicker.jsx';
import { playNotificationSound } from '../utils/notificationSound.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ChatRoom = ({ roomCode, alias, initialMessages, expiresAt, creatorToken, onLeaveRoom }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [expired, setExpired] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactingMessageId, setReactingMessageId] = useState(null);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
  const [otherLastSeenId, setOtherLastSeenId] = useState(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const isCreator = Boolean(creatorToken);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // whenever the message list changes, tell the other person we've seen up to the latest message
  useEffect(() => {
    if (!socket || messages.length === 0) return;
    const lastRealMessage = [...messages].reverse().find((m) => m.type !== 'system');
    if (lastRealMessage) {
      socket.emit('markSeen', { lastSeenMessageId: lastRealMessage.id });
    }
  }, [messages, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.alias !== alias) {
        playNotificationSound();
      }
    };
    const handleUserTyping = ({ alias }) => setTypingUser(alias);
    const handleUserStoppedTyping = () => setTypingUser(null);
    const handleUserLeft = ({ alias }) => {
      setMessages((prev) => [...prev, { alias: 'system', content: `${alias} has left`, type: 'system' }]);
    };
    const handleRoomExpired = () => setExpired(true);
    const handleRoomTerminated = () => setTerminated(true);
    const handleErrorMessage = ({ error }) => alert(error);
    const handleReactionUpdate = ({ messageId, reactions }) => {
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)));
    };
    const handleSeenUpdate = ({ lastSeenMessageId }) => {
      setOtherLastSeenId(lastSeenMessageId);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);
    socket.on('userLeft', handleUserLeft);
    socket.on('roomExpired', handleRoomExpired);
    socket.on('roomTerminated', handleRoomTerminated);
    socket.on('errorMessage', handleErrorMessage);
    socket.on('reactionUpdate', handleReactionUpdate);
    socket.on('seenUpdate', handleSeenUpdate);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
      socket.off('userLeft', handleUserLeft);
      socket.off('roomExpired', handleRoomExpired);
      socket.off('roomTerminated', handleRoomTerminated);
      socket.off('errorMessage', handleErrorMessage);
      socket.off('reactionUpdate', handleReactionUpdate);
      socket.off('seenUpdate', handleSeenUpdate);
    };
  }, [socket, alias]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('sendMessage', { content: input.trim(), type: 'text' });
    setInput('');
    socket.emit('stopTyping');
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    socket.emit('typing');
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socket.emit('stopTyping'), 1500);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File too large (max 2MB)');
      e.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Only images are supported here — use the 📎 button for other file types');
      e.target.value = '';
      return;
    }

    const base64 = await fileToBase64(file);
    socket.emit('sendMessage', { content: base64, type: 'image' });
    e.target.value = '';
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File too large (max 2MB)');
      e.target.value = '';
      return;
    }

    const base64 = await fileToBase64(file);
    socket.emit('sendMessage', { content: base64, type: 'file', fileName: file.name });
    e.target.value = '';
  };

  const handleReact = (messageId, emoji) => {
    socket.emit('reactToMessage', { messageId, emoji });
  };

  const handleEmojiSelectForInput = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleEmojiSelectForReaction = (emoji) => {
    if (reactingMessageId) {
      handleReact(reactingMessageId, emoji);
    }
    setReactingMessageId(null);
  };

  const handleTerminate = () => {
    socket.emit('terminateRoom', { creatorToken });
    setShowTerminateConfirm(false);
  };

  if (terminated) {
    return (
      <>
        <div className="room-expired fade-in-up">
          <h2>this room was ended by its creator</h2>
          <p>all messages have been permanently deleted.</p>
          <button onClick={onLeaveRoom} className="btn-glow">return home</button>
        </div>
        <Footer />
      </>
    );
  }

  if (expired) {
    return (
      <>
        <RoomExpired onReturnHome={onLeaveRoom} />
        <Footer />
      </>
    );
  }

  // find the LAST own message that matches the other person's last-seen id,
  // so "seen" only shows once, under the most recent applicable message
  const lastOwnMessageIndex = [...messages]
    .map((m, i) => ({ ...m, i }))
    .reverse()
    .find((m) => m.alias === alias && m.id === otherLastSeenId)?.i;

  return (
    <div className="chat-room-wrapper">
      <div className="chat-room fade-in-up">
        <div className="chat-brand">
          <span className="chat-brand-logo">🩲</span>
          <span className="chat-brand-name">brief</span>
        </div>

        <div className="chat-header">
          <div className="header-left">
            <span className="room-label">room: <strong>{roomCode}</strong></span>
            <CopyLinkButton roomCode={roomCode} />
          </div>
          <div className="header-right">
            <ConnectionStatus />
            <span className="alias-label">you: <strong>{alias}</strong></span>
            <Countdown expiresAt={expiresAt} onExpire={() => setExpired(true)} />
            {isCreator && (
              <button type="button" className="terminate-btn" onClick={() => setShowTerminateConfirm(true)}>
                end room
              </button>
            )}
            <button type="button" className="settings-btn" onClick={() => setShowSettings(true)}>⚙</button>
          </div>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={msg.id || i}>
              <MessageBubble
                message={msg}
                isOwn={msg.alias === alias}
                currentAlias={alias}
                onReact={handleReact}
                onOpenFullPicker={setReactingMessageId}
              />
              {i === lastOwnMessageIndex && <div className="seen-label">seen</div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {typingUser && <TypingIndicator alias={typingUser} />}

        <form onSubmit={handleSend} className="message-form">
          <label className="file-input-label" title="send an image">
            🖼️
            <input type="file" accept="image/*" onChange={handleImageSelect} hidden />
          </label>
          <label className="file-input-label" title="send a file">
            📎
            <input type="file" accept={ALLOWED_FILE_EXTENSIONS} onChange={handleFileSelect} hidden />
          </label>
          <button type="button" className="emoji-trigger-btn" onClick={() => setShowEmojiPicker(true)}>
            😊
          </button>
          <input value={input} onChange={handleChange} placeholder="type a message..." />
          <button type="submit" className="btn-glow">send</button>
        </form>
      </div>

      <Footer />

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showEmojiPicker && (
        <EmojiPicker onSelect={handleEmojiSelectForInput} onClose={() => setShowEmojiPicker(false)} />
      )}
      {reactingMessageId && (
        <EmojiPicker onSelect={handleEmojiSelectForReaction} onClose={() => setReactingMessageId(null)} />
      )}

      {showTerminateConfirm && (
        <div className="settings-overlay modal-fade-in" onClick={() => setShowTerminateConfirm(false)}>
          <div className="confirm-panel modal-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3>end this room?</h3>
            <p>this will immediately delete the room and all messages for both people. this can't be undone.</p>
            <div className="confirm-actions">
              <button type="button" className="skip-btn" onClick={() => setShowTerminateConfirm(false)}>
                cancel
              </button>
              <button type="button" className="terminate-confirm-btn" onClick={handleTerminate}>
                end room now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;