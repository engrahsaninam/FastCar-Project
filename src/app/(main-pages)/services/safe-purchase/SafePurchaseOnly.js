import React from "react";
import { Shield, CreditCard, Clock, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

const SafePurchasePage = () => {
  const safetyFeatures = [
    {
      icon: <Shield className="w-12 h-12 text-red-500" />,
      title: "Secure Transactions",
      description: "All payments are encrypted using industry-standard SSL technology and 3D-Secure Payments",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-red-500" />,
      title: "Protected Payments",
      description: "Your payment details are never stored on our servers",
    },
    {
      icon: <Clock className="w-12 h-12 text-red-500" />,
      title: "Incident Management",
      description: "Customer Support for Post-Purchase Assistance during working hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Safe Purchase Program</h1>
          <p className="text-xl max-w-2xl mx-auto">
          Shop with confidence knowing your payments and information are
          protected by industry-leading security.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Safe Purchase Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safetyFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Security Certifications */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Security Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <img src="/api/placeholder/120/60" alt="SSL Certificate" className="max-h-12" />
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <img src="/api/placeholder/120/60" alt="PCI Compliance" className="max-h-12" />
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <img src="/api/placeholder/120/60" alt="Norton Secured" className="max-h-12" />
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <img src="/api/placeholder/120/60" alt="McAfee Secure" className="max-h-12" />
            </div>
          </div>
        </div>

        {/* Purchase Protection */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Purchase Protection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">What's Protected:</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span>100% Payment Security</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span>Identity Protection</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span>Fraud Prevention</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Not Covered:</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                  <span>Account credentials shared with third parties</span>
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                  <span>Unauthorized access due to negligence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="bg-red-50 rounded-lg p-8">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help with any questions related to our safe purchase program. Feel free to reach out at any time.
            </p>
            <button className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafePurchasePage;