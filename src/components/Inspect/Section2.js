// components/CarAudit.js
import React from "react";

const CarAudit = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-black mb-8">
          The purchase starts with a CarAudit™ inspection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 ">
          {/* Step 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <img
                  src="/icons/vehicle-certification.svg"
                  alt="Vehicle Certification"
                  className="w-16 h-16"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-black">
              01. Vehicle certification
            </h3>
            <p className="text-gray-600">
              First, we will verify all information about the vehicle and check
              its legal status in available databases and registers.
            </p>
          </div>
          {/* Step 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <img
                  src="/icons/detailed-inspection.svg"
                  alt="Detailed Inspection"
                  className="w-16 h-16"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-black">
              02. Detailed inspection
            </h3>
            <p className="text-gray-600">
              Our mechanic will personally inspect and test the vehicle based on
              the criteria of our strict standardized procedure.
            </p>
          </div>
          {/* Step 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <img
                  src="/icons/recommendation.svg"
                  alt="Recommendation"
                  className="w-16 h-16"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-black">
              03. Our recommendation
            </h3>
            <p className="text-gray-600">
              Based on the inspection data, we will evaluate the overall
              condition of the vehicle and give our recommendation on whether
              you should buy it or not.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarAudit;
