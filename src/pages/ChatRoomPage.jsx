// src/pages/ChatRoomPage.jsx
import { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket.js';
import ChatRoom from '../components/ChatRoom.jsx';

const ChatRoomPage = ({ roomCode, onLeaveRoom }) => {
  const { socket } = useSocket();
  const [alias, setAlias] = useState(null);
  const [messages, setMessages] = useState([]);
  const [expiresAt, setExpiresAt] = useState(null);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(true);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', { code: roomCode }, (response) => {
      setJoining(false);
      if (response.error) {
        setError(response.error);
        return;
      }
      setAlias(response.alias);
      setMessages(response.messages || []);
      setExpiresAt(response.expiresAt);
    });
  }, [socket, roomCode]);

  if (joining) return <p>joining room...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <ChatRoom
      roomCode={roomCode}
      alias={alias}
      initialMessages={messages}
      expiresAt={expiresAt}
      onLeaveRoom={onLeaveRoom}
    />
  );
};

export default ChatRoomPage;