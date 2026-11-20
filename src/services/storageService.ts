/**
 * ==============================================================================
 * KASHISH MASALE - Storage & Persistence Service
 * ==============================================================================
 * Is file ka kaam browser ke andar data ko permanently save aur load karna hai:
 * 
 * 1. IndexedDB:
 *    Browser ka built-in high capacity database. LocalStorage me sirf 5MB
 *    ki limit hoti hai, par IndexedDB me user 100MB+ tak high-resolution
 *    masala package photos save kar sakta hai bina kisi server/backend ke!
 * 
 * 2. LocalStorage Sync:
 *    Site ki configuration (phone number, brand name, taglines) ko
 *    LocalStorage me turant save karta hai.
 * 
 * 3. Client-Side Image Compression:
 *    Admin jab package photo upload karta hai, ye service us photo ko
 *    compress karke Base64 string banati hai taaki website super fast load ho.
 * ==============================================================================
 */

import { MasalaProduct, SiteConfig } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_SITE_CONFIG } from './defaultData';

const DB_NAME = 'kashish_spices_db';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';
const CONFIG_KEY = 'kashish_site_config';
const ADMIN_AUTH_KEY = 'kashish_admin_auth';

/**
 * -----------------------------------------------------------------------------
 * IndexedDB Initialization Helper
 * -----------------------------------------------------------------------------
 * Ye function browser ke IndexedDB ko open karta hai.
 * Agar pehli baar khul raha hai, toh 'products' table create karta hai.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB browser me supported nahi hai'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    // Pehli baar table create karne ke liye
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
        // 'id' ko primary key banaya
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
 * -----------------------------------------------------------------------------
 * StorageService Object
 * -----------------------------------------------------------------------------
 * Saare database operations ka single point of control.
 */
export const storageService = {
  /**
   * 1. GET ALL PRODUCTS (Saare Masale Load Karein):
   * Pehle IndexedDB se data dhoondhta hai.
   * Agar IndexedDB khali hai, toh default 24 authentic masalo ko load karta hai.
   */
  async getProducts(): Promise<MasalaProduct[]> {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readonly');
        const store = transaction.objectStore(PRODUCTS_STORE);
        const request = store.getAll();

        request.onsuccess = async () => {
          const items: MasalaProduct[] = request.result || [];
          if (items.length === 0) {
            // Agar database khali hai, toh initial default data save karein
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
   * Naya masala add karne ke liye ya existing masala ko edit karne ke liye.
   */
  async saveProduct(product: MasalaProduct): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      const request = store.put(product); // put() naye ko insert karta hai aur purane ko update

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * 3. DELETE PRODUCT (Masala Delete Karein):
   * Admin panel se kisi masala ko list se hatane ke liye.
   */
  async deleteProduct(productId: string): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      const request = store.delete(productId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * 4. SEED / RESET PRODUCTS (Default Data Restore Karein):
   * Database ko reset karke original masale restore karta hai.
   */
  async seedDefaultProducts(): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      store.clear(); // Purana data saaf karein

      for (const product of DEFAULT_PRODUCTS) {
        store.put(product);
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  /**
   * 5. GET SITE CONFIG (Website ki Settings Load Karein):
   * Brand name, mobile numbers, FSSAI number, social links etc.
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
   * 6. SAVE SITE CONFIG (Website ki Settings Save Karein):
   * Admin panel se kiya gaya koi bhi badlav turant save ho jata hai.
   */
  saveSiteConfig(config: SiteConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('[StorageService] Error saving site config to localStorage', e);
    }
  },

  /**
   * 7. IMAGE UPLOADER & COMPRESSOR (Package Photo Upload System):
   * User ki uploaded photo ko clean Base64 me convert karta hai.
   * Image ko resize karta hai taaki IndexedDB me fast load ho.
   */
  async compressAndReadImage(file: File, maxWidth = 900, maxHeight = 900, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          // Canvas ke through aspect ratio maintain karke resize karein
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

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(image, 0, 0, width, height);

          // WebP ya JPEG format me high-quality Base64 generate karein
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
   * 8. EXPORT DATABASE (Backup Download Karein):
   * Saare products aur site configuration ka JSON file generate karta hai.
   */
  async exportFullBackup(): Promise<string> {
    const products = await this.getProducts();
    const config = this.getSiteConfig();
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      config,
      products,
    };
    return JSON.stringify(backupData, null, 2);
  },

  /**
   * 9. IMPORT DATABASE (Backup Restore Karein):
   * Pehle se download kiye hue JSON backup ko wapas restore karta hai.
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

      const db = await openDatabase();
      const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
      const store = transaction.objectStore(PRODUCTS_STORE);
      store.clear();

      for (const prod of parsed.products) {
        store.put(prod);
      }

      return new Promise((resolve) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => resolve(false);
      });
    } catch (e) {
      console.error('[StorageService] Failed to import backup:', e);
      return false;
    }
  },

  /**
   * 10. AUTH STORAGE HELPERS (Admin Login Session):
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
