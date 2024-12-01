import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for making API requests

const Register = () => {
    const api = process.env.REACT_APP_BACKEND_API
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');  // To store any error messages
    const navigate = useNavigate();

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!formData.username || !formData.email || !formData.password) {
            setError('All fields are required.');
            return;
        }

        try {
            // Sending registration data to the backend API (replace with your API URL)
            const response = await axios.post(`${api}/api/register/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 201) {
                // Registration successful, redirect to login page
                navigate('/login');
            } else {
                setError('Failed to register. Please try again.');
            }
        } catch (err) {
            // Handle any errors (e.g., server errors, duplicate email/username)
            console.error('Error during registration:', err);
            setError(err.response ? err.response.data.detail || 'Something went wrong.' : 'Error occurred.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
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
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
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
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
