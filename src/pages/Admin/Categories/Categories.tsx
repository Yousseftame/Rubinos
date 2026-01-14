import React, { useState } from 'react';
import { 
  Visibility,
  Edit,
  Delete,
  Search,
  Add
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data
  const categories = [
    { id: 1, name: 'Appetizers', description: 'Starters and small plates', items: 12, status: 'Active' },
    { id: 2, name: 'Main Courses', description: 'Primary dishes and entrees', items: 24, status: 'Active' },
    { id: 3, name: 'Desserts', description: 'Sweet endings', items: 8, status: 'Active' },
    { id: 4, name: 'Beverages', description: 'Drinks and cocktails', items: 15, status: 'Active' },
    { id: 5, name: 'Salads', description: 'Fresh and healthy options', items: 6, status: 'Inactive' },
    { id: 6, name: 'Seafood', description: 'Ocean fresh selections', items: 18, status: 'Active' },
    { id: 7, name: 'Pasta', description: 'Italian classics', items: 10, status: 'Active' },
    { id: 8, name: 'Steaks', description: 'Premium cuts', items: 14, status: 'Active' },
    { id: 9, name: 'Vegetarian', description: 'Plant-based options', items: 9, status: 'Active' },
    { id: 10, name: 'Specials', description: 'Chef recommendations', items: 5, status: 'Active' },
  ];

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <div className="w-full max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-2" style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}>
          Categories
        </h1>
        <p className="text-sm" style={{ color: '#3D525799' }}>
          Manage your menu categories
        </p>
      </div>

      {/* Search and Add Section */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2" 
            style={{ color: '#3D525799', fontSize: '20px' }}
          />
          <input
            type="text"
            placeholder="Search categories..."
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

        {/* Add Button */}
        <button
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
          Add Category
        </button>
      </div>

      {/* Table Card */}
      <div 
        className="rounded-xl shadow-sm overflow-hidden"
        style={{ 
          backgroundColor: 'white',
          border: '1px solid #D7CDC122'
        }}
      >
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Head */}
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

            {/* Table Body */}
            <tbody>
              {currentCategories.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-b transition-all duration-150"
                  style={{ 
                    borderColor: '#D7CDC122',
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9F9F9'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D7CDC108'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#F9F9F9'}
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
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: category.status === 'Active' ? '#D7CDC122' : '#3D525722',
                        color: category.status === 'Active' ? '#3D5257' : '#3D525799',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Button */}
                      <button
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

                      {/* Edit Button */}
                      <button
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

                      {/* Delete Button */}
                      <button
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div 
          className="px-6 py-4 flex items-center justify-between border-t flex-wrap gap-4"
          style={{ borderColor: '#D7CDC122' }}
        >
          <div className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} entries
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                color: '#3D5257',
                backgroundColor: currentPage === 1 ? 'transparent' : '#D7CDC122'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#D7CDC133';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#D7CDC122';
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
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
                onMouseEnter={(e) => {
                  if (currentPage !== index + 1) {
                    e.currentTarget.style.backgroundColor = '#D7CDC122';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== index + 1) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                color: '#3D5257',
                backgroundColor: currentPage === totalPages ? 'transparent' : '#D7CDC122'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#D7CDC133';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#D7CDC122';
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;