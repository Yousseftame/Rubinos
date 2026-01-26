import { Instagram } from 'lucide-react';
import knotIcon from '../../assets/Seaworthy_favicon_rope-removebg-preview.png';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#0E302A' }}>
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
          Authentic Italian, Right at Your Table
        </h2>

        {/* Subheading */}
        <p className="text-sm lg:text-base font-serif mb-6" style={{ color: '#d4ccc0' }}>
          Submit a query for news and updates from Rubinos
        </p>

        {/* Email Signup */}
        <form className="flex gap-0 max-w-sm mx-auto mb-6">
          {/* <input
          
            type="email"
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3 font-serif text-sm bg-white text-[#5a7a82] placeholder-[#999] focus:outline-none"
          /> */}
          <button
           onClick={()=>{navigate("/contact")}}
            type="button"
            className=" btn-invert flex-1 px-8 py-3  text-sm font-medium tracking-widest transition-all hover:shadow-lg  duration-300"
           
          >
            CONTACT
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-xs font-serif mb-4" style={{ color: '#d4ccc0' }}>
          <a  href="#" className="hover:opacity-80 transition-opacity">
            Privacy Policy
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            Accessibility Statement
          </a>
        </div>

        {/* Instagram Handle */}
        <div className="mb-4">
          <a
            href="https://www.instagram.com/rubinos.eg/?fbclid=IwY2xjawPTNHFleHRuA2FlbQIxMABicmlkETE0aVk5ZExEQjRLamU4NnlDc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHh6RekMP4QEdS5fhEntWrBEHq95LVVFzdAkeHNn0mFRx0ctm3BXUss7gjPDu_aem_WDL_jQcTeBrVOQJqWlq2wA#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-serif text-sm transition-opacity hover:opacity-80"
            style={{ color: '#d4ccc0' }}
          >
           Rubinos.eg
            <Instagram size={14} strokeWidth={1.5} />
          </a>
        </div>

        {/* Copyright */}
        <p className="font-serif text-xs tracking-wide" style={{ color: '#b8aea0' }}>
          Rubinos © 2023 / All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;