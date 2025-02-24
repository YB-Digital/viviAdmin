'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// style
import './layoutComponent.scss';

// image
import dashboard from '@/image/dahsboard.svg'
import video from '@/image/videoManagament.svg'
import services from '@/image/services.svg'
import logout from '@/image/logOut.svg'
import certificate from '@/image/certificate.svg'

export default function LayoutComponent() {
    const pathname = usePathname();
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(localStorage.getItem('userId'));  

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`https://viviacademy.de/vivi_Adminbackend/getUser.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({ userId }).toString(),
                    });

                    const data = await response.json();

                    if (data.status === 'success') {
                        setUserName(data.userName);
                    } 
                    else {
                        console.error('Failed to fetch user data:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [userId]);  

    const handleLogout = async () => {
        localStorage.removeItem('userId');
        setUserId(null); 
        window.location.reload();
    };

    return (
        <div className="layoutComponent">
            <div className="layoutLinks">
                <Link href='/admin/dashboard' className={pathname === '/admin/dashboard' ? 'active' : ''}>
                    <Image src={dashboard} alt="icon" />
                    <p className="font-inter">Dashboard</p>
                </Link>
                <Link href='/admin/videoupload' className={pathname === '/admin/videoupload' ? 'active' : ''}>
                    <Image src={video} alt="icon" />
                    <p className="font-inter">Video Management</p>
                </Link>
                <Link href='/admin/addcategory' className={pathname === '/profile/addservice' ? 'active' : ''}>
                    <Image src={services} alt="icon" />
                    <p className="font-inter">Category</p>
                </Link>
                <Link href='/admin/addservice' className={pathname === '/profile/addservice' ? 'active' : ''}>
                    <Image src={services} alt="icon" />
                    <p className="font-inter">Services</p>
                </Link>
                <Link href='/admin/certificate' className={pathname === '/profile/services' ? 'active' : ''}>
                    <Image src={certificate} alt="icon" />
                    <p className="font-inter">Certificate</p>
                </Link>
                <button onClick={handleLogout} className="logoutButton">
                    <Image src={logout} alt="icon" />
                    <p className="font-inter">Log Out</p>
                </button>
            </div>
        </div>
    );
}