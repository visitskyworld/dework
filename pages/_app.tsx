import type { AppProps } from 'next/app'
// import 'antd/dist/antd.css';
// import 'antd/lib/style/themes/default.css';
import '../styles/globals.less'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
