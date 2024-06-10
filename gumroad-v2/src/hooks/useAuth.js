import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    var user;

    useEffect(() => {
        const token = localStorage.getItem('token');
        user = JSON.parse(localStorage.getItem('user'));
        // Ideally, here you would also validate the token's integrity and expiration
        setIsLoggedIn(!!token);
    }, []);

    // fetch user data from storage

    return {isLoggedIn, user};
};

export default useAuth;