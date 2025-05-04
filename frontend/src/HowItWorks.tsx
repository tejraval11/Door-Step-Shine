const HowItWorks: React.FC = () => {
  const steps = [
    { step: '1', title: 'Schedule Online', description: 'Choose a convenient time for your car wash.' },
    { step: '2', title: 'We Come to You', description: 'Our team arrives at your location, fully equipped.' },
    { step: '3', title: 'Shiny Clean', description: 'Enjoy your freshly cleaned car!' }
  ];

  return (
    <section id="how-it-works" className="py-16 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-8">How It Works</h2>
        <p className="text-lg text-gray-600 mb-12">
          Get your car cleaned without leaving your home! Our simple process ensures convenience and professional results, leaving your car spotless every time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="p-6 hover:bg-gray-100 transition duration-300 flex flex-col justify-between">
              <div className="text-blue-500 text-4xl font-bold mb-4">{step.step}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
