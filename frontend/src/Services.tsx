import React, { useState } from "react";
import { FaCar, FaTools, FaCheckCircle } from "react-icons/fa";

const Services: React.FC = () => {
  const [carType, setCarType] = useState<"sedan" | "suv" | "hatchback">("sedan");

  const services = [
    {
      id: 1,
      title: "Exterior Wash",
      description: "Quick and efficient exterior cleaning.",
      prices: { sedan: "₹500", suv: "₹600", hatchback: "₹400" },
      icon: FaCar,
    },
    {
      id: 2,
      title: "Interior Detailing",
      description: "Deep cleaning of your car’s interior.",
      prices: { sedan: "₹1000", suv: "₹1200", hatchback: "₹800" },
      icon: FaTools,
    },
    {
      id: 3,
      title: "Full Car Detailing",
      description: "Complete interior and exterior cleaning.",
      prices: { sedan: "₹1500", suv: "₹1800", hatchback: "₹1200" },
      icon: FaCheckCircle,
    },
    {
      id: 4,
      title: "Eco-Friendly Wash",
      description: "Water-saving, eco-friendly car wash.",
      prices: { sedan: "₹700", suv: "₹800", hatchback: "₹500" },
      icon: FaCar,
    },
  ];

  return (
    <section id="services" className="py-16 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-8">Our Services</h2>
        <p className="text-lg text-gray-600 mb-12">
          Choose from a range of premium car washing and detailing services.
          We guarantee professional results that will leave your car looking as good as new!
        </p>

        {/* Car Type Selection */}
        <div className="flex justify-center gap-4 mb-8">
          {["sedan", "suv", "hatchback"].map((type) => (
            <button
              key={type}
              onClick={() => setCarType(type as "sedan" | "suv" | "hatchback")}
              className={`px-4 py-2 rounded-md text-white font-semibold transition ${
                carType === type ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              <div className="mb-4">
                <service.icon className="text-2xl text-primary mb-4" />
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
              <div>
                <p className="font-semibold text-lg mb-4">
                  {service.prices[carType]}
                </p>
                <a
                  href={`/service-details/${service.id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
