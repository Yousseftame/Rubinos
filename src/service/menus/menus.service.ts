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
  getDownloadURL,
  listAll
} from 'firebase/storage';
import { db, storage } from '../firebase';

export interface MenuItem {
  uid?: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  categoryName: string; // Store category name for storage path
  images: string[]; // Array of download URLs
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

// Upload image to storage with category name in path
const uploadMenuImage = async (
  categoryName: string,
  menuItemId: string,
  file: File,
  index: number
): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${index}.${fileExtension}`;
    // Use category name instead of ID in storage path
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
    console.error('Error deleting image:', error);
    // Don't throw - image might already be deleted
  }
};

// Move images to new category folder when category changes
const moveImagesToNewCategory = async (
  oldCategoryName: string,
  newCategoryName: string,
  menuItemId: string,
  images: string[]
): Promise<string[]> => {
  try {
    if (oldCategoryName === newCategoryName || images.length === 0) {
      return images;
    }

    const newImageUrls: string[] = [];

    for (const imageUrl of images) {
      try {
        // Extract file name from URL
        const urlPath = new URL(imageUrl).pathname;
        const fileName = urlPath.split('/').pop() || `${Date.now()}.jpg`;
        
        // Get the image data
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });

        // Upload to new location
        const newUrl = await uploadMenuImage(newCategoryName, menuItemId, file, 0);
        newImageUrls.push(newUrl);

        // Delete from old location
        await deleteMenuImage(imageUrl);
      } catch (error) {
        console.error('Error moving image:', error);
        // Keep original URL if move fails
        newImageUrls.push(imageUrl);
      }
    }

    return newImageUrls;
  } catch (error) {
    console.error('Error moving images to new category:', error);
    return images;
  }
};

// Add new menu item with images
export const addMenuItem = async (
  menuData: Omit<MenuItem, 'uid' | 'createdAt' | 'updatedAt' | 'images'>,
  imageFiles: File[]
): Promise<string> => {
  try {
    // First, create the menu item without images
    const menuRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(menuRef, {
      ...menuData,
      images: [],
      status: menuData.status || 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Upload images and collect URLs
    const imageUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      try {
        const imageUrl = await uploadMenuImage(
          menuData.categoryName,
          docRef.id,
          imageFiles[i],
          i
        );
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error(`Error uploading image ${i}:`, error);
      }
    }

    // Update menu item with image URLs
    if (imageUrls.length > 0) {
      await updateDoc(docRef, {
        images: imageUrls,
        updatedAt: serverTimestamp()
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw new Error('Failed to add menu item');
  }
};

// Update menu item with images
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

    // Handle category change - move images to new folder
    if (menuData.categoryName && menuData.categoryName !== currentItem.categoryName) {
      updatedImages = await moveImagesToNewCategory(
        currentItem.categoryName,
        menuData.categoryName,
        id,
        updatedImages
      );
    }

    // Delete specific images if needed
    if (imagesToDelete && imagesToDelete.length > 0) {
      for (const imageUrl of imagesToDelete) {
        try {
          await deleteMenuImage(imageUrl);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
      // Remove deleted images from array
      updatedImages = updatedImages.filter(img => !imagesToDelete.includes(img));
    }

    // Upload new images and append to existing ones
    if (imageFiles && imageFiles.length > 0) {
      const categoryName = menuData.categoryName || currentItem.categoryName;
      for (let i = 0; i < imageFiles.length; i++) {
        try {
          const imageUrl = await uploadMenuImage(
            categoryName,
            id,
            imageFiles[i],
            i
          );
          updatedImages.push(imageUrl);
        } catch (error) {
          console.error(`Error uploading image ${i}:`, error);
        }
      }
    }

    // Update menu item
    const updateData: any = {
      ...menuData,
      images: updatedImages,
      updatedAt: serverTimestamp()
    };

    const menuItemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(menuItemRef, updateData);
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

    // Delete all images from storage
    if (menuItem.images && menuItem.images.length > 0) {
      for (const imageUrl of menuItem.images) {
        try {
          await deleteMenuImage(imageUrl);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    // Delete menu item document
    const menuItemRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(menuItemRef);
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

// Get count of items in a category
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

// Get menu statistics
export const getMenuStatistics = async (): Promise<{
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  totalByCategory: Record<string, number>;
}> => {
  try {
    const menuRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(menuRef);
    
    const items = querySnapshot.docs.map(doc => doc.data()) as MenuItem[];
    
    const totalByCategory: Record<string, number> = {};
    items.forEach(item => {
      totalByCategory[item.categoryName] = (totalByCategory[item.categoryName] || 0) + 1;
    });

    return {
      totalItems: items.length,
      activeItems: items.filter(item => item.status === 'active').length,
      inactiveItems: items.filter(item => item.status === 'inactive').length,
      totalByCategory
    };
  } catch (error) {
    console.error('Error fetching menu statistics:', error);
    throw new Error('Failed to fetch menu statistics');
  }
};