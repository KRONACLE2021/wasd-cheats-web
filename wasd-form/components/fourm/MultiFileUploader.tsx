import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { API, BASE_IMAGE_URL, USER_FILE_UPLOAD } from '../../requests/config';
import { useSelector } from 'react-redux';


let allowedFileTypes = [
    "image/png", 
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/bmp",
    "image/x-icon"
];

const MultiFileUploader : React.FC<{ 
    reccomended_size: string, 
    uploadType: "icon" | "image", 
    output: (arg: Array<string>) => void, 
    getImage?: (url: string) => void,
    custom_classes: Array<string> | undefined
}> = ({ reccomended_size, uploadType, output, custom_classes, getImage })  => {
    const [file, setFile] = useState<{selectedFiles: Array<{ file: File, url: string}> }>({ selectedFiles: [] });
    const [uploadedAttachemnts, setUploadedAttachemnts] = useState<Array<string>>([]);
    const [error, setError] = useState<string>("");

    const userStore = useSelector(state => state.user);

    const onFileChange = e => {
        console.log("[WASD Uploader] Got file user wants to upload");
        if(!allowedFileTypes.includes(e.target.files[0].type)){
            //in update change this to a nicely formed error!
            console.log("[WASD Uploader] Error! Mimetype does not match an allowed mimetype");
            alert("Invalid file type!");
        } else {
            setFile({ selectedFiles: [...file.selectedFiles, { file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) }] });
            uploadFile(e.target.files[0]);
        }
    
    };

    const uploadFile = async (file_: any) => {
        
        if(uploadedAttachemnts.length == 10) return setError("Reached attachment limit!"); 
        
        console.log("[WASD Uploader] Uploading file...")
        const formData = new FormData();

        formData.append("file", 
            file_, 
            file_.name);

        let result = await axios.post(`${API}/${USER_FILE_UPLOAD}`, formData, {
            headers: {
                authorization: userStore.user.api_key
            }
        }).then((res) => res)
        .catch((err) => err.response);


        if(result.error == true) {
            alert("[AXIOS] Error uploading file: " + result.errors);
        } else {
            setUploadedAttachemnts([ ...uploadedAttachemnts, result.data.attachment_.id ]);
        }
    }

    useEffect(() => {
        console.log(uploadedAttachemnts)
        output(uploadedAttachemnts);
    }, [uploadedAttachemnts])
    
    return (
        <div className={`file-uploader_container ${custom_classes}`}>
            <input className="file-uploader_input" type="file" onChange={onFileChange} />
            {file.selectedFiles.length !== 0 ? <>
                <div>
                    <p>Your files: </p>
                    {uploadedAttachemnts.map(file_ => {
                        return (
                            <div onClick={() => {
                                if(getImage){
                                    console.log("uwu");
                                    getImage(file_)
                                } 
                            }} className={"uploader-file-card"} style={{ float: "left", marginLeft: "10px"}}>
                                <img src={BASE_IMAGE_URL(file_)} style={{ height: "100px", width: "100%", objectFit: "scale-down"}}></img> 
                                <p>Uploaded!</p>
                            </div>
                        )
                    })}
                </div>
            </> : (
                <div>
                    <p className={"file_uploader-smallText"}><span style={{fontWeight: "400", marginBottom: "0px", marginTop: "0px"}}>Click </span> to upload a {uploadType} (Max file uploads: 10)</p>
                    <p className={"file_uploader-size file_uploader-smallText"}>Reccomended size: {reccomended_size}</p>
                </div>
            ) }
        </div>
    )
}

export default MultiFileUploader;