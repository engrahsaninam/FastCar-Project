import React from 'react';
import process from "@/assets/process.png"
import Link from 'next/link'; 

const DreamCarBanner = () => {
  return (
    <div className="bg-[#e8f7f4] py-16 px-4 md:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:space-x-24">
        <div className="md:w-[38%]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
            Buy your dream car easier than you think
          </h1>
          <p className="text-[#7F8C8D] mb-8">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et massa mi.
            Aliquam in hendrerit urna.
          </p>
          <div className="flex justify-start md:justify-start space-x-4">
            <Link href="/cars" passHref>
              <button className="bg-[#FF5A5F] hover:bg-[#E54850] text-white font-bold py-3 px-6 rounded-md">
                Get your car
              </button>
            </Link>

          </div>
        </div>
        <div className="md:w-[50%] flex justify-center sm:mt-0 mt-12">
          <div className="relative">
            <div className="bg-[#F0F9F7] rounded-full w-20 h-20 absolute top-8 left-8"></div>
            <div className="bg-[#F0F9F7] rounded-full w-16 h-16 absolute bottom-8 right-96"></div>
            <img
              src={process.src}
              alt="Dream Car"
              className="w-full max-w-[900px] relative z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamCarBanner;