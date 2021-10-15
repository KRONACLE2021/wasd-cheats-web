import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin.module.css';
import ModelContainer from '../models/ModelContainer';
import FourmError from '../shared/FourmError';
import Dropdown from '../shared/Dropdown';
import axios from 'axios';
import { API, EDIT_DOWNLOAD } from '../../requests/config';
import router from 'next/router';

const AdminDownloadCard: React.FC<{ 
    id: string,
    name: string, 
    fileIds: Array<string>, 
    subscripton_id: string,  
    description: string, 
    version: string, 
    subscriptions: Array<string>, 
    api_key: string 
}> = ({ name, fileIds, description, version, subscriptions, subscripton_id, id, api_key }) => {
    
    const [editModel, setEditModel] = useState(false);
    const [editBody, setEditBody] = useState({ name: name, description: description, linkedSubscription: subscripton_id});
    const [error, setError] = useState("");

    const editDownload = async () => {
        if(!editBody.name || editBody.name == "") return setError("Please provide a new name for your downlaod");
        if(!editBody.description || editBody.description == "") return setError("Please provide a new description for your downlaod");
        if(!editBody.linkedSubscription || editBody.linkedSubscription == "") return setError("Please provide a new subscription for your downlaod");
        
        await axios.post(`${API}/${EDIT_DOWNLOAD(id)}`, {
            name: editBody.name,
            description: editBody.description,
            linkedSubscription: editBody.linkedSubscription
        }, {
            headers: { Authorization: api_key }
        }).then(res => {
            if(!res.data.error){
                  setEditModel(false);
            } else {
                setError(res.data.errors);
            }
        }).catch(err => {
            console.log(err);
            setError("Axios error! please reload the page, if this issue persists contact a developer.")
        });
    }


    return (
        <>
            <ModelContainer isActive={editModel} setModelActive={setEditModel}>
                <div className={styles.model_popup_container}>
                    <h1>Editing {name}</h1>
                    {error !== "" ? (
                        <FourmError error={"Error!"} errorDescription={error} />
                    ) : "" }
                    <div>
                        <p>Name</p>
                        <input value={editBody.name} placeholder={"Download Name"} onChange={(e) => setEditBody({ ...editBody, name: e.target.value })} className={styles.admin_input}/>   
                    </div>
                    <div>
                        <p>Description</p>
                        <input value={editBody.description} placeholder={"Download Description"} onChange={(e) => setEditBody({ ...editBody, description: e.target.value })} className={styles.admin_input}/>   
                    </div>
                    <div>
                        <p>Linked Subscription</p>
                        <Dropdown default_state={subscripton_id} choices={subscriptions.map(i => { return { name: i.name, data: i.id} })} output={(choice) => setEditBody({ ...editBody, linkedSubscripton: choice })} />
                    </div>
                    <button onClick={() => editDownload()} style={{ marginTop: "15px"}} className={styles.button}>Create Download</button>
                </div>    
            </ModelContainer>
            <div className={styles.admin_download_card}>
                <h2>{name}</h2>
                <p>{description}</p>
                <p>Current active release: {version ? version : "This product does not have a relesae!"}</p>
                <button className={styles.button} onClick={() => setEditModel(true)}>Edit</button>
                <button className={styles.button} style={{ marginLeft: "10px"}} onClick={() => router.push(`/admin/downloads/${id}/new`)} >New release</button>
                <button className={styles.button} style={{ marginLeft: "10px"}}>Delete</button>
            </div>
        </>
    )
}

export default AdminDownloadCard;