'use client'

import { useState, useEffect } from 'react';
import AddServiceForm from '@/component/addServiceForm';
import ServiceTable from '@/component/serviceTable';

//style
import './addService.scss';

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function Page() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const handleEdit = (service: Service) => {
    setSelectedService(service);
  };

  const handleServiceUpdate = () => {
    setSelectedService(null);
    fetchServices();
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://ybdigitalx.com/vivi_Adminbackend/service_table.php");
      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Error fetching services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className='addService'>
      {error && <div className='error'>{error}</div>}
      <AddServiceForm selectedService={selectedService} onServiceUpdate={handleServiceUpdate} />
      <ServiceTable services={services} onEdit={handleEdit} refreshServices={fetchServices} />
      {loading && <div className='loading'>Loading services...</div>}
    </div>
  );
}
