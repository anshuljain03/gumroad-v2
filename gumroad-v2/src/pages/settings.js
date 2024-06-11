import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'; // Ensure this path is correct based on your directory structure

const SettingsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        paymentAddress: ''
    });

    // Fetch user details from local storage when the component mounts
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const userDetails = JSON.parse(userData);
            setFormData({
                name: userDetails.name || '',
                email: userDetails.email || '',
                paymentAddress: userDetails.paymentAddress || ''
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Here you would handle the form submission to your backend
        console.info('Form data submitted:', formData);
        // Optionally update the local storage if needed
        localStorage.setItem('users', JSON.stringify(formData));
    };

    return (
        <Layout>
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
