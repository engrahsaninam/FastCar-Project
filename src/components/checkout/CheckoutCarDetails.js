import React, { memo } from "react";
import { Timer, CalendarDays, ArrowUpRight, Phone } from "lucide-react";

const carData = {
  image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=60",
  title: "Cupra Formentor 2.0 TDI 4Drive DSG 110 kW",
  mileage: "30 353 km",
  year: "05/2023",
  deliveryInfo: "The usual delivery time is 20 working days. We will let you know the exact date during the order process.",
  support: {
    phone: "+420 246 034 700",
    hours: "Mo-Su 8 am-8 pm"
  }
};

const CarImage = memo(({ src, alt }) => (
  <div className="w-[86px] h-[64px] flex-shrink-0">
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded"
      loading="lazy"
    />
  </div>
));

const InfoItem = memo(({ Icon, text }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-4 h-4 flex items-center justify-center">
      <Icon size={14} className="text-gray-500" />
    </div>
    <span className="text-[13px] text-gray-500">{text}</span>
  </div>
));

const DeliveryInfo = memo(({ text }) => (
  <div className="flex items-start gap-2 text-[13px] text-red-500">
    <Timer size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
    <span>{text}</span>
  </div>
));

const SupportCard = memo(({ phone, hours, isMobile }) => (
  <div className={`bg-white border border-gray-100 rounded-lg shadow-sm ${isMobile ? 'mt-4' : 'w-[280px]'}`}>
    <div className="p-4 h-full flex items-center">
      <div className={`flex items-center gap-3 ${isMobile ? 'justify-center w-full' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Phone size={18} className="text-red-500" />
        </div>
        <div className={isMobile ? 'flex flex-col items-center text-center' : ''}>
          <div className="text-[13px] text-gray-600">Do you need advice?</div>
          <div className="text-[15px] text-red-500 font-medium">{phone}</div>
          {!isMobile && <div className="text-[13px] text-gray-500 mt-0.5">{hours}</div>}
        </div>
      </div>
    </div>
  </div>
));

const CarInfoCard = memo(({ data, isMobile }) => (
  <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex-1">
    <div className="p-4 h-full flex flex-col">
      <div className="flex gap-3">
        <CarImage src={data.image} alt={data.title} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <h2 className="text-[15px] text-[#111827] font-medium leading-snug pr-2">
              {data.title}
            </h2>
            <ArrowUpRight size={16} className="text-red-500 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-4 mt-1.5">
            <InfoItem Icon={Timer} text={data.mileage} />
            <InfoItem Icon={CalendarDays} text={data.year} />
          </div>
          {!isMobile && (
            <div className="mt-3">
              <DeliveryInfo text={data.deliveryInfo} />
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <div className="px-4 pb-4 pt-4 ">
          <DeliveryInfo text={data.deliveryInfo} />
        </div>
      )}
    </div>
  </div>
));

const CheckoutCarDetails = () => {
  return (
    <div className="w-full font-sans">
      {/* Mobile Design */}
      <div className="lg:hidden">
        <CarInfoCard data={carData} isMobile={true} />
        <SupportCard 
          phone={carData.support.phone}
          hours={carData.support.hours}
          isMobile={true}
        />
      </div>

      {/* Desktop Design */}
      <div className="hidden lg:block bg-white">
        <div className="max-w-[92%] mx-auto py-4">
          <div className="flex items-stretch justify-between gap-4">
            <CarInfoCard data={carData} isMobile={false} />
            <SupportCard 
              phone={carData.support.phone}
              hours={carData.support.hours}
              isMobile={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCarDetails;