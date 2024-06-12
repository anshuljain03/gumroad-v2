import React from 'react';
import MyHead from './MyHead';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, title, onLinksPage = false, useFeedbackHeader=true, linkDetails}) => {
    return (
        <>
                <div className="top-bar"></div>
                <div id="wrapper">
                    <MyHead title={title} />
                    <Header onLinksPage={onLinksPage} useFeedbackHeader={useFeedbackHeader} linkDetails={linkDetails}/>
                    {children}
                </div>
            <Footer />
        </>
    );
};

export default Layout;
