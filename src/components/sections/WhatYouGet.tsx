import React from 'react';
import { BarChart3, Lightbulb, BookOpen } from 'lucide-react';
import styles from './WhatYouGet.module.css';

/**
 * What You'll Get section
 * Shows the three main outcomes users will receive using CSS Modules
 */
const WhatYouGet: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Title */}
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>
            <span className={styles.titleGreen}>What</span>
            <span> You'll Get</span>
          </h2>
        </div>

        {/* Outcomes */}
        <div className={styles.outcomesContainer}>
          {/* Evaluation Results */}
          <div className={styles.outcomeItem}>
            <div className={styles.outcomeIcon}>
              <BarChart3 size={32} color="var(--villgro-green)" />
            </div>
            <h3 className={styles.outcomeTitle}>
              Your evaluation results
            </h3>
          </div>

          {/* Tailored Recommendations */}
          <div className={styles.outcomeItem}>
            <div className={styles.outcomeIcon}>
              <Lightbulb size={32} color="var(--villgro-green)" />
            </div>
            <h3 className={styles.outcomeTitle}>
              Tailored recommendations for your organization
            </h3>
          </div>

          {/* Resources */}
          <div className={styles.outcomeItem}>
            <div className={styles.outcomeIcon}>
              <BookOpen size={32} color="var(--villgro-green)" />
            </div>
            <h3 className={styles.outcomeTitle}>
              Resources for next steps
            </h3>
          </div>
          
          {/* Connecting lines positioned exactly as in Figma */}
          <div className={styles.connectingLine1}></div>
          <div className={styles.connectingLine2}></div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
