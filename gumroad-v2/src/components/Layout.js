import React from 'react';
import MyHead from './MyHead';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, title }) => {
    return (
        <>
            <MyHead title={title} />
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
