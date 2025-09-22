import React from 'react';
import styles from './Footer.module.css';

/**
 * Footer component with Villgro branding and partner logos
 * Features dark background with logo placeholders using CSS Modules
 */
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Left - Villgro Logo */}
          <div className={styles.logoSection}>
            <div className={styles.villgroLogo}>
              VILLGRO
            </div>
          </div>

          {/* Right - Partner Logo */}
          <div className={styles.partnerLogo}>
            Partner Logo
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          © 2024 Villgro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
