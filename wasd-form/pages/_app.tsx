import { AppProps } from 'next/app';
import { useEffect } from 'react';
import Store from '../stores/store';
import Navbar from '../components/shared/Navbar';
import { Provider, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import '../styles/globals.css';
import "../styles/vars.css";
import "draft-js/dist/Draft.css"; 

import {RefreshUser} from '../stores/actions/userActions';
import { createWrapper } from 'next-redux-wrapper';
import { fetchItemsInCart } from '../stores/actions/userCartActions';
import Footer from '../components/shared/Footer';

function MyApp({ Component, pageProps }: AppProps) {

  let dispatch = useDispatch();
  let userStore = useSelector(state => state.user);
  let user = useSelector(state => state.user.user);

  useEffect(() => {
    dispatch(RefreshUser());
  }, [userStore]);

  useEffect(() => {
    if(userStore.user.api_key){
      console.log("fetching users cart")
      dispatch(fetchItemsInCart(userStore.user.api_key));
    }
  }, [user]);

  return <>
    <div className={"page_container"}>
      <Provider store={Store}>
        <Navbar></Navbar>
        <Component {...pageProps} />
      </Provider>
      <Footer></Footer>
    </div>
  </>
}

const makeStore = () => Store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
