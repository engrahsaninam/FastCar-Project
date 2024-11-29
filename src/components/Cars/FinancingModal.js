import React, { useState } from 'react';
import { X } from 'lucide-react';

const OptionsModal = ({ car, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('financing');
  const [downPayment, setDownPayment] = useState(car.price * 0.1);
  const [term, setTerm] = useState(60);

  const calculateMonthlyPayment = () => {
    const principal = car.price - downPayment;
    const monthlyInterest = 0.05 / 12; // Assuming 5% annual interest rate
    const monthlyPayment = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, term)) / (Math.pow(1 + monthlyInterest, term) - 1);
    return monthlyPayment.toFixed(2);
  };

  const estimateImportCost = () => {
    // This is a simplified calculation. Adjust based on your actual import cost structure
    const baseCost = car.price * 0.1; // 10% of car price
    const shipping = 1500; // Example shipping cost
    const customs = car.price * 0.05; // Example customs duty
    return (baseCost + shipping + customs).toFixed(2);
  };

  const handleModalClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-white p-6 rounded-lg max-w-md w-full"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{car.name} - Options</h2>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 ${activeTab === 'financing' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab('financing');
            }}
          >
            Financing
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'import' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab('import');
            }}
          >
            Import
          </button>
        </div>
        {activeTab === 'financing' && (
          <div className="space-y-4" onClick={handleModalClick}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Down Payment</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDownPayment(Number(e.target.value));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Term (months)</label>
              <select
                value={term}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTerm(Number(e.target.value));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value={36}>36 months</option>
                <option value={48}>48 months</option>
                <option value={60}>60 months</option>
                <option value={72}>72 months</option>
              </select>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Estimated Monthly Payment</p>
              <p className="text-2xl font-bold text-red-600">€{calculateMonthlyPayment()}</p>
            </div>
            <button 
              onClick={handleModalClick}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Apply for Financing
            </button>
          </div>
        )}
        {activeTab === 'import' && (
          <div className="space-y-4" onClick={handleModalClick}>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Estimated Import Cost</p>
              <p className="text-2xl font-bold text-red-600">€{estimateImportCost()}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>This estimate includes:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Base import cost</li>
                <li>Estimated shipping fees</li>
                <li>Estimated customs duties</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Note: Actual import costs may vary based on specific regulations and fees at the time of import.
            </p>
            <button 
              onClick={handleModalClick}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Request Detailed Import Quote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsModal;