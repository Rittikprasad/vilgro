import React, { useState, useEffect, useRef } from 'react';
import styles from './WhyUse.module.css';
import laptopImage from '../../assets/laptop.png';
import MeterIcon from '../../assets/svg/meter.svg';
import PersonIcon from '../../assets/svg/person.svg';
import ResourceIcon from '../../assets/svg/Resourse.svg';

/**
 * Why Use This Tool section
 * Features a large background image and benefits list using CSS Modules
 * Includes scroll-based animation for the green progress line
 */
const WhyUse: React.FC = () => {
  const benefitsListRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!benefitsListRef.current) return;

      const element = benefitsListRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Line starts at 130px from top of benefitsList and has height of calc(100% - 340px)
      const lineStartOffset = 130;
      const lineEndOffset = 340;
      const lineTop = rect.top + lineStartOffset;
      const lineHeight = rect.height - lineEndOffset;
      
      // Calculate progress: fill as user scrolls through the line
      // Start when line top enters middle of viewport, finish when line bottom exits
      const triggerPoint = windowHeight * 0.5; // Middle of viewport
      const lineBottom = lineTop + lineHeight;
      
      let progress = 0;
      if (lineTop <= triggerPoint) {
        // Line has started to fill
        if (lineBottom <= triggerPoint) {
          // Entire line has passed the trigger point
          progress = 1;
        } else {
          // Line is partially past trigger point
          const scrolledPast = triggerPoint - lineTop;
          progress = scrolledPast / lineHeight;
          progress = Math.max(0, Math.min(1, progress));
        }
      }
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="why-use" className={styles.section}>
      {/* Gradient background div */}
      <div className={styles.gradientBackground}></div>
      <div className={styles.gradientBackground1}></div>
      <div className={styles.container}>
        <div className={styles.whyUseSection}>
          

          <div className={styles.contentContainer}>
            <div className={styles.imageSection}>
              <img src={laptopImage} alt="Person using laptop" className={styles.laptopImage} />
            </div>

            {/* Right side - Benefits List */}
            <div 
              ref={benefitsListRef}
              className={styles.benefitsList}
              style={{ '--scroll-progress': scrollProgress } as React.CSSProperties}
            >
            <div className={styles.sectionTitle}>
            <h2 className={styles.title}>
              <span className={styles.titleGreen}>Why</span>
              <span> Use This Tool?</span>
            </h2>
          </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitDot}></div>
              <p className={styles.benefitText}>Get recommendation on right capital for you</p>
            </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitDot}></div>
                <p className={styles.benefitText}>Built by funders & experts in Social Enterprises evaluation</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitDot}></div>
                <p className={styles.benefitText}>Assess your impact and financial readiness</p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitDot}></div>
                <p className={styles.benefitText}>Used by 200+ Social Enterprises across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Get Section */}
        <div className={styles.whatYouGetSection}>
          <div className={styles.sectionTitle1}>
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
