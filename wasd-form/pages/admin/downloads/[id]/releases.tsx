import axios from 'axios';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminDashboardRoot from '../../../../components/admin/AdminDashboardRoot';
import DownloadCard from '../../../../components/settings/DownloadCard';
import FullPageError from '../../../../components/shared/FullpageError';
import Preloader from '../../../../components/shared/Preloader';
import { API, RELEASE_NEW_DOWNLOAD } from '../../../../requests/config';
import { AdminGetAllDownloads } from '../../../../stores/actions/adminActions';
import styles from '../../../../styles/admin.module.css';

export default function AdminPanel() {
    const [isLoading, setLoading] = useState(true);

    const router = useRouter();
    
    const { query: { id } } = router;

    const dispatch = useDispatch();

    let userStore = useSelector((state : any) => state.user.user);
    let downloadStore = useSelector((state : any) => state.adminStore.downloads.filter((i: any) => i.id == id));

    const [download, setDownload] = useState({});
    const [fullPageError, setFullpageError] = useState("");
    const [error, setError] = useState("");

    const onFileChange = e => {
        console.log("[WASD Uploader] Got file user wants to upload");
        setFile({ selectedFile: e.target.files[0] });
    
    };

    const fetchAdminInfo = () => {
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

    useEffect(() => {
        if(downloadStore[0]){
            setDownload(downloadStore[0]);
            setFullpageError("");
        } else {
            setFullpageError("Could not find download!");
        }
    }, [downloadStore]);


    if(isLoading) return <Preloader />;

    if(fullPageError !== "") return <FullPageError error={fullPageError} code={404}></FullPageError>

    return (
        <div>
            <AdminDashboardRoot>
                <div className={styles.dashboard_container}>
                    <h1>Release history for {download?.name}</h1>
                    <div className={styles.dashboard_centered}>
                        <div style={{ width: "100%"}}>

                            {download?.releases?.map((i: any) => {
                                return <DownloadCard 
                                    key={i.name}
                                    name={download?.name}
                                    version={i.version}
                                    description={i.notes}
                                    content_id={i.file_id}
                                    userId={i.user_id}
                                    date={i.date}
                                    id={download?.id}
                                    subscription_status={{ time_left: "Not applicable in this context."}}
                                    api_key={userStore.api_key}
                                />
                            })}
                        </div>
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}