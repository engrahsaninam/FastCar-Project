"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Info } from 'lucide-react';

const FinancingOptions = () => {
  const [loanAmount, setLoanAmount] = useState(45.3);
  const [period, setPeriod] = useState(24);
  const [downPayment, setDownPayment] = useState(30);

  return (
    <div className="bg-white rounded-lg p-6 space-y-6 mb-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold">Financing specifications</h2>
      </div>

      {/* Loan Types */}
      <div className="bg-white rounded-lg p-4 md:p-6 space-y-4 md:space-y-6 mb-6 md:mb-8">
        <button className="p-4 bg-red-500 text-white rounded-lg text-left">
          LoanForsmart
          <div className="text-sm mt-1">{loanAmount}%</div>
        </button>
        <button className="p-4 bg-gray-100 text-gray-500 rounded-lg text-left">
          Regular loan
          <div className="text-sm mt-1">Not available</div>
        </button>
      </div>

      {/* Down Payment Slider */}
      <div>
        <label className="block mb-2 text-sm">Down payment (%)</label>
        <input 
          type="range"
          min="0"
          max="100"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-1 text-gray-500">
          <span>0%</span>
          <span>{downPayment}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Period Slider */}
      <div>
        <label className="block mb-2 text-sm">Payback period</label>
        <input 
          type="range"
          min="12"
          max="72"
          step="12"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-1 text-gray-500">
          <span>12 months</span>
          <span>{period} months</span>
          <span>72 months</span>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-4">Parameters of your financing option</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-gray-500 text-sm mb-1">Monthly payment</div>
            <div className="font-medium">CZK 134,254</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Interest rate</div>
            <div className="font-medium">7.29 %</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">RPSN</div>
            <div className="font-medium">7.55 %</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex gap-2 text-blue-800">
          <Info size={20} className="shrink-0" />
          <p className="text-sm">
            The CarVerguard already includes the selected transport and other additional services.
            The financing option offered can finance both the car and the additional services.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
          I want financing
        </button>
        <button className="flex-1 border border-red-500 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
          I will pay in full
        </button>
      </div>
    </div>
  );
};

const BankTransferForm = () => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6 mb-8">
      {/* Car inspection info */}
      <div>
        <h3 className="text-lg font-medium text-[#1E1B39]">CarAudit™ vehicle inspection</h3>
        <p className="text-gray-600 mt-2">
          We want you to buy a car in the best possible condition and this is why we have to first of all
          thoroughly inspect the chosen car. You receive a details inspection report on the technical condition
          of the car, photo documentation and our recommendation. Then it is up to you, in your own time, to
          decide whether you want to buy the car.
        </p>
      </div>

      {/* Process Steps */}
      <div>
        <h4 className="font-medium text-[#1E1B39] mb-4">What happens after ordering the inspection</h4>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">1</div>
            <div>
              <p className="font-medium text-[#1E1B39]">We get the car VIN from the dealer</p>
              <p className="text-sm text-gray-500">
                and we check this in legal status in European countries to see whether the car has been stolen or crashed
                and we also check the mileage.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">2</div>
            <div>
              <p className="font-medium text-[#1E1B39]">We arrange a visit by a mechanic</p>
              <p className="text-sm text-gray-500">who checks the actual technical condition of the car.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">3</div>
            <div>
              <p className="font-medium text-[#1E1B39]">In the case of a tax-deductible car, we check,</p>
              <p className="text-sm text-gray-500">to see whether the car really is tax-deductible.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">4</div>
            <div>
              <p className="font-medium text-[#1E1B39]">You receive an inspection report</p>
              <p className="text-sm text-gray-500">
                including evaluation of the condition of the car. We assume a guarantee for this being the actual
                condition of the car and are liable to you for this if you subsequently decide to buy the car.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 line-through">CZK 4,990</div>
            <div className="text-xl font-medium text-[#1E1B39]">CZK 1,990</div>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Check size={16} />
            <span>Money-back guarantee if the car fails the inspection.</span>
          </div>
        </div>
      </div>

      {/* Billing Details Form */}
      <div>
        <h3 className="font-medium text-[#1E1B39] mb-4">Billing address</h3>
        
        {/* Type Toggle */}
        <div className="flex mb-6">
          <button className="flex-1 bg-red-500 text-white py-2 rounded-l-lg">Consumer</button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-r-lg">Company</button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs text-gray-500">NAME</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="Name" />
            <div className="text-red-500 text-xs">Name required</div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-500">SURNAME</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="Surname" />
            <div className="text-red-500 text-xs">Surname required</div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-500">TELEPHONE NUMBER</label>
            <div className="flex gap-2">
              <select className="w-24 p-2 border rounded-lg">
                <option>+420</option>
              </select>
              <input type="tel" className="flex-1 p-2 border rounded-lg" placeholder="674193684" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-500">BIRTH DATE</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="dd.mm.yyyy" />
          </div>

          {/* Billing Address Section */}
          <div className="col-span-2 mt-4">
            <h4 className="text-red-500 font-medium">Billing address</h4>
          </div>

          <div>
            <label className="block text-xs text-gray-500">STREET</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="Street" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500">HOUSE NUMBER</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="House number" />
            </div>
            <div>
              <label className="block text-xs text-gray-500">POSTAL CODE</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="222 00" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500">CITY</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="City" />
          </div>

          <div>
            <label className="block text-xs text-gray-500">COUNTRY</label>
            <select className="w-full p-2 border rounded-lg">
              <option>Czech Republic</option>
            </select>
          </div>

          {/* Info Message */}
          <div className="col-span-2 bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              You cannot change the country any longer. If you need to make a change, please get in touch with our support.
            </p>
          </div>

          {/* Same Address Checkbox */}
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Same as billing address</span>
            </label>
          </div>

          {/* Submit Button */}
          <button className="col-span-2 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors">
            Confirm the data
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentMethod = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8 p-4">
      {/* Payment Selection */}
      <div>
      <div className="mb-2 text-gray-500 text-sm">STEP 1</div>
        <div className="bg-white p-4 md:p-6 rounded-lg">
        <h2 className="text-lg md:text-xl font-semibold text-[#1E1B39] mb-4 md:mb-6">Are you interested in financing?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <button
              onClick={() => setSelectedPayment('financing')}
              className={`p-4 border-2 rounded-lg text-left ${
                selectedPayment === 'financing' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-red-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'financing' ? 'border-red-500' : 'border-gray-300'
                }`}>
                  {selectedPayment === 'financing' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <span>Yes, I'm interested</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedPayment('bank')}
              className={`p-4 border-2 rounded-lg text-left ${
                selectedPayment === 'bank' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-red-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'bank' ? 'border-red-500' : 'border-gray-300'
                }`}>
                  {selectedPayment === 'bank' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <span>No, I want to pay by bank transfer</span>
              </div>
            </button>
          
          
        </div>
      </div>

      {/* Render selected component */}
      {selectedPayment === 'financing' && <FinancingOptions />}
      {selectedPayment === 'bank' && <BankTransferForm />}

      {/* Step 2 */}
      <div id="car-condition">
        <div className="mb-2 text-gray-500 text-sm">STEP 2</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Car condition check</h2>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-600 text-sm">CarAudit™ vehicle inspection</span>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div id="delivery">
        <div className="mb-2 text-gray-500 text-sm">STEP 3</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Delivery</h2>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-600 text-sm">Delivery</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-600 text-sm">Additional Services</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Fast Guard</span>
                <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">
                  RECOMMENDED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div id="payment">
        <div className="mb-2 text-gray-500 text-sm">STEP 4</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Payment</h2>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-600 text-sm">Payment</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PaymentMethod;