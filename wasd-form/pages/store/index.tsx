import React, { useEffect } from 'react';
import styles from '../../styles/store.module.css';
import ItemCard from '../../components/shop/ItemCard';
import { GetItems } from '../../stores/actions/shopItemsActions';
import { useDispatch } from 'react-redux';

export default function StoreIndex() {

    const dispatcher = useDispatch();

    useEffect(() => {
        GetItems(dispatcher);
    }, [])

    return (
        <div>
            <div className={styles.shop_container}>
                <div className={styles.shop_header}>
                    <h1>Undetected cheats</h1>
                    <p>Purchase our premium undetected cheats</p>
                </div>
                <div className={styles.shop_items}>
                    <ItemCard cover_image={"/test-banner.jpg"} name={"Test Item"} description={"10 months of premium something"} price={"50"} currency={"CAD"} id={"bs-id"} />
                </div>
            </div>
        </div>
    )
}