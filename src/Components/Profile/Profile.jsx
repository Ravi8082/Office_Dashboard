import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaUserTag, FaEdit, FaKey, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        userId: '',
        name: '',
        email: '',
        mobile: '',
        role: '',
        department: '',
        joiningDate: '',
        address: '',
        emergencyContact: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [success, setSuccess] = useState(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await axios.get('http://localhost:8081/getLoggedInUser', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data;
            const userInfo = {
                userId: data.userId,
                name: data.userName || data.name,
                email: data.userEmail || data.email,
                mobile: data.userMobile || data.mobile,
                role: data.role,
                department: data.department || '',
                joiningDate: data.joiningDate || '',
                address: data.address || '',
                emergencyContact: data.emergencyContact || ''
            };
            
            setUserData(userInfo);
            setFormData(userInfo);
            setError(null);
        } catch (error) {
            console.error('Error fetching user data: ', error);
            if (error.response && error.response.status === 403) {
                setError('You are not authorized to access this resource.');
            } else {
                setError('Failed to fetch user data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
        if (!editMode) {
            setFormData(userData);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            await axios.put(`http://localhost:8081/users/${userData.userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setUserData(formData);
            setSuccess('Profile updated successfully');
            setEditMode(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
            
        } catch (error) {
            console.error('Error updating profile: ', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            await axios.post(`http://localhost:8081/users/${userData.userId}/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setPasswordSuccess('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            // Clear success message and close form after 3 seconds
            setTimeout(() => {
                setPasswordSuccess(null);
                setShowPasswordForm(false);
            }, 3000);
            
        } catch (error) {
            console.error('Error updating password: ', error);
            if (error.response && error.response.status === 400) {
                setPasswordError('Current password is incorrect');
            } else {
                setPasswordError('Failed to update password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData.name) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile data...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    {!editMode && (
                        <button className="edit-profile-btn" onClick={handleEditToggle}>
                            <FaEdit /> Edit Profile
                        </button>
                    )}
                </div>
                
                {error && <div className="profile-error">{error}</div>}
                {success && <div className="profile-success">{success}</div>}
                
                {!editMode ? (
                    <div className="profile-info">
                        <div className="profile-avatar">
                            <FaUser className="avatar-icon" />
                            <h2>{userData.name}</h2>
                            <span className="role-badge">{userData.role}</span>
                        </div>
                        
                        <div className="info-section">
                            <div className="info-item">
                                <FaIdCard className="info-icon" />
                                <div>
                                    <span className="info-label">Employee ID</span>
                                    <span className="info-value">{userData.userId}</span>
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <FaEnvelope className="info-icon" />
                                <div>
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{userData.email}</span>
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <FaPhone className="info-icon" />
                                <div>
                                    <span className="info-label">Mobile</span>
                                    <span className="info-value">{userData.mobile}</span>
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <FaUserTag className="info-icon" />
                                <div>
                                    <span className="info-label">Department</span>
                                    <span className="info-value">{userData.department || 'Not specified'}</span>
                                </div>
                            </div>
                            
                            {userData.joiningDate && (
                                <div className="info-item">
                                    <FaUserTag className="info-icon" />
                                    <div>
                                        <span className="info-label">Joining Date</span>
                                        <span className="info-value">{userData.joiningDate}</span>
                                    </div>
                                </div>
                            )}
                            
                            {userData.address && (
                                <div className="info-item">
                                    <FaUserTag className="info-icon" />
                                    <div>
                                        <span className="info-label">Address</span>
                                        <span className="info-value">{userData.address}</span>
                                    </div>
                                </div>
                            )}
                            
                            {userData.emergencyContact && (
                                <div className="info-item">
                                    <FaUserTag className="info-icon" />
                                    <div>
                                        <span className="info-label">Emergency Contact</span>
                                        <span className="info-value">{userData.emergencyContact}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="profile-actions">
                            <button className="change-password-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                                <FaKey /> Change Password
                            </button>
                        </div>
                        
                        {showPasswordForm && (
                            <div className="password-form-container">
                                <h3>Change Password</h3>
                                {passwordError && <div className="password-error">{passwordError}</div>}
                                {passwordSuccess && <div className="password-success">{passwordSuccess}</div>}
                                
                                <form onSubmit={handleUpdatePassword} className="password-form">
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input 
                                            type="password" 
                                            name="currentPassword" 
                                            value={passwordData.currentPassword} 
                                            onChange={handlePasswordChange} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input 
                                            type="password" 
                                            name="newPassword" 
                                            value={passwordData.newPassword} 
                                            onChange={handlePasswordChange} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            value={passwordData.confirmPassword} 
                                            onChange={handlePasswordChange} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="password-form-actions">
                                        <button type="button" onClick={() => setShowPasswordForm(false)} className="cancel-btn">
                                            <FaTimes /> Cancel
                                        </button>
                                        <button type="submit" className="save-btn" disabled={loading}>
                                            <FaSave /> {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    required 
                                    disabled 
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Mobile</label>
                                <input 
                                    type="text" 
                                    name="mobile" 
                                    value={formData.mobile} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Department</label>
                                <input 
                                    type="text" 
                                    name="department" 
                                    value={formData.department} 
                                    onChange={handleInputChange} 
                                    disabled={userData.role !== 'Admin'} 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Emergency Contact</label>
                            <input 
                                type="text" 
                                name="emergencyContact" 
                                value={formData.emergencyContact} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Address</label>
                            <textarea 
                                name="address" 
                                value={formData.address} 
                                onChange={handleInputChange} 
                                rows="3"
                            ></textarea>
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" onClick={handleEditToggle} className="cancel-btn">
                                <FaTimes /> Cancel
                            </button>
                            <button type="submit" className="save-btn" disabled={loading}>
                                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;