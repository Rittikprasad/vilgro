import React from 'react';
import styles from './Footer.module.css';
import VilgroLogoSvg from '../../assets/svg/VilgroLogo.svg';
import convergenceImage from '../../assets/convergence.png';

/**
 * Footer component with Villgro branding and partner logos
 * Features dark background with logo placeholders using CSS Modules
 */
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.logoSection}>
            <p className={styles.developedBy}>developed by</p>
            <img src={VilgroLogoSvg} alt="Villgro Logo" className={styles.villgroLogo} />
          </div>
          <div className={styles.partnerSection}>
            <p className={styles.supportedBy}>supported by</p>
            <img src={convergenceImage} alt="Convergence Logo" className={styles.convergenceLogo} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
