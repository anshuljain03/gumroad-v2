import React from 'react';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';  // Import the auth hook
import { useRouter } from 'next/router';


const Header = ({ onLinksPage, useFeedbackHeader, linkDetails }) => {
    const { isLoggedIn, user } = useAuth();  // Retrieve authentication state and user data
    const router = useRouter();
    const path = router.pathname;
    const isPermalinkPage = path.startsWith('/l/');

    return (
        <>
            <div id="header">
                <Link href="/" passHref>
                    <h1 id="logo">Gumroad</h1>
                </Link>

                {isLoggedIn && !useFeedbackHeader ? (
                    <p id="account-navigation">
                        {onLinksPage ? (
                            <Link href="/home" passHref><span>Home</span></Link>
                        ) : (
                            <Link href="/links" passHref><span>Your links</span></Link>
                        )}
                        &nbsp;•&nbsp;
                        <span className="balance">${user ? user.balance : '0.00'}</span>&nbsp;•&nbsp;
                        <Link href="/settings" passHref><span>Settings</span></Link>&nbsp;•&nbsp;
                        <Link href="/logout" passHref><span>Logout</span></Link>
                    </p>
                ) : isPermalinkPage && linkDetails? (
                    <p>{linkDetails.name || ''}</p>
                ) : useFeedbackHeader ? (
                    <p>Thanks for using Gumroad! <a href="mailto:hi@gumroad.com">Feedback?</a></p>
                ) : (
                    <p>Have an account? <Link href="/login" passHref><span id="login-link" className="underline">Login</span></Link></p>
                )}
            </div>

        </>
    );
};

export default Header;
