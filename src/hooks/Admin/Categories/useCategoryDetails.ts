// src/hooks/Categories/useCategoryDetails.ts
import { useState, useEffect } from 'react';
import { getCategoryById, type Category } from '../../../service/categories/categories.service';
import { toast } from 'react-hot-toast';

export const useCategoryDetails = (categoryId: string | undefined) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryById(categoryId);
        
        if (data) {
          setCategory(data);
        } else {
          setError('Category not found');
          toast.error('Category not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  return {
    category,
    loading,
    error
  };
};