import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios for making API requests

const AddTask = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const navigate = useNavigate();
    const api = process.env.REACT_APP_BACKEND_API

    // Get the JWT token from localStorage (or sessionStorage)
    const token = localStorage.getItem('token');  // Replace with sessionStorage if needed

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !dueDate) {
            alert('Please fill in all fields');
            return;
        }

        // Prepare the data to send to the backend
        const newTask = {
            title,
            description,    
            due_date: dueDate,
            is_completed: false,
        };

        try {
            // Send the data to your Django backend (update the URL accordingly)
            const response = await axios.post(`${api}/api/tasks/`, newTask, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Add the token to the header
                }
            });

            // Optionally handle the response here (e.g., update UI state)
            if (response.status === 201) {
                // Pass the new task to the parent component (optional)
                onAddTask(response.data);  // If needed, pass the newly created task from the backend

                // Navigate back to the dashboard after successful task creation
                navigate('/dashboard');
            } else {
                alert('Error: Could not create task');
            }
        } catch (error) {
            console.error('There was an error!', error);
            alert('Error: Could not create task');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="dueDate">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;

