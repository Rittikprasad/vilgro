import React from 'react';
import styles from './WhoShouldUse.module.css';
import BuildingIcon from '../../assets/svg/building.svg';
import MoneyIcon from '../../assets/svg/money.svg';

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
                src={BuildingIcon} 
                alt="For-profit social enterprises icon"
                className={styles.audienceIconImage}
              />
            </div>
            <h3 className={styles.audienceTitle}>
              For-profit social enterprises
            </h3>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Funders */}
          <div className={styles.audienceItem}>
            <div className={styles.audienceIcon}>
              <img 
                src={MoneyIcon} 
                alt="Funders icon"
                className={styles.audienceIconImage}
              />
            </div>
            <h3 className={styles.audienceTitle}>
              Funders for evaluating for-profit social enterprises
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoShouldUse;
