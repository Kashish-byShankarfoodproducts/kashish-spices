/**
 * ==============================================================================
 * KASHISH MASALE - Product & Catalog Global Context
 * ==============================================================================
 * Ye file puri website ka Central Nervous System (Heart) hai!
 * 
 * Ye context kya-kya manage karta hai:
 * 1. Saare Masale (Products list from IndexedDB)
 * 2. Active Filters:
 *    - Category Filter (Sabzi & Curries, Pure Spices, etc.)
 *    - Dietary Filter: Veg, Non-Veg, ya Both (User ki special requirement!)
 *    - Search Query (Naam se dhoondhna)
 * 3. Quick View Modal:
 *    - Kisi bhi masala card par click karne par popup kholna
 * 4. Admin CRUD Operations:
 *    - Naya masala list karna (Add Product)
 *    - Existing masala update karna (Update Product)
 *    - Masala delete karna (Delete Product)
 * 5. Full Website Settings:
 *    - Live site config (brand, phones, hero text, FSSAI)
 * ==============================================================================
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { MasalaProduct, SiteConfig, Category, DietaryType } from '../types';
import { storageService } from '../services/storageService';
import { DEFAULT_CATEGORIES } from '../services/defaultData';

interface ProductContextType {
  // Data states
  products: MasalaProduct[];
  categories: Category[];
  siteConfig: SiteConfig;
  loading: boolean;

  // Filter & Search states
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeDietary: 'all' | DietaryType;
  setActiveDietary: (diet: 'all' | DietaryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filtered list (Cards jo screen par dikhni chahiye)
  filteredProducts: MasalaProduct[];

  // Quick View Modal
  selectedProduct: MasalaProduct | null;
  isModalOpen: boolean;
  openProductModal: (product: MasalaProduct) => void;
  closeProductModal: () => void;

  // Admin Actions (Bina backend ya code change kiye turant update!)
  addProduct: (product: MasalaProduct) => Promise<void>;
  updateProduct: (product: MasalaProduct) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSiteConfig: (config: SiteConfig) => void;
  resetToDefaults: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State variables
  const [products, setProducts] = useState<MasalaProduct[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => storageService.getSiteConfig());
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDietary, setActiveDietary] = useState<'all' | DietaryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal
  const [selectedProduct, setSelectedProduct] = useState<MasalaProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /**
   * Initial Load:
   * Website open hote hi IndexedDB se masale fetch karein.
   */
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await storageService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('[ProductContext] Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  /**
   * Quick View Modal Controls:
   */
  const openProductModal = (product: MasalaProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Background scroll band karein
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = ''; // Background scroll wapas chalu
  };

  /**
   * ADD PRODUCT (Admin Panel se naya masala list karna):
   * 1. IndexedDB me save karta hai.
   * 2. React state me add karta hai taaki website par turant dikhe.
   */
  const addProduct = async (newProduct: MasalaProduct) => {
    await storageService.saveProduct(newProduct);
    setProducts((prev) => [newProduct, ...prev]);
  };

  /**
   * UPDATE PRODUCT (Existing masala ki info ya image badalna):
   */
  const updateProduct = async (updatedProduct: MasalaProduct) => {
    await storageService.saveProduct(updatedProduct);
    setProducts((prev) =>
      prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
    );
  };

  /**
   * DELETE PRODUCT (Masala ko website se hatana):
   */
  const deleteProduct = async (id: string) => {
    await storageService.deleteProduct(id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * UPDATE SITE CONFIG (Brand info, Phones, FSSAI live update):
   */
  const updateSiteConfig = (newConfig: SiteConfig) => {
    storageService.saveSiteConfig(newConfig);
    setSiteConfig(newConfig);
  };

  /**
   * RESET TO DEFAULTS:
   * Database ko reset karke original factory settings par lana.
   */
  const resetToDefaults = async () => {
    setLoading(true);
    await storageService.seedDefaultProducts();
    const fresh = await storageService.getProducts();
    setProducts(fresh);
    const defConf = storageService.getSiteConfig();
    setSiteConfig(defConf);
    setLoading(false);
  };

  /**
   * FILTER LOGIC (Automatic Computed List):
   * Category + Dietary (Veg/Non-Veg/Both) + Search Input ke hisaab se
   * products filter hote hain.
   */
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return products.filter((item) => {
      // 1. Category Filter check
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;

      // 2. Dietary Filter check (Veg, Non-Veg, Both)
      let matchesDietary = true;
      if (activeDietary !== 'all') {
        if (activeDietary === 'veg') {
          // Agar user ne 'Veg' chuna, toh 'veg' wale aur 'both' wale dono show ho sakte hain
          matchesDietary = item.dietaryType === 'veg' || item.dietaryType === 'both';
        } else if (activeDietary === 'non-veg') {
          // Agar user ne 'Non-Veg' chuna
          matchesDietary = item.dietaryType === 'non-veg' || item.dietaryType === 'both';
        } else if (activeDietary === 'both') {
          // Sirf wahi jo dono ke liye use hote hain
          matchesDietary = item.dietaryType === 'both';
        }
      }

      // 3. Search Query check (English title, Hindi title, description)
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        (item.hindiTitle && item.hindiTitle.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q);

      return matchesCategory && matchesDietary && matchesSearch;
    });
  }, [products, activeCategory, activeDietary, searchQuery]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        siteConfig,
        loading,
        activeCategory,
        setActiveCategory,
        activeDietary,
        setActiveDietary,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        selectedProduct,
        isModalOpen,
        openProductModal,
        closeProductModal,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSiteConfig,
        resetToDefaults,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom Hook: kisi bhi component me `useProducts()` call karke sab data access karein
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
