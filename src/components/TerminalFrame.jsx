// src/components/TerminalFrame.jsx
const TerminalFrame = ({ title = 'brief', children }) => {
  return (
    <div className="terminal-frame">
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
};

export default TerminalFrame;