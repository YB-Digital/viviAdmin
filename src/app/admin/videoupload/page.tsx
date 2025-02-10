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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data:", formData);
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
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}