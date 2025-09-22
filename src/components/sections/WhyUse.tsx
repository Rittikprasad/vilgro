import React from 'react';
import styles from './WhyUse.module.css';

/**
 * Why Use This Tool section
 * Features a large background image and benefits list using CSS Modules
 */
const WhyUse: React.FC = () => {
  return (
    <section id="why-use" className={styles.section}>
      <div className={styles.container}>
        {/* Section Title */}
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>
            <span className={styles.titleGreen}>Why</span>
            <span> Use This Tool?</span>
          </h2>
        </div>

        <div className={styles.contentContainer}>
          {/* Left side - Background image section */}
          <div className={styles.imageSection}>
            {/* Laptop image handled by CSS background */}
          </div>

          {/* Right side - Benefits List */}
          <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitDot}>✓</div>
              <p className={styles.benefitText}>Get recommendation on right capital for you</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitDot}>✓</div>
              <p className={styles.benefitText}>Built by funders & experts in SPO evaluation</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitDot}>✓</div>
              <p className={styles.benefitText}>Assess your impact and financial readiness</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitDot}>✓</div>
              <p className={styles.benefitText}>Used by 200+ SPOs across India</p>
            </div>
          </div>
        </div>

        {/* Connecting lines as shown in Figma */}
        <div className={styles.connectingLine}></div>
        <div className={styles.connectingLineShort}></div>
      </div>
    </section>
  );
};

export default WhyUse;
