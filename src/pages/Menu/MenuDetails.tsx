// MenuDetails.tsx
import {  useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, } from 'lucide-react';

export default function MenuDetails() {
//   const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4ccc0' }}>
        <p className="text-xl font-serif" style={{ color: '#3d5055' }}>Item not found</p>
      </div>
    );
  }

  return (
    <div>
     
     

      {/* Details Section */}
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: '#d4ccc0' }}>
       
       {/* Back Button Bar */}
   <div data-aos="zoom-in" className="relative z-10" style={{ backgroundColor: '#d4ccc0' }}>
  <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 pt-10">
    <button
      onClick={() => navigate('/menu')}
      className="flex items-center gap-2 font-serif text-base font-semibold transition-all hover:opacity-75 duration-300"
      style={{ color: '#3d5055' }}
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Menu
    </button>
  </div>
</div>


         {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start animate-fadeIn">
            
            {/* Image Container */}
            <div data-aos="zoom-in" className="relative overflow-hidden rounded-lg shadow-2xl h-96 lg:h-[500px]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content Container */}
            <div data-aos="zoom-in" className="flex flex-col justify-start">
              {/* Header */}
              <div className="mb-8">
                <h1
                  className="font-serif text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                  style={{ color: '#3d5055' }}
                >
                  {item.name}
                </h1>
                
                <p
                  className="font-serif text-3xl font-semibold"
                  style={{ color: '#5a7a82' }}
                >
                  {item.price}
                </p>
              </div>

              {/* Divider */}
              <div className="h-1 w-16 mb-8 bg-gradient-to-r from-[#b8aea0] to-[#a89f97]" />

              {/* Description */}
              <div className="mb-10">
                <p
                  className="font-serif text-lg leading-relaxed"
                  style={{ color: '#6b7c7e' }}
                >
                  {item.fullDescription}
                </p>
              </div>

             

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-12">
                {/* <button
                  className="px-8 py-4 font-serif text-sm lg:text-base font-bold tracking-wider transition-all hover:opacity-85 duration-300 rounded-lg flex-1"
                  style={{ backgroundColor: '#3d5055', color: '#f5f1ed' }}
                >
                  RESERVE A TABLE
                </button> */}
                <button
                  onClick={() => navigate('/menu')}
                  className="px-8 py-4 font-serif text-sm lg:text-base font-bold tracking-wider transition-all hover:opacity-75 duration-300 rounded-lg border-2"
                  style={{ borderColor: '#3d5055', color: '#3d5055', backgroundColor: 'transparent' }}
                >
                  BACK TO MENU
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      {/* Style for fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}