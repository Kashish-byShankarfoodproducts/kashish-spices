/**
 * ==============================================================================
 * KASHISH MASALE - Storage & Persistence Service
 * ==============================================================================
 * Is file ka kaam browser aur cloud ke beech data ko save aur load karna hai:
 * 
 * 1. Cloud Database (Supabase Sync):
 *    Jab Supabase connect hota hai, admin ke dwara jode gaye naye masale,
 *    unke 4 photos, aur website settings duniya ke sabhi devices (phones, laptops)
 *    par turant real-time live dikhte hain!
 * 
 * 2. IndexedDB & Local Storage Cache:
 *    Browser ka built-in local database jo offline support aur fast loading deta hai.
 *    Supabase na hone par ya network offline hone par safe fallback ki tarah kaam karta hai.
 * 
 * 3. Client-Side Image Compression:
 *    Uploaded images ko WebP / Base64 format me compress karta hai.
 * 
 * 4. Code Exporter (defaultData.ts Generator):
 *    Admin panel ke data aur images ko 1-click me direct code me export karta hai,
 *    taaki bina kisi cloud database ke bhi GitHub / Cloudflare par deploy kiya ja sake.
 * ==============================================================================
 */

import { MasalaProduct, SiteConfig } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_SITE_CONFIG, DEFAULT_CATEGORIES, CATALOG_VERSION } from './defaultData';
import { supabaseService } from './supabaseService';

const DB_NAME = 'kashish_spices_db';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';
const CONFIG_KEY = 'kashish_site_config';
const ADMIN_AUTH_KEY = 'kashish_admin_auth';
const CATALOG_VERSION_KEY = 'kashish_catalog_version';

/**
 * -----------------------------------------------------------------------------
 * IndexedDB Initialization Helper
 * -----------------------------------------------------------------------------
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB browser me supported nahi hai'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
        db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Helper to write products array into local IndexedDB
 */
async function writeProductsToIndexedDB(products: MasalaProduct[]): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      store.clear();
      for (const prod of products) {
        store.put(prod);
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('[StorageService] writeProductsToIndexedDB error:', err);
  }
}

/**
 * -----------------------------------------------------------------------------
 * StorageService Object
 * -----------------------------------------------------------------------------
 */
