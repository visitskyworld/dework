import React from "react";
import { AppProps } from "next/app";
import "../styles/styles.css";

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
