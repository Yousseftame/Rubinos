import  { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

import logo from '../../assets/rub-transparent.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when scrolling on mobile
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Private Dining', href: '#private-dining' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#46616d]/95 backdrop-blur-md shadow-lg py-4' 
          : 'bg-transparent py-8 lg:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 transition-transform hover:scale-105 duration-300">
            <img
              src={logo}
              alt="Seaworthy - Oysters & Cocktails"
              className="h-16 lg:h-16 w-auto opacity-90"
            />
          </a>

          {/* Desktop Navigation - Moved to the right */}
          <div className="hidden lg:flex items-center gap-8 ml-auto">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-secondary/90 hover:text-secondary text-sm tracking-wide transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            
            {/* Reserve Button - Desktop */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-seaworthy-nav ml-4"
            >
              Reserve Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-secondary p-2 hover:opacity-80 transition-opacity"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Fixed positioning */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-0 bg-seaworthy-charcoal/95 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Inner content to prevent closing on child click */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center h-screen space-y-8 pt-20  bg-seaworthy-charcoal/95 backdrop-blur-sm z-40"
          >
            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-secondary p-2"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            {/* Mobile Logo */}
            <img src={logo} alt="Seaworthy" className="h-12 mb-8" />

            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="nav-link text-2xl text-secondary hover:text-secondary/80 transition-colors duration-300"
                style={{
                  animation: isMenuOpen ? `fadeInUp 0.4s ease-out ${index * 0.1}s forwards` : 'none',
                  opacity: isMenuOpen ? 1 : 0,
                }}
              >
                {link.label}
              </a>
            ))}

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="btn-seaworthy-solid mt-6"
            >
              Reserve Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;