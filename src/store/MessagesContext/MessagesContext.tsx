import React, { createContext, useContext, useState, useEffect,  type ReactNode } from 'react';
import { 
  getAllMessages, 
  deleteMessage,
  updateMessageStatus,
  type Message 
} from '../../service/messages/messages.service';
import { toast } from 'react-hot-toast';

interface MessagesContextType {
  messages: Message[];
  loading: boolean;
  error: string | null;
  newCount: number;
  seenCount: number;
  repliedCount: number;
  fetchMessages: () => Promise<void>;
  handleDeleteMessage: (id: string) => Promise<void>;
  handleUpdateStatus: (id: string, status: 'new' | 'seen' | 'replied') => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate counts from messages state
  const newCount = messages.filter(m => m.status === 'new').length;
  const seenCount = messages.filter(m => m.status === 'seen').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;

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

  // Update message status (optimistic update)
  const handleUpdateStatus = async (id: string, status: 'new' | 'seen' | 'replied') => {
    // Optimistic update - update UI immediately
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.uid === id ? { ...msg, status } : msg
      )
    );

    try {
      await updateMessageStatus(id, status);
      toast.success('Message status updated successfully!');
    } catch (err) {
      // Revert on error
      await fetchMessages();
      const errorMessage = err instanceof Error ? err.message : 'Failed to update message status';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete message (optimistic update)
  const handleDeleteMessage = async (id: string) => {
    // Store original state for rollback
    const originalMessages = [...messages];
    
    // Optimistic update - remove from UI immediately
    setMessages(prevMessages => prevMessages.filter(msg => msg.uid !== id));

    try {
      await deleteMessage(id);
      toast.success('Message deleted successfully!');
    } catch (err) {
      // Revert on error
      setMessages(originalMessages);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        loading,
        error,
        newCount,
        seenCount,
        repliedCount,
        fetchMessages,
        handleDeleteMessage,
        handleUpdateStatus
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesContext = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessagesContext must be used within a MessagesProvider');
  }
  return context;
};