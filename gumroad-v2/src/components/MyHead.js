import Head from 'next/head';

const MyHead = ({ title }) => {
  return (
    <Head>
      <title>{title || 'Gumroad - Selling should be as easy as sharing a link.'}</title>
      <link rel="stylesheet" href="/static/css/style.css" />
      <meta property="og:site_name" content="Gumroad" />
      <meta property="og:title" content="Gumroad" />
      <meta property="og:url" content="http://gumroad.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="Selling should be as easy as sharing a link." />
      <meta property="fb:page_id" content="http://www.facebook.com/gumroad" />
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    </Head>
  );
};

export default MyHead;
