import React from 'react';
import { Phone, Mail, Check, Minus, ChevronDown } from 'lucide-react';

const HeroSection = () => (
  <div className="bg-white px-8 py-12">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">
          Financing without worries, choices without compromise
        </h1>
        <p className="text-gray-600 mb-6">
          We can even arrange imported car financing, allowing you to choose from a wide range of cars across Europe.
        </p>
        <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700">
          I want to hire purchase
        </button>
      </div>
      <div className="w-1/2 relative">
        <img src="https://media.istockphoto.com/id/1490837411/photo/cartoon-car-and-contract-on-the-blue-background-3d-rendering.jpg?s=1024x1024&w=is&k=20&c=bk0Nbajby1TfryctCrXl7OC_dyT8pKzFFvcbgIATFZc=" alt="Car illustration" className="w-full" />
      </div>
    </div>
  </div>
);

const StatsSection = () => (
  <div className="bg-gray-50 py-16">
    <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-grey mb-2">7.79 %</h2>
        <p className="text-gray-600">Interest rate from 7.79 %</p>
      </div>
      <div className="text-center">
        <h2 className="text-4xl font-bold text-grey  mb-2">Simplicity</h2>
        <p className="text-gray-600">A transparent process</p>
      </div>
      <div className="text-center">
        <h2 className="text-4xl font-bold text-grey  mb-2">87 %</h2>
        <p className="text-gray-600">Application success rate up to 87 %</p>
      </div>
    </div>
  </div>
);

const ComparisonTable = () => (
  <div className="py-16 bg-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Why finance through Fast Cars?</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="border-b py-4 font-medium"></div>
        <div className="border-b py-4 font-medium text-center">Fast Cars</div>
        <div className="border-b py-4 font-medium text-center">The usual method</div>
        
        {[
          {
            label: 'Available cars',
            Fast: 'Unlimited selection from vehicles from all over Europe.',
            usual: 'Cars registered in the Czech Republic only.'
          },
          {
            label: 'Process',
            Fast: 'We will sort out the financing right at the time of purchase. You will learn right away how much you can borrow.',
            usual: 'Before choosing your car, you need to check if and how much you can borrow from the bank.'
          },
          {
            label: 'Time',
            Fast: 'Online application form, approval in minutes.',
            usual: 'At least 3 visits to the bank, approval within days.'
          }
        ].map((row) => (
          <React.Fragment key={row.label}>
            <div className="border-b py-4">{row.label}</div>
            <div className="border-b py-4 flex items-start gap-2">
              <Check className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
              <span>{row.carvago}</span>
            </div>
            <div className="border-b py-4 flex items-start gap-2">
              <Minus className="text-gray-400 w-5 h-5 mt-1 flex-shrink-0" />
              <span>{row.usual}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

const ProcessSteps = () => (
  <div className="bg-white py-16">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">How does Fast Car financing work?</h2>
      <div className="grid grid-cols-3 gap-8">
        {[
          {
            step: '01.',
            title: "You'll choose your car.",
            description: 'Choose from our wide selection of more than 1,000,000 verified cars from all over Europe and click the "Buy" button.',
            image: '/1.png'
          },
          {
            step: '02.',
            title: 'Fill in the online application',
            description: 'Next, click the "I am interested in financing" button and fill out the application. Well take care of the rest',
            image: '/2.png'
          },
          {
            step: '03.',
            title: 'We will send you a quote',
            description: 'We will send your application to the lender for review before letting you know your specific financing options.',
            image: '/3.png'
          }
        ].map((step) => (
          <div key={step.step} className="text-center">
            <div className="mb-4">
            <img src={step.image} alt={step.title} className="w-20 h-20 rounded-full mx-auto" />
            </div>
            <h3 className="text-gray-500 mb-2">{step.step}</h3>
            <h4 className="font-bold mb-2">{step.title}</h4>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FAQ = () => (
  <div className="bg-white py-16">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
      <div className="space-y-4">
        {[
          'Can I terminate the loan agreement prematurely?',
          'Can I finance a vehicle of any age?'
        ].map((question) => (
          <button key={question} className="w-full bg-white border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
            <span>{question}</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        ))}
      </div>
      
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Do you need advice?</h3>
        <div className="flex justify-center gap-8">
          <a href="tel:+420244034700" className="flex items-center gap-2 text-red-500">
            <Phone className="w-5 h-5" />
            +420 244 034 700
          </a>
          <a href="mailto:financing@fastcar.com" className="flex items-center gap-2 text-grey">
            <Mail className="w-5 h-5" />
            financing@fastcar.com
          </a>
        </div>
      </div>
    </div>
  </div>
);

const CarFinancingPage = () => (
  <div className="min-h-screen">
    <HeroSection />
    <StatsSection />
    <ComparisonTable />
    <ProcessSteps />
    <FAQ />
  </div>
);

export default CarFinancingPage;