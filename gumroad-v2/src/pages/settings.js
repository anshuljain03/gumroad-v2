import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'; // Ensure this path is correct based on your directory structure
import { BACKEND_URL } from '../config';

const SettingsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        paymentAddress: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/users/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    paymentAddress: userData.paymentAddress || ''
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // make api call to update user details
        const response = await fetch(`${BACKEND_URL}/api/users/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        localStorage.setItem('users', JSON.stringify(response));
    };

    return (
        <Layout useFeedbackHeader={false}>
            <form onSubmit={handleSubmit} id="large-form">
                <h3>Your account settings <small>a setting you can't change: how awesome you are</small></h3>
                <p>
                    <label htmlFor="name">Full name: </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </p>
                <p>
                    <label htmlFor="email">Email address: </label>
                    <input
                        type="text"
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </p>
                <p>
                    <label htmlFor="paymentAddress">PayPal address: </label>
                    <input
                        id="paymentAddress"
                        name="paymentAddress"
                        type="text"
                        placeholder="PayPal Address"
                        value={formData.paymentAddress}
                        onChange={handleChange}
                    />
                </p>
                <p>
                    <button type="submit">Update account details</button>
                </p>
                <div className="rainbow bar"></div>
            </form>
        </Layout>
    );
};

export default SettingsPage;
