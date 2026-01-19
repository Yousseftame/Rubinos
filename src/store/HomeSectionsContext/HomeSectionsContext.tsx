// src/store/HomeSectionsContext/HomeSectionsContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getSectionByType,
  getAllSections,
  updateSection,
  getSectionMetadata,
  type HomeSection,
  type SectionType
} from '../../service/homeSections/homeSections.service';
import { toast } from 'react-hot-toast';

interface SectionMetadata {
  lastUpdated: Date | null;
  hasImage: boolean;
}

interface HomeSectionsContextType {
  sections: HomeSection[];
  loading: boolean;
  error: string | null;
  metadata: Record<SectionType, SectionMetadata | null>;
  getSectionByType: (type: SectionType) => HomeSection | null;
  fetchSections: () => Promise<void>;
  handleUpdateSection: (
    type: SectionType,
    updates: {
      title?: string;
      description?: string;
      imageUrl?: string;
    },
    imageFile?: File
  ) => Promise<void>;
  fetchSectionMetadata: (type: SectionType) => Promise<void>;
}

const HomeSectionsContext = createContext<HomeSectionsContextType | undefined>(undefined);

export const HomeSectionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Record<SectionType, SectionMetadata | null>>({
    about: null,
    dining: null,
    heroImage: null
  });

  // Get section from state
  const getSectionFromState = (type: SectionType): HomeSection | null => {
    return sections.find(section => section.type === type) || null;
  };

  // Fetch all sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSections();
      setSections(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sections';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch metadata for a specific section
  const fetchSectionMetadata = async (type: SectionType) => {
    try {
      const meta = await getSectionMetadata(type);
      setMetadata(prev => ({
        ...prev,
        [type]: meta
      }));
    } catch (err) {
      console.error(`Error fetching ${type} metadata:`, err);
    }
  };

  // Load sections and metadata on mount
  useEffect(() => {
    fetchSections();
    // Fetch metadata for all sections
    (['about', 'dining', 'heroImage'] as SectionType[]).forEach(type => {
      fetchSectionMetadata(type);
    });
  }, []);

  // Update section
  const handleUpdateSection = async (
    type: SectionType,
    updates: {
      title?: string;
      description?: string;
      imageUrl?: string;
    },
    imageFile?: File
  ) => {
    // Store original state for rollback
    const originalSections = [...sections];
    
    try {
      // Call service first to get updated image URL if image was uploaded
      await updateSection(type, updates, imageFile);
      
      // Then refresh data after successful update
      await fetchSections();
      await fetchSectionMetadata(type);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} section updated successfully!`);
    } catch (err) {
      // Rollback on error
      setSections(originalSections);
      const errorMessage = err instanceof Error ? err.message : `Failed to update ${type} section`;
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <HomeSectionsContext.Provider
      value={{
        sections,
        loading,
        error,
        metadata,
        getSectionByType: getSectionFromState,
        fetchSections,
        handleUpdateSection,
        fetchSectionMetadata
      }}
    >
      {children}
    </HomeSectionsContext.Provider>
  );
};

export const useHomeSectionsContext = () => {
  const context = useContext(HomeSectionsContext);
  if (context === undefined) {
    throw new Error('useHomeSectionsContext must be used within a HomeSectionsProvider');
  }
  return context;
};