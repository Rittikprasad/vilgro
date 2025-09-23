import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import buttonStyles from '../ui/Button.module.css';
import logoImage from '../../assets/logo.png';

/**
 * Header component with navigation and logo
 * Features glassmorphism effect and responsive navigation using CSS Modules
 */
const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={logoImage} alt="Villgro Logo" className={styles.logoImage} />
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a href="#how-it-works" className={styles.navLink}>
            How It Works?
          </a>
          <a href="#for-who" className={styles.navLink}>
            For Who?
          </a>
          <a href="#why-use" className={styles.navLink}>
            Why use?
          </a>
          <a href="#testimonials" className={styles.navLink}>
            Testimonials
          </a>
        </nav>

        {/* CTA Button and Login Link */}
        <div className={styles.headerActions}>  
          <Link to="/login" className={buttonStyles.btnPrimary}>
            Start Your Assessment
          </Link>        
        </div>
      </div>
    </header>
  );
};

export default Header;
