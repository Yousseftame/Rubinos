// src/pages/Admin/AdminGallery/GalleryFormModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Upload} from 'lucide-react';
import type { GalleryItem } from '../../../service/gallery/gallery.service';

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (imageFile: File, placeOrder?: number) => Promise<void>;
  onUpdate: (
    updates: { placeOrder?: number; status?: 'active' | 'inactive' },
    newImageFile?: File
  ) => Promise<void>;
  item?: GalleryItem | null;
  mode: 'add' | 'edit';
  maxOrder: number;
}

const GalleryFormModal: React.FC<GalleryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  item,
  mode,
  maxOrder
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [placeOrder, setPlaceOrder] = useState<number>(maxOrder + 1);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replaceImage, setReplaceImage] = useState(false);

  useEffect(() => {
    if (item && mode === 'edit') {
      setImagePreview(item.image);
      setPlaceOrder(item.placeOrder);
      setStatus(item.status);
      setReplaceImage(false);
    } else {
      setImageFile(null);
      setImagePreview(null);
      setPlaceOrder(maxOrder + 1);
      setStatus('active');
      setReplaceImage(false);
    }
  }, [item, mode, isOpen, maxOrder]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'add') {
      if (!imageFile) {
        alert('Please select an image');
        return;
      }

      if (placeOrder < 1 || placeOrder > maxOrder + 1) {
        alert(`Place order must be between 1 and ${maxOrder + 1}`);
        return;
      }

      setIsSubmitting(true);
      
      try {
        await onSubmit(imageFile, placeOrder);
        onClose();
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Edit mode
      setIsSubmitting(true);
      
      try {
        const updates: { placeOrder?: number; status?: 'active' | 'inactive' } = {};
        
        if (placeOrder !== item?.placeOrder) {
          updates.placeOrder = placeOrder;
        }
        
        if (status !== item?.status) {
          updates.status = status;
        }

        await onUpdate(updates, replaceImage && imageFile ? imageFile : undefined);
        onClose();
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
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
            {mode === 'add' ? 'Add New Image' : 'Edit Image'}
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
            {/* Image Upload */}
            <div>
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                {mode === 'add' ? 'Image *' : replaceImage ? 'New Image *' : 'Current Image'}
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3 relative rounded-lg overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {mode === 'edit' && !replaceImage && (
                    <button
                      type="button"
                      onClick={() => setReplaceImage(true)}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ color: 'white', fontFamily: 'Inter, sans-serif' }}
                    >
                      Replace Image
                    </button>
                  )}
                </div>
              )}

              {/* Upload Input */}
              {(mode === 'add' || replaceImage) && (
                <div>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all"
                    style={{
                      borderColor: '#D7CDC1',
                      backgroundColor: '#D7CDC108'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D7CDC122'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D7CDC108'}
                  >
                    <Upload size={32} style={{ color: '#3D5257', marginBottom: '8px' }} />
                    <p className="text-sm" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                      Click to upload image
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                      Max size: 5MB
                    </p>
                  </label>
                  {mode === 'edit' && replaceImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setReplaceImage(false);
                        setImageFile(null);
                        setImagePreview(item?.image || null);
                      }}
                      className="mt-2 text-sm"
                      style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                    >
                      Cancel replacement
                    </button>
                  )}
                </div>
              )}
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
                value={placeOrder}
                onChange={(e) => setPlaceOrder(parseInt(e.target.value) || 1)}
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
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
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
              disabled={isSubmitting || (mode === 'add' && !imageFile)}
              className="flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#3D5257',
                color: '#D7CDC1',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2d3f44')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3D5257')}
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Image' : 'Update Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryFormModal;