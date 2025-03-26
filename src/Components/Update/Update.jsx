import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Update.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaMobile, FaBriefcase, FaEnvelope, FaArrowLeft, FaSave } from 'react-icons/fa';

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ 
        name: '', 
        email: '', 
        mobile: '', 
        role: '',
        department: '',
        salary: '',
        joiningDate: '',
        address: '',
        emergencyContact: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const roles = [
        'Developer', 
        'Tester', 
        'Project Manager', 
        'System Administrator', 
        'Business Analyst', 
        'IT_SUPPORT',
        'Manager',
        'HR'
    ];

    const departments = [
        'Engineering', 
        'Marketing', 
        'Sales', 
        'Finance', 
        'Human Resources', 
        'IT', 
        'Operations'
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                const response = await axios.get(`http://localhost:8081/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setUser(response.data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch user data', error);
                if (error.response && error.response.status === 403) {
                    setError('You do not have permission to edit this employee.');
                } else if (error.response && error.response.status === 404) {
                    setError('Employee not found.');
                } else {
                    setError('Failed to load employee data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!user.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!user.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            errors.email = 'Email is invalid';
        }
        
        if (!user.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(user.mobile.replace(/[^0-9]/g, ''))) {
            errors.mobile = 'Mobile number must be 10 digits';
        }
        
        if (!user.role) {
            errors.role = 'Role is required';
        }
        
        if (!user.department) {
            errors.department = 'Department is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            await axios.put(`http://localhost:8081/users/${id}`, user, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setSuccess('Employee updated successfully');
            
            // Navigate after a short delay to show success message
            setTimeout(() => {
                navigate('/employeelist');
            }, 1500);
            
        } catch (error) {
            console.error('Failed to update employee', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Failed to update employee. Please try again.');
            } else {
                setError('Failed to update employee. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/employeelist');
    };

    if (loading && !user.name) {
        return (
            <div className="update-loading">
                <div className="spinner"></div>
                <p>Loading employee data...</p>
            </div>
        );
    }

    return (
        <div className='update-container'>
            <div className="update-card">
                <div className="update-header">
                    <button className="back-button" onClick={handleCancel}>
                        <FaArrowLeft /> Back
                    </button>
                    <h2>Update Employee</h2>
                </div>
                
                {error && <div className="update-error">{error}</div>}
                {success && <div className="update-success">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <FaUser className="input-icon" /> Full Name
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                value={user.name} 
                                onChange={handleChange} 
                                placeholder="Enter full name"
                            />
                            {formErrors.name && <div className="field-error">{formErrors.name}</div>}
                        </div>
                        
                        <div className="form-group">
                            <label>
                                <FaEnvelope className="input-icon" /> Email
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                value={user.email} 
                                onChange={handleChange} 
                                placeholder="Enter email address"
                                disabled // Email should not be editable
                            />
                            {formErrors.email && <div className="field-error">{formErrors.email}</div>}
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <FaMobile className="input-icon" /> Mobile Number
                            </label>
                            <input 
                                type="text" 
                                name="mobile" 
                                value={user.mobile} 
                                onChange={handleChange} 
                                placeholder="Enter mobile number"
                            />
                            {formErrors.mobile && <div className="field-error">{formErrors.mobile}</div>}
                        </div>
                        
                        <div className="form-group">
                            <label>
                                <FaBriefcase className="input-icon" /> Role
                            </label>
                            <select 
                                name="role" 
                                value={user.role} 
                                onChange={handleChange}
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            {formErrors.role && <div className="field-error">{formErrors.role}</div>}
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <select 
                                name="department" 
                                value={user.department} 
                                onChange={handleChange}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            {formErrors.department && <div className="field-error">{formErrors.department}</div>}
                        </div>
                        
                        <div className="form-group">
                            <label>Salary</label>
                            <input 
                                type="number" 
                                name="salary" 
                                value={user.salary} 
                                onChange={handleChange} 
                                placeholder="Enter salary"
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Joining Date</label>
                            <input 
                                type="date" 
                                name="joiningDate" 
                                value={user.joiningDate} 
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Emergency Contact</label>
                            <input 
                                type="text" 
                                name="emergencyContact" 
                                value={user.emergencyContact} 
                                onChange={handleChange} 
                                placeholder="Emergency contact number"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea 
                            name="address" 
                            value={user.address} 
                            onChange={handleChange} 
                            placeholder="Enter address"
                            rows="3"
                        ></textarea>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            <FaSave /> {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;