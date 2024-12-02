import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs'; // Install with: npm install dayjs

const Dashboard = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [taskToUpdate, setTaskToUpdate] = useState(null);
    const [taskToView, setTaskToView] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const api = process.env.REACT_APP_BACKEND_API;
    const API_URL = `${api}/api/tasks/`;

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
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

    // Group tasks by date
    const groupTasksByDate = (tasks) => {
        return tasks.reduce((acc, task) => {
            const date = dayjs(task.due_date).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(task);
            return acc;
        }, {});
    };

    const groupedTasks = groupTasksByDate(tasks);

    // Truncate description for card view
    const truncateText = (text, limit = 100) => {
        if (text.length > limit) {
            return `${text.substring(0, limit)}...`;
        }
        return text;
    };

    // Toggle task completion
    const toggleCompletion = async (id, is_completed) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_URL}${id}/`,
                { is_completed: !is_completed },
                { headers: { Authorization: `Bearer ${token}` } }
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
            setShowUpdateForm(false);
            setTaskToUpdate(null);
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

            {!loading && !error && (
                <div>
                    {Object.keys(groupedTasks)
                        .sort()
                        .map(date => (
                            <div key={date} className="mb-6">
                                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                                    {dayjs(date).format('MMM D, YYYY')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupedTasks[date].map(task => (
                                        <div
                                            key={task.id}
                                            className={`border rounded-lg p-4 shadow-md ${task.is_completed ? 'bg-green-100' : 'bg-white'}`}
                                        >
                                            <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                                            <p className="text-gray-600 mb-2">
                                                {truncateText(task.description)}
                                            </p>
                                            {task.description.length > 100 && (
                                                <button
                                                    onClick={() => {
                                                        setTaskToView(task);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="text-blue-500 text-sm"
                                                >
                                                    View More
                                                </button>
                                            )}
                                            <p className="text-sm text-gray-500">Due: {dayjs(task.due_date).format('MMM D, YYYY')}</p>
                                            {task.last_updated && (
                                                <p className="text-xs text-gray-400">
                                                    Last Updated: {dayjs(task.last_updated).format('MMM D, YYYY h:mm A')}
                                                </p>
                                            )}
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => toggleCompletion(task.id, task.is_completed)}
                                                    className={`py-1 px-3 rounded-md ${task.is_completed
                                                        ? 'bg-gray-500 text-white'
                                                        : 'bg-green-500 text-white'
                                                        }`}
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
                            </div>
                        ))}
                </div>
            )}

            {tasks.length === 0 && !loading && (
                <p className="text-center text-gray-500 mt-6">No tasks found. Start by adding some tasks!</p>
            )}

            {/* View More Modal */}
            {showViewModal && taskToView && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">{taskToView.title}</h2>
                        <p className="mb-4 text-gray-600">{taskToView.description}</p>
                        <p className="text-sm text-gray-500">
                            Due: {dayjs(taskToView.due_date).format('MMM D, YYYY')}
                        </p>
                        {taskToView.last_updated && (
                            <p className="text-xs text-gray-400">
                                Last Updated: {dayjs(taskToView.last_updated).format('MMM D, YYYY h:mm A')}
                            </p>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Task Form */}
            {showUpdateForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Task</h2>
                        <form onSubmit={handleUpdateTask}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block">
                                    Title
                                </label>
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
                                <label htmlFor="description" className="block">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={taskToUpdate.description}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="due_date" className="block">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="due_date"
                                    name="due_date"
                                    defaultValue={dayjs(taskToUpdate.due_date).format('YYYY-MM-DD')}
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
