import React, { useState } from 'react';
import Layout from '../components/Layout';

const HomePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error occurred. Please try again.');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you would typically handle the form submission.
        console.log('Email:', email, 'Password:', password);
        // Dummy error handling
        setShowError(true);
    };

    return (
        <Layout title="Home - Gumroad">
            <div id="intro">
                <div id="video"></div>
                <ul>
                    <li id="we-handle-payments">
                        <h5>We handle all the payment stuff.</h5>
                        <p>You should be focused on creating awesome content. We'll deal with the rest.</p>
                    </li>
                    <li id="worldwide">
                        <h5>Do what you already do.</h5>
                        <p>Use the channels you already have with your fans and followers. You <em>are</em> the distribution. No store needed.</p>
                    </li>
                </ul>
                <div id="intro-text">
                    <h2>Share and sell your digital content <br />with just a link.</h2>
                    <p id="description">Selling stuff has always been a pain. No longer! Get back to creating. <br />We make selling stuff as easy as sharing a link.</p>
                </div>
                <form id="large-form" onSubmit={handleSubmit}>
                    {showError ? (
                        <h3>Sign up for Gumroad <small className="error">{errorMessage}</small></h3>
                    ) : (
                        <h3>Sign up for Gumroad <small>Fill in the simple form below and start selling in minutes</small></h3>
                    )}
                    <p>
                        <input
                            type="text"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Start selling!</button>
                    </p>
                    <div className="rainbow bar"></div>
                </form>
            </div>
            <div id="press">
                <div className="testimonial">
                    <blockquote>&#8220;Incredibly easy&hellip; in fact, just writing this, I&#8217;m coming up with ideas and kicking myself for having not sold things in the past. Fortunately, moving forward, I won&#8217;t have to kick myself anymore.&#8221;</blockquote>
                    <span className="writer">Brad McCarty - <a href="http://thenextweb.com/apps/2011/04/09/gumroad-sell-digital-goods-with-a-link-no-storefront-needed/">The Next Web</a></span>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
