import React from 'react';
import './AboutUs.css';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaChartLine, FaHandshake } from 'react-icons/fa';

const AboutUs = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          className="about-hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1>About ARM Infotech</h1>
          <p>Empowering businesses through innovative technology solutions since 2010</p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="about-story">
        <div className="about-section-container">
          <motion.div 
            className="about-story-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2>Our Story</h2>
            <div className="about-divider"></div>
            <p>
              Founded in 2010 in Chittorgarh, Rajasthan, ARM Infotech began with a simple mission: to provide cutting-edge technology solutions that help businesses thrive in the digital age. What started as a small team of passionate tech enthusiasts has grown into a comprehensive IT service provider trusted by organizations across India.
            </p>
            <p>
              Over the years, we've expanded our expertise across web development, cybersecurity, infrastructure planning, and more. Our journey has been defined by our commitment to excellence, innovation, and building lasting relationships with our clients.
            </p>
          </motion.div>
          <motion.div 
            className="about-timeline"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="timeline-item" variants={fadeIn}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2010</h3>
                <p>Founded in Chittorgarh with a team of 5 developers</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={fadeIn}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2015</h3>
                <p>Expanded services to include cybersecurity solutions</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={fadeIn}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2018</h3>
                <p>Reached milestone of 100+ successful projects</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={fadeIn}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2023</h3>
                <p>Recognized as one of the top IT service providers in Rajasthan</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-section-container">
          <motion.div 
            className="about-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2>Our Core Values</h2>
            <div className="about-divider"></div>
            <p>The principles that guide everything we do</p>
          </motion.div>

          <motion.div 
            className="values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div className="value-card" variants={fadeIn}>
              <div className="value-icon">
                <FaUsers />
              </div>
              <h3>Client-Centric</h3>
              <p>We put our clients' needs at the center of everything we do, ensuring solutions that truly address their challenges.</p>
            </motion.div>

            <motion.div className="value-card" variants={fadeIn}>
              <div className="value-icon">
                <FaLightbulb />
              </div>
              <h3>Innovation</h3>
              <p>We constantly explore new technologies and approaches to deliver cutting-edge solutions.</p>
            </motion.div>

            <motion.div className="value-card" variants={fadeIn}>
              <div className="value-icon">
                <FaChartLine />
              </div>
              <h3>Excellence</h3>
              <p>We are committed to delivering the highest quality in every project, no matter the size.</p>
            </motion.div>

            <motion.div className="value-card" variants={fadeIn}>
              <div className="value-icon">
                <FaHandshake />
              </div>
              <h3>Integrity</h3>
              <p>We operate with transparency, honesty, and ethical practices in all our business dealings.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="about-section-container">
          <motion.div 
            className="about-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2>Our Leadership Team</h2>
            <div className="about-divider"></div>
            <p>Meet the experts behind our success</p>
          </motion.div>

          <motion.div 
            className="team-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {/* You can replace these with actual team members */}
            <motion.div className="team-member" variants={fadeIn}>
              <div className="member-photo member-1"></div>
              <h3>Nandlal Yadav</h3>
              <p className="member-title">Founder & CEO</p>
              <p className="member-bio">With over 3 Month of experience in IT, Amit leads our vision and strategic direction.</p>
            </motion.div>

            <motion.div className="team-member" variants={fadeIn}>
              <div className="member-photo member-2"></div>
              <h3>Akash kumar</h3>
              <p className="member-title">CTO</p>
              <p className="member-bio">Akash oversees our technical operations and ensures we stay at the cutting edge of technology.</p>
            </motion.div>

            <motion.div className="team-member" variants={fadeIn}>
              <div className="member-photo member-3"></div>
              <h3>Mayank Raj</h3>
              <p className="member-title">Head of Cybersecurity</p>
              <p className="member-bio">Mayank brings extensive expertise in protecting digital assets and infrastructure.</p>
            </motion.div>

            <motion.div className="team-member" variants={fadeIn}>
              <div className="member-photo member-4"></div>
              <h3>Dilip Kumar Mali</h3>
              <p className="member-title">Client Relations Director</p>
              <p className="member-bio">Dilip ensures our clients receive exceptional service and support throughout their journey with us.</p>
            </motion.div>
            
            <motion.div className="team-member" variants={fadeIn}>
              <div className="member-photo member-5"></div>
              <h3>Ravi Pal</h3>
              <p className="member-title">Lead Developer</p>
              <p className="member-bio">Ravi leads our development team with innovative solutions and technical expertise in web and mobile applications.</p>
            </motion.div>
            
            <motion.div className="team-member" variants={fadeIn}>
              <div className="member-photo member-6"></div>
              <h3>Pawan</h3>
              <p className="member-title">UI/UX Design Lead</p>
              <p className="member-bio">Pawan creates intuitive and engaging user experiences that help our clients connect with their customers effectively.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="about-section-container">
          <motion.div 
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="stat-item" variants={fadeIn}>
              <h3>200+</h3>
              <p>Projects Completed</p>
            </motion.div>
            <motion.div className="stat-item" variants={fadeIn}>
              <h3>50+</h3>
              <p>Team Members</p>
            </motion.div>
            <motion.div className="stat-item" variants={fadeIn}>
              <h3>12+</h3>
              <p>Years of Experience</p>
            </motion.div>
            <motion.div className="stat-item" variants={fadeIn}>
              <h3>95%</h3>
              <p>Client Satisfaction</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <motion.div 
          className="about-cta-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2>Ready to work with us?</h2>
          <p>Let's discuss how we can help your business grow with our technology solutions</p>
          <button className="about-cta-button">Get in Touch</button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;