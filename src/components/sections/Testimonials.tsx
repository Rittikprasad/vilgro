import React from 'react';
import { Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

/**
 * Testimonials section
 * Features testimonial cards with glassmorphism effect using CSS Modules
 */
const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.container}>
        {/* Section Title */}
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>
            Testimonials
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className={styles.testimonialsContainer}>
          {/* Testimonial 1 */}
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialHeader}>
              <h3 className={styles.organizationName}>
                Organisation 1
              </h3>
            </div>
            
            <p className={styles.testimonialText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet,
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialHeader}>
              <h3 className={styles.organizationName}>
                Organisation 2
              </h3>
            </div>
            
            <p className={styles.testimonialText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet,
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
