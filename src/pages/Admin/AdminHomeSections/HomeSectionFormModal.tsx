// src/pages/Admin/AdminHomeSections/HomeSectionFormModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useHomeSectionsContext } from '../../../store/HomeSectionsContext/HomeSectionsContext';
import type { SectionType } from '../../../service/homeSections/homeSections.service';

interface HomeSectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: SectionType | null;
  mode: 'edit';
}

const HomeSectionFormModal: React.FC<HomeSectionFormModalProps> = ({
  isOpen,
  onClose,
  sectionType,
  // mode
}) => {
  const { sections, handleUpdateSection } = useHomeSectionsContext();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replaceImage, setReplaceImage] = useState(false);

  // Get section config
  const getSectionConfig = (type: SectionType) => {
    const config: Record<SectionType, any> = {
      about: {
        title: 'Edit About Section',
        fields: ['title', 'description', 'imageUrl'],
        placeholders: {
          title: 'Enter about section title',
          description: 'Enter about section description'
        }
      },
      dining: {
        title: 'Edit Private Dining Section',
        fields: ['title', 'description', 'imageUrl'],
        placeholders: {
          title: 'Enter dining section title',
          description: 'Enter dining section description'
        }
      },
      heroImage: {
        title: 'Edit Hero Image',
        fields: ['imageUrl'],
        placeholders: {}
      }
    };
    return config[type];
  };

  useEffect(() => {
    if (sectionType && isOpen) {
      const section = sections.find(s => s.type === sectionType);
      if (section) {
        setFormData({
          title: section.title || '',
          description: section.description || '',
          imageUrl: section.imageUrl || ''
        });
        setImagePreview(section.imageUrl || null);
      } else {
        setFormData({ title: '', description: '', imageUrl: '' });
        setImagePreview(null);
      }
      setImageFile(null);
      setReplaceImage(false);
    }
  }, [sectionType, isOpen, sections]);

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
    
    if (!sectionType) return;

    // Validate required fields based on section type
    if (sectionType !== 'heroImage') {
      if (!formData.title.trim()) {
        alert('Please enter a title');
        return;
      }
      if (!formData.description.trim()) {
        alert('Please enter a description');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const updates: any = {};

      if (sectionType !== 'heroImage') {
        if (formData.title !== sections.find(s => s.type === sectionType)?.title) {
          updates.title = formData.title;
        }
        if (formData.description !== sections.find(s => s.type === sectionType)?.description) {
          updates.description = formData.description;
        }
      }

      await handleUpdateSection(
        sectionType,
        updates,
        imageFile || undefined
      );
      
      // Close modal after successful update
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !sectionType) return null;

  const config = getSectionConfig(sectionType);
  const showTitleField = config.fields.includes('title');
  const showDescriptionField = config.fields.includes('description');

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
            style={{ color: '#0E302A', fontFamily: 'Cinzel, serif' }}
          >
            {config.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} style={{ color: '#0E302A' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Title Field */}
            {showTitleField && (
              <div>
                <label 
                  htmlFor="title"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
                  style={{
                    borderColor: '#D7CDC133',
                    backgroundColor: 'white',
                    color: '#0E302A',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
                  onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
                  placeholder={config.placeholders.title}
                  required={showTitleField}
                />
              </div>
            )}

            {/* Description Field */}
            {showDescriptionField && (
              <div>
                <label 
                  htmlFor="description"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}
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
                    color: '#0E302A',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '120px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
                  onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
                  placeholder={config.placeholders.description}
                  required={showDescriptionField}
                />
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}
              >
                {replaceImage ? 'New Image *' : 'Current Image'}
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3 relative rounded-lg overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {!replaceImage && (
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
              {replaceImage && (
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
                    <Upload size={32} style={{ color: '#0E302A', marginBottom: '8px' }} />
                    <p className="text-sm" style={{ color: '#0E302A', fontFamily: 'Inter, sans-serif' }}>
                      Click to upload image
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}>
                      Max size: 5MB
                    </p>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setReplaceImage(false);
                      setImageFile(null);
                      const section = sections.find(s => s.type === sectionType);
                      setImagePreview(section?.imageUrl || null);
                    }}
                    className="mt-2 text-sm"
                    style={{ color: '#0E302A99', fontFamily: 'Inter, sans-serif' }}
                  >
                    Cancel replacement
                  </button>
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
                color: '#0E302A',
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
                backgroundColor: '#0E302A',
                color: '#D7CDC1',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2d3f44')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#0E302A')}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeSectionFormModal;