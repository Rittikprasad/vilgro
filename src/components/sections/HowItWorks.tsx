import React from 'react';
import { CheckCircle, BarChart3, FileText } from 'lucide-react';
import styles from './HowItWorks.module.css';

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
            <div className={styles.stepIcon}>
              <CheckCircle size={24} color="var(--villgro-green)" />
            </div>
            
            <h3 className={styles.stepNumber}>Step 1</h3>
            <p className={styles.stepDescription}>
              Answer a carefully curated set of questions (5-7 mins)
            </p>
          </div>

          {/* Step 2 */}
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <BarChart3 size={24} color="var(--villgro-green)" />
            </div>
            
            <h3 className={styles.stepNumber}>Step 2</h3>
            <p className={styles.stepDescription}>
              Get instant recommendations
            </p>
          </div>

          {/* Step 3 */}
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <FileText size={24} color="var(--villgro-green)" />
            </div>
            
            <h3 className={styles.stepNumber}>Step 3</h3>
            <p className={styles.stepDescription}>
              Receive tailored guidance on next steps
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
