// src/pages/Admin/Menus/MenuFormModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useCategoriesContext } from '../../../store/CategoriesContext/CategoriesContext';
import type { MenuItem } from '../../../service/menus/menus.service';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt'>,
    imageFiles?: File[],
    imagesToDelete?: string[]
  ) => Promise<void>;
  menuItem?: MenuItem | null;
  mode: 'add' | 'edit';
}

const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  menuItem,
  mode
}) => {
  const { categories } = useCategoriesContext();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    categoryId: '',
    categoryName: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (menuItem && mode === 'edit') {
      const category = categories.find(c => c.uid === menuItem.categoryId);
      setFormData({
        name: menuItem.name,
        price: menuItem.price,
        description: menuItem.description || "",
        categoryId: menuItem.categoryId,
        categoryName: menuItem.categoryName || category?.name || '',
        status: menuItem.status
      });
      setExistingImages(menuItem.images || []);
      setNewImages([]);
      setImagesToDelete([]);
      setImagePreviewUrls([]);
    } else {
      const defaultCategory = categories.length > 0 ? categories[0] : null;
      setFormData({
        name: '',
        price: 0,
        description: '',
        categoryId: defaultCategory?.uid || '',
        categoryName: defaultCategory?.name || '',
        status: 'active'
      });
      setExistingImages([]);
      setNewImages([]);
      setImagesToDelete([]);
      setImagePreviewUrls([]);
    }
  }, [menuItem, mode, isOpen, categories]);

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.uid === categoryId);
    setFormData({
      ...formData,
      categoryId,
      categoryName: category?.name || ''
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    setNewImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const handleRestoreImage = (imageUrl: string) => {
    setExistingImages(prev => [...prev, imageUrl]);
    setImagesToDelete(prev => prev.filter(img => img !== imageUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }

    if (!formData.name.trim()) {
      alert('Please enter a menu item name');
      return;
    }

  

    if (formData.price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(
        {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          categoryId: formData.categoryId,
          categoryName: formData.categoryName,
          images: existingImages,
          status: formData.status
        },
        newImages.length > 0 ? newImages : undefined,
        imagesToDelete.length > 0 ? imagesToDelete : undefined
      );
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalImages = existingImages.length + newImages.length - imagesToDelete.length;

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
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-serif font-bold"
            style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
          >
            {mode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
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
                Menu Item Name *
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
                placeholder="e.g., Margherita Pizza"
                required
              />
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label 
                  htmlFor="category"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
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
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.uid} value={category.uid}>
                      {category.name}
                    </option>
                  ))}
                </select>
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

            {/* Price */}
            <div>
              <label 
                htmlFor="price"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
                style={{
                  borderColor: '#D7CDC133',
                  backgroundColor: 'white',
                  color: '#3D5257',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
                onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
                step="0.01"
                min="0"
                placeholder="0.00"
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
                Description *
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
                placeholder="Describe the menu item... (optional)"
                
              />
            </div>

            {/* Images Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  className="block text-sm font-semibold"
                  style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
                >
                  Images ({totalImages})
                </label>
              </div>

              {/* Image Upload Input */}
              <div 
                className="mb-4 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200"
                style={{ borderColor: '#D7CDC133' }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#3D5257';
                  e.currentTarget.style.backgroundColor = '#D7CDC108';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D7CDC133';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  const input = document.getElementById('imageInput') as HTMLInputElement;
                  if (input) {
                    const dataTransfer = new DataTransfer();
                    files.forEach(file => dataTransfer.items.add(file));
                    input.files = dataTransfer.files;
                    handleImageSelect({ target: input } as React.ChangeEvent<HTMLInputElement>);
                  }
                  e.currentTarget.style.borderColor = '#D7CDC133';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="file"
                  id="imageInput"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label 
                  htmlFor="imageInput"
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ImageIcon size={20} style={{ color: '#3D525799' }} />
                  <span style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                    Drag images here or click to select
                  </span>
                </label>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                    Current Images ({existingImages.length})
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={imageUrl} 
                          alt={`existing-${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(imageUrl)}
                          className="absolute top-1 right-1 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: '#dc2626' }}
                        >
                          <Trash2 size={14} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deleted Images */}
              {imagesToDelete.length > 0 && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#fee2e2' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#dc2626', fontFamily: 'Inter, sans-serif' }}>
                    Images to Delete ({imagesToDelete.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {imagesToDelete.map((imageUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleRestoreImage(imageUrl)}
                        className="px-2 py-1 rounded text-xs font-medium transition-all"
                        style={{
                          backgroundColor: '#fca5a5',
                          color: '#7f1d1d'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f87171'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fca5a5'}
                      >
                        Undo
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {newImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                    New Images ({newImages.length})
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`new-${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: '#dc2626' }}
                        >
                          <Trash2 size={14} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Item' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuFormModal;