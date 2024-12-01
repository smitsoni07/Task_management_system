import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for making API requests

const Login = ({ onLogin }) => {
    const api = process.env.REACT_APP_BACKEND_API
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(''); // To display any login errors
    const navigate = useNavigate();


    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks (optional)
        if (!credentials.username || !credentials.password) {
            setError('Both fields are required.');
            return;
        }

        try {
            // Make a POST request to your Django backend API for login
            const response = await axios.post(`${api}/api/login/`, credentials, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                // Store the JWT token in localStorage (you can also use sessionStorage)
                localStorage.setItem('token', response.data.access); // Assuming the API returns a JWT token as 'access'

                // Call onLogin function to update the app state (optional)
                onLogin({ username: credentials.username });

                // Redirect to the dashboard
                navigate('/dashboard');
            } else {
                setError('Invalid username or password.');
            }
        } catch (err) {
            // Handle any errors during login
            console.error('Login error:', err);
            setError(err.response ? err.response.data.detail || 'Something went wrong.' : 'Error occurred.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6">
                {/* Display error message */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                >
                    Login
                </button>
                <p className="text-sm text-center mt-4">
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        className="text-blue-500 cursor-pointer underline"
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
