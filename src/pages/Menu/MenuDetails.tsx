// src/pages/Menu/MenuDetails.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMenusContext } from '../../store/MenusContext/MenusContext';
import { useCategoriesContext } from '../../store/CategoriesContext/CategoriesContext';
import noImg from "../../assets/rubinos.png";



export default function MenuDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { menuItems, loading } = useMenusContext();
  const { categories } = useCategoriesContext();
  const categoryFromUrl = new URLSearchParams(location.search).get('category');



  // Try to get item from location state first (faster), fallback to context
  const [item, setItem] = useState(location.state?.item || null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If item not in state, fetch from context
  useEffect(() => {
    if (!item && id && menuItems.length > 0) {
      const foundItem = menuItems.find((m) => m.uid === id);
      if (foundItem) {
        setItem(foundItem);
      }
    }
  }, [id, menuItems, item]);

  // Get category name
  const categoryName = item
    ? categories.find((c) => c.uid === item.categoryId)?.name || item.categoryName
    : '';

  const images = item?.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Loading state
  if (loading && !item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4ccc0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E302A] mx-auto mb-4" />
          <p className="text-xl font-serif" style={{ color: '#0E302A' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Item not found
  if (!item && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4ccc0' }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: '#0E302A' }}>
            Item not found
          </p>
          <button
            onClick={() =>
              navigate(
                categoryFromUrl
                  ? `/menu?category=${categoryFromUrl}`
                  : '/menu'
              )
            }
            className="px-8 py-3 text-sm font-bold tracking-wider transition-all hover:opacity-85 duration-300 rounded-lg"
            style={{ backgroundColor: '#0E302A', color: '#f5f1ed' }}
          >
            BACK TO MENU
          </button>
        </div>
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
              onClick={() => navigate( categoryFromUrl
                        ? `/menu?category=${categoryFromUrl}`
                        : '/menu')}
              className="flex items-center gap-2 text-base font-semibold transition-all hover:opacity-75 duration-300"
              style={{ color: '#3A5F58' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </button>
          </div>
        </div>

        {/* Texture Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start animate-fadeIn">
            {/* Image Container with Carousel */}
            <div data-aos="zoom-in" className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg shadow-2xl h-96 lg:h-[500px]">
                {!imageLoaded && currentImage && (
                  <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                )}

                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={item.name}
                    loading="eager"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center ">
                    {/* <span className="text-gray-400">No image available</span> */}
                    <img className='w-full h-full' src={noImg} alt="rubinos" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Navigation Arrows for Multiple Images */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery for Multiple Images */}
              {hasMultipleImages && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {images.map((img: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => {
                        setImageLoaded(false);
                        setCurrentImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
                          ? 'border-[#3A5F58] scale-105'
                          : 'border-transparent hover:border-[#3A5F58]/50'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${item.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Container */}
            <div data-aos="zoom-in" className="flex flex-col justify-start">
              {/* Category Badge */}
              {categoryName && (
                <div className="mb-4">
                  <span
                    className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider"
                    style={{ backgroundColor: '#3A5F58', color: '#f5f1ed' }}
                  >
                    {categoryName.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                  style={{ color: '#0E302A' }}
                >
                  {item.name}
                </h1>

                <p className="text-3xl font-semibold" style={{ color: '#0E302A' }}>
                  {item.price.toFixed(2)} EGP
                </p>
              </div>

              {/* Divider */}
              <div className="h-1 w-16 mb-8 bg-gradient-to-r from-[#b8aea0] to-[#a89f97]" />

              {/* Description */}
              <div className="mb-10">
                <p className="text-2xl leading-relaxed" style={{ color: '#3A5F58' }}>
                  {item.description}
                </p>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-12">
                <button
                  onClick={() =>
                    navigate(
                      categoryFromUrl
                        ? `/menu?category=${categoryFromUrl}`
                        : '/menu'
                    )
                  }
                  className="px-8 py-4 text-sm lg:text-base font-bold tracking-wider transition-all hover:opacity-75 duration-300 rounded-lg border-2"
                  style={{
                    borderColor: '#3A5F58',
                    color: '#3A5F58',
                    backgroundColor: 'transparent',
                  }}
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
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}