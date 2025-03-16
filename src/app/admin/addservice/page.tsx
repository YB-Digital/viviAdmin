'use client';

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
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true); // ✅ Ensures client-side rendering
    fetchServices();
  }, []);

  const handleServiceUpdate = () => {
    setSelectedService(null);
    fetchServices();
  };

  const fetchServices = async () => {
    if (typeof window === "undefined") return; // ✅ Ensures this runs only in the browser

    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://ybdigitalx.com/vivi_backend/service_table.php");

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const data = await response.json();

      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid API response.");
      }

      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Error fetching services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null; // ✅ Prevents rendering on the server

  return (
    <div className='addService'>
      {error && <div className='error'>{error}</div>}
      <AddServiceForm selectedService={selectedService} onServiceUpdate={handleServiceUpdate} />
      <ServiceTable services={services} refreshServices={fetchServices} />
      {loading && <div className='loading'>Loading services...</div>}
    </div>
  );
}
