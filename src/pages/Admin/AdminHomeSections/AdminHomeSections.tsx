// src/pages/Admin/AdminHomeSections/AdminHomeSections.tsx
import { useState } from 'react';
import { Edit, Eye, Calendar } from 'lucide-react';
import { useHomeSectionsContext } from '../../../store/HomeSectionsContext/HomeSectionsContext';
import type { SectionType } from '../../../service/homeSections/homeSections.service';
import HomeSectionFormModal from './HomeSectionFormModal';
import HomeSectionDetailsModal from './HomeSectionDetailsModal';

const AdminHomeSections = () => {
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [formMode, setFormMode] = useState<'edit'>('edit');

  // Use the context
  const { sections, loading, metadata } = useHomeSectionsContext();

  // Handlers
  const handleOpenEditModal = (type: SectionType) => {
    setFormMode('edit');
    setSelectedSection(type);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (type: SectionType) => {
    setSelectedSection(type);
    setIsDetailsModalOpen(true);
  };

  // Get section type display name
  // const getSectionDisplayName = (type: SectionType): string => {
  //   const names: Record<SectionType, string> = {
  //     about: 'About Section',
  //     dining: 'Private Dining Section',
  //     heroImage: 'Hero Image'
  //   };
  //   return names[type];
  // };

  // Get section icon color
  const getSectionColor = (type: SectionType): string => {
    const colors: Record<SectionType, string> = {
      about: '#8EC693',
      dining: '#FFD89B',
      heroImage: '#B8AEA0'
    };
    return colors[type];
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-2" style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}>
          Home Sections
        </h1>
        <p className="text-sm" style={{ color: '#3D525799' }}>
          Manage your homepage sections (About, Dining, Hero Image)
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#3D5257' }} />
        </div>
      )}

      {/* Sections Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(['about', 'dining', 'heroImage'] as SectionType[]).map((sectionType) => {
            const section = sections.find(s => s.type === sectionType);
            const sectionMeta = metadata[sectionType];
            const color = getSectionColor(sectionType);

            return (
              <div
                key={sectionType}
                className="rounded-xl shadow-sm overflow-hidden transition-all duration-200"
                style={{ 
                  backgroundColor: 'white',
                  border: '1px solid #D7CDC122'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Image Preview */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  {section?.imageUrl ? (
                    <img
                      src={section.imageUrl}
                      alt={sectionType}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: '#D7CDC122' }}
                    >
                      <span style={{ color: '#3D525799' }}>No image</span>
                    </div>
                  )}
                  {/* Type Badge */}
                  <div 
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: color,
                      color: '#ffffff',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {sectionType.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 
                    className="text-lg font-semibold mb-2 line-clamp-1"
                    style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
                  >
                   {section?.title}
                  </h3>

                  {/* Description (if exists) */}
                  {section?.description && (
                    <p 
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                    >
                      
                      {section.description}
                    </p>
                  )}

                  {/* Last Updated */}
                  {sectionMeta?.lastUpdated && (
                    <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: '#3D525799' }}>
                      <Calendar size={14} />
                      <span>{sectionMeta.lastUpdated.toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleOpenDetailsModal(sectionType)}
                      className="flex-1 p-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
                      style={{ color: '#3D525799' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#D7CDC122';
                        e.currentTarget.style.color = '#3D5257';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#3D525799';
                      }}
                      title="View details"
                    >
                      <Eye size={18} />
                      <span className="text-xs font-medium">View</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(sectionType)}
                      className="flex-1 p-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
                      style={{ color: '#3D525799' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#D7CDC122';
                        e.currentTarget.style.color = '#3D5257';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#3D525799';
                      }}
                      title="Edit"
                    >
                      <Edit size={18} />
                      <span className="text-xs font-medium">Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <HomeSectionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSection(null);
        }}
        sectionType={selectedSection}
        mode={formMode}
      />

      <HomeSectionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSection(null);
        }}
        sectionType={selectedSection}
      />
    </div>
  );
};

export default AdminHomeSections;