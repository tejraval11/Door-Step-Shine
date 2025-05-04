import React from 'react';
import carImage from './assets/car.jpg';

const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${carImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-4 animate-fadeInUp">
          Door Step Shine
        </h1>
        
        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 animate-fadeInUp delay-200">
          Premium car washing services delivered to your doorstep
        </p>
        
        {/* CTA Button */}
        <a
          href="#book"
          className="px-6 py-4 text-lg bg-yellow-500 text-black font-semibold rounded-lg shadow-lg transform hover:scale-105 hover:bg-yellow-600 transition duration-300 ease-in-out animate-fadeInUp delay-400"
        >
          Book Your Wash Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
