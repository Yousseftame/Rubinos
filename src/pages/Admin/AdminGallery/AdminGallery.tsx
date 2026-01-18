// src/pages/Admin/AdminGallery/AdminGallery.tsx
import React, { useState } from 'react';
import { 
  Visibility,
  Edit,
  Delete,
  Search,
  Add,
  Image as ImageIcon
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Images } from 'lucide-react';
import { useGalleryContext } from '../../../store/GalleryContext/GalleryContext';
import type { GalleryItem } from '../../../service/gallery/gallery.service';
import GalleryFormModal from './GalleryFormModal';
import GalleryDetailsModal from './GalleryDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const AdminGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Use the context
  const {
    galleryItems,
    loading,
    statistics,
    handleAddGalleryItem,
    handleUpdateGalleryItem,
    handleDeleteGalleryItem,
    handleToggleStatus
  } = useGalleryContext();

  // Filter gallery items
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.placeOrder.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Handlers
  const handleOpenAddModal = () => {
    setFormMode('add');
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setFormMode('edit');
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (imageFile: File, placeOrder?: number) => {
    if (formMode === 'add') {
      await handleAddGalleryItem(imageFile, placeOrder);
    }
    setIsFormModalOpen(false);
    setSelectedItem(null);
  };

  // Handle update
  const handleUpdate = async (
    updates: { placeOrder?: number; status?: 'active' | 'inactive' },
    newImageFile?: File
  ) => {
    if (!selectedItem?.uid) return;
    await handleUpdateGalleryItem(selectedItem.uid, updates, newImageFile);
    setIsFormModalOpen(false);
    setSelectedItem(null);
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!selectedItem?.uid) return;
    
    setIsDeleting(true);
    try {
      await handleDeleteGalleryItem(selectedItem.uid);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (item: GalleryItem) => {
    setIsTogglingStatus(true);
    try {
      await handleToggleStatus(item.uid || '', item.status);
    } catch (error) {
      console.error('Status toggle error:', error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-2" style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}>
          Gallery
        </h1>
        <p className="text-sm" style={{ color: '#3D525799' }}>
          Manage your restaurant gallery images
        </p>
      </div>

      {/* Analytics Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Images Card */}
        <div 
          className="rounded-xl p-6 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #D7CDC122'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                TOTAL IMAGES
              </p>
              <p 
                className="text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.totalImages || 0}
              </p>
            </div>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#D7CDC122' }}
            >
              <Images size={24} style={{ color: '#3D5257' }} />
            </div>
          </div>
        </div>

        {/* Active Images Card */}
        <div 
          className="rounded-xl p-6 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #D7CDC122'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                ACTIVE IMAGES
              </p>
              <p 
                className="text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.activeImages || 0}
              </p>
            </div>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#D7CDC122' }}
            >
              <Eye size={24} style={{ color: '#3D5257' }} />
            </div>
          </div>
        </div>

        {/* Inactive Images Card */}
        <div 
          className="rounded-xl p-6 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #D7CDC122'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                INACTIVE IMAGES
              </p>
              <p 
                className="text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.inactiveImages || 0}
              </p>
            </div>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#D7CDC122' }}
            >
              <EyeOff size={24} style={{ color: '#3D5257' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2" 
            style={{ color: '#3D525799', fontSize: '20px' }}
          />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
            style={{
              borderColor: '#D7CDC133',
              backgroundColor: 'white',
              color: '#3D5257',
              fontFamily: 'Inter, sans-serif'
            }}
            onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
            onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
            setCurrentPage(1);
          }}
          className="px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
          style={{
            borderColor: '#D7CDC133',
            backgroundColor: 'white',
            color: '#3D5257',
            fontFamily: 'Inter, sans-serif'
          }}
          onFocus={(e) => e.target.style.borderColor = '#D7CDC1'}
          onBlur={(e) => e.target.style.borderColor = '#D7CDC133'}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Add Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium flex-shrink-0"
          style={{
            backgroundColor: '#3D5257',
            color: '#D7CDC1',
            fontFamily: 'Inter, sans-serif'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3f44'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D5257'}
        >
          <Add style={{ fontSize: '20px' }} />
          Add Image
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#3D5257' }} />
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && (
        <>
          {currentItems.length === 0 ? (
            <div 
              className="rounded-xl shadow-sm p-12 text-center"
              style={{ 
                backgroundColor: 'white',
                border: '1px solid #D7CDC122'
              }}
            >
              <ImageIcon style={{ fontSize: '64px', color: '#3D525733', marginBottom: '16px' }} />
              <p style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                {searchTerm || statusFilter !== 'all' ? 'No images found matching your criteria.' : 'No images yet. Add your first image!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {currentItems.map((item) => (
                <div
                  key={item.uid}
                  className="rounded-xl shadow-sm overflow-hidden transition-all duration-200"
                  style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #D7CDC122'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Image */}
                  <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={`Gallery item ${item.placeOrder}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Order Badge */}
                    <div 
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: '#3D5257',
                        color: '#D7CDC1',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      #{item.placeOrder}
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleStatusToggle(item)}
                        disabled={isTogglingStatus}
                        className="px-3 py-1 rounded-full text-xs font-medium capitalize transition-all disabled:opacity-50"
                        style={{
                          backgroundColor: item.status === 'active' ? '#D7CDC122' : '#3D525722',
                          color: item.status === 'active' ? '#3D5257' : '#3D525799',
                          fontFamily: 'Inter, sans-serif'
                        }}
                        onMouseEnter={(e) => !isTogglingStatus && (e.currentTarget.style.opacity = '0.8')}
                        onMouseLeave={(e) => !isTogglingStatus && (e.currentTarget.style.opacity = '1')}
                        title="Click to toggle status"
                      >
                        {item.status}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex items-center justify-center gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleOpenDetailsModal(item)}
                      className="p-2 rounded-lg transition-all duration-150"
                      style={{ color: '#3D525799' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#D7CDC122';
                        e.currentTarget.style.color = '#3D5257';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#3D525799';
                      }}
                      title="View"
                    >
                      <Visibility style={{ fontSize: '20px' }} />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-lg transition-all duration-150"
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
                      <Edit style={{ fontSize: '20px' }} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleOpenDeleteModal(item)}
                      className="p-2 rounded-lg transition-all duration-150"
                      style={{ color: '#3D525799' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff000011';
                        e.currentTarget.style.color = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#3D525799';
                      }}
                      title="Delete"
                    >
                      <Delete style={{ fontSize: '20px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div 
              className="rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-4"
              style={{ 
                backgroundColor: 'white',
                border: '1px solid #D7CDC122'
              }}
            >
              <div className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ 
                    color: '#3D5257',
                    backgroundColor: currentPage === 1 ? 'transparent' : '#D7CDC122'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      backgroundColor: currentPage === index + 1 ? '#3D5257' : 'transparent',
                      color: currentPage === index + 1 ? '#D7CDC1' : '#3D5257',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ 
                    color: '#3D5257',
                    backgroundColor: currentPage === totalPages ? 'transparent' : '#D7CDC122'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <GalleryFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleFormSubmit}
        onUpdate={handleUpdate}
        item={selectedItem}
        mode={formMode}
        maxOrder={galleryItems.length}
      />

      <GalleryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemOrder={selectedItem?.placeOrder || 0}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminGallery;