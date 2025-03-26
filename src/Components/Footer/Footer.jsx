import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer-container">
            <div className="footer-top">
                <div className="footer-logo-section">
                    <h2 className="footer-logo">EPMLOYEE</h2>
                    <p className="footer-description">
                        We provide innovative IT solutions and services to help businesses transform and thrive in a digital world.
                    </p>
                    <div className="footer-contact">
                        <div className="contact-item">
                            <MdLocationOn className="contact-icon" />
                            <span>Mewar University Chhitorgarh Rajashtan 312901</span>
                        </div>
                        <div className="contact-item">
                            <MdPhone className="contact-icon" />
                            <span>8052696360</span>
                        </div>
                        <div className="contact-item">
                            <MdEmail className="contact-icon" />
                            <span>palravi1093@gmail.com</span>
                        </div>
                    </div>
                </div>
                
                <div className="footer-links">
                    <div className="footer-column">
                        <h3 className="footer-heading">SERVICES</h3>
                        <ul className="footer-list">
                            <li><Link to="/">Web Development</Link></li>
                            <li><Link to="/">Application Security</Link></li>
                            <li><Link to="/">JAVA Development</Link></li>
                            <li><Link to="/">Cyber Security</Link></li>
                            <li><Link to="/">Network Security</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column">
                        <h3 className="footer-heading">SOLUTIONS</h3>
                        <ul className="footer-list">
                            <li><Link to="/">Managed Security</Link></li>
                            <li><Link to="/">VAPT</Link></li>
                            <li><Link to="/">Developments</Link></li>
                            <li><Link to="/">Strategic Solutions</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column">
                        <h3 className="footer-heading">RESOURCES</h3>
                        <ul className="footer-list">
                            <li><Link to="/">Blog</Link></li>
                            <li><Link to="/">Datasheets</Link></li>
                            <li><Link to="/">Case Studies</Link></li>
                            <li><Link to="/">Podcasts</Link></li>
                            <li><Link to="/">Events</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="social-links">
                    <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
                        <FaInstagram />
                    </a>
                    <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
                        <FaFacebookF />
                    </a>
                    <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
                        <FaTwitter />
                    </a>
                    <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn">
                        <FaLinkedinIn />
                    </a>
                    <a href="https://youtube.com" className="social-icon" aria-label="YouTube">
                        <FaYoutube />
                    </a>
                </div>
                
                <div className="footer-divider"></div>
                
                <div className="footer-info">
                    <p className="copyright">© {currentYear} EPMLOYEE. All rights reserved.</p>
                    <div className="footer-legal">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cookies">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer