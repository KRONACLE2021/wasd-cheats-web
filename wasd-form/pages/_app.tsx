import { AppProps } from 'next/app';
import Navbar from '../components/shared/Navbar';
import '../styles/globals.css';
import "../styles/vars.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Navbar></Navbar>
    <Component {...pageProps} />
  </>
}

export default MyApp
