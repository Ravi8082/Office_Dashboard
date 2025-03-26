import axios from 'axios';

export const logoutUser = async () => {
  try {
    // Get user email from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user && user.email) {
      // Call the logout API
      await axios.post('http://localhost:8081/logout', { email: user.email }, {
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