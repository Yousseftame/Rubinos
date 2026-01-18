// src/store/CategoriesContext/CategoriesContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAllCategories, 
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoryStatistics,
  type Category 
} from '../../service/categories/categories.service';
import { toast } from 'react-hot-toast';

interface CategoryStatistics {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalItems: number;
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  statistics: CategoryStatistics | null;
  fetchCategories: () => Promise<void>;
  handleAddCategory: (categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt' | 'items'>) => Promise<string>;
  handleUpdateCategory: (id: string, categoryData: Partial<Omit<Category, 'uid' | 'createdAt' | 'items'>>) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
  handleToggleStatus: (id: string, currentStatus: 'active' | 'inactive') => Promise<void>;
  fetchStatistics: () => Promise<void>;
  refreshCategories: () => Promise<void>; // Exposed for menu module to use
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<CategoryStatistics | null>(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Refresh categories (without loading state, for real-time updates)
  const refreshCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
      await fetchStatistics();
    } catch (err) {
      console.error('Error refreshing categories:', err);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const stats = await getCategoryStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
    fetchStatistics();
  }, []);

  // Add new category (optimistic update)
  const handleAddCategory = async (categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt' | 'items'>) => {
    try {
      const newId = await addCategory(categoryData);
      toast.success('Category added successfully!');
      await fetchCategories();
      await fetchStatistics();
      return newId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add category';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update category (optimistic update)
  const handleUpdateCategory = async (id: string, categoryData: Partial<Omit<Category, 'uid' | 'createdAt' | 'items'>>) => {
    const originalCategories = [...categories];
    
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.uid === id ? { ...cat, ...categoryData } : cat
      )
    );

    try {
      await updateCategory(id, categoryData);
      toast.success('Category updated successfully!');
    } catch (err) {
      setCategories(originalCategories);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete category (optimistic update)
  const handleDeleteCategory = async (id: string) => {
    const originalCategories = [...categories];
    
    setCategories(prevCategories => prevCategories.filter(cat => cat.uid !== id));

    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully!');
      await fetchStatistics();
    } catch (err) {
      setCategories(originalCategories);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Toggle status
  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    const originalCategories = [...categories];
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.uid === id ? { ...cat, status: newStatus } : cat
      )
    );

    try {
      await toggleCategoryStatus(id, currentStatus);
      toast.success(`Category status changed to ${newStatus}!`);
      await fetchStatistics();
    } catch (err) {
      setCategories(originalCategories);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle status';
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        statistics,
        fetchCategories,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        handleToggleStatus,
        fetchStatistics,
        refreshCategories
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider');
  }
  return context;
};