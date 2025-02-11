"use client"
import React, { useEffect, useState } from 'react';
import { Phone, Mail, Check, Minus, Plus, ChevronDown, InfoIcon, HelpCircle, Star } from 'lucide-react';

const HeroSection = () => {
  const scrollToCalculator = () => {
    document.getElementById('financing-calculator').scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section className="w-full mx-auto bg-white overflow-hidden py-6">
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-2">
        {/* Image First */}
        <div className="w-full mb-8">
          <div className="relative">
            {/* Background with floating UI elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 z-20">
                <div className="bg-white/90 rounded-lg p-3">
                  <div className="w-32 h-2 bg-[#4355F9]/20 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-1/2 bg-[#4355F9] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Image */}
            <img
              src="https://carvago.com/_next/image?url=%2Fimages%2Ffinancing-lp%2Fimg-hero-financing-2x.webp&w=1536&q=75"
              alt="Car financing illustration"
              className="w-full h-[550px] object-contain relative z-10"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col lg:flex-row items-start justify-between mt-8">
            <div className="lg:w-[68%]">
              <h1 className="text-[28px] lg:text-[44px] font-bold text-[#1A237E] leading-[1.2] tracking-tight mb-5">
                Financing without worries,
                <br />
                choices without compromise
              </h1>
              <p className="text-[#4A5568] text-base lg:text-lg mb-8 max-w-[90%] leading-relaxed">
                We can even arrange imported car financing, allowing you to choose from a wide range of cars across Europe.
              </p>
              <button
                onClick={scrollToCalculator}
                className="w-full lg:w-auto bg-[#4355F9] text-white px-8 py-4 rounded-lg hover:bg-[#3a4be0] transition-all duration-300 flex items-center justify-center gap-2"
              >
                I want a hire purchase 
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => (
  <div className="bg-white py-16">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-red-500 mb-2">8.99 %</h2>
        <p className="text-gray-600">The average interest rate offered by our more than 7 trusted bank providers.</p>
      </div>
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-red-500 mb-2">Simplicity</h2>
        <p className="text-gray-600">A transparent process</p>
      </div>
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-red-500 mb-2">87 %</h2>
        <p className="text-gray-600">Application success rate up to 87 %</p>
      </div>
    </div>
  </div>
);

const FinanceCalculator = () => {
  const [monthlyPayment, setMonthlyPayment] = useState(200);
  const [paybackPeriod, setPaybackPeriod] = useState(48);
  const [downPayment, setDownPayment] = useState(30);

  const handleSliderChange = (e, setter) => {
    const value = Number(e.target.value);
    const min = Number(e.target.min);
    const max = Number(e.target.max);
    const progress = ((value - min) / (max - min)) * 100;
    e.target.style.setProperty('--range-progress', `${progress}%`);
    setter(value);
  };

  const calculateLoanDetails = () => {
    const carPrice = 25000;
    const downPaymentAmount = (carPrice * downPayment) / 100;
    const loanAmount = carPrice - downPaymentAmount;
    return {
      downPaymentAmount: downPaymentAmount.toFixed(0),
      loanAmount: loanAmount.toFixed(0)
    };
  };

  return (
    <div id="financing-calculator" className="bg-white py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:gap-24 items-start">
          <div className="lg:w-[360px] mb-10 lg:mb-0">
            <h2 className="text-[32px] lg:text-[40px] font-bold text-black leading-[1.2] mb-8">
              Pick your plan and
              <br />
              Finance your Car
            </h2>
            <p className="text-red-500 text-lg">
              Finance Less Than 30% of your Monthly Income.
            </p>
          </div>

          <div className="flex-1 w-full max-w-[640px]">
            <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-xl">
              {/* Calculator Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6 8h8M6 12h6" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Fair loans approved within 1 hour</span>
                </div>
                <img src="/leasing-service.svg" alt="Leasing Service" className="h-8" />
              </div>

              {/* Sliders */}
              <div className="space-y-10">
                {/* Monthly Payment Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-500">Monthly payment</span>
                    <span className="text-sm font-semibold">€{monthlyPayment}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={monthlyPayment}
                    onChange={(e) => handleSliderChange(e, setMonthlyPayment)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(239 68 68) ${((monthlyPayment - 100) / 900) * 100}%, #E2E8F0 ${((monthlyPayment - 100) / 900) * 100}%)`
                    }}
                  />
                </div>

                {/* Payback Period Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-500">Payback period</span>
                    <span className="text-sm font-semibold">{paybackPeriod} months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="120"
                    step="6"
                    value={paybackPeriod}
                    onChange={(e) => handleSliderChange(e, setPaybackPeriod)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(239 68 68) ${(paybackPeriod / 120) * 100}%, #E2E8F0 ${(paybackPeriod / 120) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-400">6</span>
                    <span className="text-xs text-gray-400">120</span>
                  </div>
                </div>

                {/* Down Payment Slider */}
                <div>
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-gray-500">Down payment (%)</span>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-semibold">
                      {downPayment}% = €{calculateLoanDetails().downPaymentAmount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={downPayment}
                    onChange={(e) => handleSliderChange(e, setDownPayment)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(239 68 68) ${((downPayment - 20) / 70) * 100}%, #E2E8F0 ${((downPayment - 20) / 70) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-400">20%</span>
                    <span className="text-xs text-gray-400">90%</span>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Interest rate / APR</span>
                  <span className="font-semibold">8.99% / 9.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Loan Amount</span>
                  <span className="font-semibold">€{calculateLoanDetails().loanAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-500 font-medium">Maximum car price</span>
                  <span className="font-semibold">€25,000</span>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="mt-8 text-xs leading-relaxed text-gray-400">
                Fast Cars AG is exclusively a broker for the hire purchase financing. The calculation is not a binding offer, but only a non-binding proposal which is only intended to serve as a guide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonTable = () => {
  const features = [
    {
      label: 'Available cars',
      fastCars: 'Unlimited selection from vehicles from all over Europe.',
      usual: 'Cars registered in the Czech Republic only.',
    },
    {
      label: 'Process',
      fastCars: 'We will sort out the financing right at the time of purchase. You will learn right away how much you can borrow.',
      usual: 'Before choosing your car, you need to check if and how much you can borrow from the bank.',
    },
    {
      label: 'Time',
      fastCars: 'Online application form, approval in minutes.',
      usual: 'At least 3 visits to the bank, approval within days.',
    },
    {
      label: 'Convenience',
      fastCars: 'Everything is done online from the comfort of your home.',
      usual: 'You\'ll spend a lot of time visiting the bank.',
    },
    {
      label: 'Financing of services',
      fastCars: 'We will arrange the car financing, including services.',
      usual: 'The bank will only loan the price of the car itself.',
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why finance through Fast Cars?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of car financing with our premium service
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[768px]"> {/* Minimum width for small devices */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
                <div className="text-lg font-semibold text-gray-400">Feature</div>
                <div className="text-center">
                  <span className="inline-flex items-center px-4 py-1 bg-red-50 rounded-full">
                    <Star className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-lg font-semibold text-red-500">Fast Cars</span>
                  </span>
                </div>
                <div className="text-center text-lg font-medium text-gray-400">
                  Traditional Method
                </div>
              </div>

              {/* Features */}
              <div className="divide-y divide-gray-100">
                {features.map((feature, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                    <div className="font-semibold text-gray-900 px-2">{feature.label}</div>
                    <div className="flex items-start justify-center px-4">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm md:text-base">{feature.fastCars}</span>
                      </div>
                    </div>
                    <div className="flex items-start justify-center px-4">
                      <div className="flex items-start gap-2">
                        <Minus className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-500 text-sm md:text-base">{feature.usual}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                  <div className="flex items-center gap-2 text-red-500 whitespace-nowrap">
                    <Check className="w-5 h-5" />
                    Premium Features
                  </div>
                  <div className="flex items-center gap-2 text-red-500 whitespace-nowrap">
                    <Check className="w-5 h-5" />
                    100% Transparent
                  </div>
                  <div className="flex items-center gap-2 text-red-500 whitespace-nowrap">
                    <Check className="w-5 h-5" />
                    Fast Approval
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator for Mobile */}
        <div className="md:hidden mt-4 text-center text-sm text-gray-500">
          Swipe to see more →
        </div>
      </div>
    </div>
  );
};


const ProcessSteps = () => {
  const steps = [
    {
      step: "01.",
      title: "You'll choose your car",
      description: "Choose from our wide selection of more than 1,000,000 verified cars from all over Europe and click the \"Buy\" button.",
      icon: "/icons/car-select.svg"
    },
    {
      step: "02.",
      title: "Fill in the online application",
      description: "Next, click the \"I am interested in financing\" button and fill out the application. We'll take care of the rest",
      icon: "/icons/form-fill.svg"
    },
    {
      step: "03.",
      title: "We will send you a quote",
      description: "We will send your application to the lender for review before letting you know your specific financing options.",
      icon: "/icons/quote-send.svg"
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How does Fast Car financing work?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center group">
                <div className="mb-6 flex justify-center">
                  <div className="bg-red-50 rounded-full p-6 transform transition-transform group-hover:scale-110">
                    <img src={step.icon} alt={step.title} className="w-16 h-16" />
                  </div>
                </div>
                <p className="text-red-500 font-semibold mb-2">{step.step}</p>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 -right-6 w-12 h-2 bg-red-50 transform translate-x-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Can I terminate the loan agreement prematurely?",
      answer: "Of course, you can. The easiest way is to call the Customer Service of the financial institution and express your interest in the early termination of the loan agreement. They will send you the necessary documents, the final calculation, and advise you on how to proceed."
    },
    {
      question: "Can I finance a vehicle of any age?",
      answer: "With Fast Cars, you can finance a vehicle up to a maximum of 10 years from the first registration. In the case of an older vehicle, the vehicle must be paid for in cash."
    },
    {
      question: "What documents do I need for financing?",
      answer: "Valid ID, Proof of income (last 3 months), Proof of address, Bank statements (last 3 months). For self-employed individuals, additional documentation may be required."
    },
    {
      question: "What is the maximum loan amount available?",
      answer: "The maximum loan amount depends on your monthly income and other factors. Generally, we recommend financing less than 30% of your monthly income."
    },
    {
      question: "Is there a minimum down payment required?",
      answer: "Yes, typically we require a minimum down payment of 20% of the vehicle's purchase price. However, this may vary based on your credit profile and the specific financing program."
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about our car financing services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between"
              >
                <h3 className="font-medium text-lg pr-8">{faq.question}</h3>
                <div className={`transform transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <ChevronDown className="w-5 h-5 text-red-500" />
                </div>
              </button>
              
              <div className={`transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContactSection = () => (
  <div className="bg-white py-16">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Do you need advice?</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Call Us Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-full">
              <Phone className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-gray-500 mb-1">Call us</div>
              <a href="tel:+420246034700" className="text-lg font-semibold hover:text-red-500 transition-colors">
                +420 246 034 700
              </a>
              <div className="text-sm text-gray-500 mt-1">
                Mo-Su 8 am-8 pm
              </div>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-full">
              <Mail className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-gray-500 mb-1">Email</div>
              <a href="mailto:financing@fastcars.com" className="text-lg font-semibold hover:text-red-500 transition-colors">
                financing@fastcars.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


// Main component combining all sections
const CarFinancingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <FinanceCalculator />
      <ProcessSteps />
      <ComparisonTable />
      <FAQSection />
      <ContactSection />
    </div>
  );
};

export default CarFinancingPage;