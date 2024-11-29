import React from 'react';
import { ChevronRight, Clock, EuroIcon, FileCheck, Truck, ClipboardCheck, PhoneCall } from 'lucide-react';
import AppBar from '@/components/AppBar2';
import Footer from '@/components/HomePage/Footer';

const ImportProcessPage = () => {
  const steps = [
    {
      title: "Initial Consultation",
      icon: <PhoneCall className="w-8 h-8 text-red-500" />,
      description: "Schedule a consultation with our experts to discuss your requirements and preferences for importing your dream car from Europe."
    },
    {
      title: "Vehicle Selection",
      icon: <ClipboardCheck className="w-8 h-8 text-red-500" />,
      description: "Browse through our extensive network of European dealers and select your desired vehicle based on make, model, and specifications."
    },
    {
      title: "Documentation",
      icon: <FileCheck className="w-8 h-8 text-red-500" />,
      description: "We handle all necessary paperwork including registration, customs clearance, and compliance certificates for a smooth import process."
    },
    {
      title: "Transport & Delivery",
      icon: <Truck className="w-8 h-8 text-red-500" />,
      description: "Safe and secure transportation of your vehicle from Europe to your desired location with real-time tracking updates."
    }
  ];

  const benefits = [
    {
      title: "Wide Selection",
      description: "Access to extensive European car markets with diverse options"
    },
    {
      title: "Cost Effective",
      description: "Competitive prices and transparent fee structure"
    },
    {
      title: "Quality Assured",
      description: "All vehicles undergo thorough inspection and verification"
    },
    {
      title: "Expert Support",
      description: "Dedicated team to assist you throughout the process"
    }
  ];
 
  

  return (
    <div className="min-h-screen bg-gray-50">
        <AppBar/>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Import Your Dream Car from Europe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Experience a seamless car importing process with our expert guidance and support at every step.
          </p>
        </div>
      </div>

      {/* Process Steps */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Our Import Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-red-50/95 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-red-500">
            Why Choose Our Import Service
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl text-black font-semibold mb-3">{benefit.title}</h3>
                <p className="text-zinc-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              q: "How long does the import process take?",
              a: "The typical import process takes 4-6 weeks, depending on the vehicle location and shipping method."
            },
            {
              q: "What documents are required?",
              a: "Required documents include proof of ownership, vehicle registration, customs declaration, and compliance certificates."
            },
            {
              q: "Are there any additional costs?",
              a: "Additional costs may include customs duties, VAT, transport insurance, and registration fees. We provide a detailed cost breakdown upfront."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Import Your Dream Car?
          </h2>
          <p className="text-xl mb-8">
            Contact our team today and let us help you bring your perfect car from Europe
          </p>
          <button className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ImportProcessPage;