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

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB, matches server-side limit

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ChatRoom = ({ roomCode, alias, initialMessages, expiresAt, onLeaveRoom }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [expired, setExpired] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const handleUserTyping = ({ alias }) => setTypingUser(alias);
    const handleUserStoppedTyping = () => setTypingUser(null);
    const handleUserLeft = ({ alias }) => {
      setMessages((prev) => [...prev, { alias: 'system', content: `${alias} has left`, type: 'system' }]);
    };
    const handleRoomExpired = () => setExpired(true);
    const handleErrorMessage = ({ error }) => {
      alert(error);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);
    socket.on('userLeft', handleUserLeft);
    socket.on('roomExpired', handleRoomExpired);
    socket.on('errorMessage', handleErrorMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
      socket.off('userLeft', handleUserLeft);
      socket.off('roomExpired', handleRoomExpired);
      socket.off('errorMessage', handleErrorMessage);
    };
  }, [socket]);

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
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping');
    }, 1500);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File too large (max 2MB)');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Only images are supported right now');
      e.target.value = '';
      return;
    }

    const base64 = await fileToBase64(file);
    socket.emit('sendMessage', { content: base64, type: 'image' });
    e.target.value = '';
  };

  if (expired) {
    return (
      <>
        <RoomExpired onReturnHome={onLeaveRoom} />
        <Footer />
      </>
    );
  }

  return (
    <div className="chat-room-wrapper">
      <div className="chat-room fade-in-up">
        <div className="chat-header">
          <div className="header-left">
            <span className="room-label">room: <strong>{roomCode}</strong></span>
            <CopyLinkButton roomCode={roomCode} />
          </div>
          <div className="header-right">
            <ConnectionStatus />
            <span className="alias-label">you: <strong>{alias}</strong></span>
            <Countdown expiresAt={expiresAt} onExpire={() => setExpired(true)} />
          </div>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} isOwn={msg.alias === alias} />
          ))}
        </div>

        {typingUser && <TypingIndicator alias={typingUser} />}

        <form onSubmit={handleSend} className="message-form">
          <label className="file-input-label">
            📎
            <input type="file" accept="image/*" onChange={handleFileSelect} hidden />
          </label>
          <input value={input} onChange={handleChange} placeholder="type a message..." />
          <button type="submit" className="btn-glow">send</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ChatRoom;