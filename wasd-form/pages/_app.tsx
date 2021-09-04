import { AppProps } from 'next/app';
import Store from '../stores/store';
import Navbar from '../components/shared/Navbar';
import { Provider } from 'react-redux';
import '../styles/globals.css';
import "../styles/vars.css";
import "../styles/bootstrap/bootstrap.min.css";
import { createWrapper } from 'next-redux-wrapper';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Provider store={Store}>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </Provider>
  </>
}

const makeStore = () => Store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
