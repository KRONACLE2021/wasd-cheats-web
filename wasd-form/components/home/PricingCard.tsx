import React from 'react';
import styles from '../../styles/Home.module.css';

const PricingCard:React.FC<{price: string, description: string, selling_points: Array<string>, name: string, image: string, currency: string}> = ({ price, name, description, image, currency, selling_points}) => {
    return (
        <div className={styles.pricing_card__container}>
            <div>
                <h2 className={styles.pricing_card__title}>{name}</h2>
                <h1 className={styles.pricing_card__price}>${price}/<span className={styles.pricing_card__timeline}>month</span></h1>
                <div style={{marginTop: "-10px"}}>
                    <ul>
                        {selling_points.map((selling_point) => {
                            return <li>{selling_point}</li>
                        })}
                    </ul>
                </div>
            </div>
            <div>
                <button className={styles.pricing_card__buy_btn}>Buy Now!</button>
            </div>
        </div>
    )
}

export default PricingCard;