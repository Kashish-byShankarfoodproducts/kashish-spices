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
  refreshData: () => Promise<void>;

  // Custom Product Ordering / Sequence
  reorderProducts: (orderedIds: string[]) => Promise<void>;
  moveProductToTop: (productId: string) => Promise<void>;
  moveProductUp: (productId: string) => Promise<void>;
  moveProductDown: (productId: string) => Promise<void>;
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
   * Helper: Sort products based on custom sequence in productOrder
   */
  const sortProductsByOrder = (prods: MasalaProduct[], orderList?: string[]): MasalaProduct[] => {
    if (!orderList || orderList.length === 0) {
      return [...prods].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    const orderMap = new Map<string, number>();
    orderList.forEach((id, idx) => orderMap.set(id, idx));

    return [...prods].sort((a, b) => {
      const rankA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999999;
      const rankB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999999;
      if (rankA !== rankB) return rankA - rankB;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  };

  /**
   * Initial Load & Refresh Helper:
   * Website open hote hi products aur site config load karein.
   */
  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await storageService.getProducts();
      const remoteConf = await storageService.fetchRemoteSiteConfig();
      const activeConf = remoteConf || siteConfig;
      if (remoteConf) {
        setSiteConfig(remoteConf);
      }
      setProducts(sortProductsByOrder(data, activeConf.productOrder));
    } catch (err) {
      console.error('[ProductContext] Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
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
   * 1. IndexedDB aur Supabase me save karta hai.
   * 2. React state me add karta hai taaki website par turant dikhe.
   */
  const addProduct = async (newProduct: MasalaProduct) => {
    await storageService.saveProduct(newProduct);
    const currentOrder = siteConfig.productOrder && siteConfig.productOrder.length > 0
      ? [...siteConfig.productOrder]
      : products.map((p) => p.id);
    const newOrder = [newProduct.id, ...currentOrder.filter((id) => id !== newProduct.id)];
    const updatedConf = { ...siteConfig, productOrder: newOrder };
    updateSiteConfig(updatedConf);
    setProducts((prev) => sortProductsByOrder([newProduct, ...prev], newOrder));
  };

  /**
   * UPDATE PRODUCT (Existing masala ki info ya image badalna):
   */
  const updateProduct = async (updatedProduct: MasalaProduct) => {
    await storageService.saveProduct(updatedProduct);
    setProducts((prev) => {
      const updated = prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item));
      return sortProductsByOrder(updated, siteConfig.productOrder);
    });
  };

  /**
   * DELETE PRODUCT (Masala ko website se hatana):
   */
  const deleteProduct = async (id: string) => {
    await storageService.deleteProduct(id);
    if (siteConfig.productOrder && siteConfig.productOrder.includes(id)) {
      const newOrder = siteConfig.productOrder.filter((item) => item !== id);
      updateSiteConfig({ ...siteConfig, productOrder: newOrder });
    }
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * UPDATE SITE CONFIG (Brand info, Phones, FSSAI, Product Order live update):
   */
  const updateSiteConfig = (newConfig: SiteConfig) => {
    storageService.saveSiteConfig(newConfig);
    setSiteConfig(newConfig);
  };

  /**
   * CUSTOM PRODUCT ORDERING / RANKING ACTIONS:
   */
  const reorderProducts = async (newOrderIds: string[]) => {
    const updatedConf = { ...siteConfig, productOrder: newOrderIds };
    updateSiteConfig(updatedConf);
    setProducts((prev) => sortProductsByOrder(prev, newOrderIds));
  };

  const moveProductToTop = async (productId: string) => {
    const currentOrder = siteConfig.productOrder && siteConfig.productOrder.length > 0
      ? [...siteConfig.productOrder]
      : products.map((p) => p.id);

    const filtered = currentOrder.filter((id) => id !== productId);
    const newOrder = [productId, ...filtered];
    await reorderProducts(newOrder);
  };

  const moveProductUp = async (productId: string) => {
    const currentOrder = siteConfig.productOrder && siteConfig.productOrder.length > 0
      ? [...siteConfig.productOrder]
      : products.map((p) => p.id);

    const idx = currentOrder.indexOf(productId);
    if (idx > 0) {
      const temp = currentOrder[idx - 1];
      currentOrder[idx - 1] = currentOrder[idx];
      currentOrder[idx] = temp;
      await reorderProducts([...currentOrder]);
    }
  };

  const moveProductDown = async (productId: string) => {
    const currentOrder = siteConfig.productOrder && siteConfig.productOrder.length > 0
      ? [...siteConfig.productOrder]
      : products.map((p) => p.id);

    const idx = currentOrder.indexOf(productId);
    if (idx !== -1 && idx < currentOrder.length - 1) {
      const temp = currentOrder[idx + 1];
      currentOrder[idx + 1] = currentOrder[idx];
      currentOrder[idx] = temp;
      await reorderProducts([...currentOrder]);
    }
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
        refreshData,
        reorderProducts,
        moveProductToTop,
        moveProductUp,
        moveProductDown,
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
