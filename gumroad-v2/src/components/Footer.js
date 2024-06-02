import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div id="footer">
      <div id="inner-footer">
        <p id="copyright">
          &copy; 2011 <strong>Gumroad</strong>
        </p>
        <p id="footer-navigation">
          <Link href="/about">About</Link> &bull; 
          <Link href="/faq">FAQ</Link> &bull; 
          <a href="http://twitter.com/gumroad/" target="_blank" rel="noopener noreferrer">Twitter</a> &bull; 
          <a href="http://facebook.com/gumroad/" target="_blank" rel="noopener noreferrer">Facebook</a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
