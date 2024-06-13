import React, { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
const BACKEND_URL=process.env.BACKEND_URL

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/api/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            setMessage(data.message);
            setIsSuccess(true);
        } catch (error) {
            setMessage(error.message);
            setIsSuccess(false);
        }
    };

    return (
        <Layout title="Gumroad - Forgot Password">
            <Head>
                <title>Forgot Password - Gumroad</title>
            </Head>
            <div id="forgot-password">
                <form id="large-form" onSubmit={handleSubmit}>
                    {message && (
                        <h3>
                            {isSuccess ? (
                                <span>{message}</span>
                            ) : (
                                <span className="error">Error: {message}</span>
                            )}
                        </h3>
                    )}
                    {!isSuccess && (
                        <>
                            <h3>Enter your email address <small>And don't worry about forgetting your password, we do too!</small></h3>
                            <p>
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit">Send email</button>
                            </p>
                            <div className="rainbow bar"></div>
                        </>
                    )}
                </form>
                <p id="below-form-p">&nbsp;</p>
            </div>
        </Layout>
    );
};

export default ForgotPasswordPage;
