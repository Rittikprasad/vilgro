import React from 'react';
import styles from './HowItWorks.module.css';
import Step1Icon from '../../assets/svg/Step1.svg';
import Step2Icon from '../../assets/svg/Step2.svg';
import Step3Icon from '../../assets/svg/Step3.svg';

/**
 * How It Works section showing the 3-step process
 * Features step cards with icons and connecting lines using CSS Modules
 */
const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        {/* Section Title */}
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>
            <span>How It </span>
            <span className={styles.titleGreen}>Works</span>
          </h2>
        </div>

        {/* Steps */}
        <div className={styles.stepsContainer}>
          {/* Step 1 */}
          <div className={styles.stepCard}>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3 className={styles.stepNumber}>Step 1</h3>
                <div className={styles.stepIcon}>
                  <img src={Step1Icon} alt="Step 1 Icon" className={styles.stepIconImage} />
                </div>
              </div>
              
              <p className={styles.stepDescription}>
                Answer a carefully curated set of questions (5-7 mins)
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.stepCard}>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3 className={styles.stepNumber}>Step 2</h3>
                <div className={styles.stepIcon}>
                  <img src={Step2Icon} alt="Step 2 Icon" className={styles.stepIconImage} />
                </div>
              </div>
              
              <p className={styles.stepDescription}>
                Get instant recommendations
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className={styles.stepCard}>
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3 className={styles.stepNumber}>Step 3</h3>
                <div className={styles.stepIcon}>
                  <img src={Step3Icon} alt="Step 3 Icon" className={styles.stepIconImage} />
                </div>
              </div>
              
              <p className={styles.stepDescription}>
                Receive tailored guidance on next steps
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
