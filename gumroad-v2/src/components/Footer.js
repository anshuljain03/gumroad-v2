import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div id="footer">
      <div id="inner-footer">
        <p id="copyright">
          &copy; 2024 <strong>Gumroad by Anshul Jain</strong>
        </p>
        <p id="footer-navigation">
          <Link href="/about">About</Link> &bull; 
          <Link href="/faq">FAQ</Link> &bull; 
          <a href="http://x.com/gumroad/" target="_blank" rel="noopener noreferrer">X</a> &bull; 
          <a href="http://facebook.com/gumroad/" target="_blank" rel="noopener noreferrer">Facebook</a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
