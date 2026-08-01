import React from 'react';

function BuyMeCoffee() {
  return React.createElement(
    'a',
    {
      href: 'https://buymeacoffee.com/tycoonmigs',
      target: '_blank',
      rel: 'noopener noreferrer',
      className: 'coffee-btn',
    },
    '☕ buy me a coffee'
  );
}

export default BuyMeCoffee;