// src/store/MenusContext/MenusContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  toggleMenuItemStatus,
  computeMenuStatistics,
  type MenuItem,
} from "../../service/menus/menus.service";
import { toast } from "react-hot-toast";
import { useCategoriesContext } from "../CategoriesContext/CategoriesContext";

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
    menuData: Omit<MenuItem, "uid" | "createdAt" | "updatedAt" | "images">,
    imageFiles: File[],
  ) => Promise<string>;
  handleUpdateMenuItem: (
    id: string,
    menuData: Partial<Omit<MenuItem, "uid" | "createdAt" | "updatedAt">>,
    imageFiles?: File[],
    imagesToDelete?: string[],
  ) => Promise<void>;
  handleDeleteMenuItem: (id: string) => Promise<void>;
  handleToggleStatus: (
    id: string,
    currentStatus: "active" | "inactive",
  ) => Promise<void>;
  getMenuItemCountByCategory: (categoryId: string) => Promise<number>;
  fetchStatistics: () => Promise<void>;
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

export const MenusProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<MenuStatistics | null>(null);

  // FIX: Use updateCategoryItemCount instead of refreshCategories
  // refreshCategories was doing a full Firestore read; updateCategoryItemCount is free
  const { updateCategoryItemCount } = useCategoriesContext();

  // FIX: Single helper to set items and recompute stats from same array (0 extra reads)
  const setItemsAndStats = (items: MenuItem[]) => {
    setMenuItems(items);
    setStatistics(computeMenuStatistics(items));
  };

  // Fetch all menu items — ONE read, compute stats from result
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMenuItems();
      setItemsAndStats(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch menu items";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // FIX: fetchStatistics just recomputes from current state (0 reads)
  const fetchStatistics = async () => {
    setStatistics(computeMenuStatistics(menuItems));
  };

  // Fetch menu items by category
  const fetchMenuItemsByCategory = async (
    categoryId: string,
  ): Promise<MenuItem[]> => {
    try {
      return await getMenuItemsByCategory(categoryId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch menu items";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Load menu items once on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Add new menu item
  // FIX: after add, refresh list (needed for server-generated image URLs)
  //      then update category count locally — 0 extra reads
  const handleAddMenuItem = async (
    menuData: Omit<MenuItem, "uid" | "createdAt" | "updatedAt" | "images">,
    imageFiles: File[],
  ) => {
    try {
      const newId = await addMenuItem(menuData, imageFiles);
      toast.success("Menu item added successfully!");
      // Refresh list to get image URLs from storage
      await fetchMenuItems();
      // FIX: update category item count locally — replaces refreshCategories() (0 reads)
      updateCategoryItemCount(menuData.categoryId, 1);
      return newId;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add menu item";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update menu item
  const handleUpdateMenuItem = async (
    id: string,
    menuData: Partial<Omit<MenuItem, "uid" | "createdAt" | "updatedAt">>,
    imageFiles?: File[],
    imagesToDelete?: string[],
  ) => {
    const originalMenuItems = [...menuItems];

    // Optimistic update
    setMenuItems((prev) =>
      prev.map((item) => (item.uid === id ? { ...item, ...menuData } : item)),
    );

    try {
      // Find current item for category change detection
      const currentItem = menuItems.find((item) => item.uid === id);

      await updateMenuItem(id, menuData, imageFiles, imagesToDelete);
      toast.success("Menu item updated successfully!");

      // Refresh to get updated image URLs
      await fetchMenuItems();

      // FIX: update category counts locally if category changed — 0 reads
      if (
        menuData.categoryId &&
        currentItem &&
        menuData.categoryId !== currentItem.categoryId
      ) {
        updateCategoryItemCount(currentItem.categoryId, -1);
        updateCategoryItemCount(menuData.categoryId, 1);
      }
    } catch (err) {
      setItemsAndStats(originalMenuItems);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update menu item";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (id: string) => {
    const originalMenuItems = [...menuItems];
    const itemToDelete = menuItems.find((item) => item.uid === id);

    // Optimistic update
    const updatedItems = menuItems.filter((item) => item.uid !== id);
    setItemsAndStats(updatedItems);

    try {
      await deleteMenuItem(id);
      toast.success("Menu item deleted successfully!");
      // FIX: update category count locally — 0 reads
      if (itemToDelete) {
        updateCategoryItemCount(itemToDelete.categoryId, -1);
      }
    } catch (err) {
      setItemsAndStats(originalMenuItems);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete menu item";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Toggle status
  const handleToggleStatus = async (
    id: string,
    currentStatus: "active" | "inactive",
  ) => {
    const originalMenuItems = [...menuItems];
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const updated = menuItems.map((item) =>
      item.uid === id
        ? { ...item, status: newStatus as "active" | "inactive" }
        : item,
    );
    setItemsAndStats(updated);

    try {
      await toggleMenuItemStatus(id, currentStatus);
      toast.success(`Item status changed to ${newStatus}!`);
    } catch (err) {
      setItemsAndStats(originalMenuItems);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle status";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Get menu item count by category (kept for external use)
  const getMenuItemCountByCategory = async (
    _categoryId: string,
  ): Promise<number> => {
    // FIX: compute from state instead of hitting Firestore
    return menuItems.filter((item) => item.categoryId === _categoryId).length;
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
        fetchStatistics,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
};

export const useMenusContext = () => {
  const context = useContext(MenusContext);
  if (context === undefined) {
    throw new Error("useMenusContext must be used within a MenusProvider");
  }
  return context;
};
