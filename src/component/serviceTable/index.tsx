'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image"; // Import Next.js Image component

import "./serviceTable.scss";

interface Service {
    id: string;
    image: string;
    name: string;
    description: string;
}

interface ServiceTableProps {
    services: Service[];
    refreshServices: () => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services, refreshServices }) => {
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (error) {
            console.error("ServiceTable Error:", error);
        }
    }, [error]);

    const handleEditClick = (service: Service) => {
        setSelectedService(service);
        setTitle(service.name);
        setContents(service.description);
        setPreviewImage(`https://ybdigitalx.com/${service.image}`);
        setEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedService || !title.trim() || !contents.trim()) {
            setError("Valid title and contents are required for update.");
            return;
        }

        const formData = new FormData();
        formData.append("id", selectedService.id);
        formData.append("title", title);
        formData.append("contents", contents);

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_backend/update_service.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.status === "success") {
                refreshServices();
                setEditModalOpen(false);
                setSelectedService(null);
                setError(null);
            } else {
                setError(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error("Error updating service:", err);
            setError("Error updating service.");
        }
    };

    const handleDelete = async (serviceId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (!confirmDelete) return;

        try {
            const response = await fetch("https://ybdigitalx.com/vivi_backend/delete_service.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: serviceId }),
            });

            const data = await response.json();
            if (data.status === "success") {
                refreshServices();
            } else {
                setError(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error("Error deleting service:", err);
            setError("Error deleting service.");
        }
    };

    const truncateText = (text: string, maxLength: number): string => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="serviceTable">
            {error && <div className="error">{error}</div>}
            <div className="titleRow">
                <div className="column no">No.</div>
                <div className="column image">Image</div>
                <div className="column serviceName">Service Name</div>
                <div className="column description">Description</div>
                <div className="column actions">Actions</div>
            </div>

            {services.map((service, index) => (
                <div key={service.id} className="serviceRow">
                    <div className="column no">{index + 1}</div>
                    <div className="column image">
                        <img
                            src={`https://ybdigitalx.com/${service.image}`}
                            alt={service.name}
                        />
                    </div>
                    <div className="column serviceName" title={service.name}>
                        {truncateText(service.name, 10)}
                    </div>
                    <div className="column description" title={service.description}>
                        {truncateText(service.description, 20)}
                    </div>
                    <div className="column actions">
                        <button className="editBtn" onClick={() => handleEditClick(service)} title="Edit">
                            <FaEdit />
                        </button>
                        <button className="deleteBtn" onClick={() => handleDelete(service.id)} title="Delete">
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}

            {editModalOpen && selectedService && (
                <div className="editModal">
                    <div className="modalContent">
                        <h3>Edit Service</h3>
                        <label>Title:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <label>Description:</label>
                        <textarea value={contents} onChange={(e) => setContents(e.target.value)} />
                        <label>Current Image:</label>
                        <img src={previewImage} alt="Preview" width={100} height={100} />
                        <label>Upload New Image:</label>
                        <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const files = e.target.files;
                            if (files && files[0]) {
                                setSelectedFile(files[0]);
                                setPreviewImage(URL.createObjectURL(files[0]));
                            }
                        }} />
                        <div className="modalActions">
                            <button onClick={handleUpdate}>Save</button>
                            <button onClick={() => setEditModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceTable; // Ensure the component is properly exported
