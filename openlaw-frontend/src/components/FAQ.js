import React, { useState } from 'react';

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "Can I compare different legal strategies and fees on OpenLaw?",
      answer: "Yes, our platform allows you to easily compare various legal strategies and fees side by side to make informed decisions."
    },
    {
      id: 2,
      question: "How does OpenLaw vet its lawyers?",
      answer: "We conduct comprehensive interviews to verify each attorney's proven success, specialized areas of law, litigation styles, and unique qualitative factors. This thorough vetting ensures we match you with the ideal lawyer for your specific case."
    },
    {
      id: 3,
      question: "How quickly can I receive a response from a lawyer?",
      answer: "With OpenLaw, you receive fast, often instant, responses to your legal inquiries, ensuring you get the help you need without delay."
    },
    {
      id: 4,
      question: "How does one-click booking work?",
      answer: "Once you have an OpenLaw account, simply select your preferred attorney and schedule a consultation with one click, making the booking process seamless and hassle-free."
    }
  ];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="faq-section py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Frequently Asked Questions</h2>
        <div className="accordion" id="faqAccordion">
          {faqItems.map((item) => (
            <div key={item.id} className="accordion-item">
              <h2 className="accordion-header" id={`heading${item.id}`}>
                <button 
                  className={`accordion-button ${openItem === item.id ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  {item.question}
                </button>
              </h2>
              <div 
                className={`accordion-collapse collapse ${openItem === item.id ? 'show' : ''}`}
                id={`collapse${item.id}`}
              >
                <div className="accordion-body">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 