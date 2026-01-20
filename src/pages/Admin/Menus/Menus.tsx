// src/pages/Admin/Menus/Menus.tsx
import { useState } from 'react';
import { 
  Visibility,
  Edit,
  Delete,
  Search,
  Add,
  AttachMoney,
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight, Package, Eye, EyeOff } from 'lucide-react';
import { useMenusContext } from '../../../store/MenusContext/MenusContext';
import { useCategoriesContext } from '../../../store/CategoriesContext/CategoriesContext';
import type { MenuItem } from '../../../service/menus/menus.service';
import MenuFormModal from './MenuFormModal';
import MenuDetailsModal from './MenuDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Menus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Use contexts
  const {
    menuItems,
    loading,
    statistics,
    handleAddMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    handleToggleStatus
  } = useMenusContext();

  const { categories } = useCategoriesContext();

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toString().includes(searchTerm);
    
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMenuItems = filteredMenuItems.slice(startIndex, endIndex);

  // Handlers
  const handleOpenAddModal = () => {
    setFormMode('add');
    setSelectedMenuItem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (menuItem: MenuItem) => {
    setFormMode('edit');
    setSelectedMenuItem(menuItem);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (
    data: Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt'>,
    imageFiles?: File[],
    imagesToDelete?: string[]
  ) => {
    if (formMode === 'add') {
      await handleAddMenuItem(
        { 
          name: data.name, 
          price: data.price,
          description: data.description,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          status: data.status
        },
        imageFiles || []
      );
    } else if (selectedMenuItem?.uid) {
      await handleUpdateMenuItem(
        selectedMenuItem.uid,
        {
          name: data.name,
          price: data.price,
          description: data.description,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          status: data.status
        },
        imageFiles,
        imagesToDelete
      );
    }
    setIsFormModalOpen(false);
    setSelectedMenuItem(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMenuItem?.uid) return;
    
    setIsDeleting(true);
    try {
      await handleDeleteMenuItem(selectedMenuItem.uid);
      setIsDeleteModalOpen(false);
      setSelectedMenuItem(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (menuItem: MenuItem) => {
    setIsTogglingStatus(true);
    try {
      await handleToggleStatus(menuItem.uid || '', menuItem.status);
    } catch (error) {
      console.error('Status toggle error:', error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.uid === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-2" style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}>
          Menu Items
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: '#3D525799' }}>
          Manage your menu items and dishes
        </p>
      </div>

      {/* Analytics Section */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Items Card */}
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
                TOTAL ITEMS
              </p>
              <p 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.totalItems || 0}
              </p>
            </div>
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#D7CDC122' }}
            >
              <Package size={20} className="sm:w-6 sm:h-6" style={{ color: '#3D5257' }} />
            </div>
          </div>
        </div>

        {/* Active Items Card */}
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
                ACTIVE ITEMS
              </p>
              <p 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.activeItems || 0}
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

        {/* Inactive Items Card */}
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
                INACTIVE ITEMS
              </p>
              <p 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
              >
                {statistics?.inactiveItems || 0}
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
      <div className="mb-4 sm:mb-6 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search 
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" 
            style={{ color: '#3D525799', fontSize: '18px' }}
          />
          <input
            type="text"
            placeholder="Search menu items..."
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

        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
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
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.uid} value={category.uid}>
                {category.name}
              </option>
            ))}
          </select>

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
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-medium text-sm"
            style={{
              backgroundColor: '#3D5257',
              color: '#D7CDC1',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3f44'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D5257'}
          >
            <Add style={{ fontSize: '18px' }} />
            <span className="hidden sm:inline">Add Menu Item</span>
            <span className="sm:hidden">Add Item</span>
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
                    CATEGORY
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    PRICE
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    IMAGES
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
                {currentMenuItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <p style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                        {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? 'No menu items found matching your criteria.' : 'No menu items yet. Add your first item!'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentMenuItems.map((menuItem, index) => (
                    <tr
                      key={menuItem.uid}
                      className="border-b transition-all duration-150"
                      style={{ 
                        borderColor: '#D7CDC122',
                        backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-sm" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                          {menuItem.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                          {getCategoryName(menuItem.categoryId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <AttachMoney style={{ fontSize: '16px', color: '#3D5257' }} />
                          <span className="text-sm font-medium" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                            {menuItem.price.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                          {menuItem.images?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleStatusToggle(menuItem)}
                            disabled={isTogglingStatus}
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize transition-all disabled:opacity-50"
                            style={{
                              backgroundColor: menuItem.status === 'active' ? '#D7CDC122' : '#3D525722',
                              color: menuItem.status === 'active' ? '#3D5257' : '#3D525799',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {menuItem.status}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenDetailsModal(menuItem)}
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
                            onClick={() => handleOpenEditModal(menuItem)}
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
                            onClick={() => handleOpenDeleteModal(menuItem)}
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
            {currentMenuItems.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? 'No menu items found matching your criteria.' : 'No menu items yet. Add your first item!'}
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#D7CDC122' }}>
                {currentMenuItems.map((menuItem) => (
                  <div key={menuItem.uid} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate" style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}>
                          {menuItem.name}
                        </h3>
                        <p className="text-xs mb-1" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                          {getCategoryName(menuItem.categoryId)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleStatusToggle(menuItem)}
                        disabled={isTogglingStatus}
                        className="ml-2 px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all disabled:opacity-50 flex-shrink-0"
                        style={{
                          backgroundColor: menuItem.status === 'active' ? '#D7CDC122' : '#3D525722',
                          color: menuItem.status === 'active' ? '#3D5257' : '#3D525799',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        {menuItem.status}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                        <div className="flex items-center gap-1">
                          <AttachMoney style={{ fontSize: '14px', color: '#3D5257' }} />
                          <span className="font-medium" style={{ color: '#3D5257' }}>{menuItem.price.toFixed(2)}</span>
                        </div>
                        <span>•</span>
                        <span>{menuItem.images?.length || 0} images</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenDetailsModal(menuItem)}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: '#3D525799' }}
                      >
                        <Visibility style={{ fontSize: '16px' }} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(menuItem)}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: '#3D525799' }}
                      >
                        <Edit style={{ fontSize: '16px' }} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(menuItem)}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: '#dc2626' }}
                      >
                        <Delete style={{ fontSize: '16px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredMenuItems.length > 0 && (
            <div 
              className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-3"
              style={{ borderColor: '#D7CDC122' }}
            >
              <div className="text-xs sm:text-sm order-2 sm:order-1" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredMenuItems.length)} of {filteredMenuItems.length}
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
                    key={index + 1}
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
      <MenuFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedMenuItem(null);
        }}
        onSubmit={handleFormSubmit}
        menuItem={selectedMenuItem}
        mode={formMode}
      />

      <MenuDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedMenuItem(null);
        }}
        menuItem={selectedMenuItem}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMenuItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        menuItemName={selectedMenuItem?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Menus;