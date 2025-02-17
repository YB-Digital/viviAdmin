"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Stil dosyası
import "./serviceTable.scss";

interface Service {
    id: number;
    image: string;
    name: string;
    description: string;
}

export default function ServiceTable() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetch("https://ybdigitalx.com/vivi_backend/list_service.php")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data.");
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setServices(data);
                } else {
                    setError("Invalid data format received.");
                }
            })
            .catch((err) => {
                console.error("Error fetching services:", err);
                setError("Error fetching data.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (serviceId: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        fetch("https://ybdigitalx.com/vivi_backend/delete_service.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: serviceId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setServices((prev) => prev.filter((service) => service.id !== serviceId));
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
                        <div className="column serviceName">{service.name}</div>
                        <div className="column description">{service.description}</div>
                        <div className="column actions">
                            <button className="editBtn">
                                <FaEdit />
                            </button>
                            <button className="deleteBtn" onClick={() => handleDelete(service.id)}>
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
