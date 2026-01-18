// src/store/GalleryContext/GalleryContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAllGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemStatus,
  getGalleryStatistics,
  type GalleryItem 
} from '../../service/gallery/gallery.service';
import { toast } from 'react-hot-toast';

interface GalleryStatistics {
  totalImages: number;
  activeImages: number;
  inactiveImages: number;
}

interface GalleryContextType {
  galleryItems: GalleryItem[];
  loading: boolean;
  error: string | null;
  statistics: GalleryStatistics | null;
  fetchGalleryItems: () => Promise<void>;
  handleAddGalleryItem: (imageFile: File, placeOrder?: number) => Promise<string>;
  handleUpdateGalleryItem: (
    id: string,
    updates: { placeOrder?: number; status?: 'active' | 'inactive' },
    newImageFile?: File
  ) => Promise<void>;
  handleDeleteGalleryItem: (id: string) => Promise<void>;
  handleToggleStatus: (id: string, currentStatus: 'active' | 'inactive') => Promise<void>;
  fetchStatistics: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<GalleryStatistics | null>(null);

  // Fetch all gallery items
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllGalleryItems();
      setGalleryItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch gallery items';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const stats = await getGalleryStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Load gallery items on mount
  useEffect(() => {
    fetchGalleryItems();
    fetchStatistics();
  }, []);

  // Add new gallery item
  const handleAddGalleryItem = async (imageFile: File, placeOrder?: number) => {
    try {
      const newId = await addGalleryItem(imageFile, placeOrder);
      toast.success('Image added to gallery successfully!');
      await fetchGalleryItems();
      await fetchStatistics();
      return newId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add gallery item';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update gallery item
  const handleUpdateGalleryItem = async (
    id: string,
    updates: { placeOrder?: number; status?: 'active' | 'inactive' },
    newImageFile?: File
  ) => {
    const originalGalleryItems = [...galleryItems];
    
    // Optimistic update for status only (not order, as it affects other items)
    if (updates.status && !updates.placeOrder && !newImageFile) {
      setGalleryItems(prevItems =>
        prevItems.map(item =>
          item.uid === id ? { ...item, status: updates.status! } : item
        )
      );
    }

    try {
      await updateGalleryItem(id, updates, newImageFile);
      toast.success('Gallery item updated successfully!');
      await fetchGalleryItems();
      await fetchStatistics();
    } catch (err) {
      setGalleryItems(originalGalleryItems);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update gallery item';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete gallery item
  const handleDeleteGalleryItem = async (id: string) => {
    const originalGalleryItems = [...galleryItems];
    
    setGalleryItems(prevItems => prevItems.filter(item => item.uid !== id));

    try {
      await deleteGalleryItem(id);
      toast.success('Gallery item deleted successfully!');
      await fetchStatistics();
      // Refresh to get updated order
      await fetchGalleryItems();
    } catch (err) {
      setGalleryItems(originalGalleryItems);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gallery item';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Toggle status
  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    const originalGalleryItems = [...galleryItems];
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    setGalleryItems(prevItems =>
      prevItems.map(item =>
        item.uid === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      await toggleGalleryItemStatus(id, currentStatus);
      toast.success(`Gallery item status changed to ${newStatus}!`);
      await fetchStatistics();
    } catch (err) {
      setGalleryItems(originalGalleryItems);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle status';
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <GalleryContext.Provider
      value={{
        galleryItems,
        loading,
        error,
        statistics,
        fetchGalleryItems,
        handleAddGalleryItem,
        handleUpdateGalleryItem,
        handleDeleteGalleryItem,
        handleToggleStatus,
        fetchStatistics
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryContext = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
};