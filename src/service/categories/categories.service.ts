// src/service/categories/categories.service.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
   
  updateDoc, 
 
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
  placeOrder: number;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'categories';

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

// FIX: Compute statistics from already-loaded categories array (0 extra reads)
export const computeCategoryStatistics = (categories: Category[]) => {
  return {
    totalCategories: categories.length,
    activeCategories: categories.filter(cat => cat.status === 'active').length,
    inactiveCategories: categories.filter(cat => cat.status === 'inactive').length,
    totalItems: categories.reduce((sum, cat) => sum + (cat.items || 0), 0),
  };
};

// Add new category
// FIX: Returns the full updated categories array so context doesn't need a re-fetch
export const addCategory = async (
  categoryData: Omit<Category, 'uid' | 'createdAt' | 'updatedAt' | 'items'>,
  placeOrder?: number,
  existingCategories?: Category[]
): Promise<{ id: string; updatedCategories: Category[] }> => {
  try {
    const allCategories = existingCategories ?? await getAllCategories();
    const finalPlaceOrder = placeOrder ?? (allCategories.length > 0
      ? Math.max(...allCategories.map(c => c.placeOrder || 0)) + 1
      : 1);

    const batch = writeBatch(db);
    const categoriesRef = collection(db, COLLECTION_NAME);

    // FIX: If inserting at a specific position, shift in the same batch
    if (placeOrder !== undefined) {
      allCategories.forEach(cat => {
        if (cat.placeOrder >= finalPlaceOrder) {
          const catRef = doc(db, COLLECTION_NAME, cat.uid!);
          batch.update(catRef, {
            placeOrder: cat.placeOrder + 1,
            updatedAt: serverTimestamp()
          });
        }
      });
    }

    // Add the new doc with correct placeOrder immediately (no temp 999999)
    const newDocRef = doc(categoriesRef);
    batch.set(newDocRef, {
      name: categoryData.name,
      description: categoryData.description || '',
      status: categoryData.status || 'active',
      items: 0,
      placeOrder: finalPlaceOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();

    // Build updated list locally — no extra Firestore read
    const newCategory: Category = {
      uid: newDocRef.id,
      name: categoryData.name,
      description: categoryData.description || '',
      status: categoryData.status || 'active',
      items: 0,
      placeOrder: finalPlaceOrder,
    };

    let updatedCategories = allCategories.map(cat =>
      cat.placeOrder >= finalPlaceOrder && placeOrder !== undefined
        ? { ...cat, placeOrder: cat.placeOrder + 1 }
        : cat
    );
    updatedCategories = [...updatedCategories, newCategory].sort((a, b) => a.placeOrder - b.placeOrder);

    return { id: newDocRef.id, updatedCategories };
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
};

// Update category
// FIX: Returns locally-computed updated list — no re-fetch needed
export const updateCategory = async (
  id: string,
  categoryData: Partial<Omit<Category, 'uid' | 'createdAt' | 'items'>>,
  existingCategories?: Category[]
): Promise<{ updatedCategories: Category[] }> => {
  try {
    const allCategories = existingCategories ?? await getAllCategories();
    const currentCategory = allCategories.find(c => c.uid === id);
    if (!currentCategory) throw new Error('Category not found');

    const batch = writeBatch(db);

    // Handle placeOrder swap in the same batch
    if (categoryData.placeOrder !== undefined && categoryData.placeOrder !== currentCategory.placeOrder) {
      const categoryAtTarget = allCategories.find(cat => cat.placeOrder === categoryData.placeOrder);
      if (categoryAtTarget && categoryAtTarget.uid !== id) {
        const targetRef = doc(db, COLLECTION_NAME, categoryAtTarget.uid!);
        batch.update(targetRef, {
          placeOrder: currentCategory.placeOrder,
          updatedAt: serverTimestamp()
        });
      }
    }

    const updateData: any = { updatedAt: serverTimestamp() };
    if (categoryData.name !== undefined) updateData.name = categoryData.name;
    if (categoryData.description !== undefined) updateData.description = categoryData.description;
    if (categoryData.status !== undefined) updateData.status = categoryData.status;
    if (categoryData.placeOrder !== undefined) updateData.placeOrder = categoryData.placeOrder;

    const categoryRef = doc(db, COLLECTION_NAME, id);
    batch.update(categoryRef, updateData);
    await batch.commit();

    // Build updated list locally
    let updatedCategories = allCategories.map(cat => {
      if (cat.uid === id) return { ...cat, ...categoryData };
      if (
        categoryData.placeOrder !== undefined &&
        cat.placeOrder === categoryData.placeOrder &&
        cat.uid !== id
      ) {
        return { ...cat, placeOrder: currentCategory.placeOrder };
      }
      return cat;
    });
    updatedCategories.sort((a, b) => a.placeOrder - b.placeOrder);

    return { updatedCategories };
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

// Delete category
// FIX: Returns locally-computed updated list — no re-fetch needed
export const deleteCategory = async (
  id: string,
  existingCategories?: Category[]
): Promise<{ updatedCategories: Category[] }> => {
  try {
    const allCategories = existingCategories ?? await getAllCategories();
    const category = allCategories.find(c => c.uid === id);
    if (!category) return { updatedCategories: allCategories };

    const batch = writeBatch(db);

    // Delete the document
    const categoryRef = doc(db, COLLECTION_NAME, id);
    batch.delete(categoryRef);

    // Shift remaining items down
    allCategories.forEach(cat => {
      if (cat.placeOrder > category.placeOrder) {
        const catRef = doc(db, COLLECTION_NAME, cat.uid!);
        batch.update(catRef, {
          placeOrder: cat.placeOrder - 1,
          updatedAt: serverTimestamp()
        });
      }
    });

    await batch.commit();

    // Build updated list locally
    const updatedCategories = allCategories
      .filter(cat => cat.uid !== id)
      .map(cat => cat.placeOrder > category.placeOrder
        ? { ...cat, placeOrder: cat.placeOrder - 1 }
        : cat
      )
      .sort((a, b) => a.placeOrder - b.placeOrder);

    return { updatedCategories };
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

// Increment/decrement category items count (called by menus service)
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

// KEPT for backwards compatibility but use computeCategoryStatistics instead
export const getCategoryStatistics = async () => {
  const categories = await getAllCategories();
  return computeCategoryStatistics(categories);
};

// KEPT for backwards compat
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, COLLECTION_NAME);
    const q = query(
      categoriesRef, 
      where('status', '==', 'active'),
      orderBy('placeOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      items: doc.data().items || 0,
      placeOrder: doc.data().placeOrder || 0
    })) as Category[];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    throw new Error('Failed to fetch active categories');
  }
};