// src/components/Admin/Categories/CategoryDetailsModal.tsx
import React from 'react';
import { X, Calendar, Hash, Info } from 'lucide-react';
import { format } from 'date-fns';
import type { Category } from '../../../service/categories/categories.service';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  isOpen,
  onClose,
  category
}) => {
  if (!isOpen || !category) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'PPpp'); // e.g., "Apr 29, 2024 at 12:34:56 PM"
    } catch {
      return 'Invalid Date';
    }
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
            style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
          >
            Category Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} style={{ color: '#3D5257' }} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                CATEGORY NAME
              </label>
            </div>
            <p 
              className="text-lg font-medium pl-6"
              style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
            >
              {category.name}
            </p>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                DESCRIPTION
              </label>
            </div>
            <p 
              className="pl-6 leading-relaxed"
              style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
            >
              {category.description}
            </p>
          </div>

          {/* Items Count */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                NUMBER OF ITEMS
              </label>
            </div>
            <p 
              className="text-lg font-medium pl-6"
              style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
            >
              {category.items}
            </p>
          </div>

          {/* Status */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                STATUS
              </label>
            </div>
            <div className="pl-6">
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: category.status === 'active' ? '#D7CDC122' : '#3D525722',
                  color: category.status === 'active' ? '#3D5257' : '#3D525799',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div 
            className="pt-6 mt-6 border-t space-y-4"
            style={{ borderColor: '#D7CDC133' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} style={{ color: '#3D525799' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                >
                  CREATED AT
                </label>
              </div>
              <p 
                className="pl-6"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                {formatDate(category.createdAt)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} style={{ color: '#3D525799' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                >
                  LAST UPDATED
                </label>
              </div>
              <p 
                className="pl-6"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                {formatDate(category.updatedAt)}
              </p>
            </div>

            {category.uid && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={18} style={{ color: '#3D525799' }} />
                  <label 
                    className="text-sm font-semibold"
                    style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                  >
                    CATEGORY ID
                  </label>
                </div>
                <p 
                  className="pl-6 font-mono text-xs break-all"
                  style={{ color: '#3D525799', fontFamily: 'monospace' }}
                >
                  {category.uid}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: '#D7CDC133' }}>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            style={{
              backgroundColor: '#3D5257',
              color: '#D7CDC1',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3f44'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D5257'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;