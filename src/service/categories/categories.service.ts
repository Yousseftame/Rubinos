// src/service/categories/categories.service.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Category {
  uid?: string;
  name: string;
  description: string;
  items: number;
  placeOrder: number; // NEW: Added placeOrder
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'categories';
const MENU_COLLECTION = 'menu';

// Get all categories ordered by placeOrder
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(categoriesRef, orderBy('placeOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        items: data.items || 0,
        placeOrder: data.placeOrder || 0
      };
    }) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Get active categories only
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(
      categoriesRef, 
      where('status', '==', 'active'),
      orderBy('placeOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        items: data.items || 0,
        placeOrder: data.placeOrder || 0
      };
    }) as Category[];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    throw new Error('Failed to fetch active categories');
  }
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id);
    const categoryDoc = await getDoc(categoryRef);
    
    if (categoryDoc.exists()) {
      const data = categoryDoc.data();
      return {
        uid: categoryDoc.id,
        ...data,
        items: data.items || 0,
        placeOrder: data.placeOrder || 0
      } as Category;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
};

// Get menu items count by category ID
export const getMenuItemsCountByCategory = async (categoryId: string): Promise<number> => {
  try {
    const menuRef = collection(db, MENU_COLLECTION);
    const q = query(menuRef, where('categoryId', '==', categoryId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching menu items count:', error);
    return 0;
  }
};

// Get the next available placeOrder
const getNextPlaceOrder = async (): Promise<number> => {
  try {
    const categories = await getAllCategories();
    if (categories.length === 0) return 1;
    
    const maxOrder = Math.max(...categories.map(cat => cat.placeOrder || 0));
    return maxOrder + 1;
  } catch (error) {
    console.error('Error getting next place order:', error);
    return 1;
  }
};

// Swap categories when editing (true swap behavior)
const swapCategories = async (
  categoryId: string,
  newPlaceOrder: number,
  oldPlaceOrder: number
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const categories = await getAllCategories();
    
    // Find the category currently at the target position
    const categoryAtTargetPosition = categories.find(cat => cat.placeOrder === newPlaceOrder);
    
    if (categoryAtTargetPosition && categoryAtTargetPosition.uid !== categoryId) {
      // SWAP: Give the target category the old position
      const targetCategoryRef = doc(db, COLLECTION_NAME, categoryAtTargetPosition.uid!);
      batch.update(targetCategoryRef, {
        placeOrder: oldPlaceOrder,
        updatedAt: serverTimestamp()
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error swapping categories:', error);
    throw new Error('Failed to swap categories');
  }
};

// Insert category at position (for new categories - shifts other items)
const insertCategoryAtPosition = async (
  newCategoryId: string,
  newPlaceOrder: number
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const categories = await getAllCategories();
    
    // Shift all categories at or after newPlaceOrder down by 1
    categories.forEach(cat => {
      if (cat.uid !== newCategoryId && cat.placeOrder >= newPlaceOrder) {
        const categoryRef = doc(db, COLLECTION_NAME, cat.uid!);
        batch.update(categoryRef, {
          placeOrder: cat.placeOrder + 1,
          updatedAt: serverTimestamp()
        });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error inserting category:', error);
    throw new Error('Failed to insert category');
  }
};

// Add new category
export const addCategory = async (
  categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt' | 'items'>,
  placeOrder?: number
): Promise<string> => {
  try {
    // Get final place order
    const finalPlaceOrder = placeOrder ?? await getNextPlaceOrder();
    
    // Create document with temporary high placeOrder
    const categoriesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(categoriesRef, {
      name: categoryData.name,
      description: categoryData.description || '',
      status: categoryData.status || 'active',
      items: 0,
      placeOrder: 999999, // Temporary high number
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Shift other categories if inserting at specific position
    if (placeOrder !== undefined) {
      await insertCategoryAtPosition(docRef.id, finalPlaceOrder);
    }
    
    // Update with final placeOrder
    await updateDoc(docRef, {
      placeOrder: finalPlaceOrder,
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
};

// Update category
export const updateCategory = async (
  id: string,
  categoryData: Partial<Omit<Category, 'uid' | 'createdAt' | 'items'>>
): Promise<void> => {
  try {
    const currentCategory = await getCategoryById(id);
    if (!currentCategory) throw new Error('Category not found');

    // Handle placeOrder change - SWAP logic
    if (categoryData.placeOrder !== undefined && categoryData.placeOrder !== currentCategory.placeOrder) {
      await swapCategories(id, categoryData.placeOrder, currentCategory.placeOrder);
    }

    // Update document
    const updateData: any = {
      updatedAt: serverTimestamp()
    };

    if (categoryData.name !== undefined) {
      updateData.name = categoryData.name;
    }
    if (categoryData.description !== undefined) {
      updateData.description = categoryData.description;
    }
    if (categoryData.status !== undefined) {
      updateData.status = categoryData.status;
    }
    if (categoryData.placeOrder !== undefined) {
      updateData.placeOrder = categoryData.placeOrder;
    }

    const categoryRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(categoryRef, updateData);
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const category = await getCategoryById(id);
    if (!category) return;

    // Delete document
    const categoryRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(categoryRef);

    // Reorder remaining categories to fill the gap
    const batch = writeBatch(db);
    const categories = await getAllCategories();
    
    categories.forEach(cat => {
      if (cat.placeOrder > category.placeOrder) {
        const catRef = doc(db, COLLECTION_NAME, cat.uid!);
        batch.update(catRef, { 
          placeOrder: cat.placeOrder - 1,
          updatedAt: serverTimestamp()
        });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};

// Toggle category status
export const toggleCategoryStatus = async (id: string, currentStatus: 'active' | 'inactive'): Promise<void> => {
  try {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const categoryRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(categoryRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw new Error('Failed to toggle category status');
  }
};

// Increment category items count
export const incrementCategoryItemsCount = async (categoryId: string, amount: number = 1): Promise<void> => {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, categoryId);
    const categoryDoc = await getDoc(categoryRef);
    
    if (categoryDoc.exists()) {
      const currentItems = categoryDoc.data().items || 0;
      await updateDoc(categoryRef, {
        items: Math.max(0, currentItems + amount),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error incrementing category items count:', error);
  }
};

// Get category statistics
export const getCategoryStatistics = async (): Promise<{
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalItems: number;
}> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(categoriesRef);
    
    const categories = querySnapshot.docs.map(doc => doc.data()) as Category[];
    
    let totalItems = 0;
    categories.forEach(cat => {
      totalItems += cat.items || 0;
    });

    return {
      totalCategories: categories.length,
      activeCategories: categories.filter(cat => cat.status === 'active').length,
      inactiveCategories: categories.filter(cat => cat.status === 'inactive').length,
      totalItems
    };
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    throw new Error('Failed to fetch category statistics');
  }
};