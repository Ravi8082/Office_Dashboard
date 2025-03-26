import React from 'react';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './Components/Registration/Registration';
import Login from './Components/Login/Login';
import Update from './Components/Update/Update';
import Manager from './Components/Manager/Manager';
import UserList from './Components/UserList/EmployeList';
import Home from './Components/Homepage/Home';
import Employee from './Components/Employee/Employee';
import Profile from './Components/Profile/Profile';
import Services from './Components/Services/Services';
import AboutUs from './Components/AboutUs/AboutUs';
import Contact from './Components/Contact/Contact';
import Attendance from './Components/Attendance/Attendance';
import ProtectedRoute from './Components/Protected/ProtectedRoute';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected routes */}
          <Route path="/update/:id" element={<ProtectedRoute element={<Update />} />} />
          <Route path="/employeelist" element={<ProtectedRoute element={<UserList />} allowedRoles={['admin', 'manager']} />} />
          <Route path="/manager" element={<ProtectedRoute element={<Manager />} allowedRoles={['admin', 'manager']} />} />
          <Route path="/employee" element={<ProtectedRoute element={<Employee />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/employee/attendance" element={<ProtectedRoute element={<Attendance />} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;