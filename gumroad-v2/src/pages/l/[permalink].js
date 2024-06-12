import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

const LinkPage = () => {
    const router = useRouter();
    const { permalink } = router.query;
    const [linkDetails, setLinkDetails] = useState({
        name: '',
        price: '',
        description: '',
        previewUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Generate years from the current year to 10 years ahead
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (v, i) => currentYear + i);

    // Months array
    const months = Array.from({ length: 12 }, (v, i) => ({
        value: i + 1,
        name: new Date(0, i).toLocaleString('default', { month: 'long' })
    }));

    useEffect(() => {
        if (permalink) {
            setLoading(true);
            fetch(`http://localhost:5000/api/links/${permalink}`, {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.name) {
                        setLinkDetails(data);
                    } else {
                        throw new Error('Failed to fetch link details');
                    }
                })
                .catch(error => setError(error.message))
                .finally(() => setLoading(false));
        }
    }, [permalink]);

    const handlePayment = async (event) => {
        event.preventDefault();
        const { card_number, date_month, date_year, card_security_code } = event.target.elements;
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`http://localhost:5000/api/purchases/${permalink}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    cardNumber: card_number.value,
                    expiryMonth: date_month.value,
                    expiryYear: date_year.value,
                    cvv: card_security_code.value
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Payment processing failed');
            alert('Payment Successful!');
            window.location.href = data.redirectUrl || 'https://google.com';
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
                <h1>{linkDetails.name}</h1>
                <p>{linkDetails.description}</p>
                <div id="large-form">
                <form onSubmit={handlePayment}>
                    <h3>Pay ${linkDetails.price}</h3>
                    {linkDetails.previewUrl && <a href={linkDetails.previewUrl} target="_blank">Preview</a>}
                    <input type="text" name="card_number" placeholder="Card number" required />
                    <select name="date_month" required>
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.name}</option>
                        ))}
                    </select>
                    <select name="date_year" required>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <input type="text" name="card_security_code" placeholder="Security code" required />
                    <button type="submit">Pay</button>
                </form>
                {error && <p className="error">{error}</p>}
                {loading && <p>Loading...</p>}
            </div>
        </Layout>
    );
};

export default LinkPage;
