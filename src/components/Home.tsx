import React from 'react';
import styles from '../App.module.css';
import Header from './sections/Header';
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks';
import WhoShouldUse from './sections/WhoShouldUse';
import WhyUse from './sections/WhyUse';
import WhatYouGet from './sections/WhatYouGet';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';

/**
 * Home component that renders the main landing page
 * Contains all the original sections from the main App component
 */
const Home: React.FC = () => {
  return (
    <div className={styles.app}>
      {/* Background decorative ellipses matching Figma exactly */}
      <div className={styles.backgroundEllipse1} />
      <div className={styles.backgroundEllipse2} />
      <div className={styles.backgroundEllipse3} />
      <div className={styles.backgroundEllipse4} />
      <div className={styles.backgroundEllipse5} />

      {/* Content sections */}
      <div className={styles.content}>
        <Header />
        <Hero />
        <HowItWorks />
        <WhoShouldUse />
        <WhyUse />
        <WhatYouGet />
        <Testimonials />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
