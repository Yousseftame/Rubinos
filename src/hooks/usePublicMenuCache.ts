// src/hooks/usePublicMenuCache.ts
//
// SESSION CACHE FOR PUBLIC MENU PAGE
//
// Problem: Without caching, every visitor to /menu triggers 2 Firestore reads
// (categories + menu items). 100 visitors = 200 reads.
//
// Solution: 2-layer cache
//   Layer 1 — memory (module-level): survives React re-renders and route changes
//             within the same tab session. Instant, no I/O.
//   Layer 2 — sessionStorage: survives page refreshes within the same tab.
//             Cleared when the tab is closed.
//
// Result:
//   - First visit to /menu → 2 Firestore reads, data saved to both caches
//   - Navigate away and back → 0 reads (memory cache)
//   - Refresh the page → 0 reads (sessionStorage cache, if within 5 min TTL)
//   - Open a new tab → 2 reads (sessionStorage is per-tab)
//   - After 5 minutes → cache expires, next visit does 2 fresh reads
//
// Admin mutations call invalidatePublicMenuCache() to bust the cache immediately,
// so the next visitor always sees fresh data after an admin change.

import { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../service/firebase';
import type { Category } from '../service/categories/categories.service';
import type { MenuItem } from '../service/menus/menus.service';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicMenuData {
  categories: Category[];
  items: MenuItem[];
}

interface CacheEntry {
  data: PublicMenuData;
  fetchedAt: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_KEY = 'rubinos_menu_cache';

// ─── Module-level memory cache ────────────────────────────────────────────────
// Survives React re-renders and in-app navigation. Reset when tab closes.

let memoryCache: CacheEntry | null = null;

const isFresh = (entry: CacheEntry | null): boolean =>
  entry !== null && Date.now() - entry.fetchedAt < CACHE_TTL_MS;

// ─── sessionStorage helpers ───────────────────────────────────────────────────

const loadFromSession = (): CacheEntry | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    return isFresh(entry) ? entry : null;
  } catch {
    return null;
  }
};

const saveToSession = (data: PublicMenuData): void => {
  try {
    const entry: CacheEntry = { data, fetchedAt: Date.now() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(entry));
    memoryCache = entry;
  } catch {
    // sessionStorage full or disabled — memory cache still works
    memoryCache = { data, fetchedAt: Date.now() };
  }
};

// ─── Firestore fetch (only runs on cache miss) ────────────────────────────────

const fetchFromFirestore = async (): Promise<PublicMenuData> => {
  const [catsSnap, menuSnap] = await Promise.all([
    getDocs(query(
      collection(db, 'categories'),
      where('status', '==', 'active'),
      orderBy('placeOrder', 'asc')
    )),
    getDocs(query(
      collection(db, 'menu'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    )),
  ]);

  return {
    categories: catsSnap.docs.map(d => ({
      uid: d.id,
      ...d.data(),
      items: d.data().items || 0,
      placeOrder: d.data().placeOrder || 0,
    })) as Category[],
    items: menuSnap.docs.map(d => ({
      uid: d.id,
      ...d.data(),
    })) as MenuItem[],
  };
};

// ─── Main loader ──────────────────────────────────────────────────────────────

const loadMenuData = async (): Promise<PublicMenuData> => {
  // Layer 1: memory cache (instant)
  if (isFresh(memoryCache)) return memoryCache!.data;

  // Layer 2: sessionStorage (survives refresh within same tab)
  const sessionEntry = loadFromSession();
  if (sessionEntry) {
    memoryCache = sessionEntry; // warm memory cache too
    return sessionEntry.data;
  }

  // Cache miss — fetch from Firestore (2 reads)
  const data = await fetchFromFirestore();
  saveToSession(data);
  return data;
};

// ─── Public hook ─────────────────────────────────────────────────────────────

export const usePublicMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    loadMenuData()
      .then(data => {
        setCategories(data.categories);
        setMenuItems(data.items);
      })
      .catch(err => {
        console.error('Error loading public menu data:', err);
        setError('Failed to load menu. Please refresh the page.');
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, menuItems, loading, error };
};

// ─── Cache invalidation ───────────────────────────────────────────────────────
// Called by CategoriesContext and MenusContext after any mutation.
// Ensures the next public visitor gets fresh data from Firestore.

export const invalidatePublicMenuCache = (): void => {
  memoryCache = null;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
};