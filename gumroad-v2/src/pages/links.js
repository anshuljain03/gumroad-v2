import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LinksPage = () => {
    const [links, setLinks] = useState([]);
    const [linksMessage, setLinksMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchLinks = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/links/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch links');
                }
                const data = await response.json();
                setLinks(data);
                updateLinksMessage(data.length);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    const updateLinksMessage = (numberOfLinks) => {
        if (numberOfLinks === 0) {
            setLinksMessage('create one, you know you want to');
        } else if (numberOfLinks < 3) {
            setLinksMessage('not too bad...');
        } else {
            setLinksMessage("that's a lot!");
        }
    };

    return (
        <Layout onLinksPage={true} useFeedbackHeader={false}>
            <div id="dashboard" className="">
                <h3>{links.length} link{links.length === 1 ? '' : 's'} <small>{linksMessage}</small></h3>
                <Link href="/add"><button className="button" id="add-link-button">Add link</button></Link>
                {links.length > 0 && (
                    <>
                        <div className="mini-rule"></div>
                        <ul id="links">
                            {links.map(link => (
                                <li key={link.permalink}>
                                    <Link href={`/edit/${link.permalink}`}>
                                        {link.name} - ${link.price}
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
