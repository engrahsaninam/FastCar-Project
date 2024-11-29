"use client"

const GuaranteeSection = () => {
  const handleInspectionClick = () => {
    // Assuming your PDF is stored in the public folder
    window.open('/inspectionDetail (1).pdf', '_blank');
    // You can also specify a complete URL if the PDF is hosted elsewhere
    // window.open('https://example.com/path/to/inspection-details.pdf', '_blank');
  };

  return (
    <section className="bg-gray-50">
      {/* Top Section */}
      <div className="relative h-[450px]">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://carvago.com/video/how-it-works-page-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Text Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            CarAudit™ — Guarantee of a good purchase
          </h2>
          <p className="text-lg text-white/90 max-w-2xl">
            Before the sale, each vehicle undergoes a detailed certified inspection
            by an experienced mechanic trained to detect hidden defects and potential risks.
            You know exactly what you are buying ahead of time, and we guarantee the condition
            as stated in the certificate. CarAudit is our mechanic on your side.
          </p>
          <button 
            onClick={handleInspectionClick}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            More about Inspection
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Bottom Section */}
      <div className="container mx-auto px-6 lg:px-12 mt-12 w-full h-64 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#10B981]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H3"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Detailed inspection</h3>
            <p className="text-gray-600">
              We won't miss a thing. Each inspection consists of 270 inspection items.
              We will inform you about the vehicle's condition before you decide to buy it.
            </p>
          </div>
          {/* Card 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#10B981]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Guaranteed vehicle condition
            </h3>
            <p className="text-gray-600">
              We guarantee the condition of the vehicle as stated in the CarAudit certificate.
              We will compensate for any possible deviation, deficiency, or defect detected.
            </p>
          </div>
          {/* Card 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#10B981]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Certified mechanics</h3>
            <p className="text-gray-600">
              We work only with qualified mechanics with years of experience who can detect
              even the most minute defects, be they already present or imminent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;