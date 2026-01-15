// src/pages/Admin/Messages/MessageDetailsModal.tsx
import React from 'react';
import { X, Calendar, Hash, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { Message } from '../../../service/messages/messages.service';

interface MessageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  onStatusChange: (messageId: string, newStatus: 'new' | 'seen' | 'replied') => void;
}

const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  isOpen,
  onClose,
  message,
  onStatusChange
}) => {
  if (!isOpen || !message) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'PPpp');
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'seen':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'replied':
        return { bg: '#d1fae5', color: '#065f46' };
      default:
        return { bg: '#D7CDC122', color: '#3D5257' };
    }
  };

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
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: '#D7CDC133' }}>
          <h2 
            className="text-2xl font-serif font-bold"
            style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
          >
            Message Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} style={{ color: '#3D5257' }} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Status Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                STATUS
              </label>
            </div>
            <select
              value={message.status}
              onChange={(e) => message.uid && onStatusChange(message.uid, e.target.value as any)}
              className="pl-6 px-4 py-2 rounded-lg text-sm font-medium capitalize outline-none cursor-pointer border-2 transition-all"
              style={{
                backgroundColor: getStatusColor(message.status).bg,
                color: getStatusColor(message.status).color,
                borderColor: getStatusColor(message.status).color + '33',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <option value="new">New</option>
              <option value="seen">Seen</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                NAME
              </label>
            </div>
            <p 
              className="text-lg font-medium pl-6"
              style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
            >
              {message.name}
            </p>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                EMAIL
              </label>
            </div>
            <a 
              href={`mailto:${message.email}`}
              className="pl-6 hover:underline"
              style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
            >
              {message.email}
            </a>
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                PHONE
              </label>
            </div>
            <a 
              href={`tel:${message.phone}`}
              className="pl-6 hover:underline"
              style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
            >
              {message.phone}
            </a>
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} style={{ color: '#3D525799' }} />
              <label 
                className="text-sm font-semibold"
                style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
              >
                MESSAGE
              </label>
            </div>
            <div 
              className="pl-6 p-4 rounded-lg leading-relaxed"
              style={{ 
                color: '#3D5257', 
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#F9F9F9'
              }}
            >
              {message.details}
            </div>
          </div>

          {/* Metadata */}
          <div 
            className="pt-6 mt-6 border-t space-y-4"
            style={{ borderColor: '#D7CDC133' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} style={{ color: '#3D525799' }} />
                <label 
                  className="text-sm font-semibold"
                  style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                >
                  RECEIVED AT
                </label>
              </div>
              <p 
                className="pl-6"
                style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
              >
                {formatDate(message.createdAt)}
              </p>
            </div>

            {message.uid && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={18} style={{ color: '#3D525799' }} />
                  <label 
                    className="text-sm font-semibold"
                    style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
                  >
                    MESSAGE ID
                  </label>
                </div>
                <p 
                  className="pl-6 font-mono text-xs break-all"
                  style={{ color: '#3D525799', fontFamily: 'monospace' }}
                >
                  {message.uid}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t flex gap-3" style={{ borderColor: '#D7CDC133' }}>
          <a
            href={`mailto:${message.email}`}
            className="flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium text-center"
            style={{
              backgroundColor: '#3D5257',
              color: '#D7CDC1',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3f44'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D5257'}
          >
            Reply via Email
          </a>
          <button
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailsModal;