// src/store/CategoriesContext/CategoriesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  computeCategoryStatistics,
  type Category,
} from "../../service/categories/categories.service";
import { toast } from "react-hot-toast";
import { invalidatePublicMenuCache } from "../../hooks/usePublicMenuCache";

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
  handleAddCategory: (
    categoryData: Omit<Category, "uid" | "createdAt" | "updatedAt" | "items">,
    placeOrder?: number,
  ) => Promise<string>;
  handleUpdateCategory: (
    id: string,
    categoryData: Partial<Omit<Category, "uid" | "createdAt" | "items">>,
  ) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
  handleToggleStatus: (
    id: string,
    currentStatus: "active" | "inactive",
  ) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  // FIX: refreshCategories now just recomputes from existing state — 0 reads
  refreshCategories: () => Promise<void>;
  // FIX: direct state setter for MenusContext to update item counts without a read
  updateCategoryItemCount: (categoryId: string, delta: number) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<CategoryStatistics | null>(null);

  // FIX: Single helper that sets both categories and statistics from one array
  const setCategoriesAndStats = (data: Category[]) => {
    setCategories(data);
    setStatistics(computeCategoryStatistics(data));
  };

  // Fetch all categories — ONE read, compute stats from result (not a second read)
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();
      setCategoriesAndStats(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch categories";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // FIX: refreshCategories no longer hits Firestore — just recomputes stats from current state
  // MenusContext calls this; now it's free (0 reads)
  const refreshCategories = async () => {
    setStatistics(computeCategoryStatistics(categories));
  };

  // FIX: Called by MenusContext when a menu item is added/deleted
  // Directly mutates the items count in state — 0 Firestore reads
  const updateCategoryItemCount = (categoryId: string, delta: number) => {
    setCategories((prev) => {
      const updated = prev.map((cat) =>
        cat.uid === categoryId
          ? { ...cat, items: Math.max(0, (cat.items || 0) + delta) }
          : cat,
      );
      setStatistics(computeCategoryStatistics(updated));
      return updated;
    });
  };

  // FIX: fetchStatistics now just recomputes from state (0 reads)
  const fetchStatistics = async () => {
    setStatistics(computeCategoryStatistics(categories));
  };

  // Load categories once on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  // FIX: service returns updated list locally — no second fetchCategories() call
  const handleAddCategory = async (
    categoryData: Omit<Category, "uid" | "createdAt" | "updatedAt" | "items">,
    placeOrder?: number,
  ) => {
    try {
      const { id, updatedCategories } = await addCategory(
        categoryData,
        placeOrder,
        categories,
      );
      setCategoriesAndStats(updatedCategories);
      toast.success("Category added successfully!");
      invalidatePublicMenuCache();
      return id;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add category";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update category
  // FIX: service returns updated list locally — no fetchCategories() call
  const handleUpdateCategory = async (
    id: string,
    categoryData: Partial<Omit<Category, "uid" | "createdAt" | "items">>,
  ) => {
    const originalCategories = [...categories];

    // Optimistic update immediately
    setCategories((prev) =>
      prev
        .map((cat) => (cat.uid === id ? { ...cat, ...categoryData } : cat))
        .sort((a, b) => a.placeOrder - b.placeOrder),
    );

    try {
      const { updatedCategories } = await updateCategory(
        id,
        categoryData,
        categories,
      );
      setCategoriesAndStats(updatedCategories);
      toast.success("Category updated successfully!");
      invalidatePublicMenuCache();
    } catch (err) {
      setCategoriesAndStats(originalCategories);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update category";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete category
  // FIX: service returns updated list locally — no fetchCategories() call
  const handleDeleteCategory = async (id: string) => {
    const originalCategories = [...categories];

    // Optimistic update
    setCategories((prev) => prev.filter((cat) => cat.uid !== id));

    try {
      const { updatedCategories } = await deleteCategory(id, categories);
      setCategoriesAndStats(updatedCategories);
      toast.success("Category deleted successfully!");
      invalidatePublicMenuCache();
    } catch (err) {
      setCategoriesAndStats(originalCategories);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete category";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Toggle status — optimistic, no re-fetch
  const handleToggleStatus = async (
    id: string,
    currentStatus: "active" | "inactive",
  ) => {
    const originalCategories = [...categories];
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const updated = categories.map((cat) =>
      cat.uid === id ? { ...cat, status: newStatus } : cat,
    ) as Category[];
    setCategoriesAndStats(updated);

    try {
      await toggleCategoryStatus(id, currentStatus);
      toast.success(`Category status changed to ${newStatus}!`);
      invalidatePublicMenuCache();
    } catch (err) {
      setCategoriesAndStats(originalCategories);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle status";
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
        refreshCategories,
        updateCategoryItemCount,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error(
      "useCategoriesContext must be used within a CategoriesProvider",
    );
  }
  return context;
};
