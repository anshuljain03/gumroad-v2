import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // Clear user session storage
        localStorage.removeItem('token');  // Adjust this if you use different or multiple keys
        localStorage.removeItem('user');  // For user details, if stored

        // Redirect to the home page
        router.push('/');
    }, [router]);

    return (
        <div>Logging out...</div>
    );
};

export default Logout;
