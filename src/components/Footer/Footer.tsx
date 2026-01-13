import { Instagram } from 'lucide-react';
import knotIcon from '../../assets/Seaworthy_favicon_rope-removebg-preview.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#46616d' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-6 text-center">
        {/* Knot Icon */}
        <div className="mb-3">
          <img
            src={knotIcon}
            alt="Nautical knot"
            className="w-25 h-auto mx-auto opacity-70"
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl lg:text-3xl font-head font-serif font-bold mb-3 tracking-wide" style={{ color: '#e8dfd7' }}>
          Fair Winds and Following Seas
        </h2>

        {/* Subheading */}
        <p className="text-sm lg:text-base font-serif mb-6" style={{ color: '#d4ccc0' }}>
          Sign up for news and updates from Seaworthy
        </p>

        {/* Email Signup */}
        <form className="flex gap-0 max-w-sm mx-auto mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3 font-serif text-sm bg-white text-[#5a7a82] placeholder-[#999] focus:outline-none"
          />
          <button
            type="submit"
            className="px-8 py-3 font-serif text-sm font-medium tracking-widest transition-all hover:opacity-80 duration-300"
            style={{ backgroundColor: '#3d5055', color: '#e8dfd7' }}
          >
            SIGNUP
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-xs font-serif mb-4" style={{ color: '#d4ccc0' }}>
          <a href="#" className="hover:opacity-80 transition-opacity">
            Privacy Policy
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            Accessibility Statement
          </a>
        </div>

        {/* Instagram Handle */}
        <div className="mb-4">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-serif text-sm transition-opacity hover:opacity-80"
            style={{ color: '#d4ccc0' }}
          >
            <Instagram size={14} strokeWidth={1.5} />
            @rebinos.com
          </a>
        </div>

        {/* Copyright */}
        <p className="font-serif text-xs tracking-wide" style={{ color: '#b8aea0' }}>
          Seaworthy © {currentYear} / All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;