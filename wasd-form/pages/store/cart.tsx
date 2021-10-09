import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartItemLongCard from '../../components/shop/CartItemLongCard';
import { postCartItems, removeItemFromCart } from '../../stores/actions/userCartActions';
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import styles from '../../styles/store.module.css';
import axios from 'axios';
import { API, GET_PAYPAL_ORDER } from '../../requests/config';

export default function cart() {

    const userStore = useSelector(state => state.user);
    const cartItems = useSelector((state) => state.userCart);
    const [error, setError] = useState<Array<String> | null>(null);
    const dispatcher = useDispatch();

    const initalOptions: ReactPayPalScriptOptions = {
        "client-id": "Afq0gJghMMDsCEPGnpFuI_WVXgU7CZxBfobBBUj5B5nAKKt330AmSglybiq9hpXZnQWo8qah0SOfglSA",
        currency: "USD",
        intent: "capture"
    }

    const RemoveItem = (i: any) => {
        dispatcher(removeItemFromCart(i));
    }

    const createPaypalOrder  = () => {
        axios.post(`${API}/${GET_PAYPAL_ORDER}`, {} ,{
            headers: {
                Authorization: userStore.user.api_key
            }
        }).then((res) => {
            if(!res.data.error){
                return res.data.orderID;
            } else {
                setError(res.data.errors);
            }
        }).catch((err) => {
            if(err.response.data){
                setError(err.response.data.errors)
            } else {
                setError(["Could not contact WASD Payment API, please try again later!"]);
            }
        })
    }

    useEffect(() => {
        if(cartItems.items && userStore.user.api_key){
            console.log(cartItems.items);
            dispatcher(postCartItems(cartItems.items.map(i => i.id), userStore.user.api_key));
        }
    }, [cartItems]);


    return (
        <div className={styles.store_cart_container}>
            <div className={styles.store_cart_inner}>
                <h1>Cart summery</h1>
                <p>{cartItems.items.length} Items in cart</p>
                {cartItems.items.map((i) => {
                    return <CartItemLongCard item={i} remove={RemoveItem}></CartItemLongCard>
                })}
            </div>
            <div className={styles.store_checkout_box}>
                <h3>Your Order</h3>
                {userStore.user.api_key ? <PayPalScriptProvider options={initalOptions}>
                    <PayPalButtons createOrder={createPaypalOrder()} />
                </PayPalScriptProvider> : ""}
            </div>
        </div>
    )
}