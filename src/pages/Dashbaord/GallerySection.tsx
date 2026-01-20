// src/pages/Dashboard/GallerySection.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { getActiveGalleryItems } from '../../service/gallery/gallery.service';
// import type { GalleryItem } from '../../service/gallery/gallery.service';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const items = await getActiveGalleryItems();
        // Extract just the image URLs in order
        const imageUrls = items.map(item => item.image);
        // set a limit 
        const limitedImages = imageUrls.splice(0, 6);
        setGalleryImages(limitedImages);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        // Set empty array on error so UI still renders
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const nextImage = () => {
    if (selectedImage !== null && galleryImages.length > 0) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && galleryImages.length > 0) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <section  id="gallery" className="relative py-12 lg:py-16" style={{ backgroundColor: '#d4ccc0' }}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }} />

      <div className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Show loading spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#3D5257' }} />
          </div>
        )}

        {/* Show gallery when loaded */}
        {!loading && galleryImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                className="relative group overflow-hidden cursor-pointer aspect-auto rounded-sm"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" style={{ color: '#e8dfd7' }} strokeWidth={1.5} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show message when no images */}
        {!loading && galleryImages.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-lg" style={{ color: '#6b7c7e' }}>
              No gallery images available yet.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:opacity-70 transition-opacity"
            aria-label="Close gallery"
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
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#e8dfd7' }} strokeWidth={1.5} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 lg:right-6 p-2 sm:p-3 hover:bg-white/10 transition-colors rounded-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#e8dfd7' }} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </section>
  );
}