import { ShieldCheck, User } from "lucide-react";


const SafePurchaseSection = () => {
    return (
      <div>
  <section className="relative" style={
        {
          background: 'linear-gradient(180deg, #E81616FF 0%, #C71313FF 90%)'
        }
      }>
    {/* Mobile-only background divs */}
    <div className="md:hidden absolute top-0 left-0 w-full h-[70%] " />
    <div className="md:hidden absolute bottom-0 left-0 w-full h-[30%] bg-white" />
    
    {/* Desktop-only background */}
    <div className="hidden md:block absolute inset-0 bg-gray-100" />

    {/* Content wrapper */}
    <div className="relative py-10 px-6">

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
          <ShieldCheck className="text-pink-500"/>
          <h3 className="text-lg font-medium text-gray-800">Safe Purchase</h3>
          <p className="text-gray-600 text-center mt-2">
            Enjoy a secure process from start to finish.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wrench">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-800">Inspect Car</h3>
          <p className="text-gray-600 text-center mt-2">
            Every vehicle is thoroughly inspected for quality.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins">
            <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/>
            <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/>
            <path d="m2 16 6 6"/>
            <circle cx="16" cy="9" r="2.9"/>
            <circle cx="6" cy="5" r="3"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-800">We Give Refunds</h3>
          <p className="text-gray-600 text-center mt-2">
            Get your money back if you're not satisfied.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>
    );
  };

export default SafePurchaseSection;