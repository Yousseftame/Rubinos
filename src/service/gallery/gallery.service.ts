// src/service/gallery/gallery.service.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch,
  where
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  deleteObject, 
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from '../firebase';

export interface GalleryItem {
  uid?: string;
  image: string;
  placeOrder: number;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'gallery';
const STORAGE_BASE = 'gallery';

// Get all gallery items ordered by placeOrder
export const getAllGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const galleryRef = collection(db, COLLECTION_NAME);
    const q = query(galleryRef, orderBy('placeOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as GalleryItem[];
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw new Error('Failed to fetch gallery items');
  }
};

// Get active gallery items only (for frontend display)
export const getActiveGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const galleryRef = collection(db, COLLECTION_NAME);
    const q = query(
      galleryRef,
      where('status', '==', 'active'),
      orderBy('placeOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as GalleryItem[];
  } catch (error) {
    console.error('Error fetching active gallery items:', error);
    throw new Error('Failed to fetch active gallery items');
  }
};

// Get gallery item by ID
export const getGalleryItemById = async (id: string): Promise<GalleryItem | null> => {
  try {
    const galleryItemRef = doc(db, COLLECTION_NAME, id);
    const galleryItemDoc = await getDoc(galleryItemRef);
    
    if (galleryItemDoc.exists()) {
      return {
        uid: galleryItemDoc.id,
        ...galleryItemDoc.data()
      } as GalleryItem;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    throw new Error('Failed to fetch gallery item');
  }
};

// Upload image to storage
const uploadGalleryImage = async (file: File, itemId: string): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const storagePath = `${STORAGE_BASE}/${fileName}`;
    
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
const deleteGalleryImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Get the next available placeOrder (highest + 1)
const getNextPlaceOrder = async (): Promise<number> => {
  try {
    const items = await getAllGalleryItems();
    if (items.length === 0) return 1;
    
    const maxOrder = Math.max(...items.map(item => item.placeOrder || 0));
    return maxOrder + 1;
  } catch (error) {
    console.error('Error getting next place order:', error);
    return 1;
  }
};

// FIXED: Swap items when editing (true swap behavior)
const swapGalleryItems = async (
  itemId: string,
  newPlaceOrder: number,
  oldPlaceOrder: number
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const items = await getAllGalleryItems();
    
    // Find the item currently at the target position
    const itemAtTargetPosition = items.find(item => item.placeOrder === newPlaceOrder);
    
    if (itemAtTargetPosition && itemAtTargetPosition.uid !== itemId) {
      // SWAP: Give the target item the old position
      const targetItemRef = doc(db, COLLECTION_NAME, itemAtTargetPosition.uid!);
      batch.update(targetItemRef, {
        placeOrder: oldPlaceOrder,
        updatedAt: serverTimestamp()
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error swapping gallery items:', error);
    throw new Error('Failed to swap gallery items');
  }
};

// Insert item at position (for new items only - shifts other items)
const insertGalleryItemAtPosition = async (
  newItemId: string,
  newPlaceOrder: number
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const items = await getAllGalleryItems();
    
    // Shift all items at or after newPlaceOrder down by 1
    items.forEach(item => {
      if (item.uid !== newItemId && item.placeOrder >= newPlaceOrder) {
        const itemRef = doc(db, COLLECTION_NAME, item.uid!);
        batch.update(itemRef, {
          placeOrder: item.placeOrder + 1,
          updatedAt: serverTimestamp()
        });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error inserting gallery item:', error);
    throw new Error('Failed to insert gallery item');
  }
};

// Add new gallery item
export const addGalleryItem = async (
  imageFile: File,
  placeOrder?: number
): Promise<string> => {
  try {
    // Create temporary doc to get ID for image upload
    const galleryRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(galleryRef, {
      image: '',
      placeOrder: 999999, // Temporary high number
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Upload image
    const imageUrl = await uploadGalleryImage(imageFile, docRef.id);
    
    // Get final place order
    const finalPlaceOrder = placeOrder ?? await getNextPlaceOrder();
    
    // Shift other items if inserting at specific position
    if (placeOrder !== undefined) {
      await insertGalleryItemAtPosition(docRef.id, finalPlaceOrder);
    }
    
    // Update with final data
    await updateDoc(docRef, {
      image: imageUrl,
      placeOrder: finalPlaceOrder,
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw new Error('Failed to add gallery item');
  }
};

// Update gallery item
export const updateGalleryItem = async (
  id: string,
  updates: {
    placeOrder?: number;
    status?: 'active' | 'inactive';
  },
  newImageFile?: File
): Promise<void> => {
  try {
    const currentItem = await getGalleryItemById(id);
    if (!currentItem) throw new Error('Gallery item not found');

    let imageUrl = currentItem.image;
    
    // Handle image replacement
    if (newImageFile) {
      // Delete old image
      if (currentItem.image) {
        await deleteGalleryImage(currentItem.image);
      }
      // Upload new image
      imageUrl = await uploadGalleryImage(newImageFile, id);
    }

    // Handle place order change - SWAP logic
    if (updates.placeOrder !== undefined && updates.placeOrder !== currentItem.placeOrder) {
      await swapGalleryItems(id, updates.placeOrder, currentItem.placeOrder);
    }

    // Update document
    const updateData: any = {
      updatedAt: serverTimestamp()
    };

    if (newImageFile) {
      updateData.image = imageUrl;
    }
    if (updates.placeOrder !== undefined) {
      updateData.placeOrder = updates.placeOrder;
    }
    if (updates.status !== undefined) {
      updateData.status = updates.status;
    }

    const galleryItemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(galleryItemRef, updateData);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    throw new Error('Failed to update gallery item');
  }
};

// Delete gallery item
export const deleteGalleryItem = async (id: string): Promise<void> => {
  try {
    const galleryItem = await getGalleryItemById(id);
    if (!galleryItem) return;

    // Delete image from storage
    if (galleryItem.image) {
      await deleteGalleryImage(galleryItem.image);
    }

    // Delete document
    const galleryItemRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(galleryItemRef);

    // Reorder remaining items to fill the gap
    const batch = writeBatch(db);
    const items = await getAllGalleryItems();
    
    items.forEach(item => {
      if (item.placeOrder > galleryItem.placeOrder) {
        const itemRef = doc(db, COLLECTION_NAME, item.uid!);
        batch.update(itemRef, { 
          placeOrder: item.placeOrder - 1,
          updatedAt: serverTimestamp()
        });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw new Error('Failed to delete gallery item');
  }
};

// Toggle gallery item status
export const toggleGalleryItemStatus = async (
  id: string, 
  currentStatus: 'active' | 'inactive'
): Promise<void> => {
  try {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const galleryItemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(galleryItemRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling gallery item status:', error);
    throw new Error('Failed to toggle gallery item status');
  }
};

// Get gallery statistics
export const getGalleryStatistics = async (): Promise<{
  totalImages: number;
  activeImages: number;
  inactiveImages: number;
}> => {
  try {
    const items = await getAllGalleryItems();
    
    return {
      totalImages: items.length,
      activeImages: items.filter(item => item.status === 'active').length,
      inactiveImages: items.filter(item => item.status === 'inactive').length,
    };
  } catch (error) {
    console.error('Error fetching gallery statistics:', error);
    throw new Error('Failed to fetch gallery statistics');
  }
};