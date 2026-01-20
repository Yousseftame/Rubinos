// src/pages/Admin/Categories/Categories.tsx
import { useState } from 'react';
import { 
  Visibility,
  Edit,
  Delete,
  Search,
  Add
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight, Layers, Eye, EyeOff } from 'lucide-react';
import { useCategoriesContext } from '../../../store/CategoriesContext/CategoriesContext';
import type { Category } from '../../../service/categories/categories.service';
import CategoryFormModal from './CategoryFormModal';
import CategoryDetailsModal from './CategoryDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Use the context
  const {
    categories,
    loading,
    statistics,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleToggleStatus
  } = useCategoriesContext();

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Handlers
  const handleOpenAddModal = () => {
    setFormMode('add');
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Category, 'uid' | 'createdAt' | 'updatedAt' | 'items'>) => {
    if (formMode === 'add') {
      await handleAddCategory(data);
    } else if (selectedCategory?.uid) {
      await handleUpdateCategory(selectedCategory.uid, data);
    }
    setIsFormModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory?.uid) return;
    
    setIsDeleting(true);
    try {
      await handleDeleteCategory(selectedCategory.uid);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (category: Category) => {
    setIsTogglingStatus(true);
    try {
      await handleToggleStatus(category.uid || '', category.status);
    } catch (error) {
      console.error('Status toggle error:', error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-2" style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}>
          Categories
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: '#3D525799' }}>
          Manage your menu categories
        </p>
      </div>

      {/* Analytics Section */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Categories Card */}
        <div 
          className="rounded-xl p-4 sm:p-6 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #D7CDC122'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                TOTAL CATEGORIES
              </p>
              <p 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.totalCategories || 0}
              </p>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#D7CDC122' }}
            >
              <Layers size={20} className="sm:w-6 sm:h-6" style={{ color: '#3D5257' }} />
            </div>
          </div>
        </div>

        {/* Active Categories Card */}
        <div 
          className="rounded-xl p-4 sm:p-6 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #D7CDC122'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                ACTIVE CATEGORIES
              </p>
              <p 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.activeCategories || 0}
              </p>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#D7CDC122' }}
            >
              <Eye size={20} className="sm:w-6 sm:h-6" style={{ color: '#3D5257' }} />
            </div>
          </div>
        </div>

        {/* Inactive Categories Card */}
        <div 
          className="rounded-xl p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #D7CDC122'
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                INACTIVE CATEGORIES
              </p>
              <p 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.inactiveCategories || 0}
              </p>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#D7CDC122' }}
            >
              <EyeOff size={20} className="sm:w-6 sm:h-6" style={{ color: '#3D5257' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search 
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" 
            style={{ color: '#3D525799', fontSize: '18px' }}
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all duration-200 outline-none text-sm"
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

        {/* Filter and Add Button */}
        <div className="flex gap-3 sm:gap-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all duration-200 outline-none text-sm"
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
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-medium flex-shrink-0 text-sm"
            style={{
              backgroundColor: '#3D5257',
              color: '#D7CDC1',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3f44'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D5257'}
          >
            <Add style={{ fontSize: '18px' }} />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#3D5257' }} />
        </div>
      )}

      {/* Table Card */}
      {!loading && (
        <div 
          className="rounded-xl shadow-sm overflow-hidden"
          style={{ 
            backgroundColor: 'white',
            border: '1px solid #D7CDC122'
          }}
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#3D5257' }}>
                  <th className="text-left px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    NAME
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    DESCRIPTION
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    ITEMS
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    STATUS
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <p style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                        {searchTerm || statusFilter !== 'all' ? 'No categories found matching your criteria.' : 'No categories yet. Add your first category!'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentCategories.map((category, index) => (
                    <tr
                      key={category.uid}
                      className="border-b transition-all duration-150"
                      style={{ 
                        borderColor: '#D7CDC122',
                        backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-sm" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                          {category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                          {category.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                          {category.items}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleStatusToggle(category)}
                            disabled={isTogglingStatus}
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize transition-all disabled:opacity-50"
                            style={{
                              backgroundColor: category.status === 'active' ? '#D7CDC122' : '#3D525722',
                              color: category.status === 'active' ? '#3D5257' : '#3D525799',
                              fontFamily: 'Inter, sans-serif'
                            }}
                            title="Click to toggle status"
                          >
                            {category.status}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenDetailsModal(category)}
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
                            <Visibility style={{ fontSize: '18px' }} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(category)}
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
                            <Edit style={{ fontSize: '18px' }} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(category)}
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
                            <Delete style={{ fontSize: '18px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {currentCategories.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                  {searchTerm || statusFilter !== 'all' ? 'No categories found matching your criteria.' : 'No categories yet. Add your first category!'}
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#D7CDC122' }}>
                {currentCategories.map((category) => (
                  <div key={category.uid} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                          {category.name}
                        </h3>
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                          {category.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleStatusToggle(category)}
                        disabled={isTogglingStatus}
                        className="ml-2 px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all disabled:opacity-50 flex-shrink-0"
                        style={{
                          backgroundColor: category.status === 'active' ? '#D7CDC122' : '#3D525722',
                          color: category.status === 'active' ? '#3D5257' : '#3D525799',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        {category.status}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                        <span className="font-medium" style={{ color: '#3D5257' }}>{category.items}</span> items
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenDetailsModal(category)}
                          className="p-2 rounded-lg transition-all"
                          style={{ color: '#3D525799' }}
                        >
                          <Visibility style={{ fontSize: '16px' }} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="p-2 rounded-lg transition-all"
                          style={{ color: '#3D525799' }}
                        >
                          <Edit style={{ fontSize: '16px' }} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(category)}
                          className="p-2 rounded-lg transition-all"
                          style={{ color: '#dc2626' }}
                        >
                          <Delete style={{ fontSize: '16px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredCategories.length > 0 && (
            <div 
              className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-3"
              style={{ borderColor: '#D7CDC122' }}
            >
              <div className="text-xs sm:text-sm order-2 sm:order-1" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length}
              </div>

              <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ 
                    color: '#3D5257',
                    backgroundColor: currentPage === 1 ? 'transparent' : '#D7CDC122'
                  }}
                >
                  <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150"
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
                  className="p-1.5 sm:p-2 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ 
                    color: '#3D5257',
                    backgroundColor: currentPage === totalPages ? 'transparent' : '#D7CDC122'
                  }}
                >
                  <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
        mode={formMode}
      />

      <CategoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteConfirm}
        categoryName={selectedCategory?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Categories;