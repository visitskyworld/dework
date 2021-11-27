import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.less";
import { AuthProvider } from "@dewo/app/contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>dewo</title>
        <meta
          name="description"
          content="dewo - the task manager for DAOs and decentralized work"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
