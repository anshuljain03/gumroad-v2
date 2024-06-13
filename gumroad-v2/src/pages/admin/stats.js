import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
const BACKEND_URL=process.env.BACKEND_URL

const StatsPage = () => {
    const [stats, setStats] = useState({
        numberOfLinks: 0,
        numberOfUsers: 0,
        purchaseTotal: 0,
        numberOfPurchases: 0,
        averagePurchase: 0,
        numberOfViews: 0,
        numberOfDownloads: 0,
        averageViews: 0,
        averageDownloads: 0,
        lastLinkDate: '',
        lastPurchaseDate: ''
    });

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/admin/stats`, {
            headers: { 
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setStats(data))
        .catch(error => console.error('Error fetching stats:', error));
    }, []);

    return (
        <Layout>
            <div id="main-content">
                <h3>Gumroad lets you sell just like you share.</h3>
                <div className="mini-rule"></div>
                <p>There are <strong>{stats.numberOfLinks}</strong> links and counting.</p>
                <p>There are <strong>{stats.numberOfUsers}</strong> users and counting.</p>
                <p>There have been $<strong>{stats.purchaseTotal}</strong> worth of purchases. There are <strong>{stats.numberOfPurchases}</strong> purchases and counting.</p>
                <p>That's an average of $<strong>{stats.averagePurchase}</strong> per purchase!</p>
                <p>They've been viewed <strong>{stats.numberOfViews}</strong> times and downloaded <strong>{stats.numberOfDownloads}</strong> times.</p>
                <p>That's an average of <strong>{stats.averageViews}</strong> views and <strong>{stats.averageDownloads}</strong> downloads per link!</p>
                <p>The last link was added <strong>{stats.lastLinkDate}</strong> ago.</p>
                <p>The last purchase was made <strong>{stats.lastPurchaseDate}</strong> ago.</p>
            </div>
        </Layout>
    );
};

export default StatsPage;
