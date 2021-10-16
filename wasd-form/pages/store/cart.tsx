import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartItemLongCard from '../../components/shop/CartItemLongCard';
import { clearCart, postCartItems, removeItemFromCart } from '../../stores/actions/userCartActions';
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import styles from '../../styles/store.module.css';
import axios from 'axios';
import Link from 'next/link';
import Preloader from '../../components/shared/Preloader';
import { API, CAPTURE_PAYPAL_ORDER, GET_PAYPAL_ORDER } from '../../requests/config';

export default function cart() {

    const userStore = useSelector((state: any) => state.user);
    const cartItems = useSelector((state: any) => state.userCart.items);
    const [hasCompletedPayment, setCompletedPayment] = useState(true);
    const [error, setError] = useState<Array<String> | null>(null);
    const dispatcher = useDispatch();

    const initalOptions: any = {
        "client-id": "Afq0gJghMMDsCEPGnpFuI_WVXgU7CZxBfobBBUj5B5nAKKt330AmSglybiq9hpXZnQWo8qah0SOfglSA",
        currency: "USD",
        intent: "capture",
    }

    const RemoveItem = (i: any) => {
        dispatcher(removeItemFromCart(i));
    }

    const createPaypalOrder  = () : Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            axios.post(`${API}/${GET_PAYPAL_ORDER}`, {} ,{
                headers: {
                    Authorization: userStore.user.api_key
                }
            }).then((res) => {
                if(!res.data.error){
                    resolve(res.data.orderID);
                } else {
                    setError(res.data.errors);

                    reject(res.data.errors);
                }
            }).catch((err) => {
                if(err.response.data){
                    setError(err.response.data.errors)
                    reject(err.response.data.errors);
                } else {
                    setError(["Could not contact WASD Payment API, please try again later!"]);
                    reject("Server offline");
                }
            })
        })
    }

    const capturePaypalOrder = (data : any) : Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            axios.post(`${API}/${CAPTURE_PAYPAL_ORDER}`, {
                orderID: data.orderID
            }, {
                headers: {
                    Authorization: userStore.user.api_key
                }
            }).then((res) => {
                if(!res.data.error){
                    console.log("Payment completed!");
                    dispatcher(clearCart());
                 
                } else {
                    console.log("Payment has failed");
                    setError(["Could not process paymnet! Please try again."]);
                }
            })
        });
    }

    useEffect(() => {
        if(cartItems && userStore.user.api_key){
            console.log(cartItems);
            dispatcher(postCartItems(cartItems.map((i: any) => i.id), userStore.user.api_key));
        }
    }, [cartItems]);


    return (
        <div className={styles.store_cart_container}>
            {hasCompletedPayment ? (
                <>
                    <div className={styles.store_cart_inner}>
                        <h1>Cart summery</h1>
                        <p>{cartItems.length} Items in cart</p>
                        {cartItems.map((i: any) => {
                            return <CartItemLongCard item={i} remove={RemoveItem}></CartItemLongCard>
                        })}
                    </div>
                    <div className={styles.store_checkout_box}>
                        <h3>Your Order</h3>
                        {userStore.user.api_key ? <PayPalScriptProvider options={initalOptions}>
                            <PayPalButtons createOrder={(data, error) => createPaypalOrder()} onApprove={(data) => capturePaypalOrder(data)} />
                        </PayPalScriptProvider> : ""}
                    </div>
                </>
            ) : (<> 
                <div className={styles.order_completed}>
                    <h1>{userStore.username} Thanks for your purchase!</h1>
                    <p>Go to your <Link href={"/users/me/downloads"}>downloads</Link> page to download your products!</p>
                </div>
            </>)}

        </div>
    )
}