import React from "react";
// import * as fs from "fs";
import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/styles.css";

interface ServerSideProps {}

// const regular = fs
//   .readFileSync(`${__dirname}/../styles/fonts/AvenirNextLTPro-Regular.otf`)
//   .toString("base64");
// const bold = fs
//   .readFileSync(`${__dirname}/../styles/fonts/AvenirNextLTPro-Bold.otf`)
//   .toString("base64");

// This default export is required in a new `pages/_app.js` file.
const App /*: NextComponentType<AppContextType, ServerSideProps>*/ = ({
  Component,
  pageProps,
}: AppProps) => {
  return (
    <>
      <Head>
        {/* <style>
          {`
            @font-face {
              font-family: 'Avenir Next';
              font-weight: normal;
              src: url(data:font/otf;charset=utf-8;base64,${regular}) format('opentype');
            }
            
            @font-face {
              font-family: 'Avenir Next';
              font-weight: bold;
              src: url(data:font/otf;charset=utf-8;base64,${bold}) format('opentype');
            }
          `}
        </style> */}
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
