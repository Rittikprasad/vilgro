import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logoImage from '../../assets/logo.png';
import { Button } from '../ui/Button';


const Header: React.FC = () => {
  const navigate = useNavigate();
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
        <Button style={{backgroundColor: 'var(--villgro-dark)', color: 'white'}} size="sm" onClick={() => navigate('/login')}>
              Start Your Assessment
            </Button>       
        </div>
      </div>
    </header>
  );
};

export default Header;
