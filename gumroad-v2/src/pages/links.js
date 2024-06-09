import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LinksPage = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchLinks = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/links', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch links');
                }
                const data = await response.json();
                setLinks(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    return (
        <Layout>
            <div id="dashboard" className="links-page">
                <h3>{links.length} link{links.length === 1 ? '' : 's'}</h3>
                <Link href="/add"><button className="button" id="add-link-button">Add link</button></Link>
                {links.length > 0 && (
                    <>
                        <div className="mini-rule"></div>
                        <ul id="links">
                            {links.map(link => (
                                <li key={link.uniquePermalink}>
                                    <Link href={`/edit/${link.uniquePermalink}`}>
                                        {link.name} - ${link.formatted_price}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <div className="rainbow bar"></div>
            </div>
        </Layout>
    );
};

export default LinksPage;
