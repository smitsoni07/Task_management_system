// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Dashboard from './components/Dashboard';
// import ProfileSettings from './components/ProfileSettings';
// import Login from './components/Login';
// import Register from './components/Register';
// import AddTask from './components/AddTask';

// const App = () => {
//     const [user, setUser] = useState(null);
//     const [tasks, setTasks] = useState([]);

//     const handleLogin = (userData) => {
//         setUser(userData); // Set logged-in user
//     };
//     const addTask = (newTask) => {
//         setTasks([...tasks, newTask]);
//     };

//     const handleLogout = () => {
//         setUser(null); // Clear user session
//     };

//     return (
//         <Router>
//             {user && <Navbar user={user} onLogout={handleLogout} />}
//             <Routes>
//                 {!user ? (
//                     <>
//                         <Route path="/" element={<Login onLogin={handleLogin} />} />
//                         <Route path="/register" element={<Register />} />
//                     </>
//                 ) : (
//                     <>
//                         <Route path="/dashboard" element={<Dashboard user={user} />} />
//                         <Route path="/add-task" element={<AddTask onAddTask={addTask} />} />
//                         <Route path="/profile" element={<ProfileSettings user={user} />} />
//                     </>
//                 )}
//             </Routes>
//         </Router>
//     );
// };

// export default App;





import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProfileSettings from './components/ProfileSettings';
import Login from './components/Login';
import Register from './components/Register';
import AddTask from './components/AddTask';

const App = () => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    // Handle user login
    const handleLogin = (userData) => {
        setUser(userData); // Set logged-in user
    };

    // Handle adding a new task
    const addTask = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    // Handle user logout
    const handleLogout = () => {
        setUser(null); // Clear user session
    };

    return (
        <Router>
            {user && <Navbar user={user} onLogout={handleLogout} />}
            <Routes>
                {/* Public Routes */}
                {!user ? (
                    <>
                        <Route path="/" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    <>
                        {/* Private Routes */}
                        <Route path="/dashboard" element={<Dashboard user={user} tasks={tasks} />} />
                        <Route path="/add-task" element={<AddTask onAddTask={addTask} />} />
                        <Route path="/profile" element={<ProfileSettings user={user} />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default App;

