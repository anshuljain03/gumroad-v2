import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        // Attempt to log in the user
        try {
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
            localStorage.setItem('user', JSON.stringify(loginData));
            router.push('/home'); // Redirect to home
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout title='Log in to Gumroad'>
             <div id="login-form">
                <form id="large-form" onSubmit={handleSubmit}>
                    {error && <h3>Log in to Gumroad <small className="error">{error}</small></h3>}
                    {!error && <h3>Log in to Gumroad <small>Did we tell you we love you?</small></h3>}
                    <p>
                        <input
                            type="text"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Log in</button>
                    </p>
                    <div className="rainbow bar"></div>
                </form>
                <p id="below-form-p">
                    <Link href="/forgot-password" passHref>
                        Forgot your password?
                    </Link> We all do.
                </p>
            </div>
        </Layout>
    );
};

export default LoginPage;
