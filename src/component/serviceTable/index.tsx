"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Stil dosyası
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

export default function ServiceTable({ services, refreshServices }: ServiceTableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    useEffect(() => {
        setLoading(false);
    }, [services]);

    // Edit Modal Açma
    const handleEditClick = (service: Service) => {
        setSelectedService(service);
        setTitle(service.name);
        setContents(service.description);
        setPreviewImage(service.image);
        setEditModalOpen(true);
    };

    // Güncelleme İşlemi
    const handleUpdate = async () => {
        if (!selectedService || !title || !contents) {
            setError("Valid ID, title, and contents are required for update.");
            return;
        }

        const formData = new FormData();
        formData.append("id", selectedService.id);
        formData.append("title", title);
        formData.append("contents", contents);
      
        try {
            console.log("Güncelleme Gönderilen FormData:", formData);

            const response = await fetch("https://ybdigitalx.com/vivi_backend/update_service.php", {
                method: "POST",
                body: formData,
            });

            const textResponse = await response.text();
            console.log("Güncelleme Yanıtı (Raw):", textResponse);

            try {
                const data = JSON.parse(textResponse);
                console.log("Güncelleme Yanıtı (Parsed JSON):", data);

                if (data.status === "success") {
                    refreshServices();
                    setEditModalOpen(false);
                } else {
                    setError(`Error: ${data.message}`);
                }
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError);
                setError("Invalid JSON response from server.");
            }
        } catch (error) {
            console.error("Update Error:", error);
            setError("Error updating service.");
        }
    };
    // Metni belirli bir uzunluğa göre kesen yardımcı fonksiyon
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
    return (
        <div className="serviceTable">
            {/* Hata Mesajı */}
            {error && <div className="error">{error}</div>}

            {/* Başlık Satırı */}
            <div className="titleRow">
                <div className="column no">No.</div>
                <div className="column image">Image</div>
                <div className="column serviceName">Service Name</div>
                <div className="column description">Description</div>
                <div className="column actions">Actions</div>
            </div>

            {/* Servis Listesi */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : services.length > 0 ? (
                services.map((service, index) => (
                    <div key={service.id} className="serviceRow">
                        <div className="column no">{index + 1}</div>
                        <div className="column image">
                            <img src={service.image} alt={service.name} />
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
                        </div>
                    </div>
                ))
            ) : (
                <div className="noData">No services found.</div>
            )}

            {/* Edit Modal */}
            {editModalOpen && selectedService && (
                <div className="editModal">
                    <div className="modalContent">
                        <h3>Edit Service</h3>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label>Description:</label>
                        <textarea
                            value={contents}
                            onChange={(e) => setContents(e.target.value)}
                        />
                        <label>Current Image:</label>
                        <img src={previewImage} alt="Preview" className="previewImage" />
                        <label>Upload New Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setSelectedFile(e.target.files[0]);
                                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                                }
                            }}
                        />
                        <div className="modalActions">
                            <button onClick={handleUpdate}>Save</button>
                            <button onClick={() => setEditModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
