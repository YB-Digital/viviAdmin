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
    onEdit: (service: Service) => void;
    services: Service[];
    refreshServices: () => void;
}

// Metni belirli bir uzunluğa göre kesen yardımcı fonksiyon
const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function ServiceTable({ onEdit, services, refreshServices }: ServiceTableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setLoading(false);
    }, [services]);

    const handleDelete = (serviceId: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        fetch("https://ybdigitalx.com/vivi_backend/delete_service.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: serviceId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    refreshServices();
                } else {
                    setError("Failed to delete the service.");
                }
            })
            .catch(() => setError("Error deleting service."));
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
                            <button className="editBtn" onClick={() => onEdit(service)} title="Edit">
                                <FaEdit />
                            </button>
                            <button className="deleteBtn" onClick={() => handleDelete(service.id)} title="Delete">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="noData">No services found.</div>
            )}
        </div>
    );
}
