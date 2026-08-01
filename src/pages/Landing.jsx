// src/pages/Landing.jsx
import { useState } from 'react';
import Footer from '../components/Footer.jsx';
import BuyMeCoffee from '../components/BuyMeCoffee.jsx';
import TerminalFrame from '../components/TerminalFrame.jsx';

const Landing = ({ onRoomReady }) => {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SOCKET_URL}/api/rooms`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');
      // pass both code AND creatorToken — only present because THIS response came from creation
      onRoomReady(data.code, data.creatorToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SOCKET_URL}/api/rooms/${joinCode.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Room not found');
      // no creatorToken here — this person joined, they didn't create it
      onRoomReady(data.code, null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-frame-container fade-in-up">
        <TerminalFrame title="brief — private chat">
          <div className="landing">
            <h1 className="landing-title crt-flicker">
              brief <span className="emoji">🩲</span>
            </h1>
            <p className="landing-subtitle cursor-blink">private. temporary. no trace.</p>

            <p className="landing-name-meaning">
              "brief" — as in short-lived. these chats don't stick around, and neither should your data.
            </p>

            <p className="landing-explainer">
              create a room, share the code with one other person, and talk freely.
              no accounts, no saved history — everything self-destructs after 1 hour.
            </p>

            <button onClick={handleCreateRoom} disabled={loading} className="btn-glow create-btn">
              {loading ? 'creating...' : 'create a room'}
            </button>

            <div className="divider">or</div>

            <form onSubmit={handleJoinRoom} className="join-form">
              <input
                type="text"
                placeholder="enter room code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button type="submit" disabled={loading} className="btn-glow">join</button>
            </form>

            {error && <p className="error fade-in-up">{error}</p>}

            <div className="landing-coffee">
              <BuyMeCoffee />
            </div>
          </div>
        </TerminalFrame>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;