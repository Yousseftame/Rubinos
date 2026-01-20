// src/service/homeSections/homeSections.service.ts
import { 
  
  doc, 
  getDoc, 
  updateDoc,
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

export type SectionType = 'about' | 'dining' | 'heroImage';

export interface HomeSection {
  uid?: string;
  type: SectionType;
  title?: string;
  description?: string;
  imageUrl: string;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'homeSections';
const STORAGE_BASE = 'homeSections';

// Validate section type
// const isValidSectionType = (type: string): type is SectionType => {
//   return ['about', 'dining', 'heroImage'].includes(type);
// };

// Get section by type
export const getSectionByType = async (type: SectionType): Promise<HomeSection | null> => {
  try {
    const sectionRef = doc(db, COLLECTION_NAME, type);
    const sectionDoc = await getDoc(sectionRef);
    
    if (sectionDoc.exists()) {
      const data = sectionDoc.data();
      return {
        uid: sectionDoc.id,
        type,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || '',
        updatedAt: data.updatedAt
      } as HomeSection;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${type} section:`, error);
    throw new Error(`Failed to fetch ${type} section`);
  }
};

// Get all sections
export const getAllSections = async (): Promise<HomeSection[]> => {
  try {
    const sections: HomeSection[] = [];
    
    for (const type of ['about', 'dining', 'heroImage'] as SectionType[]) {
      try {
        const section = await getSectionByType(type);
        if (section) {
          sections.push(section);
        }
      } catch (error) {
        console.error(`Error fetching ${type} section:`, error);
      }
    }
    
    return sections;
  } catch (error) {
    console.error('Error fetching all sections:', error);
    throw new Error('Failed to fetch sections');
  }
};

// Upload image to storage
const uploadSectionImage = async (
  type: SectionType,
  file: File
): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const storagePath = `${STORAGE_BASE}/${type}/${fileName}`;
    
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
const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl) return;
    
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - continue with update even if delete fails
  }
};

// Delete old image from storage
const deleteOldSectionImage = async (type: SectionType): Promise<void> => {
  try {
    // Get current section to find old image URL
    const section = await getSectionByType(type);
    if (section && section.imageUrl) {
      await deleteImageFromStorage(section.imageUrl);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
    // Don't throw - continue with update even if delete fails
  }
};

// Update section (handles title, description, and/or image)
export const updateSection = async (
  type: SectionType,
  updates: {
    title?: string;
    description?: string;
    imageUrl?: string;
  },
  imageFile?: File
): Promise<void> => {
  try {
    const sectionRef = doc(db, COLLECTION_NAME, type);
    
    let imageUrl = updates.imageUrl;
    
    // Handle image replacement
    if (imageFile) {
      // Delete old image first
      await deleteOldSectionImage(type);
      
      // Upload new image
      imageUrl = await uploadSectionImage(type, imageFile);
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: serverTimestamp()
    };

    if (updates.title !== undefined) {
      updateData.title = updates.title;
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description;
    }
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    // Update document
    await updateDoc(sectionRef, updateData);
  } catch (error) {
    console.error(`Error updating ${type} section:`, error);
    throw new Error(`Failed to update ${type} section`);
  }
};

// Get section statistics (metadata)
export const getSectionMetadata = async (type: SectionType): Promise<{
  lastUpdated: Date | null;
  hasImage: boolean;
}> => {
  try {
    const section = await getSectionByType(type);
    
    return {
      lastUpdated: section?.updatedAt 
        ? new Date((section.updatedAt as any).seconds * 1000) 
        : null,
      hasImage: !!(section?.imageUrl && section.imageUrl.trim().length > 0)
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw new Error('Failed to fetch metadata');
  }
};