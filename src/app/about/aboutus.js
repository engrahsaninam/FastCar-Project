"use client";

const HeroSection = () => {
  return (
    <div className="relative">
      {/* Background with diagonal cut */}
      <div className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-right from-red-500 to-[#FEF5F5] transform -skew-y-6 origin-top-left scale-110">
          <div className="absolute inset-0 bg-[url('/modernbuilding.jpg')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className=" space-y-6">
              <p className=" text-black text-sm md:text-base font-medium uppercase tracking-wider">
                CARS FROM ALL OVER EUROPE AT YOUR REACH
              </p>
              
              <h1 className=" text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                We are a European online marketplace
              </h1>
              
              <p className="text-lg md:text-xl opacity-90 max-w-lg">
                We bring you new markets, new customers and new opportunities for the purchase and sale of used cars. Now you can buy and sell a used car safely and comfortably online, with only a few easy clicks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
                  Buy a Car
                </button>
                
              </div>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block">
              <img 
                src="/RedCar.jpg" 
                alt="Modern Building" 
                className="rounded-lg shadow-2xl w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            viewBox="0 0 1440 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path 
              fill="white" 
              d="M0 200V68.6275C240 22.8758 480 0 720 0C960 0 1200 22.8758 1440 68.6275V200H0Z"
            />
          </svg>
        </div>
      </div>

      {/* Trust Indicators Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#FC4F3F]">
              WE ARE NEW AND GROWING FAST
            </h2>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">200k+</div>
                <div className="mt-2 text-gray-600">Cars Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">50k+</div>
                <div className="mt-2 text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">30+</div>
                <div className="mt-2 text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">24/7</div>
                <div className="mt-2 text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeroSection;