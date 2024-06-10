import React from 'react';
import Layout from '../components/Layout';  // Adjust the path as per your project structure if you have a layout component
import Link from 'next/link';

const Custom404 = () => {
    return (
        <div id="wrapper">
        <div className="top-bar"></div>
        <div id="header">
            <div id="main-content">
                <h3>404 - Page Not Found</h3>
                <div className="mini-rule"></div>
                <p>You've reached a page that doesn't exist. <Link href="/">Go home?</Link></p>
            </div>
            </div>
            <div className="rule"></div>
        </div>
    );
};

export default Custom404;
