import React, { useState } from "react";

const PrivacyFAQ = () => {
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
      question: "What information do you collect from users?",
      answer:
        "We collect certain personal information from users, such as name, email address, and contact details, when they register on our website or place an order. We also collect non-personal information, such as cookies and usage data, to improve our services and enhance user experience. Please review our privacy policy for detailed information on data collection and usage.",
    },
    {
      question: "How do you use the collected information?",
      answer:
        "The information we collect is used to provide and improve our services, process orders, personalize user experience, communicate with users, and ensure the security of our website. We may also use the information for marketing and promotional purposes, but only with the user's explicit consent. Please refer to our privacy policy for a comprehensive overview of data usage.",
    },
    {
      question: "Do you share user information with third parties?",
      answer:
        "We may share user information with trusted third-party service providers who assist us in operating our website, conducting business activities, and serving users. These third parties have access to personal information as required to perform their tasks but are obligated to keep it confidential. We do not sell or disclose personal information to unrelated third parties without user consent, except as legally required.",
    },
    {
      question: "How do you protect user information?",
      answer:
        "We take the security of user information seriously and implement appropriate measures to protect it. This includes using secure communication protocols, encryption technologies, firewalls, and regular system updates. We also restrict access to personal information to authorized personnel only. However, no method of data transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      question:
        "Can users opt-out of data collection and marketing communications?",
      answer:
        "Yes, users can exercise their rights to opt-out of data collection, processing, and marketing communications. They can update their preferences through their account settings or contact our customer support to request opt-out. However, please note that opting out of certain data collection or marketing communications may limit the use of certain features or services.",
    },
    {
      question: "How long do you retain user information?",
      answer:
        "We retain user information for as long as necessary to fulfill the purposes outlined in our privacy policy, unless a longer retention period is required or permitted by law. Once the data is no longer needed, we securely dispose of it in accordance with our data retention practices.",
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Privacy Policy FAQs</h2>
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

export default PrivacyFAQ;
