import React, { useState } from "react";

const FAQ = () => {
  const [isOpen, setIsOpen] = useState([]);

  const toggleAccordion = (index) => {
    setIsOpen((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };

  const faqData = [
    {
      question: "How can I place an order?",
      answer:
        "To place an order, simply browse our products, select the items you wish to purchase, add them to your cart, and proceed to checkout. Follow the prompts to provide your shipping and payment details to complete the order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major credit cards, debit cards, and PayPal as payment methods for your convenience.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping times may vary depending on your location. Typically, orders are processed within 1-2 business days and delivered within 5-7 business days. You will receive a tracking number to track your package's progress.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we offer international shipping to select countries. Please refer to our shipping policy for more information on international shipping rates and delivery times.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We have a hassle-free return policy. If you are not satisfied with your purchase, you can return the item within 30 days for a full refund or exchange. Please review our return policy for detailed instructions.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "Our customer support team is available 24/7 to assist you. You can reach us through our contact form on the website, or you can email us at support@example.com. We strive to respond to all inquiries within 24 hours.",
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="accordion">
        {faqData.map((item, index) => (
          <div className="accordion-item" key={index}>
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(index)}
            >
              <h3>{item.question}</h3>
              <span>{isOpen[index] ? "-" : "+"}</span>
            </div>
            {isOpen[index] && (
              <div className="accordion-content">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
