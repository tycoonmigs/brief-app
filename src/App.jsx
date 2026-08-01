// src/App.jsx
import { useState } from 'react';
import Landing from './pages/Landing.jsx';
import ChatRoomPage from './pages/ChatRoomPage.jsx';
import Onboarding, { hasCompletedOnboarding } from './onboarding/Onboarding.jsx';

function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [creatorToken, setCreatorToken] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding());

  const handleRoomReady = (code, token) => {
    setRoomCode(code);
    setCreatorToken(token);
  };

  const handleLeaveRoom = () => {
    setRoomCode(null);
    setCreatorToken(null);
  };

  if (showOnboarding) {
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="app">
      {roomCode ? (
        <ChatRoomPage roomCode={roomCode} creatorToken={creatorToken} onLeaveRoom={handleLeaveRoom} />
      ) : (
        <Landing onRoomReady={handleRoomReady} />
      )}
    </div>
  );
}

export default App;