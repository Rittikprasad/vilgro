import React from 'react';
import styles from './Hero.module.css';
import buttonStyles from '../ui/Button.module.css';
import { Button } from '../ui/Button';
import heroSectionImage from '../../assets/heroSection.png';
import Step1Icon from '../../assets/svg/Step1.svg';
import Step2Icon from '../../assets/svg/Step2.svg';
import Step3Icon from '../../assets/svg/Step3.svg';

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
            <Button variant="gradient" size="lg">
              Start Your Assessment Now
            </Button>
            
            <button className={buttonStyles.btnLink}>
              Want to learn more before starting?
            </button>
          </div>
        </div>

          {/* Dashboard Mockup */}
          <div className={styles.dashboardMockup}>
            {/* Main Assessment Interface */}
            {/* <div className={styles.assessmentInterface}> */}
              <img 
                src={heroSectionImage} 
                alt="Assessment Interface Mockup" 
                className={styles.assessmentImage}
              />
            {/* </div> */}

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

        {/* How It Works Section */}
        <div className={styles.howItWorksSection}>
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
      </div>
    </section>
  );
};

export default Hero;
