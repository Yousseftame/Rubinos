import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import interior from '../../assets/interior.webp';
import oysterPlatter from '../../assets/ambiance-1.jpg';
import cocktail from '../../assets/section1.webp';
import chefPreparing from '../../assets/ambiance-1.jpg';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Replace these with your actual image paths
  const galleryImages = [
    interior,
    oysterPlatter,
    cocktail,
    chefPreparing,
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e8dfd7' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' font-size='16' fill='%235a7a82'%3EImage 5%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23d4ccc0' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' font-size='16' fill='%235a7a82'%3EImage 6%3C/text%3E%3C/svg%3E",
  ];

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <section id="gallery" className="relative py-12 lg:py-16" style={{ backgroundColor: '#d4ccc0' }}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
       

        {/* Gallery Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className="relative group overflow-hidden cursor-pointer aspect-auto "
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#e8dfd7' }} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:opacity-70 transition-opacity"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#e8dfd7' }} strokeWidth={1.5} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6" style={{ color: '#e8dfd7' }}>
            <p className="font-serif text-sm sm:text-lg tracking-wider">
              {selectedImage + 1} / {galleryImages.length}
            </p>
          </div>

          {/* Main Image */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl h-full max-h-[70vh] sm:max-h-[80vh] lg:max-h-[85vh] flex items-center justify-center">
            <img
              src={galleryImages[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 lg:left-6 p-2 sm:p-3 hover:bg-white/10 transition-colors rounded-lg"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#e8dfd7' }} strokeWidth={1.5} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 lg:right-6 p-2 sm:p-3 hover:bg-white/10 transition-colors rounded-lg"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#e8dfd7' }} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </section>
  );
}