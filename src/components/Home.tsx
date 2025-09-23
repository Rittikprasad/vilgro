import React from 'react';
import styles from '../App.module.css';
import Header from './sections/Header';
import Hero from './sections/Hero';
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
      <div className={styles.content}>
        <Header />
        <Hero />
        <WhoShouldUse />
        <WhyUse />
        <Testimonials />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
