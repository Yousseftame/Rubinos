// src/pages/Admin/Messages/DeleteConfirmationModal.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  messageName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  messageName,
  isDeleting
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#fee2e2' }}
          >
            <AlertTriangle size={32} style={{ color: '#dc2626' }} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-serif font-bold mb-2"
            style={{ color: '#3D5257', fontFamily: 'Cinzel, serif' }}
          >
            Delete Message
          </h2>
          <p 
            className="text-sm"
            style={{ color: '#3D525799', fontFamily: 'Inter, sans-serif' }}
          >
            This action cannot be undone
          </p>
        </div>

        {/* Message */}
        <div 
          className="mb-6 p-4 rounded-lg"
          style={{ backgroundColor: '#fff5f5' }}
        >
          <p 
            className="text-center"
            style={{ color: '#3D5257', fontFamily: 'Inter, sans-serif' }}
          >
            Are you sure you want to delete the message from <span className="font-bold">"{messageName}"</span>?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium border-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: '#D7CDC1',
              color: '#3D5257',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => !isDeleting && (e.currentTarget.style.backgroundColor = '#D7CDC122')}
            onMouseLeave={(e) => !isDeleting && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => !isDeleting && (e.currentTarget.style.backgroundColor = '#b91c1c')}
            onMouseLeave={(e) => !isDeleting && (e.currentTarget.style.backgroundColor = '#dc2626')}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;