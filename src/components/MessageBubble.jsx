// src/components/MessageBubble.jsx (updated)
const MessageBubble = ({ message, isOwn }) => {
  if (message.type === 'system') {
    return <div className="system-message">{message.content}</div>;
  }

  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
      <span className="alias">{message.alias}</span>
      {message.type === 'image' ? (
        <img src={message.content} alt="shared" className="message-image" />
      ) : (
        <p className="content">{message.content}</p>
      )}
    </div>
  );
};

export default MessageBubble;