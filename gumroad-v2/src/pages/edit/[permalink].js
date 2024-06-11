import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

const EditLinkPage = () => {
    const router = useRouter();
    const { permalink } = router.query;
    const [linkData, setLinkData] = useState({
        name: '',
        price: '',
        url: '',
        previewUrl: '',
        description: '',
        downloadLimit: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!permalink) return;

        const fetchLinkData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/links/${permalink}`, {
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
                        downloadLimit: data.downloadLimit
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch link data');
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
            const res = await fetch(`http://localhost:5000/api/links/${permalink}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(linkData)
            });
            location.reload();
            if (!res.ok) throw new Error('Failed to update link');
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
            const res = await fetch(`http://localhost:5000/api/links/${permalink}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error('Failed to delete link');

            router.push('/links');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleShare = () => {
        const shareUrl = `http://www.example.com/link/${permalink}`;
        const message = encodeURIComponent(`Check out this link: ${shareUrl}`);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${message}`;

        window.open(twitterUrl, 'Share on Twitter', 'height=300,width=550');
    };

    return (
        <Layout useFeedbackHeader={false}>
            <div id="edit-link-page">
                <form onSubmit={handleSubmit} className="link-form">
                    <h3>Edit Link</h3>
                    {error && <p className="error">{error}</p>}
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={linkData.name}
                        onChange={e => setLinkData({...linkData, name: e.target.value})}
                        required
                    />
                    <label htmlFor="price">Price:</label>
                    <input
                        id="price"
                        name="price"
                        type="text"
                        value={linkData.price}
                        onChange={e => setLinkData({...linkData, price: e.target.value})}
                        required
                    />
                    <label htmlFor="url">URL:</label>
                    <input
                        id="url"
                        name="url"
                        type="text"
                        value={linkData.url}
                        onChange={e => setLinkData({...linkData, url: e.target.value})}
                        required
                    />
                    <label htmlFor="previewUrl">Preview URL:</label>
                    <input
                        id="previewUrl"
                        name="previewUrl"
                        type="text"
                        value={linkData.previewUrl}
                        onChange={e => setLinkData({...linkData, previewUrl: e.target.value})}
                        required
                    />
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={linkData.description}
                        onChange={e => setLinkData({...linkData, description: e.target.value})}
                    />
                    <button type="submit">Save Changes</button>
                </form>
                <button onClick={handleDelete} className="delete-button">Delete Link</button>
                <button onClick={handleShare} className="share-button">Share on Twitter</button>
            </div>
        </Layout>
    );
};

export default EditLinkPage;
