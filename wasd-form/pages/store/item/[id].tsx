import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetItem } from '../../../stores/actions/shopItemsActions';
import { addItemToCart } from '../../../stores/actions/userCartActions';
import styles from '../../../styles/store.module.css';

export default function StoreItem() {
  
    const dispatcher = useDispatch();
    const { query: { id } } = useRouter();
    const [item, setItem] = useState(null);

    const cart = useSelector(state => state.userCart);

    const itemStore = useSelector(state => state.shopStore.items.filter((i) => (i["id"] == id)));

    useEffect(() => {
        if(id && !item) {
            dispatcher(GetItem(id));
        }
    }, [id]);

    useEffect(() => {
        if(itemStore[0]) {
            setItem(itemStore[0]);
        }
    }, [itemStore]);


    const addItem = () => {
        dispatcher(addItemToCart(item));
        Router.push("/store/cart")
    }

    return (
        <div>
            <div className={styles.shop_big_item_container}>
                <div className={styles.item_picture_side}>
                    <img src={"/test-banner.jpg"}></img>
                </div>
                <div className={styles.item_information_side}>
                    <h1>{item?.name}</h1>
                    <h1 className={styles.price}>${item?.price}<span className={styles.currency}>{item?.currency ? item?.currency : "USD"}</span></h1>
                    <p>{item?.description}</p>
                    <button className={styles.buy_now_button} onClick={() => addItem()}>Add to cart</button>
                    <button className={`${styles.buy_now_button} ${styles.gift_button}`}>Gift to user</button>
                </div>
            </div>
        </div>
    );
} 