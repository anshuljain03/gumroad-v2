/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
};

export default nextConfig;
