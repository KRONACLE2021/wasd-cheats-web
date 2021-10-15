import axios from 'axios';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminDashboardRoot from '../../../../components/admin/AdminDashboardRoot';
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

    const [file, setFile] = useState<{selectedFile: null | File }>({ selectedFile: null });
    const [download, setDownload] = useState({});
    const [releaseData, setReleaseData] = useState("");
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


    const uploadRelease = async () => {

        if(!releaseData.version) return setError("Your release must have a version, please format it like: 0.0.0");
        if(!file.selectedFile) return setError("Your release must have a file attached!");

        const formData = new FormData();

        formData.append("file", file.selectedFile, file.selectedFile.name);
        formData.append("id", id);
        formData.append("version", releaseData.version);
        formData.append("notes", releaseData.release_notes);

        await axios.post(`${API}/${RELEASE_NEW_DOWNLOAD}`, formData, {
            headers: {
                Authorization: userStore.api_key,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

    }

    if(isLoading) return <Preloader />;

    if(fullPageError !== "") return <FullPageError error={fullPageError} code={404}></FullPageError>


    return (
        <div>
            <AdminDashboardRoot>
                <div className={styles.dashboard_container}>
                    <div>
                        <h1>Create a new release for {download.name}</h1>
                        <p>Version</p>
                        <input onChange={(e) => setReleaseData({ ...releaseData, version: e.target.value})} className={styles.admin_input} placeholder={"Version"} />
                        <p>Release Notes </p>
                        <textarea onChange={(e) => setReleaseData({ ...releaseData, release_notes: e.target.value})} placeholder={"Release Notes"} className={styles.admin_input}></textarea>

                        {/* uploader */}
                        <div className={styles.spacer}> </div>
                        <div className={`file-uploader_container`}>
                        <input className="file-uploader_input" onChange={onFileChange} type="file" />
                            {file.selectedFile !== null ? <> 
                                <div>
                                    <p>Your uploaded file (Click to change): </p>
                                    <p>{file.selectedFile.name}</p>
                                </div>
                            </> : (
                                <>
                                    <div>
                                        <p><span style={{fontWeight: "600"}}>Click </span> to upload a File/Binary/Executable</p>
                                    </div>
                                </>
                            ) }
                        </div>

                        <button className={styles.button} onClick={() => uploadRelease()}>Upload Release</button>
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}