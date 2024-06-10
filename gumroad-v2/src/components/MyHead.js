import Head from 'next/head';
import Script from 'next/script';

const MyHead = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title || 'Gumroad - Selling should be as easy as sharing a link.'}</title>
        <meta property="og:site_name" content="Gumroad" />
        <meta property="og:title" content="Gumroad" />
        <meta property="og:url" content="http://gumroad.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Serving should be as easy as sharing a link." />
        <meta property="fb:page_id" content="http://www.facebook.com/gumroad" />
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="src/styles/styles.css" />
      </Head>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js" strategy="beforeInteractive"/>
      <Script src="../static/js/app.js" strategy="afterInteractive"/>
      <Script>
        {`
          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', 'UA-3109196-41']);
          _gaq.push(['_trackPageview']);

          (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
          })();
        `}
      </Script>
    </>
  );
};

export default MyHead;
