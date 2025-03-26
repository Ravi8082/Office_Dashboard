import React from 'react'
import './Home.css'
import Amazon from '../../assets/Amazon.png'
import Dell from '../../assets/Dell.png'
import Flipkart from '../../assets/Flipkart.png'
import Meta from '../../assets/Meta.png'
import Nykaa from '../../assets/Nykaa.png'
import Hcl from '../../assets/Hcl.png'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tagline">
            <span className="highlight-text">WE SERVE</span>
          </div>
          <h1 className="hero-title">
            Digital transformation <br />& scale up infrastructure
          </h1>
          <div className="hero-cta">
            <button className="btn-primary" onClick={handleContactClick}>Connect with our Experts</button>
            <button className="btn-secondary" onClick={handleContactClick}>Contact us now</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon website-icon"></div>
            <h3>Website Design</h3>
            <p>Our expert developers, smartly collaborate with the backend of the software to create compelling website that seamlessly drive the users experience.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon it-icon"></div>
            <h3>IT Management</h3>
            <p>IT management provides application development and execution with robust capabilities and end to end visibility.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon security-icon"></div>
            <h3>Data Security</h3>
            <p>Contribute for data security is completely and IT compliances govern by international data security and privacy maintenance policies.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon infrastructure-icon"></div>
            <h3>Infrastructure Plan</h3>
            <p>The key area in the infrastructure planning is to identify the issues, predict outcomes with the help of advanced analytics. We will assist you to establish a secure and responsive IT infrastructure.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon cyber-icon"></div>
            <h3>Cyber Security</h3>
            <p>Digital touch points increased the risk of cyber-attacks highly. We believe in delivery seamless experience over the internet.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon virtual-icon"></div>
            <h3>Virtualization Design</h3>
            <p>ARM experts allow you to create stable, reliable, scalable architectures for virtual design that reduce hardware costs.</p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <h2 className="section-title">Our Partners</h2>
        <div className="partners-slider">
          <div className="partners-track">
            <Link to="/" className="partner-logo">
              <img src={Amazon} alt="Amazon" />
            </Link>
            <Link to="/" className="partner-logo">
              <img src={Dell} alt="Dell" />
            </Link>
            <Link to="/" className="partner-logo">
              <img src={Flipkart} alt="Flipkart" />
            </Link>
            <Link to="/" className="partner-logo">
              <img src={Meta} alt="Meta" />
            </Link>
            <Link to="/" className="partner-logo">
              <img src={Nykaa} alt="Nykaa" />
            </Link>
            <Link to="/" className="partner-logo">
              <img src={Hcl} alt="Hcl" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Looking for Best service Provider?</h2>
          <button className="btn-primary" onClick={handleContactClick}>Talk to our Delivery Head</button>
        </div>
      </section>
    </div>
  )
}

export default Home