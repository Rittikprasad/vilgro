import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from 'lucide-react';
import styles from './FAQ.module.css';

/**
 * FAQ section with expandable questions
 * Uses CSS Modules for styling matching Figma design
 */
const FAQ: React.FC = () => {
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: "Who is the Blended Finance Toolkit meant for?",
      answer: "For Donors: To screen For-Profit Social Enterprises for subsidy-worthiness, and prioritize those where philanthropic capital is truly additional and risk-bearing. For Impact Investors: To co-design blended structures with risk-appropriate return expectations. For Intermediaries: To create pooled vehicles or investment platforms where subsidy can be strategically deployed across a portfolio. For For-Profit Social Enterprises: To articulate their financing ask credibly and match their capital raise to their growth and impact stage."
    },
    {
      id: 2,
      question: "What is the purpose of the Blended Finance Toolkit?",
      answer: "For-Profit Social Enterprises usually target underserved populations with innovation-led solutions that traditional capital markets find difficult to serve. The toolkit provides a structured decision framework for deploying blended capital rooted in impact, risk and return. It addresses the financing gap caused by muted early returns, high risks, and underserved markets like rural or low-income segments."
    },
    {
      id: 3,
      question: "Why is the Blended Finance Toolkit needed?",
      answer: "There is often hesitation from donors and funders in providing any subsidisations to For-Profit Social Enterprises. The toolkit provides an impact mechanism to determine the systemic importance of the solution and whether it addresses the challenges faced by underserved and vulnerable communities at scale. It also assesses the impact additionality of the enterprise's model which would not be delivered through commercial capital alone. Commercial investors are often concerned about the appropriate capital structure for the risk-return profile of For-Profit Social Enterprises. The toolkit helps segment For-Profit Social Enterprises based on their risk, return, and impact profile, enabling an optimal blend of grant-funding, concessional capital and commercial capital."
    },
    {
      id: 4,
      question: "How does the toolkit work?",
      answer: "The Blended Finance Toolkit assesses an enterprise on 3 major aspects: Impact: Assesses the depth, scale, and intentionality of impact. Risk: Assesses the operational, financial, and market risk of the enterprise. Return: Assesses the financial potential and timeline of returns. Based on the composite scoring of Impact, Risk, and Return, the toolkit identifies and suggests the appropriate capital instrument and the role of philanthropic capital. This scoring allows funders to assign capital types efficiently—ensuring that philanthropic support is catalytic, not crowding out commercial funds where they are feasible."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItemId(prev => prev === id ? null : id);
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
            const isOpen = openItemId === item.id;
            
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
