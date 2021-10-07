import React, { useEffect } from 'react';
import styles from '../../styles/store.module.css';
import ItemCard from '../../components/shop/ItemCard';
import { GetItems } from '../../stores/actions/shopItemsActions';
import { useDispatch, useSelector } from 'react-redux';

export default function StoreIndex() {

    const dispatcher = useDispatch();

    const items = useSelector(state => state.shopStore.items);

    useEffect(() => {
        dispatcher(GetItems());
    }, [])

    return (
        <div>
            <div className={styles.shop_container}>
                <div className={styles.shop_header}>
                    <div>
                        <h1>WASD Shop</h1>
                        <p>Purchase our premium undetected cheats</p>
                    </div>
                </div>
                <div className={styles.shop_items}>
                    {items.map(i => {
                        return <ItemCard cover_image={"/test-banner.jpg"} name={i.name} description={i.description} price={i.price} currency={"CAD"} id={i.id} />
                    })}
                   
                </div>
            </div>
        </div>
    )
}