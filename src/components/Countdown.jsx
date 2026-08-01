// src/components/Countdown.jsx
import useCountdown from '../hooks/useCountdown.js';

const Countdown = ({ expiresAt, onExpire }) => {
  const { isExpired, formatted } = useCountdown(expiresAt);

  if (isExpired && onExpire) {
    onExpire();
  }

  return (
    <div className={`countdown ${isExpired ? 'expired' : ''}`}>
      {isExpired ? 'room expired' : `expires in ${formatted}`}
    </div>
  );
};

export default Countdown;