// components/GumroadModal.js
import React, { useState } from 'react';

export default function GumroadModal({ isVisible, onClose }) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (!cardNumber || !securityCode) {
            alert('Please complete all fields.');
            return;
        }
        setIsProcessing(true);
        // Simulate an API call
        setTimeout(() => {
            alert('Payment Successful');
            setIsProcessing(false);
            onClose(); // Close modal on success
        }, 2000);
    };

    if (!isVisible) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Purchase using Gumroad</h3>
                <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Card number" />
                <select value={expiryMonth} onChange={e => setExpiryMonth(e.target.value)}>
                    {/* Map through months */}
                </select>
                <select value={expiryYear} onChange={e => setExpiryYear(e.target.value)}>
                    {/* Map through years */}
                </select>
                <input value={securityCode} onChange={e => setSecurityCode(e.target.value)} placeholder="Security code" />
                <button onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay'}
                </button>
            </div>
        </div>
    );
}
