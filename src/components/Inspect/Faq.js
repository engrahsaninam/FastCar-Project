"use client"
import React, { useState } from 'react';

const FAQSection = () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  const faqs = [
    {
      question: 'The vehicle I ordered through CarAudit has disappeared from the offer. What happened?',
      answer: 'If the vehicle you ordered through CarAudit has disappeared from the offer, it is likely that the vehicle has been sold to another customer. We strive to update our listings in real-time, but sometimes vehicles can be sold before the listing is updated. Please contact our team for assistance.'
    },
  
    
    {
      question: 'Can I buy a vehicle without CarAudit?',
      answer: 'While you can technically purchase a vehicle without using CarAudit, we strongly recommend utilizing our services. Our independent inspection and verification process helps ensure you are making a well-informed and secure purchase.'
    },
    {
      question: 'Can I have the vehicle inspected by my own mechanic/service?',
      answer: 'Absolutely. We encourage you to have the vehicle inspected by your own trusted mechanic or service provider. This can provide an additional layer of assurance and give you peace of mind.'
    },
    {
      question: 'Is it possible to personally examine the vehicle in advance?',
      answer: 'Yes, we can arrange for you to personally examine the vehicle in advance, prior to purchase. This allows you to thoroughly inspect the car and ensure it meets your requirements.'
    },
    {
      question: 'Can I order CarAudit as a separate service when I buy a vehicle on my own?',
      answer: 'Yes, you can order CarAudit services separately, even if you are purchasing a vehicle on your own. Our inspection and verification services are available as a standalone offering.'
    }
  ];

  const toggleQuestion = (index) => {
    setActiveQuestionIndex(activeQuestionIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <button
              className="flex justify-between items-center w-full"
              onClick={() => toggleQuestion(index)}
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <span className={`text-red-400 transition-transform ${activeQuestionIndex === index ? 'rotate-180' : ''}`}>
                &#x25BC;
              </span>
            </button>
            {activeQuestionIndex === index && (
              <div className="mt-4 text-red-500">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;