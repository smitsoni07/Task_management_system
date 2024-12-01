import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [taskToUpdate, setTaskToUpdate] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const api = process.env.REACT_APP_BACKEND_API
    const API_URL = `${api}/api/tasks/`; // Replace with your API endpoint

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token'); // Retrieve JWT token
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to headers
                },
            });
            setTasks(response.data); // Assuming the API returns a list of tasks
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Toggle task completion
    const toggleCompletion = async (id, is_completed) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_URL}${id}/`,
                { is_completed: !is_completed },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setTasks(tasks.map(task => (task.id === id ? response.data : task)));
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task.');
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter(task => task.id !== id));
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task.');
        }
    };

    // Submit the updated task
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedTask = {
                ...taskToUpdate,
                title: e.target.title.value,
                description: e.target.description.value,
                due_date: e.target.due_date.value,
            };

            const response = await axios.put(`${API_URL}${updatedTask.id}/`, updatedTask, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(tasks.map(task => (task.id === updatedTask.id ? response.data : task)));
            setShowUpdateForm(false); // Hide the form after submission
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.username}!</h2>

            {loading && <p className="text-center text-gray-500">Loading tasks...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <div key={task.id} className={`border rounded-lg p-4 shadow-md ${task.is_completed ? 'bg-green-100' : 'bg-white'}`}>
                        <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                        <p className="text-gray-600 mb-2">{task.description}</p>
                        <p className="text-sm text-gray-500">Due: {task.due_date}</p>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => toggleCompletion(task.id, task.is_completed)}
                                className={`py-1 px-3 rounded-md ${task.is_completed ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'}`}
                            >
                                {task.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="py-1 px-3 rounded-md bg-red-500 text-white"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setTaskToUpdate(task);
                                    setShowUpdateForm(true);
                                }}
                                className="py-1 px-3 rounded-md bg-yellow-500 text-white"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length === 0 && !loading && <p className="text-center text-gray-500 mt-6">No tasks found. Start by adding some tasks!</p>}

            {/* Update Task Form (Modal) */}
            {showUpdateForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Update Task</h2>
                        <form onSubmit={handleUpdateTask}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    defaultValue={taskToUpdate.title}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={taskToUpdate.description}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="due_date" className="block">Due Date</label>
                                <input
                                    type="date"
                                    id="due_date"
                                    name="due_date"
                                    defaultValue={taskToUpdate.due_date}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateForm(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
