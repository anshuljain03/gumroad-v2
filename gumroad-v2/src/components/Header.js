import React from 'react';
import Link from 'next/link';

const Header = ({ user, onLinksPage }) => {
  return (
    <div id="header">
      <Link href="/">
        <h1 id="logo">Gumroad</h1>
      </Link>
      {user ? (
        <p id="account-navigation">
          {!onLinksPage ? <Link href="/links">Your links</Link> : <Link href="/home">Home</Link>}
          &bull; <span className="balance">${user.balance}</span> &bull; 
          <Link href="/settings">Settings</Link> &bull; 
          <Link href="/logout">Logout</Link>
        </p>
      ) : (
        <p>Thanks for using Gumroad! <a href="mailto:hi@gumroad.com">Feedback?</a></p>
      )}
    </div>
  );
};

export default Header;
