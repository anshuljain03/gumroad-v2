import Head from 'next/head';
import Layout from '../components/Layout';  // Adjust the path as per your project structure if you have a layout component

const About = () => {
    return (
        <Layout>
            <Head>
                <title>About Gumroad</title>
            </Head>
            <div id="main-content">
                <h3>Gumroad lets you sell just like you share.</h3>
                <div className="mini-rule"></div>
                <p>We want to democratize the ability to sell stuff online. You're a creative person; you create a lot of content. But most of it, you never sell! It's either too hard, or too time-consuming, or it doesn't even make sense to put in a store!</p>
                <p>We let you easily sell the stuff you weren't able to before. It turns out, that includes a lot of stuff.</p>
                <p>We're early in the process of changing the world and all that fun stuff, but we're <a href="mailto:hi@gumroad.com">always looking for help</a>.</p>
            </div>
        </Layout>
    );
}

export default About;
