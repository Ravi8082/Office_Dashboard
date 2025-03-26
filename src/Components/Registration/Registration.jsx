import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    joiningDate: '',
    salary: '',
    manager: '',
    address: '',
    emergencyContact: '',
  });
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegLoading, setIsRegLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([
    'Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'IT', 'Operations'
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the current user is a manager
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8081/getLoggedInUser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data.role === 'Manager' || response.data.role === 'Admin') {
          setIsManager(true);
        }
      })
      .catch(error => {
        console.error('Error checking user role:', error);
      });

      // Fetch list of managers for dropdown
      axios.get('http://localhost:8081/managers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setManagers(response.data);
      })
      .catch(error => {
        console.error('Error fetching managers:', error);
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null); // Reset error on change
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError(null); // Reset error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setIsRegLoading(true); // Start loading
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // If manager is adding employee, use different endpoint
      const endpoint = isManager ? 'http://localhost:8081/addEmployee' : 'http://localhost:8081/registerUser';
      
      await axios.post(endpoint, formData, { headers });

      if (isManager) {
        setSuccess('Employee added successfully!');
        setTimeout(() => {
          navigate('/employeelist');
        }, 2000);
      } else {
        setSuccess('Registration initiated. Please check your email for OTP.');
        setShowOtpForm(true); // Show OTP form
      }
      
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError('Error initiating registration. Please try again later.');
      }
    } finally {
      setIsRegLoading(false); // Stop loading
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsOtpLoading(true); // Start loading
      await axios.post('http://localhost:8081/verify-otp', {
        email: formData.email,
        otp: otp,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess('OTP verified successfully. Registration complete.');
      setError(null);
      setShowOtpForm(false); 

      // Navigate to the login page
      navigate('/login');
    } catch (error) {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setIsOtpLoading(false); // Stop loading
    }
  };

  return (
    <div className="box">
      <div className="containers">
        <h3 className='text-center rf'><b>{isManager ? 'Add New Employee' : 'Registration Form'}</b></h3>
        <form onSubmit={handleSubmit}>
          <div className="form-groups">
            <label htmlFor="name" className='n'>Full Name</label><br />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="email" className='n'>Email</label><br />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="mobile" className='n'>Mobile</label><br />
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
          <div className="form-groups half">
  <label htmlFor="role" className="n">Role</label><br />
  <select
    id="role"
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="">Select a role</option>
    <option value="DEVELOPER">Developer</option>
    <option value="TESTER">Tester</option>
    <option value="PROJECT_MANAGER">Project Manager</option>
    <option value="SYSTEM_ADMINISTRATOR">System Administrator</option>
    <option value="BUSINESS_ANALYST">Business Analyst</option>
    <option value="IT_SUPPORT">IT Support</option>
  </select>
</div>

          </div>
          
          {isManager && (
            <>
              <div className="form-row">
                <div className="form-groups half">
                  <label htmlFor="joiningDate" className='n'>Joining Date</label><br />
                  <input
                    type="date"
                    id="joiningDate"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-groups half">
                  <label htmlFor="salary" className='n'>Salary</label><br />
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-groups">
                <label htmlFor="manager" className='n'>Reporting Manager</label><br />
                <select
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>{manager.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-groups">
                <label htmlFor="address" className='n'>Address</label><br />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
              
              <div className="form-groups">
                <label htmlFor="emergencyContact" className='n'>Emergency Contact</label><br />
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          
          <div className="form-groups">
            <label htmlFor="password" className='n'>Password</label><br />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="confirmPassword" className='n'>Confirm Password</label><br />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className='btnR'>
            <button type="submit" disabled={isRegLoading}>
              {isManager ? 'Add Employee' : 'Register'}
            </button>
          </div>
          {error && <div className='error'>{error}</div>}
          {success && <div className='success'>{success}</div>}
        </form>

        {showOtpForm && (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-groups">
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder='Enter OTP'
                value={otp}
                onChange={handleOtpChange}
                required
              />
            </div>
            <div className='btnR'>
              <button type="submit" disabled={isOtpLoading}>Verify OTP</button>
            </div>
            {error && <div className='error'>{error}</div>}
            {success && <div className='success'>{success}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;