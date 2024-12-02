import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for making API requests

const Login = ({ onLogin }) => {
    const api = process.env.REACT_APP_BACKEND_API;
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(""); // To display any login errors
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
            setError("Both fields are required.");
            return;
        }

        try {
            // Make a POST request to your Django backend API for login
            const response = await axios.post(`${api}/api/login/`, credentials, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                // Store the JWT token in localStorage (you can also use sessionStorage)
                localStorage.setItem("token", response.data.access); // Assuming the API returns a JWT token as 'access'

                // Call onLogin function to update the app state (optional)
                onLogin({ username: credentials.username });

                // Redirect to the dashboard
                navigate("/dashboard");
            } else {
                setError("Invalid username or password.");
            }
        } catch (err) {
            // Handle any errors during login
            console.error("Login error:", err);
            setError(
                err.response
                    ? err.response.data.detail || "Something went wrong."
                    : "Error occurred."
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back!
                </h2>

                {/* Display error message */}
                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center mt-6 text-gray-600">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-indigo-600 font-medium hover:underline cursor-pointer"
                    >
                        Register Here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
