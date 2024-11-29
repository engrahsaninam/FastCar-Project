import React from 'react';
import { DollarSign, Clock, Car } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Transparent pricing',
      description: "No surprises here. See how much you'll pay on cars you like."
    },
    {
      icon: Clock,
      title: 'Minutes, not hours',
      description: 'Time saving tools to help you find the right car in a snap.'
    },
    {
      icon: Car,
      title: 'Shop your way',
      description: 'Your own pace, your own space. Shop online at your ease.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold text-center mb-16">
        Why choose us to buy your next car?
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-16 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center max-w-xs">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-gray-700" />
              </div>
              <div className="absolute inset-0 rounded-full border-8 border-red-200 -m-1" />
            </div>

            <h3 className="text-xl font-medium text-gray-900 mb-3">
              {feature.title}
            </h3>

            <p className="text-gray-500 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <a href="/bestdealss" className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors inline-block">
          Get the best deals
        </a>
      </div>
    </div>
  );
};

export default WhyChooseUs;