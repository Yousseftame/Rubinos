// src/hooks/Admin/Messages/useMessages.ts
import { useState, useEffect } from 'react';
import { 
  getAllMessages, 
  deleteMessage,
  updateMessageStatus,
  type Message 
} from '../../../service/messages/messages.service';
import { toast } from 'react-hot-toast';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMessages();
      setMessages(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Update message status
  const handleUpdateStatus = async (id: string, status: 'new' | 'seen' | 'replied') => {
    try {
      await updateMessageStatus(id, status);
      toast.success('Message status updated successfully!');
      await fetchMessages(); // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update message status';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    try {
      setLoading(true);
      await deleteMessage(id);
      toast.success('Message deleted successfully!');
      await fetchMessages(); // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
    handleUpdateStatus,
    handleDeleteMessage
  };
};