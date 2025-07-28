import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    }, 1500);
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Get In Touch</h1>
          <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto">We'd love to hear from you. Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Side: Contact Form */}
          <div className="lg:w-3/5 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" placeholder="Your message..."></textarea>
              </div>
              <div>
                <button type="submit" disabled={status === 'sending'} className="w-full flex items-center justify-center gap-2 bg-amber-700 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-amber-800 transition duration-300 disabled:bg-amber-400 transform hover:scale-105">
                  {status === 'sending' ? 'Sending...' : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-green-600 font-semibold text-center animate-pulse">Thank you! Your message has been sent successfully.</p>
              )}
            </form>
          </div>

          {/* Right Side: Contact Information (Redesigned) */}
          <div className="lg:w-2/5 bg-gray-100 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Information</h2>
            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-amber-200 text-amber-800 rounded-full p-3">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Our Workshop</h3>
                  <p className="text-gray-600 mt-1">Location</p>
                  <a href="#" className="text-amber-700 font-semibold hover:underline mt-2 inline-block">Get Directions</a>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-amber-200 text-amber-800 rounded-full p-3">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
                  <p className="text-gray-600 mt-1">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:123-456-7890" className="text-amber-700 font-semibold hover:underline mt-2 inline-block">0000000000</a>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-amber-200 text-amber-800 rounded-full p-3">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
                  <p className="text-gray-600 mt-1">We'll get back to you within 24 hours.</p>
                  <a href="mailto:contact@sovereignwoodcraft.com" className="text-amber-700 font-semibold hover:underline mt-2 inline-block">contact@sovereignwoodcraft.com</a>
                </div>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-amber-700 transition-colors p-2 rounded-full hover:bg-gray-200"><Instagram /></a>
                <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-amber-700 transition-colors p-2 rounded-full hover:bg-gray-200"><Facebook /></a>
                <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-amber-700 transition-colors p-2 rounded-full hover:bg-gray-200"><Twitter /></a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
