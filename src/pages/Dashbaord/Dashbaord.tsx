// src/pages/Dashboard/Dashboard.tsx
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import GallerySection from './GallerySection';
import { useHomeSectionsContext } from '../../store/HomeSectionsContext/HomeSectionsContext';
import mapTexture from '../../assets/ambiance-1.jpg';
import mermaid from '../../assets/mermaid.webp';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { sections, loading: sectionsLoading } = useHomeSectionsContext();
  const [heroSection, setHeroSection] = useState<any>(null);
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [diningSection, setDiningSection] = useState<any>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sections.length > 0) {
      setHeroSection(sections.find(s => s.type === 'heroImage'));
      setAboutSection(sections.find(s => s.type === 'about'));
      setDiningSection(sections.find(s => s.type === 'dining'));
    }
  }, [sections]);

  // Preload hero image for instant display
  useEffect(() => {
    if (heroSection?.imageUrl) {
      const img = new Image();
      img.src = heroSection.imageUrl;
      img.onload = () => setHeroImageLoaded(true);
    }
  }, [heroSection?.imageUrl]);

  // Loading state
  if (sectionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#0E302A' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{ borderColor: '#d4ccc0' }} />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Full Screen with Dynamic Image */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image - Dynamic with Priority Loading */}
        <div className="absolute inset-0 bg-[#0E302A]">
          {heroSection?.imageUrl ? (
            <>
              {/* Placeholder while loading */}
              {!heroImageLoaded && (
                <div className="absolute inset-0 bg-[#0E302A] animate-pulse" />
              )}
              
              {/* Actual Image */}
              <img
                src={heroSection.imageUrl}
                alt="Rubinos Interior"
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  heroImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400">No hero image</span>
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-12">
          <div data-aos="fade-up" className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            {/* Large RUBINO'S Text */}
            <h1 className="font-head text-center text-[15vw] lg:text-[12vw] text-secondary leading-none tracking-[0.05em]">
              Rubino's
            </h1>
          </div>
        </div>
      </section>

      {/* ========================== About Section - Dynamic ========================= */}
      <section className="relative py-16 lg:py-24" style={{ backgroundColor: '#d4ccc0' }}>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center overflow-hidden">
            {/* Left Content - Dynamic */}
            <div data-aos="fade-right" className="flex flex-col justify-start">
              {/* Oyster Icon */}
              <div className="mb-6 w-12 h-12 opacity-70">
                <img 
                  src={mermaid} 
                  alt="Mermaid icon" 
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>

              {/* Heading - Dynamic */}
              <h2 className="text-4xl lg:text-4xl font-extrabold font-head mb-8 leading-tight animate-fade-in" style={{ color: '#0E302A' }}>
                {aboutSection?.title || 'Come For The pizza, Stay For The Everything'}
              </h2>

              {/* Body Text - Dynamic */}
              <div className="space-y-5  text-sm lg:text-base leading-relaxed animate-fade-in" style={{ color: '#3A5F58' }}>
                {aboutSection?.description ? (
                  aboutSection.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>No about content available.</p>
                )}
              </div>

              {/* Button */}
              <div className="mt-10">
                <button
               onClick={()=>{navigate("/menu")}}
                  className="inline-block px-8 py-3  text-xs lg:text-sm font-medium tracking-wider transition-all hover:opacity-75 duration-300 cursor-pointer"
                  style={{ backgroundColor: '#0E302A', color: '#f5f1ed' }}
                >
                  MENU
                </button>
              </div>
            </div>

            {/* Right Image - Dynamic with Aspect Ratio Preservation */}
            <div data-aos="fade-left" className="relative w-full">
              <div className="overflow-hidden rounded-md shadow-lg">
                {aboutSection?.imageUrl ? (
                  <div className="relative w-full" style={{ paddingBottom: '80.67%' }}>
                    <img
                      src={aboutSection.imageUrl}
                      alt="About section"
                      className="absolute inset-0 w-full h-full object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== Background Attachment Row ======================= */}
      <section className="relative">
        <div className="grid md:grid-cols-2 h-140 bg-images"></div>
      </section>

      {/* ============================ mission/vision - Dynamic ======================== */}
      <section className="relative py-16 lg:py-24" style={{ backgroundColor: '#d4ccc0' }}>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center overflow-hidden">
            {/* Left Image - Dynamic with Aspect Ratio Preservation */}
            <div data-aos="fade-right" className="relative w-full   overflow-hidden rounded-md shadow-lg">
              {diningSection?.imageUrl ? (
                <div className="relative w-full" style={{ paddingBottom: '120.67%' }}>
                  <img
                    src={diningSection.imageUrl}
                    alt="Private Dining at Rubinos"
                    className="absolute inset-0 w-full h-full object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            {/* Right Content - Dynamic */}
            <div data-aos="fade-left" className="flex flex-col justify-start">
              {/* Heading - Dynamic */}
              <h2 className="text-4xl lg:text-4xl font-head font-serif font-bold mb-8 leading-tight animate-fade-in" style={{ color: '#0E302A' }}>
                {diningSection?.title || 'The Pearl of Private Dining'}
              </h2>

              {/* Body Text - Dynamic */}
              <div className="space-y-5 font-serif text-sm lg:text-base leading-relaxed animate-fade-in" style={{ color: '#3A5F58' }}>
                {diningSection?.description ? (
                  diningSection.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>No dining content available.</p>
                )}
              </div>

              {/* Button */}
              <div className="mt-10">
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-block px-8 py-3  text-xs lg:text-sm font-medium tracking-wider transition-all hover:opacity-75 duration-300 cursor-pointer"
                  style={{ backgroundColor: '#0E302A', color: '#f5f1ed' }}
                >
                  CONTACT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Location Section with Map Texture =================== */}
      <section
        id="contact"
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${mapTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="grid lg:grid-cols-2 gap-0 min-h-fit">
          {/* Left - Location Info */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-20 bg-gradient-to-b from-[#0E302A]/95 to-[#0E302A]/95">
            <h2 data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="100" data-aos-offset="0" className="text-4xl lg:text-5xl font-serif font-bold mb-10 tracking-wide font-head" style={{ color: '#e8dfd7' }}>
              LOCATION
            </h2>

            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#b8aea0' }} strokeWidth={1.5} />
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-sm lg:text-base tracking-wide hover:opacity-70 transition-opacity"
                  style={{ color: '#e8dfd7' }}
                >
                  39 saint Gini, Kafr abdo, Alexandria, Egypt
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#b8aea0' }} strokeWidth={1.5} />
                <a
                  href="tel:01119477764"
                  className="text-sm lg:text-base tracking-wide hover:opacity-70 transition-opacity"
                  style={{ color: '#e8dfd7' }}
                >
                  01119477764
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#b8aea0' }} strokeWidth={1.5} />
                <a
                  href="mailto:info@Rubinos.com"
                  className="font-serif text-sm lg:text-base tracking-wide hover:opacity-70 transition-opacity"
                  style={{ color: '#e8dfd7' }}
                >
                  info@Rubinos.com
                </a>
              </div>
            </div>

            {/* Button */}
            <div className="mt-10">
              <a
                href="https://www.google.com/maps?ll=31.225588,29.952763&z=16&t=m&hl=ar&gl=EG&mapclient=embed&cid=17144324494741846894"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-7 py-3  text-xs lg:text-sm font-medium tracking-widest transition-all hover:opacity-75 duration-300"
                style={{ backgroundColor: '#b8aea0', color: '#3A5F58' }}
              >
                GET DIRECTION
              </a>
            </div>
          </div>

          {/* Right - Hours & Menu */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-20 bg-[#0f1619]/99">
            <h2 data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="100" data-aos-offset="0" className="text-4xl lg:text-5xl font-serif font-bold mb-10 tracking-wide font-head" style={{ color: '#e8dfd7' }}>
              MENU
            </h2>

            <div className="space-y-5">
              {/* Restaurant Hours */}
              <div>
                <h3 data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="100" data-aos-offset="0" className="text-base lg:text-lg font-serif font-bold mb-3 tracking-widest" style={{ color: '#FFE8C0' }}>
                  RESTAURANT HOURS
                </h3>
                <div className="space-y-2 font-serif text-sm lg:text-base" style={{ color: '#b8aea0' }}>
                  <div className="flex justify-between items-center">
                    <span>Sunday - Wednesday</span>
                    <span className="text-right">4PM - 10PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Thursday - Saturday</span>
                    <span className="text-right">4PM - 11PM</span>
                  </div>
                </div>
              </div>

              {/* Happy Hour */}
              <div>
                <h3 data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="100" data-aos-offset="0" className="text-base lg:text-lg font-serif font-bold mb-2 tracking-widest" style={{ color: '#FFE8C0' }}>
                  HAPPY HOUR AT RUBINOS
                </h3>
                <p className="font-serif text-xs lg:text-sm tracking-wide mb-2" style={{ color: '#b8aea0' }}>
                  Your favorite flavors and drink specials, every happy hour.
                </p>
                <div className="flex justify-between items-center font-serif text-sm lg:text-base" style={{ color: '#b8aea0' }}>
                  <span>7 days a Week</span>
                  <span>4PM - 6PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Dynamic */}
      <GallerySection />
    </>
  );
};

export default Dashboard;