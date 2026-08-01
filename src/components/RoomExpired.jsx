// src/components/RoomExpired.jsx
const RoomExpired = ({ onReturnHome }) => {
  return (
    <div className="room-expired fade-in-up">
      <h2>this room has self-destructed</h2>
      <p>all messages have been permanently deleted.</p>
      <button onClick={onReturnHome} className="btn-glow">return home</button>
    </div>
  );
};

export default RoomExpired;