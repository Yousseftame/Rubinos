import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../../assets/rub-transparent.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Menu', to: '/menu' },
    { label: 'Private Dining', to: '/private-dining' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
  ];

  const handleHashNavigation = (hash: string) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

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
          <Link
            to="/"
            className="flex-shrink-0 transition-transform hover:scale-105 duration-300"
          >
            <img
              src={logo}
              alt="Seaworthy - Oysters & Cocktails"
              className="h-16 lg:h-16 w-auto opacity-90"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 ml-auto">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="nav-link text-secondary/90 hover:text-secondary text-sm tracking-wide transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  
                  className="nav-link text-secondary/90 hover:text-secondary text-sm tracking-wide transition-colors duration-300"
                >
                  {link.label}
                </button>
              )
            )}

            {/* Reserve Button */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-seaworthy-charcoal/95 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center h-screen space-y-8 pt-20 bg-seaworthy-charcoal/95"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-secondary p-2"
            >
              <X size={28} />
            </button>

            <img src={logo} alt="Seaworthy" className="h-28 mb-8" />

            {navLinks.map((link, index) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link text-2xl text-secondary hover:text-secondary/80 transition-colors duration-300"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${index * 0.1}s forwards`,
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => {
                    setIsMenuOpen(false);
                   
                  }}
                  className="nav-link text-2xl text-secondary hover:text-secondary/80 transition-colors duration-300"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${index * 0.1}s forwards`,
                  }}
                >
                  {link.label}
                </button>
              )
            )}

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
