import React, { useState } from 'react';
import './Services.css';
import { FaCode, FaShieldAlt, FaServer, FaNetworkWired, FaLaptopCode, FaCloudUploadAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Services = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 1,
      icon: <FaCode />,
      title: "Web Development",
      shortDesc: "Custom web solutions for your business needs",
      description: "Our expert developers create compelling websites that seamlessly drive user experience. We specialize in responsive design, e-commerce solutions, and custom web applications that help businesses achieve their digital goals.",
      features: ["Responsive Design", "E-commerce Solutions", "CMS Integration", "Performance Optimization", "SEO-friendly Structure"]
    },
    {
      id: 2,
      icon: <FaShieldAlt />,
      title: "Application Security",
      shortDesc: "Protect your applications from threats",
      description: "We implement robust security measures to protect your applications from modern threats. Our comprehensive approach includes vulnerability assessment, secure coding practices, and continuous monitoring to ensure your data remains safe.",
      features: ["Vulnerability Assessment", "Secure Coding Practices", "Penetration Testing", "Security Audits", "Compliance Management"]
    },
    {
      id: 3,
      icon: <FaLaptopCode />,
      title: "JAVA Development",
      shortDesc: "Enterprise-grade Java solutions",
      description: "Our Java development team builds scalable, high-performance applications for enterprises. From microservices to large-scale systems, we leverage Java's robust ecosystem to deliver reliable solutions that meet your business requirements.",
      features: ["Enterprise Applications", "Microservices Architecture", "Spring Framework", "Java EE Solutions", "Legacy System Migration"]
    },
    {
      id: 4,
      icon: <FaServer />,
      title: "Cyber Security",
      shortDesc: "Comprehensive digital protection",
      description: "As digital touchpoints increase the risk of cyber-attacks, our comprehensive security solutions help protect your digital assets. We provide end-to-end security services that safeguard your infrastructure, applications, and data.",
      features: ["Threat Detection", "Incident Response", "Security Monitoring", "Risk Assessment", "Employee Training"]
    },
    {
      id: 5,
      icon: <FaNetworkWired />,
      title: "Network Security",
      shortDesc: "Secure your network infrastructure",
      description: "Our network security solutions protect your infrastructure from unauthorized access and attacks. We design and implement secure network architectures that safeguard your critical assets while maintaining optimal performance.",
      features: ["Firewall Configuration", "VPN Implementation", "Network Monitoring", "Intrusion Detection", "Secure Architecture Design"]
    },
    {
      id: 6,
      icon: <FaCloudUploadAlt />,
      title: "Cloud Solutions",
      shortDesc: "Scalable cloud infrastructure",
      description: "We help businesses leverage the power of cloud computing with tailored solutions. Our cloud experts design, migrate, and manage cloud infrastructure that scales with your business needs while optimizing costs and performance.",
      features: ["Cloud Migration", "Infrastructure as Code", "Multi-cloud Strategy", "Cost Optimization", "Managed Cloud Services"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const handleServiceClick = (id) => {
    setActiveService(activeService === id ? null : id);
  };

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Comprehensive IT solutions tailored to your business needs</p>
      </div>

      <motion.div 
        className="services-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service) => (
          <motion.div 
            key={service.id}
            className={`service-card ${activeService === service.id ? 'active' : ''}`}
            variants={itemVariants}
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p className="service-short-desc">{service.shortDesc}</p>
            
            <div className="service-details">
              <p>{service.description}</p>
              <div className="service-features">
                <h4>Key Features</h4>
                <ul>
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button className="learn-more-btn">Learn More</button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="services-cta">
        <h2>Need a custom solution?</h2>
        <p>Contact our team to discuss your specific requirements</p>
        <button className="contact-btn">Get in Touch</button>
      </div>
    </div>
  );
};

export default Services;