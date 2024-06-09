import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const HomePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { isLoggedIn } = useAuth();  // Adjusted to destructure isLoggedIn directly
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/home');  // Redirect to home/dashboard if already logged in
        }
    }, [isLoggedIn, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        // Attempt to register the user
        try {
            const registerResponse = await fetch(`${BACKEND_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const registerData = await registerResponse.json();
            if (!registerResponse.ok) {
                throw new Error(registerData.message || 'Failed to register.');
            }

            // If registration is successful, attempt to login
            const loginResponse = await fetch(`${BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const loginData = await loginResponse.json();
            if (!loginResponse.ok) {
                throw new Error(loginData.message || 'Failed to login.');
            }

            // Save the token and redirect if login is successful
            localStorage.setItem('token', loginData.token);
            router.push('/home');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) return null;  // Ensure we don't render the form when logged in

    return (
        <Layout title="Home - Gumroad">
            <div id="intro">
                <div id="video"></div>
                <ul>
                    <li id="we-handle-payments">
                        <h5>We handle all the payment stuff.</h5>
                        <p>You should be focused on creating awesome content. We'll deal with the rest.</p>
                    </li>
                    <li id="worldwide">
                        <h5>Do what you already do.</h5>
                        <p>Use the channels you already have with your fans and followers. You <em>are</em> the distribution. No store needed.</p>
                    </li>
                </ul>
                <div id="intro-text">
                    <h2>Share and sell your digital content <br />with just a link.</h2>
                    <p id="description">Selling stuff has always been a pain. No longer! Get back to creating. <br />We make selling stuff as easy as sharing a link.</p>
                </div>
                <form id="large-form" onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    {isLoading ? (
                        <h3>Processing...</h3>
                    ) : (
                        <h3>Sign up for Gumroad <small>Fill in the simple form below and start selling in minutes</small></h3>
                    )}
                    <p>
                        <input type="text" placeholder="Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Start selling!</button>
                    </p>
                    <div className="rainbow bar"></div>
                </form>
            </div>
            <div id="press">
                <div className="testimonial">
                    <blockquote>&#8220;Incredibly easy&hellip; in fact, just writing this, I&#8217;m coming up with ideas and kicking myself for having not sold things in the past. Fortunately, moving forward, I won&#8217;t have to kick myself anymore.&#8221;</blockquote>
                    <span className="writer">Brad McCarty - <a href="http://thenextweb.com/apps/2011/04/09/gumroad-sell-digital-goods-with-a-link-no-storefront-needed/">The Next Web</a></span>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
