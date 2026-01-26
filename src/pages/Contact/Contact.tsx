import { useState } from 'react';
import contact from '../../assets/4.jpg';
import { addMessage } from '../../service/messages/messages.service';
import { toast } from 'react-hot-toast';

export default function Contact() {
    
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: ''
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.details) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        details: formData.details
      });

      toast.success('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        details: ''
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      toast.error('Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
     {/* Hero Section */}
          <section className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={contact}
                alt="Gallery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
            </div>
    
            <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 lg:pb-12">
              <div data-aos="fade-up" className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <h1 className="font-head text-center text-[15vw] lg:text-[12vw] text-secondary leading-none tracking-[0.05em]">
                  CONTACT
                </h1>
              </div>
            </div>
          </section>
        
         {/* Contact Form Section */}
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: '#d4ccc0' }}>
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-20"  />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h2  data-aos="fade-down" className="font-head text-4xl lg:text-5xl font-semibold mb-6" style={{ color: '#3A5F58' }}>
              Let's Be In Touch
            </h2>
            <p  data-aos="fade-down" className="text-base lg:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#3A5F58' }}>
Whether you’re curious about our authentic Italian recipes, want to explore our seasonal pizza and pasta creations, or are looking to host a special event in our cozy private dining area, we invite you to reach out to us today.            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white/40 backdrop-blur-sm p-8 lg:p-12 shadow-sm">
            <div className="space-y-8">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold mb-3 tracking-wider uppercase" style={{ color: '#0E302A' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 bg-white/60 border-b-2 border-[#a89f97] focus:border-[#3d5055] focus:outline-none transition-colors font-serif"
                    style={{ color: '#3d5055' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 tracking-wider uppercase" style={{ color: '#0E302A' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 bg-white/60 border-b-2 border-[#a89f97] focus:border-[#3d5055] focus:outline-none transition-colors font-serif"
                    style={{ color: '#3d5055' }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-3 tracking-wider uppercase" style={{ color: '#0E302A' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(504) 930-3071"
                  required
                  className="w-full px-4 py-3 bg-white/60 border-b-2 border-[#a89f97] focus:border-[#3d5055] focus:outline-none transition-colors font-serif"
                  style={{ color: '#3d5055' }}
                />
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-sm font-semibold mb-3 tracking-wider uppercase" style={{ color: '#0E302A' }}>
                  Additional Details *
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/60 border-b-2 border-[#a89f97] focus:border-[#3d5055] focus:outline-none transition-colors resize-none font-serif"
                  style={{ color: '#3d5055' }}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-12 py-4 font-semibold tracking-widest uppercase text-sm transition-all duration-300 border-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: isSubmitting ? '#0E302A' : '#0E302A',
                    color: '#d4ccc0',
                    borderColor: isSubmitting ? '#6b7c7e' : '#3d5055'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#0E302A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#0E302A';
                      e.currentTarget.style.color = '#d4ccc0';
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Query'}
                </button>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mt-16 pt-12 border-t border-[#a89f97]/30">
            <h3 data-aos="zoom-in" className="font-head text-3xl lg:text-4xl font-semibold text-center mb-10" style={{ color: '#3A5F58' }}>
              Location
            </h3>
            <div data-aos="zoom-in" className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="flex justify-center mb-4">
                  <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="#0E302A" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <p className="text-base leading-relaxed" style={{ color: '#3A5F58' }}>
                 39 saint Gini <br /> kafr abdo, Alexandria, Egypt
                </p>
              </div>

              <div className="group">
                <div className="flex justify-center mb-4">
                  <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="#0E302A" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <p className=" text-base" style={{ color: '#3A5F58' }}>
                 011 19477764
                </p>
              </div>

              <div className="group">
                <div className="flex justify-center mb-4 ">
                  <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="#0E302A" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <p className="text-base" style={{ color: '#3A5F58' }}>
                  info@Rubinos.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="relative h-[400px] w-full py-3 bg-[#E5E0D9]">
          {isLoading && (
            <div className="flex items-center justify-center   pt-25">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-[#a89f97]/30 border-t-[#3d5055] rounded-full animate-spin" />
                </div>
                <p className="text-[#6b7c7e] mt-4">Loading Map...</p>
              </div>
            </div>

          )}
        <iframe
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!3d3411.8233873248387!2d29.952710442809703!3d31.225622096352538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c52418831811%3A0xedece04b1f1dbb6e!2zUnViaW5v4oCZcw!5e0!3m2!1sar!2seg!4v1768313978310!5m2!1sar!2seg"          width="100%"
          height="100%"
          style={{ border: 0 }}
          
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Restaurant Location"
           onLoad={() => setIsLoading(false)}
        ></iframe>
         
      </section>
    </>
  )
}