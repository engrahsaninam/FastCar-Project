import React from "react";

const CustomerReviewsSection = () => {
  const reviews = [
    {
      name: "Kamilia C.",
      rating: 5,
      review:
        "Brilliant car inspection, extremely professional and well-organized! I was able to buy a used car with confidence and assurance, thanks to their thorough evaluation. Highly recommended!",
      car: "Skoda Fabia - 2016",
    },
    {
      name: "John B.",
      rating: 4.5,
      review:
        "Coverage arranged for the buy of a Kia Sportage. Clear communication about the car's technical condition and detailed assessment with the CarAudit team. Definitely worth the service for peace of mind!",
      car: "Kia Sportage - 2022",
    },
    {
      name: "Ali Z.",
      rating: 4.8,
      review:
        "Precise and professional approach as well as detailed technical analysis of the Toyota Aygo I purchased. They addressed all my concerns transparently and provided a comprehensive report. Highly satisfied!",
      car: "Toyota Aygo X - 2021",
    },
    {
      name: "Maria L.",
      rating: 4.6,
      review:
        "The service was great, they inspected my used Skoda Karoc in no time, provided thorough details, and ensured everything was clear. Excellent value for money!",
      car: "Skoda Karoc - 2019",
    },
    {
      name: "Alexis K.",
      rating: 5,
      review:
        "Thank you so much for the service you provide, very clear findings, and they keep you updated throughout the process. Thanks to them, I purchased my Mercedes Benz worry-free.",
      car: "Mercedes Benz A180 - 2023",
    },
    {
      name: "Alexis K.",
      rating: 5,
      review:
        "Thank you so much for the service you provide, very clear findings, and they keep you updated throughout the process. Thanks to them, I purchased my Mercedes Benz worry-free.",
      car: "Mercedes Benz A180 - 2023",
    },
  ];

  return (
    <div className="bg-lightBlue py-10 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-darkBlue">
            What do our customers think?
          </h2>
          <p className="text-xl text-red-500 mt-2">4.8 ★★★★★</p>
          <p className="text-grey-500 text-sm">1600+ reviews</p>
        </div>

        {/* Reviews Carousel */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="mb-4">
                <h4 className="font-bold text-darkBlue">{review.name}</h4>
                <p className="text-red-500">{"★".repeat(review.rating)}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">{review.review}</p>
              <p className="text-sm font-semibold text-gray-700">
                {review.car}
              </p>
              <button className="mt-2 text-primary font-medium underline text-red-500">
                Show full review
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-center mt-8">
          <button className="border border-gray-300 rounded-full px-3 py-1 mx-1 text-darkBlue">
            {"<"}
          </button>
          <button className="border border-primary bg-primary text-white rounded-full px-3 py-1 mx-1">
            1
          </button>
          <button className="border border-gray-300 rounded-full px-3 py-1 mx-1 text-darkBlue">
            2
          </button>
          <button className="border border-gray-300 rounded-full px-3 py-1 mx-1 text-darkBlue">
            {">"}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default CustomerReviewsSection;