export const storageService = {
  /**
   * 1. GET ALL PRODUCTS (Saare Masale Load Karein):
   * - Step A: Agar Supabase configured hai, toh cloud database se latest fetch karta hai
   *   aur local IndexedDB me cache karta hai taaki sabhi devices me turant live dikhe!
   * - Step B: Agar Supabase configured nahi hai:
   *   Check karta hai ki kya code ka CATALOG_VERSION badal gaya hai. Agar naya version hai
   *   toh purana stale cache clear karke naye defaultData.ts ke masale load karta hai.
   */
  async getProducts(): Promise<MasalaProduct[]> {
    // 1. Try Cloud Database (Supabase) if configured
    if (supabaseService.getConfig().isConfigured) {
      try {
        const cloudProducts = await supabaseService.fetchProducts();
        if (cloudProducts && cloudProducts.length > 0) {
          // Cache in local IndexedDB for fast subsequent loads
          writeProductsToIndexedDB(cloudProducts).catch(() => {});
          return cloudProducts;
        }
      } catch (err) {
        console.warn('[StorageService] Supabase fetch failed, falling back to local storage:', err);
      }
    }

    // 2. Fallback to Local IndexedDB & Version Check
    try {
      const db = await openDatabase();

      // Check if catalog version changed (e.g. fresh git push to Cloudflare)
      const storedVersion = typeof window !== 'undefined' ? localStorage.getItem(CATALOG_VERSION_KEY) : null;
      if (storedVersion !== CATALOG_VERSION) {
        console.log(`[StorageService] Upgrading catalog version to ${CATALOG_VERSION}`);
        await this.seedDefaultProducts();
        if (typeof window !== 'undefined') {
          localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
        }
        return DEFAULT_PRODUCTS;
      }

      return new Promise((resolve) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readonly');
        const store = transaction.objectStore(PRODUCTS_STORE);
        const request = store.getAll();

        request.onsuccess = async () => {
          const items: MasalaProduct[] = request.result || [];
          if (items.length === 0) {
            console.log('[StorageService] First time boot: Seeding default products');
            await this.seedDefaultProducts();
            resolve(DEFAULT_PRODUCTS);
          } else {
            resolve(items);
          }
        };

        request.onerror = () => {
          console.warn('[StorageService] IndexedDB read error, falling back to defaults', request.error);
          resolve(DEFAULT_PRODUCTS);
        };
      });
    } catch (err) {
      console.warn('[StorageService] IndexedDB error, using defaults', err);
      return DEFAULT_PRODUCTS;
    }
  },

  /**
   * 2. SAVE OR UPDATE PRODUCT (Masala Add / Edit Karein):
   * Naye ya existing masala ko IndexedDB me save karta hai,
   * aur agar Supabase connect hai toh Cloud Database me bhi bhejta hai.
   */
  async saveProduct(product: MasalaProduct): Promise<void> {
    // 1. Save to local IndexedDB
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      const request = store.put(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // 2. Save to Cloud Database (Supabase) if connected (fail-safe: local save never blocks)
    if (supabaseService.getConfig().isConfigured) {
      try {
        await supabaseService.saveProduct(product);
        console.log('[StorageService] Product synced to Supabase successfully:', product.title);
      } catch (err) {
        console.warn('[StorageService] Could not sync product to Supabase, saved locally:', err);
      }
    }
  },

  /**
   * 3. DELETE PRODUCT (Masala Delete Karein):
   * Local IndexedDB aur Supabase dono se hatata hai.
   */
  async deleteProduct(productId: string): Promise<void> {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      const request = store.delete(productId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    if (supabaseService.getConfig().isConfigured) {
      try {
        await supabaseService.deleteProduct(productId);
      } catch (err) {
        console.error('[StorageService] Error deleting product from Supabase:', err);
      }
    }
  },

  /**
   * 4. SEED / RESET PRODUCTS (Default Data Restore Karein):
   */
  async seedDefaultProducts(): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      store.clear();

      for (const product of DEFAULT_PRODUCTS) {
        store.put(product);
      }

      transaction.oncomplete = () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
        }
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  },

  /**
   * 5. GET SITE CONFIG:
   */
  getSiteConfig(): SiteConfig {
    if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG;
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          logoUrl: parsed.logoUrl || DEFAULT_SITE_CONFIG.logoUrl,
          logoBgColor: parsed.logoBgColor || DEFAULT_SITE_CONFIG.logoBgColor,
        };
      }
    } catch (e) {
      console.error('[StorageService] Error loading site config from localStorage', e);
    }
    return DEFAULT_SITE_CONFIG;
  },

  /**
   * 6. FETCH REMOTE SITE CONFIG FROM CLOUD (Async):
   */
  async fetchRemoteSiteConfig(): Promise<SiteConfig | null> {
    if (supabaseService.getConfig().isConfigured) {
      try {
        const cloudConfig = await supabaseService.fetchSiteConfig();
        if (cloudConfig) {
          this.saveSiteConfig(cloudConfig);
          return cloudConfig;
        }
      } catch (err) {
        console.warn('[StorageService] Error fetching cloud site config:', err);
      }
    }
    return null;
  },

  /**
   * 7. SAVE SITE CONFIG:
   */
  saveSiteConfig(config: SiteConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('[StorageService] Error saving site config to localStorage', e);
    }

    if (supabaseService.getConfig().isConfigured) {
      supabaseService.saveSiteConfig(config).catch((err) => {
        console.error('[StorageService] Failed to sync config to Supabase:', err);
      });
    }
  },

  /**
   * 8. IMAGE UPLOADER & COMPRESSOR:
   */
  async compressAndReadImage(file: File, maxWidth = 900, maxHeight = 900, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(image, 0, 0, width, height);

          const base64Url = canvas.toDataURL('image/webp', quality);
          resolve(base64Url);
        };
        image.onerror = (err) => reject(err);
        image.src = readerEvent.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  /**
   * 9. EXPORT DATABASE (Backup Download):
   */
  async exportFullBackup(): Promise<string> {
    const products = await this.getProducts();
    const config = this.getSiteConfig();
    const backupData = {
      version: '2.1',
      exportedAt: new Date().toISOString(),
      config,
      products,
    };
    return JSON.stringify(backupData, null, 2);
  },

  /**
   * 10. GENERATE defaultData.ts FILE CONTENT (1-Click Publish to Code):
   * Is function se naya defaultData.ts banta hai jisme user ke naye masale
   * aur unki uploaded photos embedded hoti hain.
   */
  generateDefaultDataCode(products: MasalaProduct[], config: SiteConfig): string {
    const newVersion = `catalog-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;

    return `/**
 * ==============================================================================
 * KASHISH MASALE - Default Initial Data (Seed Data)
 * ==============================================================================
 * Generated via Kashish Admin Panel - 1-Click Code Publisher
 * Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
 * ==============================================================================
 */

import { MasalaProduct, Category, SiteConfig } from '../types';

export const CATALOG_VERSION = ${JSON.stringify(newVersion)};

export const DEFAULT_CATEGORIES: Category[] = ${JSON.stringify(DEFAULT_CATEGORIES, null, 2)};

export const DEFAULT_PRODUCTS: MasalaProduct[] = ${JSON.stringify(products, null, 2)};

export const DEFAULT_SITE_CONFIG: SiteConfig = ${JSON.stringify(config, null, 2)};
`;
  },

  /**
   * 11. IMPORT DATABASE:
   */
  async importFullBackup(jsonContent: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.products || !Array.isArray(parsed.products)) {
        throw new Error('Invalid backup file format: products array not found');
      }

      if (parsed.config) {
        this.saveSiteConfig(parsed.config);
      }

      await writeProductsToIndexedDB(parsed.products);

      // If Supabase is connected, offer to sync all to cloud as well
      if (supabaseService.getConfig().isConfigured) {
        try {
          await supabaseService.syncAllToCloud(parsed.products, parsed.config || this.getSiteConfig());
        } catch (e) {
          console.warn('[StorageService] Could not sync imported backup to Supabase:', e);
        }
      }

      return true;
    } catch (e) {
      console.error('[StorageService] Failed to import backup:', e);
      return false;
    }
  },

  /**
   * 12. AUTH STORAGE HELPERS:
   */
  getStoredAuth(): { isAuthenticated: boolean; username: string } {
    if (typeof window === 'undefined') return { isAuthenticated: false, username: '' };
    try {
      const saved = sessionStorage.getItem(ADMIN_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      /* ignore */
    }
    return { isAuthenticated: false, username: '' };
  },

  setStoredAuth(auth: { isAuthenticated: boolean; username: string }): void {
    if (typeof window === 'undefined') return;
    try {
      if (auth.isAuthenticated) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(auth));
      } else {
        sessionStorage.removeItem(ADMIN_AUTH_KEY);
      }
    } catch (e) {
      /* ignore */
    }
  },
};
