// src/store/MenusContext/MenusContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAllMenuItems, 
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  getMenuItemCountByCategory,
  toggleMenuItemStatus,
  getMenuStatistics,
  type MenuItem 
} from '../../service/menus/menus.service';
import { toast } from 'react-hot-toast';
import { useCategoriesContext } from '../CategoriesContext/CategoriesContext';

interface MenuStatistics {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  totalByCategory: Record<string, number>;
}

interface MenusContextType {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  statistics: MenuStatistics | null;
  fetchMenuItems: () => Promise<void>;
  fetchMenuItemsByCategory: (categoryId: string) => Promise<MenuItem[]>;
  handleAddMenuItem: (
    menuData: Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt' | 'images'>,
    imageFiles: File[]
  ) => Promise<string>;
  handleUpdateMenuItem: (
    id: string,
    menuData: Partial<Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt'>>,
    imageFiles?: File[],
    imagesToDelete?: string[]
  ) => Promise<void>;
  handleDeleteMenuItem: (id: string) => Promise<void>;
  handleToggleStatus: (id: string, currentStatus: 'active' | 'inactive') => Promise<void>;
  getMenuItemCountByCategory: (categoryId: string) => Promise<number>;
  fetchStatistics: () => Promise<void>;
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

export const MenusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<MenuStatistics | null>(null);
  // Get categories context
const { refreshCategories } = useCategoriesContext();

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMenuItems();
      setMenuItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch menu items';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const stats = await getMenuStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Fetch menu items by category
  const fetchMenuItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
    try {
      const data = await getMenuItemsByCategory(categoryId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch menu items';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Load menu items on mount
  useEffect(() => {
    fetchMenuItems();
    fetchStatistics();
  }, []);

  // Add new menu item (optimistic update)
  const handleAddMenuItem = async (
    menuData: Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt' | 'images'>,
    imageFiles: File[]
  ) => {
    try {
      const newId = await addMenuItem(menuData, imageFiles);
      toast.success('Menu item added successfully!');
      // Refresh list to get latest data with images
      await fetchMenuItems();
      await fetchStatistics();
      await refreshCategories();  // ← REFRESH CATEGORIES! ✅
      return newId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add menu item';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update menu item (optimistic update with proper image handling)
  const handleUpdateMenuItem = async (
    id: string,
    menuData: Partial<Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt'>>,
    imageFiles?: File[],
    imagesToDelete?: string[]
  ) => {
    // Store original state for rollback
    const originalMenuItems = [...menuItems];
    
    // Optimistic update - update UI immediately
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.uid === id 
          ? { 
              ...item, 
              ...menuData,
            } 
          : item
      )
    );

    try {
      await updateMenuItem(id, menuData, imageFiles, imagesToDelete);
      toast.success('Menu item updated successfully!');
      // Refresh to get images properly
      await fetchMenuItems();
      await fetchStatistics();
      await refreshCategories();  // ← REFRESH CATEGORIES! ✅
    } catch (err) {
      // Revert on error
      setMenuItems(originalMenuItems);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update menu item';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete menu item (optimistic update)
  const handleDeleteMenuItem = async (id: string) => {
    // Store original state for rollback
    const originalMenuItems = [...menuItems];
    
    // Optimistic update - remove from UI immediately
    setMenuItems(prevItems => prevItems.filter(item => item.uid !== id));

    try {
      await deleteMenuItem(id);
      toast.success('Menu item deleted successfully!');
      await fetchStatistics();
      await refreshCategories();  // ← REFRESH CATEGORIES! ✅
    } catch (err) {
      // Revert on error
      setMenuItems(originalMenuItems);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete menu item';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Toggle status
  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    // Store original state
    const originalMenuItems = [...menuItems];
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // Optimistic update
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.uid === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      await toggleMenuItemStatus(id, currentStatus);
      toast.success(`Item status changed to ${newStatus}!`);
      await fetchStatistics();
      
    } catch (err) {
      // Revert on error
      setMenuItems(originalMenuItems);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle status';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Get menu item count by category
  const getMenuItemCountByCategory = async (categoryId: string): Promise<number> => {
    try {
      return await getMenuItemCountByCategory(categoryId);
    } catch (err) {
      console.error('Error fetching count:', err);
      return 0;
    }
  };

  return (
    <MenusContext.Provider
      value={{
        menuItems,
        loading,
        error,
        statistics,
        fetchMenuItems,
        fetchMenuItemsByCategory,
        handleAddMenuItem,
        handleUpdateMenuItem,
        handleDeleteMenuItem,
        handleToggleStatus,
        getMenuItemCountByCategory,
        fetchStatistics
      }}
    >
      {children}
    </MenusContext.Provider>
  );
};

export const useMenusContext = () => {
  const context = useContext(MenusContext);
  if (context === undefined) {
    throw new Error('useMenusContext must be used within a MenusProvider');
  }
  return context;
};