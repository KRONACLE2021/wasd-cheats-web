import React, { useState, useEffect } from 'react';
import CategoryContainer from '../../components/fourm/CategoryContainer';
import TopicCard from '../../components/fourm/TopicCard';
import styles from '../../styles/fourms.module.css';
import FourmRoot from '../../components/fourm/FourmRoot';
import { FetchTopicsByCategory } from '../../stores/actions/topicActions';
import { FetchCategorys } from '../../stores/actions/categoryActions';
import { useDispatch, useSelector } from 'react-redux';
import ModelContainer from '../../components/models/ModelContainer';

const FourmHome: React.FC<any> = () => {

    const dispatch = useDispatch();
    const userStore = useSelector(state => state.user);

    const [modelIsActive, setModelActive] = useState<boolean>(false);
    
    const categorys = useSelector(state => state.categorys.categorys);
  
    useEffect(() => {
        FetchCategorys(dispatch);
    }, []);


    return (
        <>
            <ModelContainer isActive={modelIsActive}>
                <h1>Create a new topic</h1>

            </ModelContainer>

            <FourmRoot header={
                 <h1 className={styles.header}>Fourms</h1>
            }>
                <div className={styles.fourm_content}>
                    {categorys.map((c) => {
                        return <> 
                            <CategoryContainer toggleAddModel={setModelActive} isAdmin={userStore.permissions ? userStore.permissions.includes("MODERATOR") : false} name={c.title} id={c.id} key={c.id} />
                            <div className={styles.top_spacer}></div>
                        </>
                    })}
                </div>

            </FourmRoot>
        
        </>
    );
}

export default FourmHome;