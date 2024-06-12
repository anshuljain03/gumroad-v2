import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';

const LinkForm = ({ edit = false, linkData: initialLinkData }) => {
    const [linkData, setLinkData] = useState({
        name: '',
        price: '',
        url: '',
        previewUrl: '',
        description: ''
    });
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const method = edit ? 'PUT' : 'POST';
        const url = `http://localhost:5000/api/links${edit ? `/${initialLinkData.id}` : '/'}`;
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(linkData)
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            router.push('/links'); // Redirect after submit
        } catch (error) {
            console.error('Failed to submit the form:', error);
        }
    };

    return (
        <Layout useFeedbackHeader={false}>
            <form onSubmit={handleSubmit} className="link-form">
                <h3>Create a new link</h3>
                <p>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder='name'
                        value={linkData.name}
                        onChange={e => setLinkData({...linkData, name: e.target.value})}
                        required
                    />
                </p>
                <p>
                    <label htmlFor="price">Price:</label>
                    <input
                        id="price"
                        name="price"
                        type="text"
                        placeholder='10'
                        value={linkData.price}
                        onChange={e => setLinkData({...linkData, price: e.target.value})}
                        required
                    />
                </p>
                <p>
                <label htmlFor="url">URL:</label>
                    <input
                        id="url"
                        name="url"
                        type="text"
                        placeholder='https://'
                        value={linkData.url}
                        onChange={e => setLinkData({...linkData, url: e.target.value})}
                        required
                    />
                </p>

                <p>
                    <label htmlFor="previewUrl">Preview URL:</label>
                    <input
                        id="previewUrl"
                        name="previewUrl"
                        type="text"
                        placeholder='https://'
                        value={linkData.previewUrl}
                        onChange={e => setLinkData({...linkData, previewUrl: e.target.value})}
                        required
                    />
                </p>
                <p>
                <label htmlFor="description">
                Description:<br />
                <span className="faint">(optional)</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    placeholder='optional'
                    value={linkData.description}
                    onChange={e => setLinkData({...linkData, description: e.target.value})}
                />
                </p>
                <p>
                    <button type="submit">{'Add Link'}</button>
                </p>
                <div className="rainbow bar"></div>
            </form>
        </Layout>
    );
};

export default LinkForm;
