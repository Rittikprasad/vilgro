import React from 'react';
import styles from './Hero.module.css';
import buttonStyles from '../ui/Button.module.css';

/**
 * Hero section with main headline, description and CTA buttons
 * Features the assessment dashboard mockup and glassmorphism effects
 */
const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Main Headline */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleGreen}>Quickly Assess your Funding Readiness</span>
            <span> and Get Matched with the Right Instrument</span>
          </h1>
          
          <p className={styles.heroDescription}>
            Our free, expert designed tool, evaluates your Organization's readiness for funding and recommends the most suitable financial instrument
          </p>

          {/* CTA Buttons */}
          <div className={styles.heroButtons}>
            <button className={buttonStyles.btnSecondary}>
              Start Your Assessment Now
            </button>
            
            <button className={buttonStyles.btnLink}>
              Want to learn more before starting?
            </button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className={styles.dashboardMockup}>
          {/* Main Assessment Interface */}
          <div className={styles.assessmentInterface}>
            <div className={styles.browserControls}>
              <div className={`${styles.browserDot} ${styles.browserDotRed}`}></div>
              <div className={`${styles.browserDot} ${styles.browserDotYellow}`}></div>
              <div className={`${styles.browserDot} ${styles.browserDotGreen}`}></div>
            </div>
            
            <div className={styles.interfaceContent}>
              {/* Left Sidebar */}
              <div className={styles.sidebar}>
                <div className={styles.sectionTitle}>Impact</div>
                <div>
                  <div>Impact</div>
                  <div>Risk</div>
                  <div>Return</div>
                  <div>Sector Maturity</div>
                  <div>Result</div>
                </div>
              </div>

              {/* Main Content */}
              <div className={styles.mainContent}>
                <div>
                  <h3 className={styles.questionTitle}>What</h3>
                  <p className={styles.questionTitle}>
                    1. What is the level of innovation introduced by the intervention?
                  </p>
                </div>
                
                <div>
                  <p className={styles.questionTitle}>
                    2. What is the impact on the affordability of products for the target group?
                  </p>
                  <div>
                    <div>0%</div>
                    <div>Progress bar placeholder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Bar Chart */}
          <div className={`${styles.floatingChart} ${styles.floatingChartRight}`}>
            <div className={styles.barChart}>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>30%</div>
                <div className={`${styles.bar} ${styles.bar30}`}></div>
              </div>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>70%</div>
                <div className={`${styles.bar} ${styles.bar70}`}></div>
              </div>
              <div className={styles.barItem}>
                <div className={styles.barLabel}>100%</div>
                <div className={`${styles.bar} ${styles.bar100}`}></div>
              </div>
            </div>
          </div>

          {/* Floating Pie Chart */}
          <div className={`${styles.floatingChart} ${styles.floatingChartLeft}`}>
            <div className={styles.pieChart}>
              <div className={styles.pieSegmentLarge}>90%</div>
              <div className={styles.pieSegmentMedium}>50%</div>
              <div className={styles.pieSegmentSmall}>10%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
