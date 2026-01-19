// Gallery.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import ambiance from '../../assets/ambiance-1.jpg';
import { getActiveGalleryItems } from '../../service/gallery/gallery.service';
import type { GalleryItem } from '../../service/gallery/gallery.service';

export default function Gallery() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery images on mount
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await getActiveGalleryItems();
        setGalleryImages(items);
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError('Failed to load gallery images');
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Lazy load images using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageId = parseInt(entry.target.getAttribute('data-image-id') || '0');
            setLoadedImages((prev) => new Set(prev).add(imageId));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const images = document.querySelectorAll('[data-image-id]');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [galleryImages]); // Re-run when galleryImages changes

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ambiance}
            alt="Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 lg:pb-12">
          <div data-aos="fade-up" className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <h1 className="font-head text-center text-[15vw] lg:text-[12vw] text-secondary leading-none tracking-[0.05em]">
              GALLERY
            </h1>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="relative py-20 lg:py-32" style={{ backgroundColor: '#d4ccc0' }}>
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center space-y-8">
            <h2 
              data-aos="fade-up"
              className="font-head text-5xl lg:text-6xl font-bold leading-tight tracking-wide"
              style={{ color: '#5a7a82' }}
            >
              SO MUCH TO SEA.
            </h2>

            <div className="h-1 w-20 bg-gradient-to-r from-[#b8aea0] to-[#a89f97] mx-auto" />

            <div className="space-y-6">
              <p
                className="font-serif text-base lg:text-lg leading-relaxed"
                style={{ color: '#6b7c7e' }}
              >
                Rubinos's intimate setting in a historic 19th century Creole townhome transports you to another time and place. We invite you to get lost in our thoughtfully curated menu, enjoy the views of passing streetcars, and savor everything this New Orleans oyster bar has to offer.
              </p>

              <p
                className="font-serif text-base lg:text-lg leading-relaxed"
                style={{ color: '#6b7c7e' }}
              >
                While we have a hand full of menu mainstays (Shrimp & Grits, Oysters, Caviar, Rubinos Roll, Boquerones, Parker House Rolls, Frozen Key Lime Pie), many of our menu items are seasonal and feature the freshest ingredients available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative py-0 pb-10" style={{ backgroundColor: '#d4ccc0' }}>
        <div className="w-full">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-[#a89f97]/30 border-t-[#3d5055] rounded-full animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="font-serif text-lg" style={{ color: '#6b7c7e' }}>
                {error}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && galleryImages.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif text-lg" style={{ color: '#6b7c7e' }}>
                No gallery images available yet.
              </p>
            </div>
          )}

          {/* Gallery Grid - Dynamic */}
          {!loading && !error && galleryImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {galleryImages.map((item, index) => (
                <div
                  key={item.uid || index}
                  data-image-id={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="group relative overflow-hidden h-64 lg:h-80 bg-gray-200 cursor-pointer"
                >
                  {loadedImages.has(index) ? (
                    <>
                      <img
                        src={item.image}
                        alt={`Gallery image ${item.placeOrder}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" strokeWidth={1.5} />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#a89f97]/30 border-t-[#3d5055] rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" strokeWidth={1.5} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 text-white font-serif text-base">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full max-w-4xl">
            <img
              src={galleryImages[selectedImageIndex].image}
              alt={`Gallery image ${galleryImages[selectedImageIndex].placeOrder}`}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Previous Button */}
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev === null ? 0 : prev === 0 ? galleryImages.length - 1 : prev - 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
          </button>

          {/* Next Button */}
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev === null ? 0 : prev === galleryImages.length - 1 ? 0 : prev + 1))}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Animation Styles */}
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