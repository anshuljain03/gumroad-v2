import React from 'react';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';  // Import the auth hook

const Header = ({ onLinksPage }) => {
    const { isLoggedIn, user } = useAuth();  // Retrieve authentication state and user data

    return (
        <div id="wrapper">
            <div className="top-bar"></div>
            <div id="header">
                <Link href="/">
                    <h1 id="logo">Gumroad</h1>
                </Link>

                {isLoggedIn ? (
                    <p id="account-navigation">
                        {onLinksPage ? (
                            <Link href="/home"><span>Home</span></Link>
                        ) : (
                            <Link href="/links"><span>Your links</span></Link>
                        )}
                        &nbsp;•&nbsp;
                        <span className="balance">${user ? user.balance.toFixed(2) : '0.00'}</span>&nbsp;•&nbsp;
                        <Link href="/settings"><span>Settings</span></Link>&nbsp;•&nbsp;
                        <Link href="/logout"><span>Logout</span></Link>
                    </p>
                ) : (
                    <p>Have an account? <Link href="/login"><span id="login-link" className="underline">Login</span></Link></p>
                )}
            </div>
            <div className="rule"></div>
        </div>
    );
};

export default Header;
