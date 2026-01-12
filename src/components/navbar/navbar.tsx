import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/rubinos.png';

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

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Private Dining', href: '#private-dining' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-seaworthy-teal/95 backdrop-blur-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="Seaworthy - Oysters & Cocktails"
              className="h-10 lg:h-12 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 ">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-secondary/90 hover:text-secondary "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Reserve Button - Desktop */}
          <a
            href="https://www.opentable.com/r/seaworthy-new-orleans-2"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block btn-seaworthy-nav"
          >
            Reserve Now
          </a>

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

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-0 bg-seaworthy-teal z-40 transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 text-secondary p-2"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {/* Mobile Logo */}
          <img src={logo} alt="Seaworthy" className="h-12 mb-8" />

          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="nav-link text-2xl text-secondary"
              style={{
                animation: isMenuOpen ? `fadeInUp 0.4s ease-out ${index * 0.1}s forwards` : 'none',
                opacity: 0,
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href="https://www.opentable.com/r/seaworthy-new-orleans-2"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="btn-seaworthy-nav mt-6"
          >
            Reserve Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;