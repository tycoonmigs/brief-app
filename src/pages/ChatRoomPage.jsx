// src/pages/ChatRoomPage.jsx
import { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket.js';
import ChatRoom from '../components/ChatRoom.jsx';
import Footer from '../components/Footer.jsx';

const ChatRoomPage = ({ roomCode, creatorToken, onLeaveRoom }) => {
  const { socket } = useSocket();
  const [alias, setAlias] = useState(null);
  const [messages, setMessages] = useState([]);
  const [expiresAt, setExpiresAt] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [joining, setJoining] = useState(true);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', { code: roomCode }, (response) => {
      setJoining(false);
      if (response.error) {
        setErrorType(response.error);
        setErrorMessage(response.message || 'Could not join this room.');
        return;
      }
      setAlias(response.alias);
      setMessages(response.messages || []);
      setExpiresAt(response.expiresAt);
    });
  }, [socket, roomCode]);

  if (joining) {
    return (
      <div className="join-status-screen">
        <p>joining room...</p>
      </div>
    );
  }

  if (errorType === 'room-full') {
    return (
      <div className="join-status-screen fade-in-up">
        <div className="join-status-card">
          <h2>room's full 🚪</h2>
          <p>{errorMessage}</p>
          <button onClick={onLeaveRoom} className="btn-glow">return home</button>
        </div>
        <Footer />
      </div>
    );
  }

  if (errorType) {
    return (
      <div className="join-status-screen fade-in-up">
        <div className="join-status-card">
          <h2>couldn't join</h2>
          <p>{errorMessage}</p>
          <button onClick={onLeaveRoom} className="btn-glow">return home</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ChatRoom
      roomCode={roomCode}
      alias={alias}
      initialMessages={messages}
      expiresAt={expiresAt}
      creatorToken={creatorToken}
      onLeaveRoom={onLeaveRoom}
    />
  );
};

export default ChatRoomPage;