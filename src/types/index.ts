/**
 * ==============================================================================
 * KASHISH MASALE - TypeScript Type Definitions
 * ==============================================================================
 * Ye file puri website ke data structures (types/interfaces) define karti hai.
 * Yahan har ek type ko clearly explain kiya gaya hai taaki koi bhi developer
 * ya beginner samajh sake ki konsa data kahan se aata hai aur kis kaam aata hai.
 * ==============================================================================
 */

/**
 * 1. DietaryType (Ahaar Prakaar):
 * Masala kiske liye suitable hai:
 * - 'veg': Pure Shakahari (Jaise Paneer, Sabji, Dal)
 * - 'non-veg': Mansahari (Jaise Chicken, Meat, Mutton)
 * - 'both': Dono ke liye (Jaise Garam Masala, Deggi Mirch, Biryani Masala jo Veg & Non-Veg dono me dalti hai)
 */
export type DietaryType = 'veg' | 'non-veg' | 'both';

/**
 * 2. ProductWeight (Pack Size aur MRP):
 * Har ek masala package ka weight aur uska price/MRP:
 * Example: { weight: '50g', price: 45 }
 */
export interface ProductWeight {
  weight: string; // Jaise: '12g', '25g', '50g', '100g', '200g', '500g'
  price: number;  // Price in INR (₹)
}

/**
 * 3. MasalaProduct (Masala Package ki Full Information):
 * Har ek masala item jo website par list hota hai uska complete schema.
 * Admin panel me jab naya masala add karte hain, toh yahi information save hoti hai.
 */
export interface MasalaProduct {
  id: string;               // Unique ID (jaise: 'matar-paneer-masala' ya timestamp)
  title: string;            // Masala ka English naam (jaise: 'Matar Paneer Masala')
  hindiTitle?: string;      // Masala ka Hindi naam (jaise: 'मटर पनीर मसाला')
  category: string;         // Category ID (jaise: 'masala-blends', 'non-veg', 'pure-spices', 'snacks', 'premium', 'dry-ingredients')
  dietaryType: DietaryType; // 'veg' | 'non-veg' | 'both' (User ki main requirement!)
  description: string;      // Detail description jo card aur modal me dikhegi
  weights: ProductWeight[]; // Available pack sizes aur unki MRP
  badge?: string;           // Optional badge: 'Top Seller', 'Premium', 'New', 'Essential', etc.
  imageUrl?: string;        // Package ki uploaded photo (Base64 data URL ya file path)
  images?: string[];        // Multiple uploaded package photos (Carousel / Auto-slide on hover)
  inStock: boolean;         // Kya ye product abhi stock me available hai? (true/false)
  featured: boolean;        // Kya isse Home page ke Featured Masalas me dikhana hai? (true/false)
  createdAt?: string;       // Kis tareekh ko ye masala list kiya gaya tha
}

/**
 * 4. Category (Categories ki list):
 * Shop page par jo filter buttons aate hain unki details.
 */
export interface Category {
  id: string;   // Filter ID (jaise: 'all', 'masala-blends', 'non-veg', etc.)
  name: string; // Button par display hone wala naam (jaise: 'Sabzi & Curries')
  icon?: string;// Optional FontAwesome ya Lucide icon name
}

/**
 * 5. SiteConfig (Website ki Puri Live Customization Settings):
 * Admin Panel se bina code chhue brand name, taglines, phone, address,
 * hero text, FSSAI number sab customize karne ke liye settings object.
 */
export interface SiteConfig {
  // Brand details
  brandName: string;         // 'KASHISH BY M/S SHANKAR FOOD PRODUCTS'
  shortBrand: string;        // 'Kashish'
  logoUrl?: string;          // Global Brand Logo (Uploaded via Live Customizer)
  logoBgColor?: string;      // Auto-detected logo background color (e.g. #FAF8ED)
  tagline: string;           // 'Purity & Taste, A Unique Blend'
  taglineHindi: string;      // 'शुद्धता और स्वाद का अनूठा संगम'
  fssaiNumber: string;       // '22723105000242'
  sinceYear: string;         // '2017'
  
  // Hero section banner
  heroSubtitle: string;      // 'WELCOME TO SHANKAR FOOD PRODUCTS'
  heroBrand: string;         // 'KASHISH MASALE'
  
  // Contact details
  companyName: string;       // 'Shankar Food Products'
  address: string;           // 'Ghaziabad, Uttar Pradesh (U.P.), India-201013'
  primaryPhone: string;      // '+91 9213544074'
  secondaryPhone: string;    // '7683063554'
  email: string;             // 'foodproductsshankar@gmail.com'
  whatsappNumber: string;    // '919213544074' (Bina '+' ke WhatsApp API link ke liye)
  web3formsAccessKey?: string;// Web3Forms Access Key for sending inquiries to email
  hcaptchaEnabled?: boolean; // Enable/Disable hCaptcha on Contact form
  hcaptchaSiteKey?: string;  // Custom or default hCaptcha sitekey
  
  // Social links
  facebookUrl?: string;
  instagramUrl?: string;
  wordpressUrl?: string;
  
  // About section story
  aboutHeading: string;      // 'The Secret to Every Perfect Indian Dish'
  aboutParagraph1: string;
  aboutParagraph2: string;

  // Stats Counters
  statBlendsCount: number;   // 27 (Unique Blends)
  statNaturalPercent: number;// 100 (Natural Ingredients)
  statDistributors: number;  // 50 (City Distributors)
  statPurePromise: number;   // 100 (% Pure Promise)
}

/**
 * 6. AdminUser (Admin Panel Session State):
 * Authentication ke liye user state.
 */
export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  token?: string;
}
