import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartItemLongCard from '../../components/shop/CartItemLongCard';
import { removeItemFromCart } from '../../stores/actions/userCartActions';
import styles from '../../styles/store.module.css';

export default function cart() {

    const cartItems = useSelector((state) => state.userCart);
    const dispatcher = useDispatch();

    const RemoveItem = (i: any) => {
        dispatcher(removeItemFromCart(i));
    }

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
                <button className={styles.continue_with_paypal}>Continue with paypal</button>
            </div>
        </div>
    )
}