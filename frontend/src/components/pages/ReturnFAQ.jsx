import React, { useState } from "react";

const ReturnFAQ = () => {
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
      question: "What is your return policy?",
      answer:
        "We have a hassle-free return policy. If you are not satisfied with your purchase, you can return the item within 30 days for a full refund or exchange. Please review our return policy for detailed instructions and eligibility criteria.",
    },
    {
      question: "How do I initiate a return?",
      answer:
        "To initiate a return, please log in to your account, go to the 'Orders' section, and select the order containing the item you wish to return. Follow the provided instructions to generate a return label and receive further return instructions.",
    },
    {
      question: "Are there any return shipping fees?",
      answer:
        "Return shipping fees may apply based on the reason for the return. If the return is due to a defect or error on our part, we will cover the return shipping costs. However, if the return is due to a change of mind or preference, the return shipping fees will be the responsibility of the customer.",
    },
    {
      question: "How long does it take to process a refund?",
      answer:
        "Once we receive your returned item, we will inspect it and process your refund within 3-5 business days. The refund will be issued to the original payment method used during the purchase.",
    },
    {
      question: "Can I exchange an item for a different size or color?",
      answer:
        "Yes, you can exchange an item for a different size or color, subject to availability. Please follow the return process mentioned above, and during the return request, indicate your preference for an exchange. Our customer support team will assist you in processing the exchange.",
    },
    {
      question: "What if I received a damaged or defective item?",
      answer:
        "If you received a damaged or defective item, please contact our customer support within 48 hours of receiving the package. We will provide further instructions on returning the item and arrange for a replacement or refund, depending on your preference.",
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Return and Exchange FAQs</h2>
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

export default ReturnFAQ;
