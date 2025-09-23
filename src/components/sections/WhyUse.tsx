import React from 'react';
import styles from './WhyUse.module.css';
import laptopImage from '../../assets/laptop.png';
import MeterIcon from '../../assets/svg/meter.svg';
import PersonIcon from '../../assets/svg/person.svg';
import ResourceIcon from '../../assets/svg/Resourse.svg';

/**
 * Why Use This Tool section
 * Features a large background image and benefits list using CSS Modules
 */
const WhyUse: React.FC = () => {
  return (
    <section id="why-use" className={styles.section}>
      <div className={styles.container}>
        {/* Why Use This Tool Section */}
        <div className={styles.whyUseSection}>
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
              <img src={laptopImage} alt="Person using laptop" className={styles.laptopImage} />
            </div>

            {/* Right side - Benefits List */}
            <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitDot}></div>
              <p className={styles.benefitText}>Recommendation on right capital for you</p>
            </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitDot}></div>
                <p className={styles.benefitText}>Built by funders & experts in SPO evaluation</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitDot}></div>
                <p className={styles.benefitText}>Assess your impact and financial readiness</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitDot}></div>
                <p className={styles.benefitText}>Used by 200+ SPOs across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Get Section */}
        <div className={styles.whatYouGetSection}>
          <div className={styles.sectionTitle}>
            <h2 className={styles.title}>
              <span className={styles.titleGreen}>What</span>
              <span className={styles.titleDark}> You'll Get</span>
            </h2>
          </div>

          <div className={styles.itemsContainer}>
            <div className={styles.item}>
              <div className={styles.itemIcon}>
                <img src={MeterIcon} alt="Evaluation results" className={styles.itemIconImage} />
              </div>
              <h3 className={styles.itemTitle}>Your evaluation results</h3>
            </div>

            <div className={styles.itemDivider}></div>

            <div className={styles.item}>
              <div className={styles.itemIcon}>
                <img src={PersonIcon} alt="Tailored recommendations" className={styles.itemIconImage} />
              </div>
              <h3 className={styles.itemTitle}>Tailored recommendations for your organization</h3>
            </div>

            <div className={styles.itemDivider}></div>

            <div className={styles.item}>
              <div className={styles.itemIcon}>
                <img src={ResourceIcon} alt="Resources" className={styles.itemIconImage} />
              </div>
              <h3 className={styles.itemTitle}>Resources for next steps</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUse;
