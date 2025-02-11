import React from "react";
import { Timer, CalendarDays, ArrowUpRight, Phone } from "lucide-react";

const CarHeader = () => {
  const steps = [
    { id: 1, label: "Payment method", isActive: true },
    { id: 2, label: "Car condition check", isActive: false },
    { id: 3, label: "Delivery", isActive: false },
    { id: 4, label: "Payment", isActive: false },
  ];
  return (
    <div className="w-full font-sans">
      {/* Mobile Design */}
      <div className="lg:hidden">
        <div className="border border-gray-100 rounded-lg bg-white shadow-sm">
          <div className="p-4 flex gap-3">
            <div className="w-[86px] h-[64px] flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60"
                alt="Cupra Formentor"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <h2 className="text-[15px] text-[#111827] font-medium leading-snug pr-2">
                  Cupra Formentor 2.0 TDI 4Drive DSG 110 kW
                </h2>
                <ArrowUpRight
                  size={16}
                  className="text-red-500 flex-shrink-0"
                />
              </div>
              <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Timer size={14} className="text-gray-500" />
                  </div>
                  <span className="text-[13px] text-gray-500">30 353 km</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <CalendarDays size={14} className="text-gray-500" />
                  </div>
                  <span className="text-[13px] text-gray-500">05/2023</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-start gap-2 text-[13px] text-red-500">
              <Timer size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <span>
                The usual delivery time is 20 working days. We will let you know
                the exact date during the order process.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-red-500" />
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-[13px] text-gray-600">
                  Do you need advice?
                </div>
                <div className="text-[15px] text-red-500 font-medium">
                  +420 246 034 700
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Design */}
      <div className="hidden lg:block bg-white">
        <div className="max-w-[92%]  mx-auto py-4">
          <div className="flex items-stretch justify-between gap-4">
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex-1">
              <div className="p-4 h-full flex flex-col">
                <div className="flex gap-3">
                  <div className="w-[86px] h-[64px] flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60"
                      alt="Cupra Formentor"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h2 className="text-[15px] text-[#111827] font-medium leading-snug pr-2">
                        Cupra Formentor 2.0 TDI 4Drive DSG 110 kW
                      </h2>
                      <ArrowUpRight
                        size={16}
                        className="text-red-500 flex-shrink-0"
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <Timer size={14} className="text-gray-500" />
                        </div>
                        <span className="text-[13px] text-gray-500">
                          30 353 km
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <CalendarDays size={14} className="text-gray-500" />
                        </div>
                        <span className="text-[13px] text-gray-500">
                          05/2023
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-[13px] text-red-500">
                      <Timer
                        size={16}
                        className="text-red-500 mt-0.5 flex-shrink-0"
                      />
                      <span>
                        The usual delivery time is 20 working days. We will let
                        you know the exact date during the order process.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg shadow-sm w-[280px]">
              <div className="p-4 h-full flex items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-red-500" />
                  </div>
                  <div>
                    <div className="text-[13px] text-gray-600">
                      Do you need advice?
                    </div>
                    <div className="text-[15px] text-red-500 font-medium">
                      +420 246 034 700
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">
                      Mo-Su 8 am-8 pm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white border-bottom border-gray-200 mb-4">
        <div className=" hidden md:block max-w-[92%] mx-auto py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-medium
                  ${
                    step.isActive
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`
                  text-[15px] whitespace-nowrap
                  ${
                    step.isActive ? "text-red-500 font-medium" : "text-gray-600"
                  }
                `}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
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
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="md:hidden w-full bg-gray-50 py-4">
      <div className="max-w-[92%] mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-medium
                    ${
                      step.isActive
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                >
                  {step.id}
                </div>
                <span
                  className={`
                    text-xs text-center hidden sm:block
                    ${
                      step.isActive ? "text-red-500 font-medium" : "text-gray-600"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-gray-200 mx-2">
                  <div 
                    className={`h-full ${
                      step.isActive ? "bg-red-500" : "bg-gray-200"
                    }`}
                    style={{
                      width: step.isActive ? "100%" : "0%"
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default CarHeader;
