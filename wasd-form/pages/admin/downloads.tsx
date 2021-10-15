import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import AdminDashboardRoot from '../../components/admin/AdminDashboardRoot';
import ModelContainer from '../../components/models/ModelContainer';
import Preloader from '../../components/shared/Preloader';
import styles from '../../styles/admin.module.css';
import Dropdown from '../../components/shared/Dropdown';
import Requester from '../../requests/Requester';
import FourmError from '../../components/shared/FourmError';
import { useDispatch, useSelector } from 'react-redux';
import { AdminGetAllDownloads, getShopSubscriptions } from '../../stores/actions/adminActions';
import { API, CREATE_NEW_DOWNLOAD } from '../../requests/config';
import AdminDownloadCard from '../../components/admin/AdminDownloadCard';

const Requester_ = new Requester(API);

export default function AdminPanel() {
    const [isLoading, setLoading] = useState(true);
    const [createDownloadModelActive, setCreateDownloadModelActive] = useState<boolean>(false); 
    const [createDownloadBody, setCreateDownloadBody] = useState<{ name: string, description: string, linkedSubscripton: string }>({ name: "", description: "", linkedSubscripton: "" });
    const [formError, setFormError] = useState("");

    const dispatch = useDispatch();

    let userStore = useSelector(state => state.user.user);
    let adminSubscriptions = useSelector(state => state.adminStore.subscriptions);
    let downloads = useSelector(state => state.adminStore.downloads);

    const fetchAdminInfo = () => {
        dispatch(getShopSubscriptions(userStore.api_key));
        dispatch(AdminGetAllDownloads(userStore.api_key));
        setLoading(false);
    }

    useEffect(() => {
        if(userStore){
            if(userStore.username){
                console.log(userStore);
                if(userStore.permissions.includes("ADMINISTRATOR")) {
                    fetchAdminInfo();
                } else {
                    Router.push("/fourm")  
                }
            }
        } 
    }, [userStore]);


    const createDownload = () => {

        setFormError("");
        if(!createDownloadBody.name || createDownloadBody.name == "") return setFormError("Please provide a name for your download!");
        if(!createDownloadBody.description || createDownloadBody.description == "") return setFormError("Please provide a description for your download!");
        if(!createDownloadBody.linkedSubscripton || createDownloadBody.linkedSubscripton == "") return setFormError("Please provide a linked subscription for your download!");

        
        Requester_.makePostRequest(CREATE_NEW_DOWNLOAD, 
            createDownloadBody, {
            queryStringParams: [],
            headers: {
                Authorization: userStore.api_key
            }
        }).then(res => {
            if(res.error){
                setFormError(res.errors[0]);
            } else{
                setCreateDownloadModelActive(false);
            }
            
        }).catch(err => {
            setFormError(err.errors[0]);
        });
    }

    if(isLoading) return <Preloader />;

    return (
        <div>
            <ModelContainer isActive={createDownloadModelActive} setModelActive={setCreateDownloadModelActive}>
                <div className={styles.model_popup_container}>
                    <h1>Create a new download</h1>
                    {formError !== "" ? (
                        <FourmError error={"Error!"} errorDescription={formError} />
                    ) : "" }
                    <div>
                        <p>Name</p>
                        <input placeholder={"Download Name"} onChange={(e) => setCreateDownloadBody({ ...createDownloadBody, name: e.target.value })} className={styles.admin_input}/>   
                    </div>
                    <div>
                        <p>Description</p>
                        <input placeholder={"Download Description"} onChange={(e) => setCreateDownloadBody({ ...createDownloadBody, description: e.target.value })} className={styles.admin_input}/>   
                    </div>
                    <div>
                        <p>Linked Subscription</p>
                        <Dropdown choices={adminSubscriptions.map(i => { return { name: i.name, data: i.id} })} output={(choice) => setCreateDownloadBody({ ...createDownloadBody, linkedSubscripton: choice })} />
                    </div>
                    <button onClick={() => createDownload()} style={{ marginTop: "15px"}} className={styles.button}>Create Download</button>
                </div>    
            </ModelContainer>
            <AdminDashboardRoot>
                <div className={styles.dashboard_container}>
                    <h1>Manage your downloads</h1>
                    <div>
                        <button className={styles.button}>Create new download</button>
                    </div>
                    <div>
                        {downloads.map((i: any) => {
                            return <AdminDownloadCard
                                id={i.id} 
                                name={i.name} 
                                fileIds={i.file_ids} 
                                description={i.description} 
                                version={i.version} 
                                subscripton_id={i.linkedSubscription}
                                subscriptions={adminSubscriptions} 
                                api_key={userStore.api_key} 
                            />
                        })}
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}