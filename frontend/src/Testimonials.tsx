const Testimonials: React.FC = () => {
    const testimonials = [
      { name: 'John Doe', review: 'Amazing service! My car looks brand new.', rating: 5 },
      { name: 'Jane Smith', review: 'Convenient and professional. Highly recommend!', rating: 4 },
      { name: 'Jane Smith', review: 'Convenient and professional. Highly recommend!', rating: 4 },
      { name: 'Jane Smith', review: 'Convenient and professional. Highly recommend!', rating: 4 },
    ];
  
    return (
      <section id="testimonials" className="py-16 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4">"{testimonial.review}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <div className="text-yellow-400">
                  {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  