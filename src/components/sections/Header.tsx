import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logoImage from '../../assets/logo.png';
import { Button } from '../ui/Button';


const Header: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Smooth scroll to element by ID
   */
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    // If not on home page, navigate first then scroll
    const currentPath = window.location.pathname;
    if (currentPath !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        scrollToElement(targetId);
      }, 300);
    } else {
      // Already on home page, scroll immediately
      scrollToElement(targetId);
    }
  };

  /**
   * Scroll to element helper function
   */
  const scrollToElement = (targetId: string) => {
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      } else {
        console.warn(`Element with id "${targetId}" not found`);
      }
    }, 100);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={logoImage} alt="Villgro Logo" className={styles.logoImage} />
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a href="#how-it-works" className={styles.navLink} onClick={(e) => handleScrollTo(e, 'how-it-works')}>
            How It Works
          </a>
          <a href="#for-who" className={styles.navLink} onClick={(e) => handleScrollTo(e, 'for-who')}>
            For Who
          </a>
          <a href="#why-use" className={styles.navLink} onClick={(e) => handleScrollTo(e, 'why-use')}>
            Why use
          </a>
          <a href="#testimonials" className={styles.navLink} onClick={(e) => handleScrollTo(e, 'testimonials')}>
            Testimonials
          </a>
        </nav>

        {/* CTA Button and Login Link */}
        <div className={styles.headerActions}>  
        <Button style={{backgroundColor: 'var(--villgro-dark)', color: 'white'}} size="sm" onClick={() => navigate('/signup')}>
              Start Your Assessment
            </Button>       
        </div>
      </div>
    </header>
  );
};

export default Header;
