// src/main.jsx
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import './styles/global.css';
import './styles/landing.css';
import './styles/chatroom.css';
import './styles/onboarding.css';

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
  </SocketProvider>
);