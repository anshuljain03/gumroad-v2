import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
const BACKEND_URL = process.env.BACKEND_URL;

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
        if (!permalink) return;

        const fetchLinkDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/links/${permalink}`, {
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();

                if(data.previewUrl && !data.previewUrl.startsWith('http')) {
                    // fetch temporary signed URL
                    const res = await fetch(`${BACKEND_URL}/api/file/${data.previewUrl}`, {
                        type: 'GET',
                        headers: { 
                            'Content-Type': 'application/json'
                        }
                    });
                    if(res.ok) {
                        const urlData = await res.json();
                        data.previewUrl = urlData.url;
                    } else {
                        // append https:// to the url
                        data.previewUrl = `https://${data.previewUrl}`;
                    }
                }

                if (res.ok) {
                    setLinkDetails(data);
                } else {
                    throw new Error(data.message || 'Failed to fetch link details');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const incrementViews = async () => {
            try {
                await fetch(`${BACKEND_URL}/api/links/${permalink}/views`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error('Failed to increment views:', error);
            }
        };

        fetchLinkDetails();
        incrementViews();
    }, [permalink]);

    const handlePayment = async (event) => {
        event.preventDefault();
        const { card_number, date_month, date_year, card_security_code } = event.target.elements;
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${BACKEND_URL}/api/purchases/${permalink}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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

            if(data.redirectUrl && !data.redirectUrl.startsWith('http')) {
                const res = await fetch(`${BACKEND_URL}/api/file/${data.redirectUrl}`, {
                    type: 'GET',
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                });
                if(res.ok) {
                    const urlData = await res.json();
                    data.redirectUrl = urlData.url;
                } else {
                    data.redirectUrl = `https://${data.redirectUrl}`;
                }
            }

            window.location.href = data.redirectUrl || 'https://google.com';
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout linkDetails={linkDetails} disableFooter={true}>
            <div id='description-box' style={{ width: '60%', marginLeft: '20%'}}>
                <p>{linkDetails.description}</p>
            </div>
            <div id="large-form" style={{ width: '60%', marginLeft: '20%' }}>
                <form onSubmit={handlePayment}>
                    <div id='link'>
                        {linkDetails.previewUrl && <a href={linkDetails.previewUrl} target="_blank" id='preview_link'>Preview</a>}
                        <h3>Pay ${linkDetails.price}</h3>
                        <p><label >Card Number:</label> <input id='card_number' type="text" name="card_number" placeholder="Card number" required /></p>
                        <p id='expiry_p'>Expiration date: <select name="date_month" required>
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.name}</option>
                            ))}
                        </select>
                        <select name="date_year" required>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select> </p>
                        <p>
                            <label >Card Security Code:</label>
                            <input id='card_security_code' type="text" name="card_security_code" placeholder="Security code" required />
                        </p>
                        <p className="last-p"><button type="submit" id="submit_button">Pay</button></p>
                        <div className="rainbow bar"></div>
                    </div>

                </form>
                {error && <p className="error">{error}</p>}
                {loading && <p>Loading...</p>}
            </div>
        </Layout>
    );
};

export default LinkPage;
