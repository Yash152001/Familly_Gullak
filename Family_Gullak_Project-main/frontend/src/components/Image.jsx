import React, { useState } from 'react';
// import axios from '/';
import { useDropzone } from 'react-dropzone';

const ImageUpload = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (acceptedFiles) => {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append('images', file);
            });

            try {
                const response = await fetch('https://anis-drive-app.onrender.com/api/image/upload', formData, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token: localStorage.getItem("token"),
                    },
                });

                setUploadedImages(response.data.images);
                console.log(response.data.images);
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        },
        multiple: true, // Allow multiple files
    });

    return (
        <div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop some images here, or click to select images</p>
            </div>
            <div>
                {uploadedImages.map((image, index) => (
                    <div key={index}>
                        <img src={image.url} alt={`Image ${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
