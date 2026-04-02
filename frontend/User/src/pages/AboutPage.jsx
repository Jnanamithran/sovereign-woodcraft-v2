import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Leaf, Hammer } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <section 
        className="relative h-[50vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold">About Sovereign Woodcraft</h1>
          <p className="text-lg md:text-xl mt-4">Crafting tomorrow's heirlooms, today.</p>
        </div>
      </section>

      {/* --- OUR STORY SECTION --- */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Sovereign Woodcraft was born from a simple love for wood and a passion for timeless design. What started in a small garage workshop has grown into a dedicated team of artisans committed to creating beautiful, functional furniture that tells a story.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that furniture should be more than just an object; it should be a part of your home's narrative. Each piece is meticulously crafted with attention to detail, using traditional techniques passed down through generations, ensuring it can be cherished for years to come.
            </p>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1572277555613-7893111e53a3?auto=format&fit=crop&q=80" 
              alt="Craftsman working on wood" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- OUR VALUES SECTION --- */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-6 py-16 lg:py-24 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="flex flex-col items-center">
              <div className="bg-amber-700 text-white rounded-full p-4 mb-4">
                <Hammer size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">True Craftsmanship</h3>
              <p className="text-gray-600">
                Every joint, curve, and finish is a testament to our dedication to the craft. We don't cut corners.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-amber-700 text-white rounded-full p-4 mb-4">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sustainable Sourcing</h3>
              <p className="text-gray-600">
                We use responsibly harvested wood and eco-friendly finishes to protect our planet for future generations.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-amber-700 text-white rounded-full p-4 mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Built to Last</h3>
              <p className="text-gray-600">
                Our furniture is designed to be durable and timeless, becoming a cherished part of your family's story.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="container mx-auto px-6 py-16 lg:py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Find Your Perfect Piece?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Browse our collection and discover the difference that true craftsmanship makes. We're excited to help you create a home you love.
        </p>
        <Link to="/shop" className="bg-amber-700 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-amber-800 transition duration-300">
          Explore The Shop
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
