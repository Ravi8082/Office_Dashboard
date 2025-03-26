import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationTriangle } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged out
    const isLoggedOut = localStorage.getItem("isLoggedOut");
    
    // Check if token exists
    const token = localStorage.getItem("token");
    
    if (isLoggedOut === "true") {
      // User has been logged out, don't redirect even if token exists
      // Clear any stale tokens that might be present
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setMessage("You have been logged out. Please login again to continue.");
    } else if (token) {
      // Only redirect if user has a token and hasn't been logged out
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData.role === "admin" || userData.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (message) setMessage("");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
  
    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8081/login", formData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        const { userId, role, name, email, token } = response.data;
  
        // Store user details in localStorage
        localStorage.setItem("user", JSON.stringify({ userId, role, name, email, token }));
        localStorage.setItem("token", token);
        
        // Reset the logged out flag when user logs in
        localStorage.removeItem("isLoggedOut");
  
        // Set default Axios Authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
        // Redirect based on role
        if (role === "admin" || role === "manager") {
          navigate("/manager");
        } else {
          navigate("/employee");
        }
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      if (error.response?.status === 403) {
        setMessage("Access Denied: You do not have permission.");
      } else if (error.response?.status === 401) {
        setMessage("Invalid email or password.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>
        
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              placeholder="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          
          <div className="remember-forgot">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>
          
          {message && (
            <div className="error-message">
              <FaExclamationTriangle /> {message}
            </div>
          )}
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="register-link">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
};

// Logout function that can be exported and used in other components
export const logoutUser = async () => {
  try {
    // Get user email from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user && user.email) {
      // Call the logout API
      await axios.post("http://localhost:8081/logout", { email: user.email }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    }
    
    // Set logged out flag
    localStorage.setItem('isLoggedOut', 'true');
    
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if the API call fails, we should still log out the user locally
    localStorage.setItem('isLoggedOut', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  }
};

export default Login;