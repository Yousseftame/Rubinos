// src/pages/Admin/AdminHomeSections/HomeSectionDetailsModal.tsx
import React from 'react';
import { X, Calendar, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useHomeSectionsContext } from '../../../store/HomeSectionsContext/HomeSectionsContext';
import type { SectionType } from '../../../service/homeSections/homeSections.service';

interface HomeSectionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: SectionType | null;
}

const HomeSectionDetailsModal: React.FC<HomeSectionDetailsModalProps> = ({
  isOpen,
  onClose,
  sectionType
}) => {
  const { sections, metadata } = useHomeSectionsContext();

  if (!isOpen || !sectionType) return null;

  const section = sections.find(s => s.type === sectionType);
  const sectionMeta = metadata[sectionType];

  if (!section) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'PPpp');
    } catch {
      return 'Invalid Date';
    }
  };

  const getSectionDisplayName = (type: SectionType): string => {
    const names: Record<SectionType, string> = {
      about: 'About Section',
      dining: 'Private Dining Section',
      heroImage: 'Hero Image'
    };
    return names[type];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: '#D7CDC133' }}>
          <h2 
            className="text-2xl font-serif font-bold"
            style={{ color: '#0E302A', fontFamily: 'Cinzel, serif' }}
          >
            {getSectionDisplayName(sectionType)} Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} style={{ color: '#0E302A' }} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Image */}
          <div>
            <label 
              className="text-sm font-semibold mb-3 block"
              style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}
            >
              IMAGE
            </label>
            <div className="rounded-lg overflow-hidden" style={{ height: '300px' }}>
              <img
                src={section.imageUrl}
                alt={sectionType}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Title (if exists) */}
          {section.title && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} style={{ color: '#0E302A99' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}
                >
                  TITLE
                </label>
              </div>
              <p 
                className="text-lg font-medium pl-6"
                style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}
              >
                {section.title}
              </p>
            </div>
          )}

          {/* Description (if exists) */}
          {section.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} style={{ color: '#0E302A99' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}
                >
                  DESCRIPTION
                </label>
              </div>
              <p 
                className="pl-6 leading-relaxed"
                style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}
              >
                {section.description}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div 
            className="pt-6 mt-6 border-t space-y-4"
            style={{ borderColor: '#D7CDC133' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} style={{ color: '#0E302A99' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}
                >
                  LAST UPDATED
                </label>
              </div>
              <p 
                className="pl-6"
                style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}
              >
                {formatDate(section.updatedAt) || 'N/A'}
              </p>
            </div>

            {/* Image Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} style={{ color: '#0E302A99' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}
                >
                  IMAGE STATUS
                </label>
              </div>
              <div className="pl-6">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: sectionMeta?.hasImage ? '#D7CDC122' : '#0E302A22',
                    color: sectionMeta?.hasImage ? '#0E302A' : '#0E302A99',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {sectionMeta?.hasImage ? 'Image Uploaded' : 'No Image'}
                </span>
              </div>
            </div>

            {/* Section Type */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} style={{ color: '#0E302A99' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}
                >
                  SECTION TYPE
                </label>
              </div>
              <p 
                className="pl-6 capitalize"
                style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}
              >
                {sectionType}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: '#D7CDC133' }}>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            style={{
              backgroundColor: '#0E302A',
              color: '#D7CDC1',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3f44'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0E302A'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSectionDetailsModal;