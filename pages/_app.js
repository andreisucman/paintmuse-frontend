import Head from "next/head";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ContextProvider from "../components/common/ContextProvider";
import "../styles/globals.scss";

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
        </Head>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </ContextProvider>
  );
}

export default MyApp;
