// src/services/categories.service.ts
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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Category {
  uid?: string;
  name: string;
  description: string;
  items: number;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'categories';

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(categoriesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as Category[];
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
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as Category[];
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
      return {
        uid: categoryDoc.id,
        ...categoryDoc.data()
      } as Category;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
};

// Add new category
export const addCategory = async (categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(categoriesRef, {
      ...categoryData,
      items: categoryData.items || 0,
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
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'uid' | 'createdAt'>>): Promise<void> => {
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
    await updateCategory(id, { status: newStatus });
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw new Error('Failed to toggle category status');
  }
};

// Update category items count
export const updateCategoryItemsCount = async (id: string, count: number): Promise<void> => {
  try {
    await updateCategory(id, { items: count });
  } catch (error) {
    console.error('Error updating category items count:', error);
    throw new Error('Failed to update category items count');
  }
};