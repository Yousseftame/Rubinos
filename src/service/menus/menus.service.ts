// src/service/menus/menus.service.ts
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
import { 
  ref, 
  uploadBytes, 
  deleteObject, 
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { incrementCategoryItemsCount } from '../categories/categories.service';

export interface MenuItem {
  uid?: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'menu';
const STORAGE_BASE = 'menu';

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuRef = collection(db, COLLECTION_NAME);
    const q = query(menuRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as MenuItem[];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Failed to fetch menu items');
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
  try {
    const menuRef = collection(db, COLLECTION_NAME);
    const q = query(
      menuRef,
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as MenuItem[];
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    throw new Error('Failed to fetch menu items');
  }
};

// Get menu item by ID
export const getMenuItemById = async (id: string): Promise<MenuItem | null> => {
  try {
    const menuItemRef = doc(db, COLLECTION_NAME, id);
    const menuItemDoc = await getDoc(menuItemRef);
    
    if (menuItemDoc.exists()) {
      return {
        uid: menuItemDoc.id,
        ...menuItemDoc.data()
      } as MenuItem;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw new Error('Failed to fetch menu item');
  }
};

// Upload image to storage
const uploadMenuImage = async (
  menuItemId: string,
  file: File,
  index: number
): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${index}.${fileExtension}`;
    // FIX: simplified path — no category name in path (avoids the "move images" problem)
    const storagePath = `${STORAGE_BASE}/${menuItemId}/${fileName}`;
    
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

// Delete image from storage
const deleteMenuImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    // Don't throw — image might already be deleted or URL might be invalid
    console.error('Error deleting image (non-fatal):', error);
  }
};

// FIX: REMOVED moveImagesToNewCategory entirely.
// Images stay in their original storage path when category changes.
// Only the categoryId/categoryName fields in Firestore are updated.
// This eliminates: fetch(imageUrl) → re-upload → delete old — which was a massive spike.

// Add new menu item with images
export const addMenuItem = async (
  menuData: Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt' | 'images'>,
  imageFiles: File[]
): Promise<string> => {
  try {
    const menuRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(menuRef, {
      ...menuData,
      images: [],
      status: menuData.status || 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Upload images (if any) in parallel for speed
    const imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map((file, i) =>
        uploadMenuImage(docRef.id, file, i).catch(err => {
          console.error(`Error uploading image ${i}:`, err);
          return null;
        })
      );
      const results = await Promise.all(uploadPromises);
      results.forEach(url => { if (url) imageUrls.push(url); });

      await updateDoc(docRef, {
        images: imageUrls,
        updatedAt: serverTimestamp()
      });
    }

    // Increment category items count
    await incrementCategoryItemsCount(menuData.categoryId, 1);

    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw new Error('Failed to add menu item');
  }
};

// Update menu item with images
// FIX: No more moveImagesToNewCategory — just update Firestore fields
export const updateMenuItem = async (
  id: string,
  menuData: Partial<Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt'>>,
  imageFiles?: File[],
  imagesToDelete?: string[]
): Promise<void> => {
  try {
    const currentItem = await getMenuItemById(id);
    if (!currentItem) throw new Error('Menu item not found');

    let updatedImages = [...(currentItem.images || [])];

    // FIX: Category change — just update the Firestore fields, don't move storage files
    // Images stay at their original storage paths. This eliminates the massive HTTP fetch+reupload spike.

    // Delete specific images if needed (parallel)
    if (imagesToDelete && imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(url => deleteMenuImage(url)));
      updatedImages = updatedImages.filter(img => !imagesToDelete.includes(img));
    }

    // Upload new images in parallel
    if (imageFiles && imageFiles.length > 0) {
      const uploadPromises = imageFiles.map((file, i) =>
        uploadMenuImage(id, file, i).catch(err => {
          console.error(`Error uploading image ${i}:`, err);
          return null;
        })
      );
      const results = await Promise.all(uploadPromises);
      results.forEach(url => { if (url) updatedImages.push(url); });
    }

    const updateData: any = {
      ...menuData,
      images: updatedImages,
      updatedAt: serverTimestamp()
    };

    const menuItemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(menuItemRef, updateData);

    // Update counts for category change
    if (menuData.categoryId && menuData.categoryId !== currentItem.categoryId) {
      await Promise.all([
        incrementCategoryItemsCount(currentItem.categoryId, -1),
        incrementCategoryItemsCount(menuData.categoryId, 1),
      ]);
    }
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw new Error('Failed to update menu item');
  }
};

// Delete menu item and all its images
export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const menuItem = await getMenuItemById(id);
    if (!menuItem) return;

    // Delete all images from storage in parallel
    if (menuItem.images && menuItem.images.length > 0) {
      await Promise.all(menuItem.images.map(url => deleteMenuImage(url)));
    }

    // Delete menu item document
    const menuItemRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(menuItemRef);

    // Decrement category items count
    await incrementCategoryItemsCount(menuItem.categoryId, -1);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw new Error('Failed to delete menu item');
  }
};

// Toggle menu item status
export const toggleMenuItemStatus = async (id: string, currentStatus: 'active' | 'inactive'): Promise<void> => {
  try {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const menuItemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(menuItemRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling menu item status:', error);
    throw new Error('Failed to toggle menu item status');
  }
};

// FIX: computeMenuStatistics — compute from already-loaded array (0 extra reads)
export const computeMenuStatistics = (items: MenuItem[]) => {
  const totalByCategory: Record<string, number> = {};
  items.forEach(item => {
    totalByCategory[item.categoryName] = (totalByCategory[item.categoryName] || 0) + 1;
  });
  return {
    totalItems: items.length,
    activeItems: items.filter(item => item.status === 'active').length,
    inactiveItems: items.filter(item => item.status === 'inactive').length,
    totalByCategory,
  };
};

// KEPT for backwards compat
export const getMenuStatistics = async () => {
  const items = await getAllMenuItems();
  return computeMenuStatistics(items);
};

export const getMenuItemCountByCategory = async (categoryId: string): Promise<number> => {
  try {
    const menuRef = collection(db, COLLECTION_NAME);
    const q = query(menuRef, where('categoryId', '==', categoryId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching menu item count:', error);
    return 0;
  }
};