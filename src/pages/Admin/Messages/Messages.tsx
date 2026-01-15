// src/pages/Admin/Messages/Messages.tsx
import React, { useState } from 'react';
import { 
  Visibility,
  Delete,
  Search,
  Email,
  MarkEmailRead,
  Reply
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMessages } from '../../../hooks/Admin/Messages/useMessages';
import type { Message } from '../../../service/messages/messages.service';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import MessageDetailsModal from './MessageDetailsModal';

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'seen' | 'replied'>('all');
  const itemsPerPage = 8;

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the hook
  const {
    messages,
    loading,
    handleDeleteMessage,
    handleUpdateStatus,
    fetchMessages
  } = useMessages();

  // Filter messages based on search and status
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.phone.includes(searchTerm) ||
      message.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  // Count by status
  const newCount = messages.filter(m => m.status === 'new').length;
  const seenCount = messages.filter(m => m.status === 'seen').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;

  // Handlers
  const handleOpenDetailsModal = (message: Message) => {
    setSelectedMessage(message);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (message: Message) => {
    setSelectedMessage(message);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMessage?.uid) return;
    
    setIsDeleting(true);
    try {
      await handleDeleteMessage(selectedMessage.uid);
      setIsDeleteModalOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: 'new' | 'seen' | 'replied') => {
    try {
      await handleUpdateStatus(messageId, newStatus);
      await fetchMessages();
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Email style={{ fontSize: '16px' }} />;
      case 'seen':
        return <MarkEmailRead style={{ fontSize: '16px' }} />;
      case 'replied':
        return <Reply style={{ fontSize: '16px' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-2" style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}>
          Messages
        </h1>
        <p className="text-sm" style={{ color: '#3D525799' }}>
          Manage customer inquiries and messages
        </p>
      </div>

      {/* Status Filter Chips */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => {
            setStatusFilter('all');
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: statusFilter === 'all' ? '#3D5257' : '#D7CDC122',
            color: statusFilter === 'all' ? '#D7CDC1' : '#3D5257',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => {
            setStatusFilter('new');
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          style={{
            backgroundColor: statusFilter === 'new' ? '#3D5257' : '#D7CDC122',
            color: statusFilter === 'new' ? '#D7CDC1' : '#3D5257',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Email style={{ fontSize: '16px' }} />
          New ({newCount})
        </button>
        <button
          onClick={() => {
            setStatusFilter('seen');
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          style={{
            backgroundColor: statusFilter === 'seen' ? '#3D5257' : '#D7CDC122',
            color: statusFilter === 'seen' ? '#D7CDC1' : '#3D5257',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <MarkEmailRead style={{ fontSize: '16px' }} />
          Seen ({seenCount})
        </button>
        <button
          onClick={() => {
            setStatusFilter('replied');
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          style={{
            backgroundColor: statusFilter === 'replied' ? '#3D5257' : '#D7CDC122',
            color: statusFilter === 'replied' ? '#D7CDC1' : '#3D5257',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Reply style={{ fontSize: '16px' }} />
          Replied ({repliedCount})
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2" 
            style={{ color: '#3D525799', fontSize: '20px' }}
          />
          <input
            type="text"
            placeholder="Search messages..."
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
                    CONTACT
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    MESSAGE
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold tracking-wide" style={{ color: '#D7CDC1', fontFamily: 'Cinzel, serif' }}>
                    DATE
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
                {currentMessages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <p style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                        {searchTerm || statusFilter !== 'all' ? 'No messages found matching your criteria.' : 'No messages yet.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentMessages.map((message, index) => (
                    <tr
                      key={message.uid}
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
                          {message.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <div style={{ color: '#3D5257' }}>{message.email}</div>
                          <div style={{ color: '#3D525799' }}>{message.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm line-clamp-2" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                          {message.details}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                          {formatDate(message.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <select
                            value={message.status}
                            onChange={(e) => message.uid && handleStatusChange(message.uid, e.target.value as any)}
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize outline-none cursor-pointer"
                            style={{
                              backgroundColor: 
                                message.status === 'new' ? '#fef3c7' : 
                                message.status === 'seen' ? '#dbeafe' : 
                                '#d1fae5',
                              color: 
                                message.status === 'new' ? '#92400e' : 
                                message.status === 'seen' ? '#1e40af' : 
                                '#065f46',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <option value="new">New</option>
                            <option value="seen">Seen</option>
                            <option value="replied">Replied</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => handleOpenDetailsModal(message)}
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

                          {/* Delete Button */}
                          <button
                            onClick={() => handleOpenDeleteModal(message)}
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

          {/* Pagination */}
          {filteredMessages.length > 0 && (
            <div 
              className="px-6 py-4 flex items-center justify-between border-t flex-wrap gap-4"
              style={{ borderColor: '#D7CDC122' }}
            >
              <div className="text-sm" style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredMessages.length)} of {filteredMessages.length} entries
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
        </div>
      )}

      {/* Modals */}
      <MessageDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedMessage(null);
          fetchMessages(); // Refresh to update status
        }}
        message={selectedMessage}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMessage(null);
        }}
        onConfirm={handleDeleteConfirm}
        messageName={selectedMessage?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Messages;