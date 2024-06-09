import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Ideally, here you would also validate the token's integrity and expiration
        setIsLoggedIn(!!token);
    }, []);

    return isLoggedIn;
};

export default useAuth;
