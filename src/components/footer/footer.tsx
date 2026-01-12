import { Instagram, Facebook } from 'lucide-react';
import logo from '../../assets/rubinos.png';
import mermaid from '../../assets/mermaid.webp';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-seaworthy-charcoal overflow-hidden">
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Left - Logo & Mermaid */}
          <div className="text-center md:text-left">
            <img
              src={mermaid}
              alt="Seaworthy Mermaid"
              className="w-24 h-auto mx-auto md:mx-0 mb-6 opacity-60"
            />
            <img
              src={logo}
              alt="Seaworthy"
              className="h-10 w-auto mx-auto md:mx-0 opacity-80"
            />
          </div>

          {/* Center - Contact Info */}
          <div className="text-center">
            <h4 className="font-display text-lg text-secondary tracking-[0.15em] uppercase mb-6">
              Contact
            </h4>
            <div className="space-y-3 text-secondary/70 font-body text-sm">
              <p>
                <a
                  href="https://maps.app.goo.gl/DNhEqSRg7yZdN9uc6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  630 Carondelet Street<br />
                  New Orleans, LA 70130
                </a>
              </p>
              <p>
                <a
                  href="tel:504-930-3071"
                  className="hover:text-secondary transition-colors"
                >
                  504.930.3071
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@seaworthynola.com"
                  className="hover:text-secondary transition-colors"
                >
                  info@seaworthynola.com
                </a>
              </p>
            </div>
          </div>

          {/* Right - Hours & Social */}
          <div className="text-center md:text-right">
            <h4 className="font-display text-lg text-secondary tracking-[0.15em] uppercase mb-6">
              Hours
            </h4>
            <div className="space-y-2 text-secondary/70 font-body text-sm mb-8">
              <p>Sunday - Wednesday: 4pm - 10pm</p>
              <p>Thursday - Saturday: 4pm - 11pm</p>
            </div>

            {/* Social Links */}
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://instagram.com/seaworthynola"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-secondary/30 rounded-full flex items-center justify-center text-secondary/60 hover:text-secondary hover:border-secondary transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com/seaworthynola"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-secondary/30 rounded-full flex items-center justify-center text-secondary/60 hover:text-secondary hover:border-secondary transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-secondary/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-secondary/40 font-body text-xs tracking-wide">
              © {currentYear} Seaworthy. All rights reserved.
            </p>
            <div className="flex gap-6 text-secondary/40 font-body text-xs">
              <a href="#" className="hover:text-secondary/70 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-secondary/70 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;