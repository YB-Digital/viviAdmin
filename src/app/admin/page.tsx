'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import InputComponent from '@/component/inputComponent';

//style
import './profile.scss';

export default function Page() {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const router = useRouter(); 

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    if (typeof window === "undefined") return;
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('https://ybdigitalx.com/vivi_Adminbackend/profile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ userId }).toString(),
      });

      const data = await response.text();
      const profileData = data.split('|');

      if (profileData.length >= 4) {
        setFormData({
          name: profileData[0] || '',
          surname: profileData[1] || '',
          email: profileData[2] || '',
          phone: profileData[3] || ''
        });
      } else {
        console.error('Unexpected profile data format:', data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    if (typeof window === "undefined") return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('https://ybdigitalx.com/vivi_Adminbackend/profile_update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          userId,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
        }).toString(),
      });

      const result = await response.text();
      if (result === 'success') {
        setIsEditable(false); 
        fetchProfileData(); 
      } else {
        alert('Error updating profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const toggleEdit = () => {
    if (isEditable) {
      handleSave();
    } else {
      setIsEditable(true);
    }
  };

  return (
    <div className="profilePage">
      <h3 className="font-montserrat">My Profile</h3>

      <form>
        <div className="information">
          <h4 className="font-inter">Profile Information</h4>
          <p className="font-inter editButton" onClick={toggleEdit}>
            {isEditable ? 'Save' : 'Edit'}
          </p>
        </div>

        <div className="formGroup">
          <label htmlFor="name" className="font-inter">Name:</label>
          <InputComponent
            name="name"
            value={formData.name}
            placeholder="Enter your name"
            disabled={!isEditable}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="surname" className="font-inter">Surname:</label>
          <InputComponent
            name="surname"
            value={formData.surname}
            placeholder="Enter your surname"
            disabled={!isEditable}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="email" className="font-inter">Email:</label>
          <InputComponent
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            disabled={!isEditable}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="phone" className="font-inter">Phone number:</label>
          <InputComponent
            name="phone"
            value={formData.phone}
            placeholder="Enter your phone number"
            disabled={!isEditable}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </form>
    </div>
  );
}
