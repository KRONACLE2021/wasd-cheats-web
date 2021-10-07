import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import styles from '../../styles/store.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart } from '../../stores/actions/userCartActions';

const CartItemLongCard: React.FC<any> = ({ item, remove }) => {

    return (
        <div className={styles.cart_long_card_container}>
            <div>
                <h2>{item.name}</h2>
                <p>${item.price}</p>    
            </div>
            <div className={styles.cart_cart_icons}>
                <FontAwesomeIcon onClick={() => remove(item)} icon={faTrash} />
            </div>
        </div>
    )
} 

export default CartItemLongCard;