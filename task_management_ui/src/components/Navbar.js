import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const api = process.env.REACT_APP_BACKEND_API;
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        onLogout();
        navigate(`${api}`);
    };

    return (
        <nav className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left Side - Branding */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/dashboard"
                        className="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text hover:from-purple-500 hover:to-blue-400 transition duration-300"
                    >
                        Task Manager
                    </Link>

                    {/* Conditionally Rendered Buttons for Larger Screens */}
                    <div className="hidden md:flex items-center space-x-4">
                        {location.pathname === '/dashboard' && (
                            <Link
                                to="/add-task"
                                style={{ textDecoration: 'none' }}
                                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
                            >
                                Add Task
                            </Link>
                        )}
                        {(location.pathname === '/profile' || location.pathname === '/add-task') && (
                            <Link
                                to="/dashboard"
                                style={{ textDecoration: 'none' }}
                                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="focus:outline-none text-gray-300 hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative hidden md:block">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md focus:outline-none"
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
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
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

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden bg-gray-800 text-white">
                    <div className="space-y-2 px-4 py-3">
                        {location.pathname === '/dashboard' && (
                            <Link
                                to="/add-task"
                                style={{ textDecoration: 'none' }}
                                className="block px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                                onClick={toggleMenu}
                            >
                                Add Task
                            </Link>
                        )}
                        {(location.pathname === '/profile' || location.pathname === '/add-task') && (
                            <Link
                                to="/dashboard"
                                style={{ textDecoration: 'none' }}
                                className="block px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                                onClick={toggleMenu}
                            >
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={() => {
                                toggleMenu();
                                navigate('/profile');
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                        >
                            Profile Settings
                        </button>
                        <button
                            onClick={() => {
                                toggleMenu();
                                handleLogout();
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
