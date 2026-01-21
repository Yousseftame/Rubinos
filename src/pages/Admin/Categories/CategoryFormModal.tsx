// src/pages/Admin/Categories/CategoryFormModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Category } from '../../../service/categories/categories.service';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'uid' | 'createdAt' | 'updatedAt' | 'items'>, placeOrder?: number) => Promise<void>;
  category?: Category | null;
  mode: 'add' | 'edit';
  maxOrder: number;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  mode,
  maxOrder
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    placeOrder: maxOrder + 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
        placeOrder: category.placeOrder
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        placeOrder: maxOrder + 1
      });
    }
  }, [category, mode, isOpen, maxOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (mode === 'add' && (formData.placeOrder < 1 || formData.placeOrder > maxOrder + 1)) {
      alert(`Place order must be between 1 and ${maxOrder + 1}`);
      return;
    }

    if (mode === 'edit' && (formData.placeOrder < 1 || formData.placeOrder > maxOrder)) {
      alert(`Place order must be between 1 and ${maxOrder}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        placeOrder: formData.placeOrder
      };
      
      await onSubmit(categoryData, mode === 'add' ? formData.placeOrder : undefined);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-serif font-bold"
            style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
          >
            {mode === 'add' ? 'Add New Category' : 'Edit Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} style={{ color: '#3D5257' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label 
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
                style={{
                  borderColor: '#D7CDC133',
                  backgroundColor: 'white',
                  color: '#3D5257',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
                onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label 
                htmlFor="description"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none resize-none"
                style={{
                  borderColor: '#D7CDC133',
                  backgroundColor: 'white',
                  color: '#3D5257',
                  fontFamily: 'Inter, sans-serif',
                  minHeight: '100px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
                onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
                placeholder="Enter category description (optional)"
              />
            </div>

            {/* Place Order */}
            <div>
              <label 
                htmlFor="placeOrder"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                Display Order *
              </label>
              <input
                type="number"
                id="placeOrder"
                min="1"
                max={mode === 'add' ? maxOrder + 1 : maxOrder}
                value={formData.placeOrder}
                onChange={(e) => setFormData({ ...formData, placeOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
                style={{
                  borderColor: '#D7CDC133',
                  backgroundColor: 'white',
                  color: '#3D5257',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
                onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
                required
              />
              <p className="text-xs mt-1" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                {mode === 'add' 
                  ? `Enter a number between 1 and ${maxOrder + 1} (current max: ${maxOrder})`
                  : `Enter a number between 1 and ${maxOrder}`}
              </p>
            </div>

            {/* Status */}
            <div>
              <label 
                htmlFor="status"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
                style={{
                  borderColor: '#D7CDC133',
                  backgroundColor: 'white',
                  color: '#3D5257',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
                onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium border-2"
              style={{
                borderColor: '#D7CDC1',
                color: '#3D5257',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D7CDC122'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#3D5257',
                color: '#D7CDC1',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2d3f44')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3D5257')}
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Category' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;