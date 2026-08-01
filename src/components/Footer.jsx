// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="app-footer">
      <span>
        built by{' '}
        <a href="https://tycooncv.vercel.app/" target="_blank" rel="noopener noreferrer">
          tycoonmigs
        </a>
      </span>
      <span className="footer-sep">·</span>
      <a href="https://github.com/tycoonmigs" target="_blank" rel="noopener noreferrer">
        github
      </a>
    </footer>
  );
};

export default Footer;