import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/users`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }

                    const data = await response.json();
                    setUser(data);
                    setIsLoggedIn(true);
                } catch (error) {
                    setError(error.message);
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        fetchUserData();
    }, []);

    return {isLoggedIn, user};
};

export default useAuth;