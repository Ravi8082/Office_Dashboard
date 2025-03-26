import React, { useEffect, useState } from 'react';
import './Employee.css';
import { 
  FaCalendarAlt, FaMoneyBillWave, FaProjectDiagram, FaUserCircle, 
  FaClipboardList, FaBell, FaTachometerAlt, FaEnvelope, FaCog, 
  FaSignOutAlt, FaChartBar, FaSearch, FaTimes, FaBars, FaExclamationTriangle
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { logoutUser } from '../Login/Login';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Employee = () => {
    const [userData, setUserData] = useState({
        Id: '',
        name: '',
        email: '',
        mobile: '',
        role: '',
        password: '',
        joiningDate: '',
        department: '',
        manager: '',
        salary: '',
        nextPayDate: ''
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [projects, setProjects] = useState({
        current: [],
        upcoming: []
    });
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
    
    // Calendar data
    const [calendarDays, setCalendarDays] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token"); // Retrieve JWT token from local storage

            const response = await fetch("http://localhost:8081/getLoggedInUser", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,  // Ensure token is included
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const userError = response.status === 403 ? 'You are not authorized to access this resource.' : 'Failed to fetch user data';
                setError(userError);
                throw new Error(userError);
            }

            const data = await response.json();
            console.log("User data:", data);
            
            setUserData({
                Id: data.userId,
                name: data.userName || data.name,
                email: data.userEmail || data.email,
                mobile: data.userMobile || data.mobile,
                role: data.role,
                password: '********',
                joiningDate: data.joiningDate || '01-01-2023',
                department: data.department || 'Engineering',
                manager: data.manager || 'Nandlal Yadav',
                salary: data.salary || '₹45,000',
                nextPayDate: data.nextPayDate || '30-05-2023'
            });

            // Fetch attendance data
            const attendanceResponse = await fetch(`http://localhost:8081/user/${data.userId}/attendances`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!attendanceResponse.ok) {
                const attendanceError = attendanceResponse.status === 403 ? 'You are not authorized to access this resource.' : 'Failed to fetch attendance data';
                setError(attendanceError);
                throw new Error(attendanceError);
            }

            const attendance = await attendanceResponse.json();
            setAttendanceData(attendance);

            // Mock project data
            setProjects({
                current: [
                    { id: 1, name: 'E-commerce Website Redesign', deadline: '15-06-2023', progress: 65, role: 'Frontend Developer' },
                    { id: 2, name: 'Mobile App Development', deadline: '30-07-2023', progress: 40, role: 'UI Developer' }
                ],
                upcoming: [
                    { id: 3, name: 'CRM Integration', startDate: '01-08-2023', endDate: '30-09-2023', role: 'Full Stack Developer' },
                    { id: 4, name: 'Payment Gateway Implementation', startDate: '15-08-2023', endDate: '15-10-2023', role: 'Backend Developer' }
                ]
            });

            // Mock notifications
            setNotifications([
                { id: 1, message: 'Your leave request has been approved', date: '10-05-2023', read: false },
                { id: 2, message: 'Team meeting scheduled for tomorrow at 10:00 AM', date: '12-05-2023', read: false },
                { id: 3, message: 'Please complete your timesheet for last week', date: '08-05-2023', read: true }
            ]);

            // Generate calendar data
            generateCalendarDays();
            
            // Mock events for calendar
            setEvents([
                { date: 10, type: 'meeting', title: 'Team Meeting' },
                { date: 15, type: 'deadline', title: 'Project Deadline' },
                { date: 22, type: 'leave', title: 'Approved Leave' }
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setError('Error fetching data');
            setLoading(false);
        }
    };

    // Generate calendar days for current month
    const generateCalendarDays = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        const days = [];
        
        // Add empty slots for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ day: '', empty: true });
        }
        
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, empty: false });
        }
        
        setCalendarDays(days);
    };

    // Chart data for performance metrics
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Tasks Completed',
                data: [12, 19, 15, 8, 22, 14],
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Hours Worked',
                data: [15, 12, 18, 14, 10, 16],
                backgroundColor: '#2196F3',
            },
            {
                label: 'Meetings',
                data: [5, 8, 3, 7, 4, 6],
                backgroundColor: '#E91E63',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Performance',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Render dashboard overview
    const renderDashboard = () => (
        <div className="dashboard-content-area">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <p>Welcome back, {userData.name}</p>
            </div>

            <div className="stats-summary">
                <div className="stat-card">
                    <div className="stat-icon salary-icon">
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-details">
                        <h3>Salary</h3>
                        <p className="stat-value">{userData.salary}</p>
                        <p className="stat-period">Next payment: {userData.nextPayDate}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon attendance-icon">
                        <FaCalendarAlt />
                    </div>
                    <div className="stat-details">
                        <h3>Attendance</h3>
                        <p className="stat-value">{attendanceData.filter(a => a.status === 'Present').length} days</p>
                        <p className="stat-period">This month</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon projects-icon">
                        <FaProjectDiagram />
                    </div>
                    <div className="stat-details">
                        <h3>Projects</h3>
                        <p className="stat-value">{projects.current.length}</p>
                        <p className="stat-period">Active projects</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon notifications-icon">
                        <FaBell />
                    </div>
                    <div className="stat-details">
                        <h3>Notifications</h3>
                        <p className="stat-value">{notifications.filter(n => !n.read).length}</p>
                        <p className="stat-period">Unread messages</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="chart-container">
                    <h3>Performance Metrics</h3>
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <div className="calendar-container">
                    <div className="calendar-header">
                        <h3>{currentMonth}</h3>
                    </div>
                    <div className="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="calendar-days">
                        {calendarDays.map((day, index) => (
                            <div 
                                key={index} 
                                className={`calendar-day ${day.empty ? 'empty' : ''} ${
                                    events.find(event => event.date === day.day) ? 'has-event' : ''
                                } ${
                                    events.find(event => event.date === day.day)?.type || ''
                                }`}
                            >
                                {day.day}
                                {events.find(event => event.date === day.day) && (
                                    <span className="event-indicator"></span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="dashboard-bottom-grid">
                <div className="recent-activities-container">
                    <h3>Recent Activities</h3>
                    <div className="activity-list">
                        {notifications.map(notification => (
                            <div key={notification.id} className={`activity-item ${!notification.read ? 'unread' : ''}`}>
                                <div className="activity-icon"><FaBell /></div>
                                <div className="activity-content">
                                    <p>{notification.message}</p>
                                    <span className="activity-date">{notification.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="current-projects-container">
                    <h3>Current Projects</h3>
                    <div className="projects-list">
                        {projects.current.map(project => (
                            <div key={project.id} className="project-item">
                                <h4>{project.name}</h4>
                                <div className="project-details">
                                    <p><strong>Role:</strong> {project.role}</p>
                                    <p><strong>Deadline:</strong> {project.deadline}</p>
                                    <div className="progress-container">
                                        <div className="progress-label">Progress: {project.progress}%</div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Render profile section
    const renderProfile = () => (
        <div className="profile-section">
            <div className="profile-header">
                <div className="profile-avatar">
                    <FaUserCircle />
                </div>
                <div className="profile-info">
                    <h3>{userData.name}</h3>
                    <p>{userData.role}</p>
                </div>
            </div>
            
            <div className="profile-details">
                <div className="detail-group">
                    <h4>Personal Information</h4>
                    <div className="detail-item">
                        <div className="detail-label">Employee ID</div>
                        <div className="detail-value">{userData.Id}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">Full Name</div>
                        <div className="detail-value">{userData.name}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">Email</div>
                        <div className="detail-value">{userData.email}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">Mobile</div>
                        <div className="detail-value">{userData.mobile}</div>
                    </div>
                </div>
                
                <div className="detail-group">
                    <h4>Employment Details</h4>
                    <div className="detail-item">
                        <div className="detail-label">Department</div>
                        <div className="detail-value">{userData.department}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">Role</div>
                        <div className="detail-value">{userData.role}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">Manager</div>
                        <div className="detail-value">{userData.manager}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">Joining Date</div>
                        <div className="detail-value">{userData.joiningDate}</div>
                    </div>
                </div>
                
                <div className="detail-group">
                    <h4>Salary Information</h4>
                    <div className="detail-item">
                        <div className="detail-label">Current Salary</div>
                        <div className="detail-value">{userData.salary}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">Next Pay Date</div>
                        <div className="detail-value">{userData.nextPayDate}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render attendance section
    const renderAttendance = () => {
        // Calculate attendance statistics
        const present = attendanceData.filter(a => a.status === 'Present').length;
        const absent = attendanceData.filter(a => a.status === 'Absent').length;
        const leave = attendanceData.filter(a => a.status === 'Leave').length;
        const late = attendanceData.filter(a => a.status === 'Late').length;
        
        return (
            <div className="attendance-section">
                <div className="dashboard-header">
                    <h2>Attendance</h2>
                    <p>Your attendance record for the current month</p>
                </div>
                
                <div className="attendance-summary">
                    <div className="summary-card">
                        <h4>Present</h4>
                        <div className="summary-count" style={{ color: '#4CAF50' }}>{present}</div>
                    </div>
                    <div className="summary-card">
                        <h4>Absent</h4>
                        <div className="summary-count" style={{ color: '#F44336' }}>{absent}</div>
                    </div>
                    <div className="summary-card">
                        <h4>Leave</h4>
                        <div className="summary-count" style={{ color: '#FF9800' }}>{leave}</div>
                    </div>
                    <div className="summary-card">
                        <h4>Late</h4>
                        <div className="summary-count" style={{ color: '#2196F3' }}>{late}</div>
                    </div>
                </div>
                
                <div className="calendar-container">
                    <div className="calendar-header">
                        <h3>{currentMonth} Attendance</h3>
                    </div>
                    <div className="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="calendar-days">
                        {calendarDays.map((day, index) => (
                            <div 
                                key={index} 
                                className={`calendar-day ${day.empty ? 'empty' : ''} ${
                                    day.day && attendanceData.find(a => new Date(a.date).getDate() === day.day) ? 
                                    attendanceData.find(a => new Date(a.date).getDate() === day.day).status.toLowerCase() : ''
                                }`}
                            >
                                {day.day}
                            </div>
                        ))}
                    </div>
                </div>
                
                {attendanceData.length === 0 && (
                    <div className="error-message">
                        <FaExclamationTriangle /> No attendance records found for the current month.
                    </div>
                )}
            </div>
        );
    };

    // Render projects section
    const renderProjects = () => {
        const [activeProjectTab, setActiveProjectTab] = useState('current');
        
        return (
            <div className="projects-section">
                <div className="dashboard-header">
                    <h2>Projects</h2>
                    <p>Your assigned projects and their status</p>
                </div>
                
                <div className="projects-tabs">
                    <button 
                        className={`project-tab ${activeProjectTab === 'current' ? 'active' : ''}`}
                        onClick={() => setActiveProjectTab('current')}
                    >
                        Current Projects
                    </button>
                    <button 
                        className={`project-tab ${activeProjectTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveProjectTab('upcoming')}
                    >
                        Upcoming Projects
                    </button>
                </div>
                
                {activeProjectTab === 'current' && (
                    <div className="projects-list">
                        {projects.current.length > 0 ? (
                            projects.current.map(project => (
                                <div key={project.id} className="project-item">
                                    <h4>{project.name}</h4>
                                    <div className="project-details">
                                        <p><strong>Role:</strong> {project.role}</p>
                                        <p><strong>Deadline:</strong> {project.deadline}</p>
                                        <div className="progress-container">
                                            <div className="progress-label">Progress: {project.progress}%</div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="error-message">
                                <FaExclamationTriangle /> No current projects assigned.
                            </div>
                        )}
                    </div>
                )}
                
                {activeProjectTab === 'upcoming' && (
                    <div className="projects-list">
                        {projects.upcoming.length > 0 ? (
                            projects.upcoming.map(project => (
                                <div key={project.id} className="project-item">
                                    <h4>{project.name}</h4>
                                    <div className="project-details">
                                        <p><strong>Role:</strong> {project.role}</p>
                                        <p><strong>Start Date:</strong> {project.startDate}</p>
                                        <p><strong>End Date:</strong> {project.endDate}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="error-message">
                                <FaExclamationTriangle /> No upcoming projects assigned.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Render notifications section
    const renderNotifications = () => {
        const [notificationFilter, setNotificationFilter] = useState('all');
        
        // Filter notifications based on selected filter
        const filteredNotifications = notificationFilter === 'unread' 
            ? notifications.filter(n => !n.read)
            : notifications;
            
        // Mark notification as read
        const markAsRead = (id) => {
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
            ));
        };
        
        return (
            <div className="notifications-section">
                <div className="dashboard-header">
                    <h2>Notifications</h2>
                    <p>Your recent notifications and updates</p>
                </div>
                
                <div className="notification-filters">
                    <button 
                        className={`notification-filter ${notificationFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setNotificationFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`notification-filter ${notificationFilter === 'unread' ? 'active' : ''}`}
                        onClick={() => setNotificationFilter('unread')}
                    >
                        Unread ({notifications.filter(n => !n.read).length})
                    </button>
                </div>
                
                <div className="notification-list">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                                <div className="notification-icon"><FaBell /></div>
                                <div className="notification-content">
                                    <p>{notification.message}</p>
                                    <span className="notification-date">{notification.date}</span>
                                    {!notification.read && (
                                        <div className="notification-actions">
                                            <button 
                                                className="notification-action"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                Mark as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="error-message">
                            <FaExclamationTriangle /> No notifications found.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
        </div>;
    }

    return (
        <div className={`modern-dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
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
                        className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <FaTachometerAlt /> <span>Dashboard</span>
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUserCircle /> <span>Profile</span>
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        <FaCalendarAlt /> <span>Attendance</span>
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        <FaProjectDiagram /> <span>Projects</span>
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <FaBell /> 
                        <span>Notifications</span>
                        {notifications.filter(n => !n.read).length > 0 && 
                            <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
                        }
                    </button>
                </div>

                <div className="sidebar-footer">
                    <button className="menu-item" onClick={logoutUser}>
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
                            <span className="action-badge">3</span>
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
                    
                    {activeTab === 'overview' && renderDashboard()}
                    {activeTab === 'profile' && renderProfile()}
                    {activeTab === 'attendance' && renderAttendance()}
                    {activeTab === 'projects' && renderProjects()}
                    {activeTab === 'notifications' && renderNotifications()}
                </div>
            </div>
        </div>
    );
};

export default Employee;