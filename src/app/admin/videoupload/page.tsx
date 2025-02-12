"use client";

import React, { useState } from "react";
import InputComponent from "@/component/inputComponent";
import TextAreaComponent from "@/component/textAreaComponent";
import FileComponent from "@/component/fileComponent";

//style
import "./videoUpload.scss";

export default function Page() {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        contents: "",
        imageFile: null as File | null,
        videoFile: null as File | null,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "price" && !/^\d*$/.test(value)) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (file: File | null, type: "imageFile" | "videoFile") => {
        setFormData((prev) => ({
            ...prev,
            [type]: file,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("contents", formData.contents);
        
        if (formData.imageFile) {
            formDataToSend.append("image", formData.imageFile);
        }
        if (formData.videoFile) {
            formDataToSend.append("video", formData.videoFile);
        }

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/video_upload.php", {
                method: "POST",
                body: formDataToSend,
            });

            const data = await response.json();
            if (data.status === "success") {
                setMessage("Video uploaded successfully!");
                setFormData({
                    title: "",
                    price: "",
                    contents: "",
                    imageFile: null,
                    videoFile: null,
                });
            } else {
                setMessage("Error while uploading video.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="videoUpload">
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="inputComponents">
                        <div className="formGroup">
                            <label className="font-inter" htmlFor="title">
                                Title
                            </label>
                            <InputComponent name="title" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="formGroup">
                            <label className="font-inter" htmlFor="price">
                                Price
                            </label>
                            <InputComponent name="price" value={formData.price} onChange={handleChange} />
                        </div>
                        <div className="formGroup">
                            <label className="font-inter" htmlFor="contents">
                                Contents
                            </label>
                            <TextAreaComponent name="contents" value={formData.contents} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="files">
                        <FileComponent label="Video" accept="video/*" onFileChange={(file) => handleFileChange(file, "videoFile")} />
                        <FileComponent label="Image" accept="image/*" onFileChange={(file) => handleFileChange(file, "imageFile")} />
                    </div>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Save"}
                </button>
            </form>
            {message && <p className="responseMessage">{message}</p>}
        </div>
    );
}