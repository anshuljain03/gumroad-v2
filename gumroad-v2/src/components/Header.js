import React from 'react';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';  // Import the auth hook

const Header = ({ onLinksPage, useFeedbackHeader }) => {
    const { isLoggedIn, user } = useAuth();  // Retrieve authentication state and user data

    return (
        <>
            <div id="header">
                <Link href="/" passHref>
                    <h1 id="logo">Gumroad</h1>
                </Link>

                {isLoggedIn ? (
                    <p id="account-navigation">
                        {onLinksPage ? (
                            <Link href="/home" passHref><span>Home</span></Link>
                        ) : (
                            <Link href="/links" passHref><span>Your links</span></Link>
                        )}
                        &nbsp;•&nbsp;
                        <span className="balance">${user ? user.balance.toFixed(2) : '0.00'}</span>&nbsp;•&nbsp;
                        <Link href="/settings" passHref><span>Settings</span></Link>&nbsp;•&nbsp;
                        <Link href="/logout" passHref><span>Logout</span></Link>
                    </p>
                ) : useFeedbackHeader ? (
                    <p>Thanks for using Gumroad! <a href="mailto:hi@gumroad.com">Feedback?</a></p>
                ) : (
                    <p>Have an account? <Link href="/login" passHref><span id="login-link" className="underline">Login</span></Link></p>
                )}
            </div>
            <div className="rule"></div>
        </>
    );
};

export default Header;
