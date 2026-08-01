// src/App.jsx (updated)
import { useState } from 'react';
import Landing from './pages/Landing.jsx';
import ChatRoomPage from './pages/ChatRoomPage.jsx';
import Onboarding, { hasCompletedOnboarding } from './onboarding/Onboarding.jsx';

function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding());

  if (showOnboarding) {
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="app">
      {roomCode ? (
        <ChatRoomPage roomCode={roomCode} onLeaveRoom={() => setRoomCode(null)} />
      ) : (
        <Landing onRoomReady={setRoomCode} />
      )}
    </div>
  );
}

export default App;