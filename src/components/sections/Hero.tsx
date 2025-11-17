import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Hero.module.css';
import buttonStyles from '../ui/Button.module.css';
import { Button } from '../ui/Button';
import heroSectionImage from '../../assets/heroSection.png';
import heroVideo from '../../assets/video/hero.mp4';
import Step1Icon from '../../assets/svg/Step1.svg';
import Step2Icon from '../../assets/svg/Step2.svg';
import Step3Icon from '../../assets/svg/Step3.svg';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../app/store';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, has_completed_profile } = useSelector((state: RootState) => state.auth);

  const handleStartAssessment = () => {
    // If user has completed profile, go directly to assessment
    // Otherwise, go to signup flow
    if (isAuthenticated && has_completed_profile) {
      navigate('/assessment');
    } else {
      navigate('/signup');
    }
  };
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Main Headline */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleGreen}>Quickly Assess your Funding Readiness</span>
            <span> and </span><br/>
            <span>Get Matched with the Right Instrument</span>
          </h1>
          
          <p className={styles.heroDescription}>
            Our free, expert designed tool, evaluates your Organization's readiness <br/> for funding and recommends the most suitable financial instrument
          </p>

          {/* CTA Buttons */}
          <div className={styles.heroButtons}>
            <Button variant="gradient" size="lg" onClick={handleStartAssessment}>
              Start Your Assessment Now
            </Button>
            
            <button className={buttonStyles.btnLink}>
              Want to learn more before starting?
            </button>
          </div>
        </div>

        <div className={styles.videoWrapper}>
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            poster={heroSectionImage}
            aria-label="Assessment Interface Demo Video"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className={styles.howItWorksSection}>
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
