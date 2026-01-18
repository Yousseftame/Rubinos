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
  items: number; // Stored in Firestore directly
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'categories';
const MENU_COLLECTION = 'menu';

// Get all categories - FAST (no queries needed, items stored in doc)
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(categoriesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        items: data.items || 0 // Use stored items count
      };
    }) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Get active categories only - FAST
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(
      categoriesRef, 
      where('status', '==', 'active'),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        items: data.items || 0
      };
    }) as Category[];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    throw new Error('Failed to fetch active categories');
  }
};

// Get category by ID - FAST
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id);
    const categoryDoc = await getDoc(categoryRef);
    
    if (categoryDoc.exists()) {
      const data = categoryDoc.data();
      return {
        uid: categoryDoc.id,
        ...data,
        items: data.items || 0
      } as Category;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
};

// Get menu items count by category ID - for verification only
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

// Add new category with items = 0
export const addCategory = async (categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt' | 'items'>): Promise<string> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(categoriesRef, {
      ...categoryData,
      items: 0, // Start with 0 items
      status: categoryData.status || 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
};

// Update category
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'uid' | 'createdAt' | 'items'>>): Promise<void> => {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(categoryRef);
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
        items: Math.max(0, currentItems + amount), // Never go below 0
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error incrementing category items count:', error);
  }
};

// Get category statistics - OPTIMIZED
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
    
    // Items count is already in Firestore, just sum them up
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