import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout'; 
const BACKEND_URL=process.env.BACKEND_URL

const ResetPassword = () => {
    const router = useRouter();
    const { resetHash } = router.query;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/api/users/password-reset/${resetHash}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                localStorage.setItem('token', data.token);
                router.push('/home');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Layout>
            <form id="large-form" onSubmit={handleResetPassword}>
                {error && <h3 className="error">Reset your password <small>{error}</small></h3>}
                {success ? (
                    <h3>{success}</h3>
                ) : (
                    <h3>Reset your password <small>And don't worry about forgetting your password, we do too!</small></h3>
                )}
                <p>
                    <input
                        type="text"
                        placeholder="Email Address"
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input style={{ height: '25px' }}
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" style={{ marginTop: '20px' }}>Reset Password and Login</button>
                </p>
                <div className="rainbow bar"></div>
            </form>
            <p id="below-form-p">&nbsp;</p>
        </Layout>
    );
};

export default ResetPassword;
