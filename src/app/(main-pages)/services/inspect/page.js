"use client"
import React, { useState } from "react";
import { ArrowDown } from "lucide-react";
import Footer from "@/components/HomePage/Footer";
import AppBar from "@/components/AppBar";

const CarInspectionPage = () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  const handleInspectionClick = () => {
    window.open('/inspectionDetail (1).pdf', '_blank');
  };

  const guaranteeFeatures = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-[#10B981]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H3"
          />
        </svg>
      ),
      title: "Complete Condition Check",
      description: "Nothing escapes our attention. Each vehicle undergoes a rigorous 120-point inspection, providing you with a clear and complete picture of its condition before you make your decision."
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-[#10B981]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      title: "Guaranteed Condition",
      description: "We back the condition stated in the Car Inspection report with our guarantee. If any defects arise not included in the vehicle inspection, we'll take full responsibility and provide compensation."
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-[#10B981]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Certified mechanics",
      description: "Our certified mechanics bring years of experience and expertise, ensuring even the smallest current or potential issues are identified and addressed."
    }
  ];

  const inspectionSteps = [
    {
      title: "01. Vehicle certification",
      description: "We start by verifying all information about the vehicle, including its legal status, using trusted databases and official registers.",
      icon: "/icons/vehicle-certification.svg"
    },
    {
      title: "02. Detailed inspection",
      description: "A certified mechanic personally inspects and tests the vehicle, following our strict, standardized procedures.",
      icon: "/icons/detailed-inspection.svg"
    },
    {
      title: "03. Our recommendation",
      description: "Based on the inspection results, we evaluate the vehicle's overall condition and offer a clear recommendation on whether it's a good choice for you",
      icon: "/icons/recommendation.svg"
    }
  ];

  const reviews = [
    {
      name: "Kamilia C.",
      rating: 5,
      review: "Brilliant car inspection, extremely professional and well-organized! I was able to buy a used car with confidence and assurance, thanks to their thorough evaluation. Highly recommended!",
      car: "Skoda Fabia - 2016"
    },
    {
      name: "John B.",
      rating: 4,
      review: "Coverage arranged for the buy of a Kia Sportage. Clear communication about the car's technical condition and detailed assessment with the CarAudit team. Definitely worth the service for peace of mind!",
      car: "Kia Sportage - 2022"
    },
    {
      name: "Ali Z.",
      rating: 4,
      review: "Precise and professional approach as well as detailed technical analysis of the Toyota Aygo I purchased. They addressed all my concerns transparently and provided a comprehensive report. Highly satisfied!",
      car: "Toyota Aygo X - 2021"
    },
    {
      name: "Maria L.",
      rating: 4,
      review: "The service was great, they inspected my used Skoda Karoc in no time, provided thorough details, and ensured everything was clear. Excellent value for money!",
      car: "Skoda Karoc - 2019"
    },
    {
      name: "Alexis K.",
      rating: 5,
      review: "Thank you so much for the service you provide, very clear findings, and they keep you updated throughout the process. Thanks to them, I purchased my Mercedes Benz worry-free.",
      car: "Mercedes Benz A180 - 2023"
    }
  ];

  const legalChecks = [
    "Service history and accident records",
    "Odometer alterations",
    "Stolen Vehicles Register",
    "Unpaid leasing or other financial liabilities",
    "Possibility of VAT deduction"
  ];

  const faqs = [
    {
      question: "The vehicle I ordered through the Car Check has disappeared from the offer. What happened?",
      answer: "If the vehicle you ordered through Car Check has disappeared from the offer, it is likely that the vehicle has been sold to another customer. We strive to update our listings in real-time, but sometimes vehicles can be sold before the listing is updated. Please contact our team for assistance."
    },
    {
      question: "Can I buy a vehicle without Car Check?",
      answer: "While you can technically purchase a vehicle without using Car Check, we strongly recommend utilizing our services. Our independent inspection and verification process helps ensure you are making a well-informed and secure purchase."
    },
    {
      question: "Can I have the vehicle inspected by my own mechanic/service?",
      answer: "Yes, you can arrange for your own mechanic to inspect the vehicle in addition to our Car Check service."
    },
    {
      question: "Is it possible to personally examine the vehicle in advance?",
      answer: "Yes, you can schedule a personal inspection of the vehicle before making a purchase decision."
    },
    {
      question: "Can I order Car Check as a separate service when I buy a vehicle on my own?",
      answer: "Yes, our Car Check service is available as a standalone option even if you're purchasing a vehicle independently."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <AppBar/>
      <div className="relative h-[450px] ">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://carvago.com/video/how-it-works-page-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Car Check — Certified Car Inspection
          </h2>
          <p className="text-lg text-white/90 max-w-2xl">
            Every vehicle undergoes a thorough certified inspection by a skilled mechanic trained to identify hidden defects and potential issues before it goes on sale. With CarAudit, you'll know exactly what you're purchasing upfront, and we stand by the condition outlined in the inspection certificate. CarAudit: your trusted mechanic advocate.
          </p>
          <button 
            onClick={handleInspectionClick}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            More about Inspection
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Guarantee Features */}
      <div className="container max-w-6xl mx-auto px-6 lg:px-12 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guaranteeFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Inspection Process */}
      <div className="py-24 max-w-6xl mx-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-black mb-8">
            The purchase starts with a CarAudit™ inspection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {inspectionSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 rounded-full p-4">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="w-16 h-16"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Checks Section */}
      <div className="history-legal-defects max-w-6xl mx-auto">
        <div className="container bg-[#FEF3F3]">
          <div className="content">
            <h2 className="text-black">Vehicle History and Legal Check</h2>
            <p>
              To avoid any unexpected issues after purchase, we review European registers and
              databases for:
            </p>
            <ul>
              {legalChecks.map((check, index) => (
                <li key={index}>
                  <span>✔</span> {check}
                </li>
              ))}
            </ul>
          </div>
          <div className="image">
            <img
              src="https://carvago.com/images/car-audit/process-3.webp"
              className="h-[300px] w-[400px]"
              alt="Man checking car history"
            />
          </div>
        </div>
        <style jsx>{`
          .history-legal-defects {
            background-color: #FEF3F3;
            padding: 2rem;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .container {
            display: flex;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
          }
          .content {
            flex: 1;
            padding: 1rem;
          }
          h2 {
            color: black;
            font-size: 4vw;
            margin-bottom: 1rem;
          }
          p {
            color: #333;
            margin-bottom: 1rem;
            line-height: 1.6;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            display: flex;
            align-items: center;
            font-size: 1rem;
            color: #333;
            margin-bottom: 0.5rem;
          }
          li span {
            color: #2ecc71;
            font-size: 1.2rem;
            margin-right: 0.5rem;
          }
          .image {
            flex: 1;
            padding: 1rem;
          }
          img {
            max-width: 100%;
            border-radius: 0.5rem;
          }
          @media (max-width: 768px) {
            .container {
              flex-direction: column;
            }
            .content,
            .image {
              width: 100%;
            }
          }
        `}</style>
      </div>

      {/* Reviews Section
      <div className="bg-lightBlue py-24 px-4 max-w-6xl mx-auto">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-darkBlue">
              TRUSTPILOT REVIEWS
            </h2>
            <p className="text-xl text-red-500 mt-2">4.8 ★★★★★</p>
            <p className="text-grey-500 text-sm">1600+ reviews</p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="mb-4">
                  <h4 className="font-bold text-darkBlue">{review.name}</h4>
                  <p className="text-red-500">{"★".repeat(review.rating)}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">{review.review}</p>
                <p className="text-sm font-semibold text-gray-700">
                  {review.car}
                </p>
                <button className="mt-2 text-primary font-medium underline text-red-500">
                  Show full review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* FAQ Section */}
      <div className="bg-white rounded-lg mt-24 shadow-sm p-6 max-w-6xl mx-auto mb-24">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <button
                className="flex justify-between items-center w-full"
                onClick={() => setActiveQuestionIndex(activeQuestionIndex === index ? null : index)}
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
      <Footer/>
      </div>

  );
};

export default CarInspectionPage;