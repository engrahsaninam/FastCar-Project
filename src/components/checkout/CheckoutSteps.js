import React from "react";

const CheckoutSteps = () => {
  const steps = [
    { id: 1, label: "Payment method", isActive: true },
    { id: 2, label: "Car condition check", isActive: false },
    { id: 3, label: "Delivery", isActive: false },
    { id: 4, label: "Payment", isActive: false },
  ];

  // Reusable step number component
  const StepNumber = ({ number, isActive }) => (
    <div
      className={`
        w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-medium
        transition-colors duration-200
        ${isActive ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}
      `}
    >
      {number}
    </div>
  );

  // Reusable step label component
  const StepLabel = ({ label, isActive, isMobile }) => (
    <span
      className={`
        ${isMobile ? "text-xs" : "text-[15px]"} 
        whitespace-nowrap transition-colors duration-200
        ${isActive ? "text-red-500 font-medium" : "text-gray-600"}
        ${isMobile ? "hidden sm:block" : ""}
      `}
    >
      {label}
    </span>
  );

  // Chevron separator for desktop
  const ChevronSeparator = () => (
    <div className="w-5 h-5 flex items-center justify-center text-gray-400">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  // Line separator for mobile
  const LineSeparator = ({ isActive }) => (
    <div className="flex-1 h-[2px] bg-gray-200 mx-2">
      <div 
        className={`h-full transition-all duration-300 ${isActive ? "bg-red-500" : "bg-gray-200"}`}
        style={{ width: isActive ? "100%" : "0%" }}
      />
    </div>
  );

  return (
    <div className="w-full bg-white border-b border-gray-200 mb-4">
      {/* Desktop View */}
      <div className="hidden md:block max-w-[92%] mx-auto py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3">
                <StepNumber number={step.id} isActive={step.isActive} />
                <StepLabel label={step.label} isActive={step.isActive} />
              </div>
              {index < steps.length - 1 && <ChevronSeparator />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden w-full bg-gray-50 py-4">
        <div className="max-w-[92%] mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-1">
                  <StepNumber number={step.id} isActive={step.isActive} />
                  <StepLabel label={step.label} isActive={step.isActive} isMobile />
                </div>
                {index < steps.length - 1 && (
                  <LineSeparator isActive={step.isActive} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;