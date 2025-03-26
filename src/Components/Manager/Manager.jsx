import React, { useEffect, useState } from 'react';
import './Manager.css';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaUserPlus, FaChartBar, FaCalendarAlt, FaClipboardList, 
  FaBell, FaTachometerAlt, FaUserCircle, FaSignOutAlt, FaSearch,
  FaEnvelope, FaCog, FaTimes, FaBars, FaExclamationTriangle
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Manager = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        id: null,
        name: '',
        email: '',
        role: 'Manager',
        department: 'Engineering'
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [departmentStats, setDepartmentStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        onLeave: 0,
        projects: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch('http://localhost:8081/getLoggedInUser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setError('You are not authorized to access this resource.');
                } else {
                    setError('Failed to fetch user data');
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserData({
                id: data.userId,
                name: data.userName || data.name,
                email: data.userEmail || data.email,
                role: 'Manager',
                department: 'Engineering'
            });

            // Fetch all employees using the new API endpoint
            const employeesResponse = await fetch('http://localhost:8081/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (employeesResponse.ok) {
                const employeesData = await employeesResponse.json();
                setEmployeeData(employeesData);
                
                // Set department stats
                setDepartmentStats({
                    totalEmployees: employeesData.length,
                    presentToday: Math.floor(employeesData.length * 0.8), // Mock data
                    onLeave: Math.floor(employeesData.length * 0.1), // Mock data
                    projects: 5 // Mock data
                });
            } else {
                console.error('Failed to fetch employees');
            }

            // Fetch attendance data
            const attendanceResponse = await fetch(`http://localhost:8081/user/${data.userId}/attendance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (attendanceResponse.ok) {
                const attendanceData = await attendanceResponse.json();
                setAttendanceData(attendanceData);
            }

            // Mock notifications
            setNotifications([
                { id: 1, message: 'Employee John Smith requested leave approval', date: '10-05-2023', read: false, type: 'leave' },
                { id: 2, message: 'Team meeting scheduled for tomorrow at 10:00 AM', date: '12-05-2023', read: false, type: 'meeting' },
                { id: 3, message: 'Project deadline approaching for E-commerce Website', date: '08-05-2023', read: true, type: 'project' },
                { id: 4, message: 'New employee onboarding pending', date: '07-05-2023', read: true, type: 'employee' }
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Chart data for department performance
    const departmentPerformanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Projects Completed',
                data: [3, 5, 4, 6, 2, 3],
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Projects Ongoing',
                data: [2, 3, 5, 4, 7, 5],
                backgroundColor: '#2196F3',
            }
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Department Performance',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Attendance distribution data for pie chart
    const attendanceDistributionData = {
        labels: ['Present', 'Absent', 'Leave', 'Late'],
        datasets: [
            {
                data: [departmentStats.presentToday, 2, departmentStats.onLeave, 3],
                backgroundColor: ['#4CAF50', '#F44336', '#FF9800', '#2196F3'],
                borderWidth: 1,
            },
        ],
    };

    // Render dashboard overview
    const renderDashboard = () => (
        <div className="dashboard-content-area">
            <div className="dashboard-header">
                <h2>Manager Dashboard</h2>
                <p>Welcome back, {userData.name}</p>
            </div>

            <div className="stats-summary">
                <div className="stat-card">
                    <div className="stat-icon employees-icon">
                        <FaUsers />
                    </div>
                    <div className="stat-details">
                        <h3>Total Employees</h3>
                        <p className="stat-value">{departmentStats.totalEmployees}</p>
                        <p className="stat-period">In your department</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon attendance-icon">
                        <FaCalendarAlt />
                    </div>
                    <div className="stat-details">
                        <h3>Present Today</h3>
                        <p className="stat-value">{departmentStats.presentToday}</p>
                        <p className="stat-period">Out of {departmentStats.totalEmployees}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon leave-icon">
                        <FaClipboardList />
                    </div>
                    <div className="stat-details">
                        <h3>On Leave</h3>
                        <p className="stat-value">{departmentStats.onLeave}</p>
                        <p className="stat-period">Pending approvals: 2</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon projects-icon">
                        <FaChartBar />
                    </div>
                    <div className="stat-details">
                        <h3>Active Projects</h3>
                        <p className="stat-value">{departmentStats.projects}</p>
                        <p className="stat-period">2 nearing deadline</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="chart-container">
                    <h3>Department Performance</h3>
                    <Bar data={departmentPerformanceData} options={chartOptions} />
                </div>

                <div className="chart-container">
                    <h3>Today's Attendance</h3>
                    <div className="pie-chart-container">
                        <Pie data={attendanceDistributionData} />
                    </div>
                </div>
            </div>

            <div className="dashboard-bottom-grid">
                <div className="recent-activities-container">
                    <h3>Recent Notifications</h3>
                    <div className="activity-list">
                        {notifications.map(notification => (
                            <div key={notification.id} className={`activity-item ${!notification.read ? 'unread' : ''}`}>
                                <div className={`activity-icon ${notification.type}-icon`}>
                                    {notification.type === 'leave' && <FaCalendarAlt />}
                                    {notification.type === 'meeting' && <FaUsers />}
                                    {notification.type === 'project' && <FaChartBar />}
                                    {notification.type === 'employee' && <FaUserPlus />}
                                </div>
                                <div className="activity-content">
                                    <p>{notification.message}</p>
                                    <span className="activity-date">{notification.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-actions-container">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions-grid">
                        <Link to="/employeelist" className="quick-action-card">
                            <div className="quick-action-icon"><FaUsers /></div>
                            <span>View Employees</span>
                        </Link>
                        <Link to="/register" className="quick-action-card">
                            <div className="quick-action-icon"><FaUserPlus /></div>
                            <span>Add Employee</span>
                        </Link>
                        <Link to="/attendance" className="quick-action-card">
                            <div className="quick-action-icon"><FaCalendarAlt /></div>
                            <span>Attendance</span>
                        </Link>
                        <Link to="/reports" className="quick-action-card">
                            <div className="quick-action-icon"><FaChartBar /></div>
                            <span>Reports</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render employee list
    const renderEmployeeList = () => (
        <div className="employee-list-section">
            <div className="section-header">
                <h2>Employee List</h2>
                <div className="header-actions">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search employees..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                    <Link to="/register" className="add-employee-btn">
                        <FaUserPlus /> Add Employee
                    </Link>
                </div>
            </div>

            <div className="employee-table-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeData.length > 0 ? (
                            employeeData.map((employee, index) => (
                                <tr key={employee.id || index}>
                                    <td>{employee.id || `EMP${index + 1001}`}</td>
                                    <td>{employee.name || `Employee ${index + 1}`}</td>
                                    <td>{employee.email || `employee${index + 1}@example.com`}</td>
                                    <td>{employee.department || 'Engineering'}</td>
                                    <td>{employee.position || 'Developer'}</td>
                                    <td>
                                        <span className={`status-badge ${index % 3 === 0 ? 'active' : index % 3 === 1 ? 'on-leave' : 'inactive'}`}>
                                            {index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'On Leave' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn view-btn" title="View Details">
                                                <FaUserCircle />
                                            </button>
                                            <button className="action-btn edit-btn" title="Edit">
                                                <FaCog />
                                            </button>
                                        </div>
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
        </div>
    );

    // Render attendance report
    const renderAttendanceReport = () => (
        <div className="attendance-report-section">
            <div className="section-header">
                <h2>Attendance Report</h2>
                <div className="header-actions">
                    <select className="date-filter">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>Custom Range</option>
                    </select>
                    <button className="export-btn">Export Report</button>
                </div>
            </div>

            <div className="attendance-summary-cards">
                <div className="summary-card">
                    <div className="summary-icon present-icon">
                        <FaUsers />
                    </div>
                    <div className="summary-details">
                        <h4>Present</h4>
                        <p className="summary-count">{departmentStats.presentToday}</p>
                        <p className="summary-percentage">{Math.round((departmentStats.presentToday / departmentStats.totalEmployees) * 100)}%</p>
                    </div>
                </div>
                
                <div className="summary-card">
                    <div className="summary-icon absent-icon">
                        <FaUsers />
                    </div>
                    <div className="summary-details">
                        <h4>Absent</h4>
                        <p className="summary-count">2</p>
                        <p className="summary-percentage">{Math.round((2 / departmentStats.totalEmployees) * 100)}%</p>
                    </div>
                </div>
                
                <div className="summary-card">
                    <div className="summary-icon leave-icon">
                        <FaCalendarAlt />
                    </div>
                    <div className="summary-details">
                        <h4>On Leave</h4>
                        <p className="summary-count">{departmentStats.onLeave}</p>
                        <p className="summary-percentage">{Math.round((departmentStats.onLeave / departmentStats.totalEmployees) * 100)}%</p>
                    </div>
                </div>
                
                <div className="summary-card">
                    <div className="summary-icon late-icon">
                        <FaCalendarAlt />
                    </div>
                    <div className="summary-details">
                        <h4>Late</h4>
                        <p className="summary-count">3</p>
                        <p className="summary-percentage">{Math.round((3 / departmentStats.totalEmployees) * 100)}%</p>
                    </div>
                </div>
            </div>

            <div className="attendance-table-container">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Working Hours</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeData.length > 0 ? (
                            employeeData.map((employee, index) => (
                                <tr key={employee.id || index}>
                                    <td>{employee.name || `Employee ${index + 1}`}</td>
                                    <td>{employee.department || 'Engineering'}</td>
                                    <td>
                                        <span className={`status-badge ${index % 4 === 0 ? 'present' : index % 4 === 1 ? 'absent' : index % 4 === 2 ? 'leave' : 'late'}`}>
                                            {index % 4 === 0 ? 'Present' : index % 4 === 1 ? 'Absent' : index % 4 === 2 ? 'Leave' : 'Late'}
                                        </span>
                                    </td>
                                    <td>{index % 4 === 1 ? '-' : '09:' + (index % 2 === 0 ? '00' : '15') + ' AM'}</td>
                                    <td>{index % 4 === 1 ? '-' : '06:' + (index % 3 === 0 ? '00' : index % 3 === 1 ? '15' : '30') + ' PM'}</td>
                                    <td>{index % 4 === 1 ? '-' : (8 + (index % 3)) + ' hrs'}</td>
                                    <td>
                                        <button className="action-btn view-btn" title="View Details">
                                            <FaUserCircle />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No attendance data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) {
        return <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
        </div>;
    }

    return (
        <div className={`manager-dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {/* Mobile Toggle Button */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="user-avatar">
                        <FaUserCircle />
                    </div>
                    <div className="user-info">
                        <h3>{userData.name}</h3>
                        <p>{userData.role}</p>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <button 
                        className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <FaTachometerAlt /> <span>Dashboard</span>
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'employees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('employees')}
                    >
                        <FaUsers /> <span>Employees</span>
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        <FaCalendarAlt /> <span>Attendance</span>
                    </button>
                    <Link 
                        to="/register"
                        className="menu-item"
                    >
                        <FaUserPlus /> <span>Add Employee</span>
                    </Link>
                    <Link 
                        to="/profile"
                        className="menu-item"
                    >
                        <FaUserCircle /> <span>Profile</span>
                    </Link>
                </div>

                <div className="sidebar-footer">
                    <button className="menu-item" onClick={handleLogout}>
                        <FaSignOutAlt /> <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Top Navigation */}
                <div className="dashboard-topbar">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                    <div className="topbar-actions">
                        <button className="action-button">
                            <FaEnvelope />
                            <span className="action-badge">2</span>
                        </button>
                        <button className="action-button">
                            <FaBell />
                            <span className="action-badge">{notifications.filter(n => !n.read).length}</span>
                        </button>
                        <button className="action-button">
                            <FaCog />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="dashboard-content">
                    {error && <div className="error-message"><FaExclamationTriangle /> {error}</div>}
                    
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'employees' && renderEmployeeList()}
                    {activeTab === 'attendance' && renderAttendanceReport()}
                </div>
            </div>
        </div>
    );
};

export default Manager;