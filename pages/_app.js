import Head from "next/head";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ContextProvider from "../components/common/ContextProvider";
import "../styles/globals.scss";
import "react-image-crop/src/ReactCrop.scss";

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <div className="page">
        <Head>
          <title>Custom AI Stock Images Created By Your Imagination</title>
          <meta
            name="description"
            content="Free stock images created by your imagination"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </ContextProvider>
  );
}

export default MyApp;
