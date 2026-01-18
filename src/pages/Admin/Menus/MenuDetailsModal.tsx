// src/pages/Admin/Menus/MenuDetailsModal.tsx
import React from 'react';
import { X, Calendar, Hash, Info, DollarSign, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useCategoriesContext } from '../../../store/CategoriesContext/CategoriesContext';
import type { MenuItem } from '../../../service/menus/menus.service';

interface MenuDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
}

const MenuDetailsModal: React.FC<MenuDetailsModalProps> = ({
  isOpen,
  onClose,
  menuItem
}) => {
  const { categories } = useCategoriesContext();

  if (!isOpen || !menuItem) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'PPpp');
    } catch {
      return 'Invalid Date';
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.uid === categoryId)?.name || 'Unknown';
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-8"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: '#D7CDC133' }}>
          <h2 
            className="text-2xl font-serif font-bold"
            style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
          >
            Menu Item Details
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
                ITEM NAME
              </label>
            </div>
            <p 
              className="text-lg font-medium pl-6"
              style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
            >
              {menuItem.name}
            </p>
          </div>

          {/* Category, Price, and Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} style={{ color: '#3D525799' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                >
                  CATEGORY
                </label>
              </div>
              <p 
                className="text-lg font-medium pl-6"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                {getCategoryName(menuItem.categoryId)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} style={{ color: '#3D525799' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                >
                  PRICE
                </label>
              </div>
              <p 
                className="text-lg font-medium pl-6"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                ${menuItem.price.toFixed(2)}
              </p>
            </div>

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
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                  style={{
                    backgroundColor: menuItem.status === 'active' ? '#D7CDC122' : '#3D525722',
                    color: menuItem.status === 'active' ? '#3D5257' : '#3D525799',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {menuItem.status}
                </span>
              </div>
            </div>
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
              {menuItem.description}
            </p>
          </div>

          {/* Images */}
          {menuItem.images && menuItem.images.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={18} style={{ color: '#3D525799' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                >
                  IMAGES ({menuItem.images.length})
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pl-6">
                {menuItem.images.map((imageUrl, index) => (
                  <div 
                    key={index}
                    className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={imageUrl} 
                      alt={`menu-item-${index}`}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

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
                {formatDate(menuItem.createdAt)}
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
                {formatDate(menuItem.updatedAt)}
              </p>
            </div>

            {menuItem.uid && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={18} style={{ color: '#3D525799' }} />
                  <label 
                    className="text-sm font-semibold"
                    style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                  >
                    MENU ITEM ID
                  </label>
                </div>
                <p 
                  className="pl-6 font-mono text-xs break-all"
                  style={{ color: '#3D525799', fontFamily: 'monospace' }}
                >
                  {menuItem.uid}
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

export default MenuDetailsModal;