// src/components/CopyLinkButton.jsx
import { useState } from 'react';
import { copyToClipboard } from '../utils/generateClipboardHelper.js';

const CopyLinkButton = ({ roomCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // copying the code itself (not a URL, since there's no routing/join-by-link yet)
    const success = await copyToClipboard(roomCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={handleCopy} className="copy-link-btn">
      {copied ? 'copied!' : 'copy code'}
    </button>
  );
};

export default CopyLinkButton;