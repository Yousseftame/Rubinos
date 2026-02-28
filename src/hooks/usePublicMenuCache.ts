// src/hooks/usePublicMenuCache.ts
// 
// This module provides a session-level in-memory cache for the public /menu page.
// The menu and categories data rarely changes during a user session, so we cache
// the first fetch and serve all subsequent reads from memory.
//
// Result: 100 visitors in a session window = 1 Firestore read instead of 100.

import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../service/firebase';
import type { Category } from '../service/categories/categories.service';
import type { MenuItem } from '../service/menus/menus.service';

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

// Module-level cache (survives React re-renders and route changes within a session)
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let categoriesCache: CacheEntry<Category[]> | null = null;
let menuItemsCache: CacheEntry<MenuItem[]> | null = null;

const isFresh = (entry: CacheEntry<any> | null) =>
  entry !== null && Date.now() - entry.fetchedAt < CACHE_TTL_MS;

// Fetch active categories (with cache)
const fetchActiveCategories = async (): Promise<Category[]> => {
  if (isFresh(categoriesCache)) return categoriesCache!.data;

  const categoriesRef = collection(db, 'categories');
  const q = query(
    categoriesRef,
    where('status', '==', 'active'),
    orderBy('placeOrder', 'asc')
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
    items: doc.data().items || 0,
    placeOrder: doc.data().placeOrder || 0,
  })) as Category[];

  categoriesCache = { data, fetchedAt: Date.now() };
  return data;
};

// Fetch active menu items (with cache)
const fetchActiveMenuItems = async (): Promise<MenuItem[]> => {
  if (isFresh(menuItemsCache)) return menuItemsCache!.data;

  const menuRef = collection(db, 'menu');
  const q = query(
    menuRef,
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  })) as MenuItem[];

  menuItemsCache = { data, fetchedAt: Date.now() };
  return data;
};

// Exported hook for the public Menu page
export const usePublicMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      try {
        setLoading(true);
        // Fetch both in parallel — 2 reads total (or 0 if cached)
        const [cats, items] = await Promise.all([
          fetchActiveCategories(),
          fetchActiveMenuItems(),
        ]);
        setCategories(cats);
        setMenuItems(items);
      } catch (err) {
        console.error('Error loading public menu data:', err);
        setError('Failed to load menu. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { categories, menuItems, loading, error };
};

// Call this from admin context after a menu/category mutation to invalidate the cache
// so next public visitor gets fresh data
export const invalidatePublicMenuCache = () => {
  categoriesCache = null;
  menuItemsCache = null;
};