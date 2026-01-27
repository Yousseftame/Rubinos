// src/pages/Dashboard/Dashboard.tsx
import { useState, useEffect, useMemo } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import GallerySection from './GallerySection';
import { useHomeSectionsContext } from '../../store/HomeSectionsContext/HomeSectionsContext';
import mermaid from '../../assets/mermaid.webp';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../../components/shared/SplashScreen';

const Dashboard = () => {
  const { sections, loading: sectionsLoading } = useHomeSectionsContext();
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const navigate = useNavigate();

  // Check if splash should be shown (only on first load of the session)
  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem('rubinos_splash_shown');
    if (!hasShownSplash) {
      setShowSplash(true);
      // Prevent scrolling while splash is visible
      document.body.style.overflow = 'hidden';
    } else {
      // If splash was already shown, scroll to top immediately
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  // Memoize sections to prevent unnecessary re-renders
  const { heroSection, aboutSection, diningSection } = useMemo(() => {
    return {
      heroSection: sections.find(s => s.type === 'heroImage'),
      aboutSection: sections.find(s => s.type === 'about'),
      diningSection: sections.find(s => s.type === 'dining')
    };
  }, [sections]);

  // Preload hero image
  useEffect(() => {
    if (heroSection?.imageUrl) {
      const img = new Image();
      img.src = heroSection.imageUrl;
      img.onload = () => setHeroImageLoaded(true);
    }
  }, [heroSection?.imageUrl]);

  // Preload other critical images
  useEffect(() => {
    if (aboutSection?.imageUrl) {
      const img = new Image();
      img.src = aboutSection.imageUrl;
    }
    if (diningSection?.imageUrl) {
      const img = new Image();
      img.src = diningSection.imageUrl;
    }
  }, [aboutSection?.imageUrl, diningSection?.imageUrl]);

  // Check if content is ready
  useEffect(() => {
    if (!sectionsLoading && heroImageLoaded && sections.length > 0) {
      setContentReady(true);
    }
  }, [sectionsLoading, heroImageLoaded, sections.length]);

  // Hide splash when content is ready
  useEffect(() => {
    if (contentReady && showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        // Re-enable scrolling
        document.body.style.overflow = '';
        // Scroll to top smoothly after splash disappears
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [contentReady, showSplash]);

  // Scroll to top when component mounts (for navigation back to dashboard)
  useEffect(() => {
    if (!showSplash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [showSplash]);

  // Memoize split paragraphs
  const aboutParagraphs = useMemo(() => {
    return aboutSection?.description?.split('\n\n') || [];
  }, [aboutSection?.description]);

  const diningParagraphs = useMemo(() => {
    return diningSection?.description?.split('\n\n') || [];
  }, [diningSection?.description]);

  // Show splash screen while loading (only on first visit)
  if (showSplash) {
    return <SplashScreen onLoadComplete={() => {
      setShowSplash(false);
      // Re-enable scrolling
      document.body.style.overflow = '';
    }} />;
  }

  return (
    <>
      {/* Hero Section - Full Screen with Dynamic Image */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image - Optimized with WebP support */}
        <div className="absolute inset-0 bg-[#0E302A]">
          {heroSection?.imageUrl ? (
            <>
              {/* Blur placeholder while loading - lighter weight */}
              {!heroImageLoaded && (
                <div className="absolute inset-0 bg-[#0E302A]" />
              )}
              
              {/* Actual Image with optimizations */}
              <img
                src={heroSection.imageUrl}
                alt="Rubinos Interior"
                className={`w-full h-full object-cover transition-opacity duration-700 ${
                  heroImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </>
          ) : (
            <div className="w-full h-full bg-[#0E302A] flex items-center justify-center">
              
            </div>
          )}
          {/* Gradient Overlay - simplified */}
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

      {/* ========================== About Section - Optimized ========================= */}
      <section className="relative py-16 lg:py-24 bg-[#d4ccc0]">
        {/* Texture overlay - simplified */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div data-aos="fade-right" className="flex flex-col justify-start">
              {/* Mermaid Icon */}
              <div className="mb-6 w-12 h-12 opacity-70">
                <img 
                  src={mermaid} 
                  alt="Mermaid icon" 
                  className="w-full h-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Heading */}
              <h2 className="text-4xl lg:text-4xl font-extrabold font-head mb-8 leading-tight text-[#0E302A]">
                {aboutSection?.title || 'Come For The pizza, Stay For The Everything'}
              </h2>

              {/* Body Text - Memoized */}
              <div className="space-y-5 text-sm lg:text-base leading-relaxed text-[#3A5F58]">
                {aboutParagraphs.length > 0 ? (
                  aboutParagraphs.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>No about content available.</p>
                )}
              </div>

              {/* Button */}
              <div className="mt-10">
                <button
                  onClick={() => navigate("/menu")}
                  className="inline-block px-8 py-3 text-xs lg:text-sm font-medium tracking-wider transition-all hover:opacity-75 duration-300 cursor-pointer bg-[#0E302A] text-[#f5f1ed]"
                  aria-label="View menu"
                >
                  MENU
                </button>
              </div>
            </div>

            {/* Right Image - Optimized loading */}
            <div data-aos="fade-left" className="relative w-full">
              <div className="overflow-hidden rounded-md shadow-lg">
                {aboutSection?.imageUrl ? (
                  <div className="relative w-full pb-[75.67%]">
                    <img
                      src={aboutSection.imageUrl}
                      alt="About Rubinos"
                      className="absolute inset-0 w-full h-full object-cover object-top"
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

      {/* ========================== Background Attachment Row - FIXED & RESPONSIVE ======================= */}
      <section className="relative w-full overflow-hidden">
        <div 
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] bg-images bg-cover bg-center bg-fixed"
         
        />
      </section>

      {/* ============================ Mission/Vision - Optimized ======================== */}
      <section className="relative py-16 lg:py-24 bg-[#d4ccc0]">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Image - Optimized */}
            <div data-aos="fade-right" className="relative w-full overflow-hidden rounded-md shadow-lg">
              {diningSection?.imageUrl ? (
                <div className="relative w-full pb-[120.67%]">
                  <img
                    src={diningSection.imageUrl}
                    alt="Private Dining at Rubinos"
                    className="absolute inset-0 w-full h-full object-cover object-top"
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

            {/* Right Content */}
            <div data-aos="fade-left" className="flex flex-col justify-start">
              {/* Heading */}
              <h2 className="text-4xl lg:text-4xl font-head font-serif font-bold mb-8 leading-tight text-[#0E302A]">
                {diningSection?.title || 'The Pearl of Private Dining'}
              </h2>

              {/* Body Text - Memoized */}
              <div className="space-y-5 font-serif text-sm lg:text-base leading-relaxed text-[#3A5F58]">
                {diningParagraphs.length > 0 ? (
                  diningParagraphs.map((paragraph: string, index: number) => (
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
                  className="inline-block px-8 py-3 text-xs lg:text-sm font-medium tracking-wider transition-all hover:opacity-75 duration-300 cursor-pointer bg-[#0E302A] text-[#f5f1ed]"
                  aria-label="Contact us"
                >
                  CONTACT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Location Section - Optimized =================== */}
      <section id="contact" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0 min-h-fit">
          {/* Left - Location Info */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-20 bg-gradient-to-b from-[#3A5F58]/95 to-[#0E302A]/95">
            <h2 
              data-aos="fade-zoom-in" 
              data-aos-easing="ease-in-back" 
              data-aos-delay="100" 
              data-aos-offset="0" 
              className="text-4xl lg:text-5xl font-serif font-bold mb-10 tracking-wide font-head text-[#e8dfd7]"
            >
              LOCATION
            </h2>

            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#b8aea0]" strokeWidth={1.5} />
                <a
                  href="https://www.google.com/maps?ll=31.225588,29.952763&z=16&t=m&hl=ar&gl=EG&mapclient=embed&cid=17144324494741846894"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-sm lg:text-base tracking-wide hover:opacity-70 transition-opacity text-[#e8dfd7]"
                >
                  39 saint Gini, Kafr abdo, Alexandria, Egypt
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#b8aea0]" strokeWidth={1.5} />
                <a
                  href="tel:01119477764"
                  className="text-sm lg:text-base tracking-wide hover:opacity-70 transition-opacity text-[#e8dfd7]"
                >
                  01119477764
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#b8aea0]" strokeWidth={1.5} />
                <a
                  href="mailto:info@Rubinos.com"
                  className="font-serif text-sm lg:text-base tracking-wide hover:opacity-70 transition-opacity text-[#e8dfd7]"
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
                className="inline-block px-7 py-3 text-xs lg:text-sm font-medium tracking-widest transition-all hover:opacity-75 duration-300 bg-[#b8aea0] text-[#3A5F58]"
              >
                GET DIRECTION
              </a>
            </div>
          </div>

          {/* Right - Hours & Menu */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-20 bg-[#0f1619]/99">
            <h2 
              data-aos="fade-zoom-in" 
              data-aos-easing="ease-in-back" 
              data-aos-delay="100" 
              data-aos-offset="0" 
              className="text-4xl lg:text-5xl font-serif font-bold mb-10 tracking-wide font-head text-[#e8dfd7]"
            >
              MENU
            </h2>

            <div className="space-y-5">
              {/* Restaurant Hours */}
              <div>
                <h3 
                  data-aos="fade-zoom-in" 
                  data-aos-easing="ease-in-back" 
                  data-aos-delay="100" 
                  data-aos-offset="0" 
                  className="text-base lg:text-lg font-serif font-bold mb-3 tracking-widest text-[#FFE8C0]"
                >
                  RESTAURANT HOURS
                </h3>
                <div className="space-y-2 font-serif text-sm lg:text-base text-[#e8dfd7]">
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
                <h3 
                  data-aos="fade-zoom-in" 
                  data-aos-easing="ease-in-back" 
                  data-aos-delay="100" 
                  data-aos-offset="0" 
                  className="text-base lg:text-lg font-serif font-bold mb-2 tracking-widest text-[#FFE8C0]"
                >
                  HAPPY HOUR AT RUBINOS
                </h3>
                <p className="text-xs lg:text-sm tracking-wide mb-2 text-[#e8dfd7]">
                  Your favorite flavors and drink specials, every happy hour.
                </p>
                <div className="flex justify-between items-center text-sm lg:text-base text-[#e8dfd7]">
                  <span>7 days a Week</span>
                  <span>4PM - 6PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />
    </>
  );
};

export default Dashboard;