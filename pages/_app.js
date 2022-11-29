import Head from "next/head";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ContextProvider from "../components/common/ContextProvider";
import "react-image-crop/src/ReactCrop.scss";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <div className="page">
        <Head>
          <title>Create Better Art With Custom-Made AI Mood Boards Inspired By Your Imagination</title>
          <meta
            name="description"
            content="Free AI mood board and stock images created by your imagination"
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
