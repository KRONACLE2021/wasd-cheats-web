import React, { useState, useEffect } from 'react';
import CategoryContainer from '../../components/fourm/CategoryContainer';
import TopicCard from '../../components/fourm/TopicCard';
import styles from '../../styles/fourms.module.css';
import FourmRoot from '../../components/fourm/FourmRoot';
import { FetchTopicsByCategory } from '../../stores/actions/topicActions';
import { CreateNewCategory, FetchCategorys } from '../../stores/actions/categoryActions';
import { useDispatch, useSelector } from 'react-redux';
import ModelContainer from '../../components/models/ModelContainer';
import Preloader from '../../components/shared/Preloader';
import FullPageError from '../../components/shared/FullpageError';
import FourmError from '../../components/shared/FourmError';

const FourmHome: React.FC<any> = () => {

    const dispatch = useDispatch();
    const userStore = useSelector(state => state.user.user);

    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [formError, setFormError] = useState("");
    const [modelIsActive, setModelActive] = useState<boolean>(false);
    const [createCategoryData, setCreateCategoryData] = useState<{ title: string, description: string }>({ title: "", description: "" });

    const categorys = useSelector(state => state.categorys.categorys);
  
    useEffect(() => {
        
        const fetch = async () => {
            let res = await FetchCategorys(dispatch);
            if(!res.error) {
                setLoading(false);
            } else {
                setError(res.errors);
                setLoading(false);
            }
        } 

        fetch();

    }, []);

    const createNewCategory = () => {
        if(!createCategoryData.title) return setFormError("You havent provided a title for your category!");
        if(!createCategoryData.description) return setFormError("You havent provided a description for your category!");

        dispatch(CreateNewCategory(createCategoryData, userStore.api_key));
    }

    if(isLoading) return <Preloader />; 
    if(error) return <FullPageError code={500} error={error}/>;

    return (
        <>
            <ModelContainer isActive={modelIsActive} setModelActive={setModelActive}>
                <div className={styles.base_model_container} style={{ padding: "15px 20px" }}>
                    <h1>Create a new category</h1>
                    {formError !== "" ? (
                        <FourmError error={"Error submitting!"} errorDescription={formError} />
                    ) : ""}
                    <div>
                        <p>Title</p>
                        <input className={styles.input} onChange={(e) => setCreateCategoryData({ ...createCategoryData, title: e.target.value})} placeholder={"Title"}></input>    
                    </div>
                    <div>
                        <p>Description</p>
                        <input className={styles.input} onChange={(e) => setCreateCategoryData({ ...createCategoryData, description: e.target.value})} placeholder={"Description"}></input>    
                    </div>
                    <div style={{ marginTop: "15px" }} >
                        <button className={styles.delete_button} onClick={() => createNewCategory()}>Create</button>
                    </div>
                </div>
            </ModelContainer>
            <FourmRoot header={
                <div>
                    <h1 className={styles.header}>Home</h1>
                    {userStore?.permissions?.includes("MODERATOR") ? (
                        <>
                            <button className={styles.delete_button} onClick={() => setModelActive(true)}>Add A Category</button>
                            <div style={{ marginBottom: "20px"}}></div>
                        </>
                    ) : ""}
                </div>
            }>
                <div className={styles.fourm_content}>
                    {categorys.map((c) => {
                        return <> 
                            <CategoryContainer 
                                toggleAddModel={setModelActive} 
                                isAdmin={userStore.permissions ? userStore.permissions.includes("MODERATOR") : false} 
                                name={c.title} 
                                id={c.id} 
                                key={c.id} 
                            />

                            <div className={styles.top_spacer}></div>
                        </>
                    })}
                </div>

            </FourmRoot>
        
        </>
    );
}

export default FourmHome;