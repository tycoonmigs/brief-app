// src/components/ConnectionStatus.jsx
import useSocket from '../hooks/useSocket.js';

const ConnectionStatus = () => {
  const { isConnected } = useSocket();

  return (
    <div className="connection-status">
      <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
      <span className="status-text">{isConnected ? 'connected' : 'reconnecting...'}</span>
    </div>
  );
};

export default ConnectionStatus;