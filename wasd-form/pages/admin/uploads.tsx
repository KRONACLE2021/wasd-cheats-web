import moment from 'moment';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminDashboardRoot from '../../components/admin/AdminDashboardRoot';
import DashbaordCard from '../../components/admin/DashboardCard';
import Preloader from '../../components/shared/Preloader';
import { IUser } from '../../interfaces';
import { AdminGetAttachments, RemoveAttachment } from '../../stores/actions/adminActions';
import { adminFetchUsers } from '../../stores/actions/userActions';
import styles from '../../styles/admin.module.css';
import WASDTable from '../../components/shared/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ModelContainer from '../../components/models/ModelContainer';
import Requester from '../../requests/Requester';
import { API, DELETE_ATTACHMENT, MASS_DELETE_ATTACHMENTS_ASSIGNEDCONTENT } from '../../requests/config';
import router from 'next/router';

const Requester_ = new Requester(API);

export default function AdminPanel() {
    const [isLoading, setLoading] = useState(true);

    const dispatch = useDispatch();

    let userStore = useSelector(state => state.user.user);
    let attachments = useSelector(state => state.adminStore.attachments);
    const [deleteModel, setDeleteModel] = useState<boolean>(false);
    const [itemDeleting, setItemDeleting] = useState("");
    const [massItemDeleteing, setMassItemDeleting] = useState<boolean>(false);
    const [error, setError] = useState([]);

    const fetchAdminInfo = () => {
        dispatch(AdminGetAttachments(0, 20, userStore.api_key));
    }

    useEffect(() => {
        if(userStore){
            if(userStore.username){
                console.log(userStore);
                if(userStore.permissions.includes("ADMINISTRATOR")) {
                    setLoading(false);
                    fetchAdminInfo();
                } else {
                    Router.push("/fourm")  
                }
            }
        } 
    }, [userStore]);

    const deleteAttachment = (id: string) => {
        Requester_.makePostRequest(DELETE_ATTACHMENT(id), "", {
            headers: {
                Authorization: userStore.api_key
            },
            queryStringParams: []
        }).then((res) => {
            if(res.error) {
                setError(res.errors);
                setItemDeleting("");
                setDeleteModel(false);
            }  else {
                console.log("uwu")
                dispatch(RemoveAttachment(id));
                setItemDeleting("");
                setDeleteModel(false);
            }
        }).catch(err => {
            setError(err.errors);
        }) 
    }


    const deleteImagesWithNoAssignedContent = () => {
        Requester_.makePostRequest(MASS_DELETE_ATTACHMENTS_ASSIGNEDCONTENT, "", {
            headers: {
                Authorization: userStore.api_key
            },
            queryStringParams: []
        }).then(res => {
            if(!res.error){
                router.reload();
            } else {
                setError(res.errors);
            }
        }).catch(err => {
            setError(err.errors);
        })
    }

    if(isLoading) return <Preloader />;

    return (
        <div>
            <ModelContainer isActive={deleteModel} setModelActive={setDeleteModel}>
                <div className={styles.model_popup_container}>
                    <h1>Are you sure you want to delete this attachment?</h1>
                    <p>Deleting an attachment thats assinged to something can cause issues.</p>
                    <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <button className={styles.button} onClick={() => setDeleteModel(false)}>Cancel</button>
                        <button className={`${styles.button} ${styles.button_delete}`} onClick={() => deleteAttachment(itemDeleting)}>Delete</button>
                    </div>
                </div>
            </ModelContainer>
            <ModelContainer isActive={massItemDeleteing} setModelActive={setMassItemDeleting}>
                <div className={styles.model_popup_container}>
                    <h1>WARNING! YOU ARE ABOUT TO MASS DELETE ALL ATTACHMENTS UPLOADED THAT HAVE NO CONTENT ID!</h1>
                    <p>THINK BEFORE YOU DO THIS!!!</p>
                    <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <button className={styles.button} onClick={() => setMassItemDeleting(false)}>Im a pussy</button>
                        <button className={`${styles.button} ${styles.button_delete}`} onClick={() => deleteImagesWithNoAssignedContent()}>Fucking burn those attachments</button>
                    </div>
                </div>
            </ModelContainer>
            <AdminDashboardRoot>
                <div className={styles.dashboard_container}>
                    <h1>Attachment browser:</h1>
                    <button className={styles.button} onClick={() => setMassItemDeleting(true)}>Delete All with no assigned content</button>
                    <div style={{ marginTop: "10px" }}>
                        <p>Displaying {attachments.length} attachments</p>
                        <WASDTable
                            table_colomns={[
                                "Name",
                                "ID",
                                "Uploaded by",
                                "Assigned To",
                                "Size",
                                "Actions"
                            ]}

                            table_data={attachments.map((i: any) => {
                                if(i !== null){
                                    return (
                                        <tr key={i.id}>
                                            <th>{i.name}</th>
                                            <th>{i.id}</th>
                                            <th>{i.uid}</th>
                                            <th>{i.attachedTo}</th>
                                            <th>{i.size}</th>
                                            <th><span onClick={() => {
                                                setItemDeleting(i.id);
                                                setDeleteModel(true);
                                            }}><FontAwesomeIcon icon={faTrash} /></span></th>
                                        </tr>
                                    )
                                } else {
                                   return;
                                }
                            })}
                        ></WASDTable>
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}