import React from 'react';
import styles from '../../styles/store.module.css';
import Router from 'next/router';

const ItemCard: React.FC<{ cover_image: string, name: string, description: string, price: string | number, currency: string, id: string }> = (props) => {
    return (
        <div className={styles.item_card_container}>
            <div className={styles.item_info}>
                <h3>{props.name}</h3>
                <h1 className={styles.item_price}>${props.price}<span className={styles.currency}>{props.currency}</span></h1>
                <p>{props.description}</p>
            </div>
            <div>
                <button onClick={() => { Router.push(`/store/item/${props.id}`)}} className={styles.view_item}>View Item</button>
            </div>
        </div>
    )
}

export default ItemCard;