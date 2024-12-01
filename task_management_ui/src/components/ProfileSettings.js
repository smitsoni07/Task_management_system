import React, { useState } from 'react';
import axios from 'axios';
const api = process.env.REACT_APP_BACKEND_API

const ProfileSettings = ({ user, apiEndpoint = `${api}/api/profile/` }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        existingPassword: '',
        newPassword: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setLoading(true);

        // Password validation
        if (formData.newPassword && !formData.existingPassword) {
            setErrorMessage('Please enter your existing password to set a new one.');
            setLoading(false);
            return;
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
            setErrorMessage('New password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        const updatedProfile = {
            username: formData.username,
            email: formData.email,
            existing_password: formData.existingPassword,
            new_password: formData.newPassword,
        };

        try {
            const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage
            const response = await axios.put(apiEndpoint, updatedProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Handle the response
            setSuccessMessage(response.data.message || 'Profile updated successfully!');
            setFormData({
                ...formData,
                existingPassword: '',
                newPassword: '',
            }); // Clear password fields after successful update
        } catch (err) {
            const error = err.response?.data?.detail || 'Failed to update profile.';
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Profile Settings</h2>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg"
            >
                {/* Username Field */}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Existing Password Field */}
                <div className="mb-4">
                    <label htmlFor="existingPassword" className="block text-gray-700 font-medium">
                        Existing Password
                    </label>
                    <input
                        type="password"
                        id="existingPassword"
                        name="existingPassword"
                        value={formData.existingPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* New Password Field */}
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-gray-700 font-medium">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>

            {/* Success Message */}
            {successMessage && (
                <div className="text-green-600 text-center mt-4 font-semibold">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="text-red-600 text-center mt-4 font-semibold">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
