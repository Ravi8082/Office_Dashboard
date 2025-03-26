import React, { useState, useEffect } from 'react';
import './Attendance.css';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaCalendarDay, FaUser, FaBuilding, FaClock, FaChartLine } from 'react-icons/fa';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDate, isSameDay, subMonths, differenceInMonths } from 'date-fns';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        department: '',
        employeeId: '',
        joiningDate: '',
        role: ''
    });
    const [attendanceSummary, setAttendanceSummary] = useState({
        present: 0,
        absent: 0,
        leave: 0,
        halfDay: 0,
        totalWorkingDays: 0
    });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [yearlyAttendance, setYearlyAttendance] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get the user ID from localStorage or context
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');
                
                if (!userId || !token) {
                    throw new Error('User not authenticated');
                }
                
                // Fetch user data
                const userResponse = await fetch(`http://localhost:8081/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await userResponse.json();
                setUserData({
                    name: userData.name || 'N/A',
                    email: userData.email || 'N/A',
                    department: userData.department || 'N/A',
                    employeeId: userData.employeeId || userId,
                    joiningDate: userData.joiningDate || 'N/A',
                    role: userData.role || 'N/A'
                });
                
                // Now fetch attendance data
                await fetchAttendanceData(userId, token);
                
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data. Please try again later.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchAttendanceData = async (userId, token) => {
        try {
            setLoading(true);
            
            // Fetch attendance data
            const response = await fetch(`http://localhost:8081/user/${userId}/attendances`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }

            const data = await response.json();
            
            // Sort attendance data by date (newest first)
            const sortedData = data.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            setAttendanceData(sortedData);
            
            // Calculate attendance summary
            const present = sortedData.filter(a => a.status === 'Present').length;
            const absent = sortedData.filter(a => a.status === 'Absent').length;
            const leave = sortedData.filter(a => a.status === 'Leave').length;
            const halfDay = sortedData.filter(a => a.status === 'Half Day').length;
            
            setAttendanceSummary({
                present,
                absent,
                leave,
                halfDay,
                totalWorkingDays: present + absent + leave + halfDay
            });

            // Generate yearly attendance data for heatmap
            generateYearlyAttendanceData(sortedData);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setError('Failed to load attendance data. Please try again later.');
            setLoading(false);
            
            // Set mock data for development/testing
            const mockData = generateMockAttendanceData();
            setAttendanceData(mockData);
            
            const present = mockData.filter(a => a.status === 'Present').length;
            const absent = mockData.filter(a => a.status === 'Absent').length;
            const leave = mockData.filter(a => a.status === 'Leave').length;
            const halfDay = mockData.filter(a => a.status === 'Half Day').length;
            
            setAttendanceSummary({
                present,
                absent,
                leave,
                halfDay,
                totalWorkingDays: present + absent + leave + halfDay
            });
            
            // Generate yearly attendance data for heatmap
            generateYearlyAttendanceData(mockData);
            
            setLoading(false);
        }
    };

    const generateMockAttendanceData = () => {
        const mockData = [];
        const today = new Date();
        const startDate = subMonths(today, 3); // 3 months of data
        
        let currentDate = startDate;
        while (currentDate <= today) {
            // Skip weekends
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                const randomStatus = Math.random();
                let status;
                
                if (randomStatus > 0.85) {
                    status = 'Leave';
                } else if (randomStatus > 0.75) {
                    status = 'Half Day';
                } else if (randomStatus > 0.1) {
                    status = 'Present';
                } else {
                    status = 'Absent';
                }
                
                mockData.push({
                    date: format(currentDate, 'yyyy-MM-dd'),
                    status: status,
                    checkIn: status === 'Present' || status === 'Half Day' ? '09:00 AM' : '-',
                    checkOut: status === 'Present' ? '06:00 PM' : (status === 'Half Day' ? '01:00 PM' : '-'),
                    workingHours: status === 'Present' ? '9h 0m' : (status === 'Half Day' ? '4h 0m' : '-'),
                    notes: status === 'Leave' ? 'Approved leave' : (status === 'Absent' ? 'Unplanned absence' : '')
                });
            }
            
            // Move to next day
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
        
        return mockData.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const generateYearlyAttendanceData = (attendanceData) => {
        const year = selectedYear;
        const months = Array.from({ length: 12 }, (_, i) => i);
        const yearlyData = [];
        
        months.forEach(month => {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            
            days.forEach(day => {
                const date = new Date(year, month, day);
                const dateString = format(date, 'yyyy-MM-dd');
                
                const attendance = attendanceData.find(a => {
                    const attendanceDate = a.date.includes('-') 
                        ? a.date 
                        : format(new Date(a.date), 'yyyy-MM-dd');
                    return attendanceDate === dateString;
                });
                
                yearlyData.push({
                    date,
                    status: attendance ? attendance.status : null
                });
            });
        });
        
        setYearlyAttendance(yearlyData);
    };

    useEffect(() => {
        // Generate calendar days for the current month
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start, end });
        setCalendarDays(days);
    }, [currentMonth, attendanceData]);

    const getAttendanceStatus = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const attendance = attendanceData.find(a => {
            // Handle different date formats
            const attendanceDate = a.date.includes('-') 
                ? a.date 
                : format(new Date(a.date), 'yyyy-MM-dd');
            return attendanceDate === formattedDate;
        });
        
        return attendance ? attendance.status : null;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Present':
                return 'status-present';
            case 'Absent':
                return 'status-absent';
            case 'Leave':
                return 'status-leave';
            case 'Half Day':
                return 'status-half-day';
            default:
                return '';
        }
    };

    const calculateAttendanceStreak = () => {
        let currentStreak = 0;
        let maxStreak = 0;
        
        // Sort by date (oldest first) for streak calculation
        const sortedData = [...attendanceData].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        for (let i = 0; i < sortedData.length; i++) {
            if (sortedData[i].status === 'Present') {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }
        
        return maxStreak;
    };

    const calculateMonthlyAttendance = () => {
        const today = new Date();
        const currentMonthData = attendanceData.filter(a => {
            const attendanceDate = new Date(a.date);
            return attendanceDate.getMonth() === today.getMonth() && 
                   attendanceDate.getFullYear() === today.getFullYear();
        });
        
        const workingDays = currentMonthData.length;
        const present = currentMonthData.filter(a => a.status === 'Present').length;
        
        return {
            workingDays,
            present,
            percentage: workingDays > 0 ? Math.round((present / workingDays) * 100) : 0
        };
    };

    const renderAttendanceCalendar = () => (
        <div className="attendance-calendar">
            <div className="calendar-header">
                <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
                <div className="calendar-controls">
                    <button 
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="calendar-control-btn"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => setCurrentMonth(new Date())}
                        className="calendar-control-btn"
                    >
                        Current
                    </button>
                    <button 
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="calendar-control-btn"
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="calendar-grid">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>
                
                {/* Empty cells for days before the first day of month */}
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, index) => (
                    <div key={`empty-start-${index}`} className="calendar-day empty"></div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map(day => {
                    const status = getAttendanceStatus(day);
                    return (
                        <div 
                            key={day.toString()} 
                            className={`calendar-day ${getStatusColor(status)}`}
                        >
                            <span className="day-number">{getDate(day)}</span>
                            {status && <span className="day-status">{status}</span>}
                        </div>
                    );
                })}
                
                {/* Empty cells for days after the last day of month */}
                {Array.from({ length: 6 - new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay() }).map((_, index) => (
                    <div key={`empty-end-${index}`} className="calendar-day empty"></div>
                ))}
            </div>
        </div>
    );

    const renderAttendanceHeatmap = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        return (
            <div className="attendance-heatmap">
                <div className="heatmap-header">
                    <h3>Yearly Attendance {selectedYear}</h3>
                    <div className="year-selector">
                        <button 
                            onClick={() => setSelectedYear(selectedYear - 1)}
                            className="year-control-btn"
                        >
                            {selectedYear - 1}
                        </button>
                        <button 
                            onClick={() => setSelectedYear(new Date().getFullYear())}
                            className="year-control-btn active"
                        >
                            {new Date().getFullYear()}
                        </button>
                        <button 
                            onClick={() => setSelectedYear(selectedYear + 1)}
                            className="year-control-btn"
                            disabled={selectedYear >= new Date().getFullYear()}
                        >
                            {selectedYear + 1}
                        </button>
                    </div>
                </div>
                
                <div className="heatmap-grid">
                    <div className="heatmap-days">
                        {days.map((day, index) => (
                            <div key={day} className="heatmap-day-label">{day}</div>
                        ))}
                    </div>
                    
                    <div className="heatmap-months">
                        {months.map((month, monthIndex) => {
                            // Calculate days in this month for the selected year
                            const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
                            
                            // Create an array of all days in the month
                            const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
                                const date = new Date(selectedYear, monthIndex, i + 1);
                                return {
                                    date: date,
                                    dayOfWeek: date.getDay()
                                };
                            });
                            
                            return (
                                <div key={month} className="heatmap-month">
                                    <div className="heatmap-month-label">{month}</div>
                                    <div className="heatmap-month-cells">
                                        {daysArray.map((day, i) => {
                                            // Find attendance data if it exists
                                            const attendanceItem = yearlyAttendance.find(item => 
                                                item.date.getFullYear() === day.date.getFullYear() && 
                                                item.date.getMonth() === day.date.getMonth() && 
                                                item.date.getDate() === day.date.getDate()
                                            );
                                            
                                            return (
                                                <div 
                                                    key={`${monthIndex}-${i}`}
                                                    className={`heatmap-cell ${attendanceItem ? getStatusColor(attendanceItem.status) : ''}`}
                                                    style={{ gridRow: day.dayOfWeek + 1 }}
                                                    title={`${format(day.date, 'yyyy-MM-dd')}: ${attendanceItem?.status || 'No data'}`}
                                                >
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading attendance data...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const monthlyAttendance = calculateMonthlyAttendance();
    const attendanceStreak = calculateAttendanceStreak();

    return (
        <div className="attendance-container">
            <div className="user-profile-section">
                <div className="user-profile-header">
                    <div className="user-avatar">
                        <FaUser className="avatar-icon" />
                    </div>
                    <div className="user-info">
                        <h2>{userData.name}</h2>
                        <p className="user-role">{userData.role}</p>
                        <p className="user-department"><FaBuilding className="info-icon" /> {userData.department}</p>
                    </div>
                </div>
                <div className="user-details">
                    <div className="user-detail-item">
                        <span className="detail-label">Employee ID</span>
                        <span className="detail-value">{userData.employeeId}</span>
                    </div>
                    <div className="user-detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{userData.email}</span>
                    </div>
                    <div className="user-detail-item">
                        <span className="detail-label">Joining Date</span>
                        <span className="detail-value">{userData.joiningDate}</span>
                    </div>
                    <div className="user-detail-item">
                        <span className="detail-label">Attendance Streak</span>
                        <span className="detail-value highlight">{attendanceStreak} days</span>
                    </div>
                </div>
            </div>

            <div className="attendance-stats-section">
                <div className="stats-card monthly-attendance">
                    <h3>This Month</h3>
                    <div className="stats-value">{monthlyAttendance.percentage}%</div>
                    <div className="stats-detail">
                        Present {monthlyAttendance.present} out of {monthlyAttendance.workingDays} working days
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${monthlyAttendance.percentage}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="stats-card total-leaves">
                    <h3>Leave Balance</h3>
                    <div className="stats-value">{12 - attendanceSummary.leave}</div>
                    <div className="stats-detail">
                        Used {attendanceSummary.leave} out of 12 leaves
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${(attendanceSummary.leave / 12) * 100}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="stats-card punctuality">
                    <h3>Punctuality</h3>
                    <div className="stats-value">
                        {attendanceSummary.totalWorkingDays > 0 
                            ? `${Math.round((attendanceSummary.present / attendanceSummary.totalWorkingDays) * 100)}%` 
                            : '0%'}
                    </div>
                    <div className="stats-detail">
                        Overall attendance rate
                    </div>
                </div>
                
                <div className="stats-card half-days">
                    <h3>Half Days</h3>
                    <div className="stats-value">{attendanceSummary.halfDay}</div>
                    <div className="stats-detail">
                        Total half days taken
                    </div>
                </div>
            </div>

            <div className="attendance-header">
                <h2>Attendance History</h2>
                <div className="attendance-legend">
                    <div className="legend-item">
                        <div className="legend-color present"></div>
                        <span>Present</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color absent"></div>
                        <span>Absent</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color leave"></div>
                        <span>Leave</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color half-day"></div>
                        <span>Half Day</span>
                    </div>
                </div>
            </div>

            <div className="attendance-summary">
                <div className="summary-card">
                    <div className="summary-icon"><FaCalendarCheck /></div>
                    <h4>Present</h4>
                    <div className="summary-count">{attendanceSummary.present}</div>
                    <div className="summary-percentage">
                        {attendanceSummary.totalWorkingDays > 0 
                            ? `${Math.round((attendanceSummary.present / attendanceSummary.totalWorkingDays) * 100)}%` 
                            : '0%'}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon"><FaCalendarTimes /></div>
                    <h4>Absent</h4>
                    <div className="summary-count">{attendanceSummary.absent}</div>
                    <div className="summary-percentage">
                        {attendanceSummary.totalWorkingDays > 0 
                            ? `${Math.round((attendanceSummary.absent / attendanceSummary.totalWorkingDays) * 100)}%` 
                            : '0%'}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon"><FaCalendarAlt /></div>
                    <h4>Leave</h4>
                    <div className="summary-count">{attendanceSummary.leave}</div>
                    <div className="summary-percentage">
                        {attendanceSummary.totalWorkingDays > 0 
                            ? `${Math.round((attendanceSummary.leave / attendanceSummary.totalWorkingDays) * 100)}%` 
                            : '0%'}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon"><FaCalendarDay /></div>
                    <h4>Half Day</h4>
                    <div className="summary-count">{attendanceSummary.halfDay}</div>
                    <div className="summary-percentage">
                        {attendanceSummary.totalWorkingDays > 0 
                            ? `${Math.round((attendanceSummary.halfDay / attendanceSummary.totalWorkingDays) * 100)}%` 
                            : '0%'}
                    </div>
                </div>
            </div>

            {renderAttendanceCalendar()}
            
            {renderAttendanceHeatmap()}

            <div className="attendance-records">
                <h3>Attendance Records</h3>
                {attendanceData.length > 0 ? (
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Working Hours</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((attendance, index) => (
                                <tr key={index} className={`status-${attendance.status.toLowerCase().replace(' ', '-')}`}>
                                    <td>{attendance.date}</td>
                                    <td>
                                        <span className={`status-badge ${attendance.status.toLowerCase().replace(' ', '-')}`}>
                                            {attendance.status}
                                        </span>
                                    </td>
                                    <td>{attendance.checkIn || '-'}</td>
                                    <td>{attendance.checkOut || '-'}</td>
                                    <td>{attendance.workingHours || '-'}</td>
                                    <td>{attendance.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-records-container">
                        <p className="no-records">No attendance records found.</p>
                        <p className="no-records-message">Your attendance records will appear here once they are available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;