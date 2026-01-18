// // src/hooks/Categories/useCategories.ts
// import { useState, useEffect } from 'react';
// import { 
//   getAllCategories, 
//   addCategory, 
//   updateCategory, 
//   deleteCategory,
//   getCategoryById,
//  type Category 
// } from '../../../service/categories/categories.service';
// import { toast } from 'react-hot-toast';

// export const useCategories = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getAllCategories();
//       setCategories(data);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load categories on mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Add new category
//   const handleAddCategory = async (categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt'>) => {
//     try {
//       setLoading(true);
//       const newId = await addCategory(categoryData);
//       toast.success('Category added successfully!');
//       await fetchCategories(); // Refresh list
//       return newId;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to add category';
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update category
//   const handleUpdateCategory = async (id: string, categoryData: Partial<Omit<Category, 'uid' | 'createdAt'>>) => {
//     try {
//       setLoading(true);
//       await updateCategory(id, categoryData);
//       toast.success('Category updated successfully!');
//       await fetchCategories(); // Refresh list
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete category
//   const handleDeleteCategory = async (id: string) => {
//     try {
//       setLoading(true);
//       await deleteCategory(id);
//       toast.success('Category deleted successfully!');
//       await fetchCategories(); // Refresh list
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     categories,
//     loading,
//     error,
//     fetchCategories,
//     handleAddCategory,
//     handleUpdateCategory,
//     handleDeleteCategory
//   };
// };