// src/store/CategoriesContext/CategoriesContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAllCategories, 
  addCategory,
  updateCategory,
  deleteCategory,
  type Category 
} from '../../service/categories/categories.service';
import { toast } from 'react-hot-toast';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  handleAddCategory: (categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  handleUpdateCategory: (id: string, categoryData: Partial<Omit<Category, 'uid' | 'createdAt'>>) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category (optimistic update)
  const handleAddCategory = async (categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = await addCategory(categoryData);
      toast.success('Category added successfully!');
      await fetchCategories(); // Refresh list
      return newId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add category';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update category (optimistic update)
  const handleUpdateCategory = async (id: string, categoryData: Partial<Omit<Category, 'uid' | 'createdAt'>>) => {
    // Store original state for rollback
    const originalCategories = [...categories];
    
    // Optimistic update - update UI immediately
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.uid === id ? { ...cat, ...categoryData } : cat
      )
    );

    try {
      await updateCategory(id, categoryData);
      toast.success('Category updated successfully!');
    } catch (err) {
      // Revert on error
      setCategories(originalCategories);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete category (optimistic update)
  const handleDeleteCategory = async (id: string) => {
    // Store original state for rollback
    const originalCategories = [...categories];
    
    // Optimistic update - remove from UI immediately
    setCategories(prevCategories => prevCategories.filter(cat => cat.uid !== id));

    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully!');
    } catch (err) {
      // Revert on error
      setCategories(originalCategories);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
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
        fetchCategories,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory
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