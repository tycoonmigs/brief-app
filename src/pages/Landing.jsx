// src/pages/Landing.jsx
import { useState } from 'react';

const Landing = ({ onRoomReady }) => {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SOCKET_URL}/api/rooms`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');
      onRoomReady(data.code);
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
      onRoomReady(data.code);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      <h1>brief 🩲</h1>
      <p>private. temporary. no trace.</p>

      <button onClick={handleCreateRoom} disabled={loading}>
        {loading ? 'creating...' : 'create a room'}
      </button>

      <form onSubmit={handleJoinRoom}>
        <input
          type="text"
          placeholder="enter room code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button type="submit" disabled={loading}>join</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );

  // src/pages/Landing.jsx (just the JSX return — logic unchanged)
    return (
    <div className="landing fade-in-up">
        <h1 className="landing-title">
        brief <span className="emoji">🩲</span>
        </h1>
        <p className="landing-subtitle cursor-blink">private. temporary. no trace.</p>

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
    </div>
    );

};

export default Landing;