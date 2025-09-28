import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from 'lucide-react';
import styles from './FAQ.module.css';

/**
 * FAQ section with expandable questions
 * Uses CSS Modules for styling matching Figma design
 */
const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      id: 1,
      question: "FAQ Question 1",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet,"
    },
    {
      id: 2,
      question: "FAQ Question 2",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet,"
    },
    {
      id: 3,
      question: "FAQ Question 3",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet,"
    },
    {
      id: 4,
      question: "FAQ Question 4",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et Lorem ipsum dolor sit amet,"
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className = {styles.gradientBackground}></div>
        {/* Section Title */}
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>
            <span>Frequently Asked </span>
            <span className={styles.titleGreen}>Questions</span>
          </h2>
        </div>

        {/* FAQ Items */}
        <div className={styles.faqContainer}>
          {faqData.map((item, index) => {
            const isOpen = openItems.includes(item.id);
            
            return (
              <div key={item.id} className={styles.faqItem}>
                <button
                  onClick={() => toggleItem(item.id)}
                  className={styles.faqButton}
                >
                  <h3 className={styles.faqQuestion}>
                    {item.question}
                  </h3>
                  
                  <div className={styles.faqToggle}>
                    {isOpen ? (
                      <MinusIcon className={styles.faqIcon} />
                    ) : (
                      <PlusIcon className={styles.faqIcon} />
                    )}
                  </div>
                </button>
                
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p className={styles.faqAnswerText}>
                      {item.answer}
                    </p>
                  </div>
                )}
                
                {/* Horizontal lines matching Figma */}
                <div className={`${styles.faqHorizontalLine} ${styles[`faqLine${index + 1}`]}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
