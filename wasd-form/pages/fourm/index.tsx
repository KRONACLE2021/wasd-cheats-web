import React, { useState, useEffect } from 'react';
import CategoryContainer from '../../components/fourm/CategoryContainer';
import TopicCard from '../../components/fourm/TopicCard';
import styles from '../../styles/fourms.module.css';
import FourmRoot from '../../components/fourm/FourmRoot';
import { FetchTopicsByCategory } from '../../stores/actions/topicActions';
import { FetchCategorys } from '../../stores/actions/categoryActions';
import { useDispatch, useSelector } from 'react-redux';

const FourmHome: React.FC<any> = () => {

    const dispatch = useDispatch();

    const categorys = useSelector(state => state.categorys.categorys);
  
    useEffect(() => {
        FetchCategorys(dispatch);
    }, []);

    return (
        <>

            <FourmRoot header={
                 <h1 className={styles.header}>Fourms</h1>
            }>
                <div className={styles.fourm_content}>
                    {categorys.map((c) => {
                        return <> 
                            <CategoryContainer name={c.title} id={c.id} key={c.id}>

                            </CategoryContainer>
                            <div className={styles.top_spacer}></div>
                        </>
                    })}
                </div>

            </FourmRoot>
        
        </>
    );
}

export default FourmHome;