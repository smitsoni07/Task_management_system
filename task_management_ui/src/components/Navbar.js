import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const api = process.env.REACT_APP_BACKEND_API
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        onLogout(); // Perform logout logic (e.g., clearing user session)
        navigate(`${api}`); // Redirect to the login page
    };
    

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-center sm:text-xl md:text-2xl lg:text-3xl">
                    Task Manager
                </span>
                
                {/* Conditionally render the Add Task button */}
                {location.pathname === '/dashboard' && (
                    <Link
                        to="/add-task"
                        className="text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 no-underline"
                    >
                        Add-Task
                    </Link>
                )}
                
                {/* Conditionally render the Dashboard button */}
                {location.pathname === '/profile' && (
                    <Link
                        to="/dashboard"
                        className="text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 no-underline"
                    >
                        Dashboard
                    </Link>
                )}

                {location.pathname === '/add-task' && (
                    <Link
                        to="/dashboard"
                        className="text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 no-underline"
                    >
                        Dashboard
                    </Link>
                )}

            </div>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                        <span>{user.username}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
                            <button
                                onClick={() => navigate('/profile')}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Profile Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;