import React from 'react';
import styles from './WhoShouldUse.module.css';

/**
 * Who Should Use This Tool section
 * Shows the target audiences with visual indicators using CSS Modules
 */
const WhoShouldUse: React.FC = () => {
  return (
    <section id="for-who" className={styles.section}>
      <div className={styles.container}>
        {/* Section Title */}
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>
            <span className={styles.titleWhite}>Who </span>
            <span className={styles.titleDark}>Should Use This Tool</span>
          </h2>
        </div>

        {/* Target Audiences */}
        <div className={styles.audiencesContainer}>
          {/* For-profit Social Enterprises */}
          <div className={styles.audienceItem}>
            <div className={styles.audienceIcon}>
              <img 
                src="http://localhost:3845/assets/651bba0638e027fe7ff498779a5962ec20d8b228.svg" 
                alt="For-profit social enterprises icon"
              />
            </div>
            <h3 className={styles.audienceTitle}>
              For-profit <br />
              social enterprises
            </h3>
          </div>

          {/* Funders */}
          <div className={styles.audienceItem}>
            <div className={styles.audienceIcon}>
              <img 
                src="http://localhost:3845/assets/91d75a77ec42b9fdd887c2bff7498c5ab25a68c3.svg" 
                alt="Funders icon"
              />
            </div>
            <h3 className={styles.audienceTitle}>
              Funders for evaluating <br />
              for-profit social enterprises
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoShouldUse;
