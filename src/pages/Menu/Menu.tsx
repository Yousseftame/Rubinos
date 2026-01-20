// src/pages/Menu/Menu.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMenusContext } from '../../store/MenusContext/MenusContext';
import { useCategoriesContext } from '../../store/CategoriesContext/CategoriesContext';
import section1 from '../../assets/ambiance-1.jpg';

// Skeleton Components for Loading States
const CategorySkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 w-24 bg-gray-300 rounded"></div>
  </div>
);

const MenuItemSkeleton = () => (
  <div className="group pb-6 border-b border-[#a89f97]/30 animate-pulse">
    <div className="flex items-start gap-4 mb-2">
      <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Image Component with Lazy Loading and Navigation
interface MenuItemImageProps {
  images: string[];
  name: string;
}

const MenuItemImage: React.FC<MenuItemImageProps> = ({ images, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);



  const hasMultipleImages = images && images.length > 1;
  const currentImage = images?.[currentImageIndex] || '';

  // Reset when images change
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setCurrentImageIndex(0);
  }, [images]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-md shadow-md group/image">
      {/* Skeleton loader while image is loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
      )}

      {/* Actual image */}
      {currentImage && !imageError ? (
        <img
          src={currentImage}
          alt={name}
          loading="lazy"
          ref={(img) => {
            if (img && img.complete) {
              setImageLoaded(true);
            }
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />

      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-xs text-gray-400">No image</span>
        </div>
      )}

      {/* Navigation arrows for multiple images */}
      {hasMultipleImages && imageLoaded && !imageError && (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrevImage}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNextImage}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
            {currentImageIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // to go back to the same category selected 

  // Get data from contexts
  const { menuItems, loading: menuLoading, error: menuError } = useMenusContext();
  const { categories, loading: categoriesLoading } = useCategoriesContext();

  // Filter active categories only - MEMOIZED for performance
  const activeCategories = useMemo(
    () => categories.filter((cat) => cat.status === 'active'),
    [categories]
  );

  // Set initial active category when categories load
  useEffect(() => {
    if (activeCategories.length === 0) return;

    const categoryFromUrl = searchParams.get('category');

    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    } else if (!activeCategory) {
      setActiveCategory(activeCategories[0].uid || '');
    }
  }, [activeCategories, searchParams]);


  // Filter menu items by active category and active status - MEMOIZED
  const filteredMenuItems = useMemo(() => {
    if (!activeCategory) return [];
    return menuItems.filter(
      (item) => item.categoryId === activeCategory && item.status === 'active'
    );
  }, [menuItems, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return;

    setIsTransitioning(true);
    setActiveCategory(categoryId);

    // Smooth transition
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleItemClick = (item: any) => {
    navigate(`/menu/${item.uid}?category=${activeCategory}`, { state: { item } });
  };

  const isLoading = menuLoading || categoriesLoading;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative h-[500px] lg:h-[600px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={section1}
            alt="Menu"
            className="w-full h-full object-cover"
            loading="eager" // Load hero image immediately
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-12">
          <div data-aos="fade-up" className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <h1 className="font-head text-center text-[15vw] lg:text-[12vw] text-secondary leading-none tracking-[0.05em]">
              MENU
            </h1>
          </div>
        </div>
      </section>

      {/* Menu Content Section */}
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: '#d4ccc0' }}>
        {/* Texture Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Error State */}
          {menuError && (
            <div className="text-center py-12">
              <p className="text-red-600 font-serif">{menuError}</p>
            </div>
          )}

          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-16">
            {categoriesLoading ? (
              // Skeleton for categories
              <>
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
              </>
            ) : (
              activeCategories.map((category) => (
                <button
                  key={category.uid}
                  onClick={() => handleCategoryChange(category.uid || '')}
                  className={`text-sm lg:text-base font-serif font-semibold tracking-widest transition-all duration-300 pb-2 border-b-2 ${activeCategory === category.uid
                      ? 'border-b-[#3d5055] text-[#3d5055]'
                      : 'border-b-transparent text-[#6b7c7e] hover:text-[#3d5055]'
                    }`}
                >
                  {category.name.toUpperCase()}
                </button>
              ))
            )}
          </div>

          {/* Menu Items Grid */}
          {isLoading || isTransitioning ? (
            // Skeleton for menu items
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              {[...Array(4)].map((_, i) => (
                <MenuItemSkeleton key={i} />
              ))}
            </div>
          ) : filteredMenuItems.length === 0 ? (
            // Empty state
            <div className="flex items-center justify-center py-20">
              <p className="font-serif text-lg" style={{ color: '#6b7c7e' }}>
                No items available in this category.
              </p>
            </div>
          ) : (
            // Actual menu items
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 animate-fadeIn">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.uid}
                  onClick={() => handleItemClick(item)}
                  className="group cursor-pointer pb-6 border-b border-[#a89f97]/30 hover:border-[#3d5055] transition-colors duration-300"
                >
                  <div className="flex items-start gap-4 mb-2">
                    {/* Image with Navigation */}
                    <MenuItemImage images={item.images || []} name={item.name} />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3
                          className="font-serif text-lg lg:text-xl font-semibold flex-1"
                          style={{ color: '#3d5055' }}
                        >
                          {item.name}
                        </h3>
                        <span
                          className="font-serif text-sm lg:text-base font-medium whitespace-nowrap"
                          style={{ color: '#5a7a82' }}
                        >
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p
                        className="font-serif text-sm lg:text-base leading-relaxed line-clamp-2"
                        style={{ color: '#6b7c7e' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Border */}
          <div className="mt-16 pt-12 border-t border-[#a89f97]/30 text-center">
            <p className="font-serif text-sm lg:text-base italic" style={{ color: '#6b7c7e' }}>
              Menu items and prices subject to change based on seasonal availability and market
              conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}