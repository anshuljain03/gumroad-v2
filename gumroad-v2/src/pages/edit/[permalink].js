import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import PieChart from '../../components/PieChart';
import { useRouter } from 'next/router';

const BACKEND_URL=process.env.BACKEND_URL
const FRONTEND_URL=process.env.FRONTEND_URL


const EditLinkPage = () => {
    const router = useRouter();
    const { permalink } = router.query;
    const [linkData, setLinkData] = useState({
        name: '',
        price: '',
        url: '',
        previewUrl: '',
        description: '',
        downloadLimit: '',
        views: 0,
        downloads: 0,
        conversion: 0,
        profit: 0.00
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [linkToShare, setLinkToShare] = useState('');

    useEffect(() => {
        if (!permalink) return;

        const fetchLinkData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/links/${permalink}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setLinkData({
                        name: data.name,
                        price: data.price,
                        url: data.url,
                        previewUrl: data.previewUrl,
                        description: data.description,
                        downloadLimit: data.downloadLimit,
                        views: data.numberOfViews || 0,
                        downloads: data.numberOfPaidDownloads || 0,
                        conversion: ((data.numberOfPaidDownloads/data.numberOfViews)*100 || 0).toFixed(2),
                        profit: data.balance || 0.00
                    });
                    setLinkToShare(`${FRONTEND_URL}/links/${permalink}`); // Assuming you want to show a clickable link
                } else {
                    alert('Failed to fetch link data');
                    router.push('/links');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLinkData();
    }, [permalink]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/links/${permalink}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(linkData)
            });
            if (!res.ok) throw new Error('Failed to update link');
            
            location.reload();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this link? There's no going back!");
        if (!confirm) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/links/${permalink}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(res.ok) {
                router.push('/links');
            } else {
                throw new Error('Failed to delete link');
            }
        
        } catch (error) {
            setError(error.message);
        }
    };

    const handleShare = (platform) => {
        const shareUrl = `${FRONTEND_URL}/l/${permalink}`;
        const message = encodeURIComponent(`Check out this link: ${shareUrl}`);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${message}`;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

        window.open(platform === 'twitter' ? twitterUrl : facebookUrl, 'Share', 'height=300,width=550');
    };

    return (
        <Layout useFeedbackHeader={false}>
            <Head>
                <title>Gumroad - {linkData.name || ''}</title>
            </Head>
            <div id='share-box'>
                <button onClick={() => handleShare('facebook')} id="facebook-button">Share on Facebook</button>
                <p>
                    <input
                        type="text"
                        value={`${FRONTEND_URL}/l/${permalink}`}
                        id="link_to_share"
                        readOnly
                        title="Share this link to sell!"
                        onClick={(e) => e.target.select()} 
                    />
                </p>
                <button onClick={() => handleShare('twitter')} id="twitter-button">Share on X</button>
                <div id="analytics-box">
                <div id='conversion-chart' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span><strong>{linkData.views}</strong> views</span>
                <span className="arrow">→</span>
                <div>
                    <PieChart conversionRate={linkData.conversion} />
                </div>
                <span><strong>{linkData.conversion}%</strong></span>
                <span className="arrow">→</span>
                <span><strong>{linkData.downloads}</strong> downloads at &#8776;</span>
                <span><strong>${linkData.price}</strong></span>
                <span className="arrow">→</span>
                <span><strong>${linkData.profit}</strong> in profit!</span>
        </div>
                </div>
            </div>
            <div id="edit-link-page">
                <form onSubmit={handleSubmit} className="link-form">
                    <h3>Edit Link <button onClick={handleDelete} id="delete-link">Delete Link</button> </h3> 
                    {error && <p className="error">{error}</p>}
                    <p>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={linkData.name}
                        onChange={e => setLinkData({ ...linkData, name: e.target.value })}
                        required
                    />
                    </p>
                    <p>
                    <label htmlFor="price">Price:</label>
                    <input
                        id="price"
                        name="price"
                        type="text"
                        value={linkData.price}
                        onChange={e => setLinkData({ ...linkData, price: e.target.value })}
                        required
                    />
                    </p>
                    <p>
                    <label htmlFor="url">URL:</label>
                    <input
                        id="url"
                        name="url"
                        type="text"
                        value={linkData.url}
                        onChange={e => setLinkData({ ...linkData, url: e.target.value })}
                        required
                    />
                    </p>
                    <p>
                    <label htmlFor="previewUrl">Preview URL:</label>
                    <input
                        id="previewUrl"
                        name="previewUrl"
                        type="text"
                        value={linkData.previewUrl}
                        onChange={e => setLinkData({ ...linkData, previewUrl: e.target.value })}
                        required
                    />
                    </p>
                    <p>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={linkData.description}
                        onChange={e => setLinkData({ ...linkData, description: e.target.value })}
                    />
                    </p>
                    <p>
                    <button type="submit">Save Changes</button>
                    </p>
                    <div className="mini-rule"></div>
                    <div id="link-options">
                        <h4>Additional link options:</h4>
                        <p>
                            <label htmlFor="download_limit">Download limit:</label>
                            <input
                                id="download_limit"
                                name="download_limit"
                                type="text"
                                placeholder="0"
                                value={linkData.downloadLimit}
                                onChange={e => setLinkData({ ...linkData, downloadLimit: e.target.value })}
                                title="The number of people that can purchase this item. 0 means no limit!"
                            />
                        </p>
                    </div>
                    <div className="rainbow bar"></div>
                </form>
            </div>
        </Layout>
    );
};

export default EditLinkPage;
