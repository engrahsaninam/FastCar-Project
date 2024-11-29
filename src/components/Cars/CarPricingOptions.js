const CarPricingOptions = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Car Pricing Options</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Import Costs</h3>
          <p className="text-gray-600">Estimated import cost: €2,500</p>
          <p className="text-sm text-gray-500">Includes shipping, customs, and processing fees</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Financing Options</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Monthly payment from:</span>
            <span className="font-bold text-gray-800">€350/month</span>
          </div>
          <p className="text-sm text-gray-500">Based on a 60-month term with 10% down payment</p>
        </div>
        
        <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300">
          Calculate Your Options
        </button>
      </div>
    );
  };
  
  export default CarPricingOptions;