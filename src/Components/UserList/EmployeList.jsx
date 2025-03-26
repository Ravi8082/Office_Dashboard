import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserList.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCalendarCheck, FaClock, FaSearch, FaFilter } from 'react-icons/fa';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceState, setAttendanceState] = useState({});
    const [selectedAttendance, setSelectedAttendance] = useState({});
    const [selectedHours, setSelectedHours] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await axios.get('http://localhost:8081/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setUsers(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching users:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 403) {
                setError('You do not have permission to view employee data.');
            } else {
                setError('Failed to fetch user data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdate = (id) => {
        if (id) {
            navigate(`/update/${id}`);
        } else {
            console.error('User ID is missing or invalid');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8081/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(users.filter(user => user.id !== id));
                alert('Employee deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error.response ? error.response.data : error.message);
                alert('Failed to delete employee. Please try again later.');
            }
        }
    };

    const handleAttendanceClick = (id) => {
        setAttendanceState(prevState => ({
            ...prevState,
            [id]: { showAttendance: !prevState[id]?.showAttendance, showHours: false }
        }));
        setSelectedAttendance(prevState => ({ ...prevState, [id]: null }));
        setSelectedHours(prevState => ({ ...prevState, [id]: null }));
    };

    const handleHoursClick = (id) => {
        setAttendanceState(prevState => ({
            ...prevState,
            [id]: { showHours: !prevState[id]?.showHours, showAttendance: false }
        }));
        setSelectedAttendance(prevState => ({ ...prevState, [id]: null }));
        setSelectedHours(prevState => ({ ...prevState, [id]: null }));
    };

    const handleAttendanceSelect = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8081/attendances', {
                user: { id },
                status,
                date: currentDate
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('Attendance updated successfully');
                setSelectedAttendance(prevState => ({ ...prevState, [id]: status }));
                setAttendanceState(prevState => ({
                    ...prevState,
                    [id]: { showAttendance: false, isAttendanceRecorded: true }
                }));
            } else if (response.status === 409) {
                alert(response.data);
            }
        } catch (error) {
            console.error('Error updating attendance:', error.response ? error.response.data : error.message);
            alert('Failed to update attendance. Please try again later.');
        }
    };

    const handleHoursSelect = async (id, hours) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8081/hours/${id}`, 
                { hours, date: currentDate },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                alert(`Hours updated to ${hours} for ${currentDate} successfully`);
                setSelectedHours(prevState => ({ ...prevState, [id]: hours }));
                setAttendanceState(prevState => ({
                    ...prevState,
                    [id]: { showHours: false, isHoursRecorded: true }
                }));
            } else if (response.status === 409) {
                alert(response.data);
            }
        } catch (error) {
            console.error('Error updating hours:', error.response ? error.response.data : error.message);
            alert('Failed to update hours. Please try again later.');
        }
    };

    const handleDateChange = (e) => {
        setCurrentDate(e.target.value);
        // Reset attendance and hours state when date changes
        setAttendanceState({});
        setSelectedAttendance({});
        setSelectedHours({});
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRoleFilter = (e) => {
        setFilterRole(e.target.value);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === '' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    // Get unique roles for filter dropdown
    const uniqueRoles = [...new Set(users.map(user => user.role))];

    return (
        <div className="employee-list-container">
            <div className="employee-list-header">
                <h1>Employee List</h1>
                <div className="employee-list-actions">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search employees..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="filter-container">
                        <FaFilter className="filter-icon" />
                        <select 
                            value={filterRole} 
                            onChange={handleRoleFilter}
                            className="filter-select"
                        >
                            <option value="">All Roles</option>
                            {uniqueRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="date-container">
                        <input 
                            type="date" 
                            value={currentDate} 
                            onChange={handleDateChange}
                            className="date-input"
                        />
                    </div>
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
                <div className="loading-spinner">Loading employees...</div>
            ) : (
                <div className="employee-table-container">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('name')}>
                                    Name {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'ascending' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => requestSort('email')}>
                                    Email {sortConfig.key === 'email' && (
                                        sortConfig.direction === 'ascending' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => requestSort('mobile')}>
                                    Mobile {sortConfig.key === 'mobile' && (
                                        sortConfig.direction === 'ascending' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => requestSort('role')}>
                                    Role {sortConfig.key === 'role' && (
                                        sortConfig.direction === 'ascending' ? '↑' : '↓'
                                    )}
                                </th>
                                <th>Actions</th>
                                <th>Attendance</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.length > 0 ? (
                                sortedUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.mobile}</td>
                                        <td>
                                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleUpdate(user.id)} className="action-btn edit-btn">
                                                <FaEdit /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="action-btn delete-btn">
                                                <FaTrash /> Delete
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => handleAttendanceClick(user.id)} 
                                                className={`action-btn attendance-btn ${attendanceState[user.id]?.isAttendanceRecorded ? 'recorded' : ''}`}
                                                disabled={attendanceState[user.id]?.isAttendanceRecorded}
                                            >
                                                <FaCalendarCheck /> {attendanceState[user.id]?.showAttendance ? 'Cancel' : 'Attendance'}
                                            </button>
                                            {attendanceState[user.id]?.showAttendance && (
                                                <div className="dropdown-container">
                                                    <div className="dropdown">
                                                        <span className="date-display">{currentDate}</span>
                                                        <select 
                                                            onChange={(e) => handleAttendanceSelect(user.id, e.target.value)} 
                                                            value={selectedAttendance[user.id] || ""}
                                                            className="dropdown-select"
                                                        >
                                                            <option value="">Select Status</option>
                                                            <option value="FULL_DAY">Full Day</option>
                                                            <option value="HALF_DAY">Half Day</option>
                                                            <option value="LEAVE">Leave</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => handleHoursClick(user.id)} 
                                                className={`action-btn hours-btn ${attendanceState[user.id]?.isHoursRecorded ? 'recorded' : ''}`}
                                                disabled={attendanceState[user.id]?.isHoursRecorded}
                                            >
                                                <FaClock /> {attendanceState[user.id]?.showHours ? 'Cancel' : 'Hours'}
                                            </button>
                                            {attendanceState[user.id]?.showHours && (
                                                <div className="dropdown-container">
                                                    <div className="dropdown">
                                                        <span className="date-display">{currentDate}</span>
                                                        <select 
                                                            onChange={(e) => handleHoursSelect(user.id, e.target.value)} 
                                                            value={selectedHours[user.id] || ""}
                                                            className="dropdown-select"
                                                        >
                                                            <option value="">Select Hours</option>
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(hour => (
                                                                <option key={hour} value={hour}>
                                                                    {hour} Hour{hour > 1 ? 's' : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-data">No employees found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;