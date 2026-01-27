import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import loginImg from '../../assets/4.webp';

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="min-h-screen flex">
        {/* Left Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12" style={{ backgroundColor: '#d4ccc0' }}>
          {/* Back Button */}
          <div className="mb-12">
            <button
              type='button'
              onClick={() => navigate('/')}
              className="flex items-center gap-2  text-base font-semibold transition-all hover:opacity-75 duration-300"
              style={{ color: '#3A5F58' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Site
            </button>
          </div>

          {/* Content from child routes */}
          <Outlet />

          {/* Decorative Element */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: '#b8aea0' }}>
            <p className="text-xs  text-center tracking-wide" style={{ color: '#3A5F58' }}>
              Nothing beats the classic, From our hands to your plate
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={loginImg}
            alt="Rubino's Interior"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
          
          {/* Quote on Image */}
          <div className="absolute bottom-12 left-12 right-12">
            <blockquote className="text-white">
              <p className="text-2xl lg:text-3xl font-head font-bold mb-3 leading-tight">
                "Come For The Pizza,<br />Stay For The Everything"
              </p>
              <p className="text-sm  opacity-90">
                " Rubino's Restaurant
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;