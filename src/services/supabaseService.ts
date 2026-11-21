/**
 * ==============================================================================
 * KASHISH MASALE - Supabase Cloud Database Service
 * ==============================================================================
 * Is service ka kaam admin ke changes (naye masale, photos, aur site config)
 * ko real-time cloud database (Supabase) me save aur sync karna hai.
 * 
 * Kyun zaroori hai:
 * IndexedDB aur LocalStorage sirf ek hi browser me rehte hain.
 * Supabase se connect karne ke baad admin panel ka har badlav sabhi phones,
 * laptops aur customers ke browsers me turant live dikhega!
 * 
 * Note: Ye service pure native browser `fetch` (PostgREST REST API) use karti hai,
 * isliye kisi heavy npm package ya external library ki zaroorat nahi hai.
 * ==============================================================================
 */

import { MasalaProduct, SiteConfig } from '../types';

const STORAGE_SUPABASE_URL = 'kashish_supabase_url';
const STORAGE_SUPABASE_KEY = 'kashish_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export const supabaseService = {
  /**
   * 1. Get current Supabase credentials:
   * Pehle environment variables (Vite / Cloudflare Pages) dekhta hai,
   * agar nahi hain toh localStorage se leta hai.
   */
  getConfig(): SupabaseConfig {
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

    let storedUrl = '';
    let storedKey = '';

    if (typeof window !== 'undefined') {
      try {
        storedUrl = localStorage.getItem(STORAGE_SUPABASE_URL) || '';
        storedKey = localStorage.getItem(STORAGE_SUPABASE_KEY) || '';
      } catch (e) {
        /* ignore */
      }
    }

    const url = (envUrl || storedUrl).trim().replace(/\/+$/, '');
    const anonKey = (envKey || storedKey).trim();

    return {
      url,
      anonKey,
      isConfigured: Boolean(url && anonKey && url.startsWith('http')),
    };
  },

  /**
   * 2. Save custom credentials to localStorage:
   */
  saveConfig(url: string, anonKey: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_SUPABASE_URL, url.trim().replace(/\/+$/, ''));
      localStorage.setItem(STORAGE_SUPABASE_KEY, anonKey.trim());
    } catch (e) {
      console.error('[SupabaseService] Error saving credentials to localStorage:', e);
    }
  },

  /**
   * 3. Clear credentials:
   */
  clearConfig(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_SUPABASE_URL);
      localStorage.removeItem(STORAGE_SUPABASE_KEY);
    } catch (e) {
      /* ignore */
    }
  },

  /**
   * 4. Helper for making authenticated requests to Supabase PostgREST:
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { url, anonKey, isConfigured } = this.getConfig();
    if (!isConfigured) {
      throw new Error('Supabase cloud database is not configured.');
    }

    const fullUrl = `${url}/rest/v1/${endpoint.replace(/^\/+/, '')}`;
    const headers: Record<string, string> = {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase API error (${res.status}): ${errorText || res.statusText}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    return (null as unknown) as T;
  },

  /**
   * 5. Test connection to Supabase:
   */
  async testConnection(customUrl?: string, customKey?: string): Promise<{ success: boolean; message: string }> {
    const url = (customUrl || this.getConfig().url).trim().replace(/\/+$/, '');
    const key = (customKey || this.getConfig().anonKey).trim();

    if (!url || !key) {
      return { success: false, message: 'URL aur Anon Public Key dono daalna anivarya hai.' };
    }

    try {
      const res = await fetch(`${url}/rest/v1/products?select=id&limit=1`, {
        method: 'GET',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });

      if (res.ok) {
        return { success: true, message: 'Supabase Cloud Database safalta-purvak connect ho gaya!' };
      }

      if (res.status === 404) {
        return {
          success: false,
          message: 'Connection mila par "products" table nahi mili! Kripya SQL snippet run karein.',
        };
      }

      const errText = await res.text();
      return { success: false, message: `Connection error (${res.status}): ${errText}` };
    } catch (err: any) {
      return {
        success: false,
        message: `Network error: Supabase se sampark nahi ho paya (${err?.message || err}).`,
      };
    }
  },

  /**
   * 6. Fetch all products from Supabase:
   */
  async fetchProducts(): Promise<MasalaProduct[]> {
    try {
      const data = await this.request<any[]>('products?select=*&order=createdAt.desc');
      if (!Array.isArray(data)) return [];

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        hindiTitle: item.hindiTitle || undefined,
        category: item.category,
        dietaryType: item.dietaryType,
        description: item.description || '',
        weights: Array.isArray(item.weights) ? item.weights : [],
        badge: item.badge || undefined,
        imageUrl: item.imageUrl || undefined,
        images: Array.isArray(item.images) ? item.images : undefined,
        inStock: typeof item.inStock === 'boolean' ? item.inStock : true,
        featured: typeof item.featured === 'boolean' ? item.featured : false,
        createdAt: item.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn('[SupabaseService] Could not fetch products from cloud:', e);
      throw e;
    }
  },

  /**
   * 7. Save or update a single product in Supabase:
   */
  async saveProduct(product: MasalaProduct): Promise<void> {
    const payload = {
      id: product.id,
      title: product.title,
      hindiTitle: product.hindiTitle || null,
      category: product.category,
      dietaryType: product.dietaryType,
      description: product.description || '',
      weights: product.weights || [],
      badge: product.badge || null,
      imageUrl: product.imageUrl || null,
      images: product.images || (product.imageUrl ? [product.imageUrl] : []),
      inStock: product.inStock,
      featured: product.featured,
      createdAt: product.createdAt || new Date().toISOString(),
    };

    await this.request('products', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * 8. Delete a product from Supabase:
   */
  async deleteProduct(productId: string): Promise<void> {
    await this.request(`products?id=eq.${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });
  },

  /**
   * 9. Fetch site configuration from Supabase:
   */
  async fetchSiteConfig(): Promise<SiteConfig | null> {
    try {
      const data = await this.request<any[]>('site_config?id=eq.main&select=*');
      if (Array.isArray(data) && data.length > 0 && data[0].config) {
        return data[0].config as SiteConfig;
      }
      return null;
    } catch (e) {
      console.warn('[SupabaseService] Could not fetch site config from cloud:', e);
      return null;
    }
  },

  /**
   * 10. Save site configuration to Supabase:
   */
  async saveSiteConfig(config: SiteConfig): Promise<void> {
    const payload = {
      id: 'main',
      config,
    };

    await this.request('site_config', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * 11. Bulk sync: Upload all local products and site config to Supabase:
   */
  async syncAllToCloud(products: MasalaProduct[], config: SiteConfig): Promise<{ success: boolean; count: number }> {
    if (!this.getConfig().isConfigured) {
      throw new Error('Supabase database configured nahi hai.');
    }

    const payloads = products.map((product) => ({
      id: product.id,
      title: product.title,
      hindiTitle: product.hindiTitle || null,
      category: product.category,
      dietaryType: product.dietaryType,
      description: product.description || '',
      weights: product.weights || [],
      badge: product.badge || null,
      imageUrl: product.imageUrl || null,
      images: product.images || (product.imageUrl ? [product.imageUrl] : []),
      inStock: product.inStock,
      featured: product.featured,
      createdAt: product.createdAt || new Date().toISOString(),
    }));

    // Upsert products in batch
    await this.request('products', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payloads),
    });

    // Save site config
    await this.saveSiteConfig(config);

    return { success: true, count: payloads.length };
  },
};
