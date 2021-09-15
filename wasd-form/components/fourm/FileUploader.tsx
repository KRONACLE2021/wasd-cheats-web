import React, { useState } from 'react'
import { JsxChild, JsxElement } from 'typescript';

let allowedFileTypes = [
    "image/png", 
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/bmp",
    "image/x-icon"
];

const FileUploader : React.FC<any> = ({ reccomended_size, uploadType, data })  => {
    const [file, setFile] = useState<{selectedFile: null | File }>({ selectedFile: null });
    const [fileUrl, setFileUrl] = useState<any>("");

    const onFileChange = e => {
        console.log("[WASD Uploader] Got file user wants to upload");
        if(!allowedFileTypes.includes(e.target.files[0].type)){
            //in update change this to a nicely formed error!
            console.log("[WASD Uploader] Error! Mimetype does not match an allowed mimetype");
            alert("Invalid file type!");
        } else {
            setFile({ selectedFile: e.target.files[0] });
            setFileUrl(URL.createObjectURL(e.target.files[0]))
        }
    
    };

    const uploadFile = () => {
        console.log("[WASD Uploader] Uploading file..");

    }
    
    return (
        <div className="file-uploader_container">
            <input className="file-uploader_input" type="file" onChange={onFileChange} />
            {fileUrl !== "" ? <> 
                <p>Your uploaded file (Click to change): </p>
                <img src={fileUrl} style={{ height: "100px", width: "100%", objectFit: "scale-down"}}></img> 
                <p>{file.selectedFile.name}</p>
            </> : (
                <>
                    <img src={"/upload_file.png"} style={{ height: "75px", marginTop: "10px"}} alt={"Upload a file"} />
                    <p><span style={{fontWeight: "600"}}>Click </span> to upload a {uploadType}</p>
                    <p>Reccomended size: {reccomended_size}</p>
                </>
            ) }
        </div>
    )
}

export default FileUploader;