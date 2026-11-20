/**
 * ==============================================================================
 * KASHISH MASALE - Default Initial Data (Seed Data)
 * ==============================================================================
 * Is file me website ke saare default authentic masale aur configuration saved hain.
 * Jab website pehli baar open hoti hai, ya fir agar Admin "Reset to Default"
 * dabata hai, toh yahi authentic data load hota hai.
 * Har ek masala ko uski category aur Veg / Non-Veg / Both prakaar ke hisaab se
 * classify kiya gaya hai.
 * ==============================================================================
 */

import { MasalaProduct, Category, SiteConfig } from '../types';

/**
 * Default Categories List:
 * Shop Page ke filter tabs ke liye.
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Products', icon: 'fa-border-all' },
  { id: 'masala-blends', name: 'Sabzi & Curries', icon: 'fa-bowl-rice' },
  { id: 'non-veg', name: 'Non-Veg Masalas', icon: 'fa-drumstick-bite' },
  { id: 'snacks', name: 'Snacks & Street Food', icon: 'fa-cookie-bite' },
  { id: 'premium', name: 'Premium Blends', icon: 'fa-crown' },
  { id: 'pure-spices', name: 'Pure Spices', icon: 'fa-seedling' },
  { id: 'dry-ingredients', name: 'Dry Ingredients', icon: 'fa-wheat-awn' },
];

/**
 * Standard default pricing logic:
 * 12g = ₹15
 * 25g = ₹25
 * 50g = ₹45
 * 100g = ₹90
 */
const standardPackWeights = [
  { weight: '12g', price: 15 },
  { weight: '25g', price: 25 },
  { weight: '50g', price: 45 },
  { weight: '100g', price: 90 },
];

/**
 * Default 24 Authentic Masala Products List:
 * Har product ka dietaryType (veg / non-veg / both) clearly marked hai.
 */
export const DEFAULT_PRODUCTS: MasalaProduct[] = [
  // -------------------------------------------------------------
  // 1. Sabzi & Curries (Masala Blends)
  // -------------------------------------------------------------
  {
    id: 'matar-paneer-masala',
    title: 'Matar Paneer Masala',
    hindiTitle: 'मटर पनीर मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'A rich and aromatic blend that perfectly balances spices for a creamy, restaurant-style Matar Paneer.',
    badge: 'Top Seller',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-01',
  },
  {
    id: 'shahi-paneer-masala',
    title: 'Shahi Paneer Masala',
    hindiTitle: 'शाही पनीर मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'A royal blend of mild, sweet spices designed to elevate the decadent creaminess of Shahi Paneer.',
    badge: 'Top Seller',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-02',
  },
  {
    id: 'kadhai-paneer-masala',
    title: 'Kadhai Paneer Masala',
    hindiTitle: 'कढ़ाई पनीर मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'A bold, roasted spice mix bringing the authentic dhaba-style wok flavor right to your kitchen.',
    badge: '',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-03',
  },
  {
    id: 'malai-chaap-masala',
    title: 'Malai Chaap Masala',
    hindiTitle: 'मलाई चाप मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'A lush and mildly spiced blend perfect for marinating and simmering creamy malai soya chaap.',
    badge: 'Top Seller',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-04',
  },
  {
    id: 'matar-mushroom-masala',
    title: 'Matar Mushroom Masala',
    hindiTitle: 'मटर मशरूम मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'An earthy and robust spice mix crafted to highlight the delicate flavors of mushrooms and tender green peas.',
    badge: '',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-05',
  },
  {
    id: 'chhole-masala',
    title: 'Chana / Chhole Masala',
    hindiTitle: 'चना / छोले मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'An intense, tangy, and dark spice blend to recreate the iconic street-style Punjabi Chole with deep flavor.',
    badge: 'Popular',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-06',
  },
  {
    id: 'sambhar-masala',
    title: 'Sambhar Masala',
    hindiTitle: 'सांभर मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'A quintessential South Indian blend of slow-roasted lentils and aromatic spices for authentic, deeply flavorful Sambhar.',
    badge: '',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-07',
  },
  {
    id: 'kitchen-king-masala',
    title: 'Kitchen King Masala',
    hindiTitle: 'किचन किंग मसाला',
    category: 'masala-blends',
    dietaryType: 'both', // Kitchen King veg aur non-veg sabhi curries me dalti hai
    description: 'The ultimate all-purpose spice blend that adds a royal aroma and taste to any mixed vegetable or gravy preparation.',
    badge: 'Must Have',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-08',
  },
  {
    id: 'sabji-masala',
    title: 'Sabji Masala',
    hindiTitle: 'सब्जी मसाला',
    category: 'masala-blends',
    dietaryType: 'both', // Everyday sabzi & dry fry
    description: 'A versatile, everyday spice mixture that brings bright flavor and traditional aroma to dry and gravy vegetable dishes.',
    badge: '',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-09',
  },
  {
    id: 'rajma-masala',
    title: 'Rajma Masala',
    hindiTitle: 'राजमा मसाला',
    category: 'masala-blends',
    dietaryType: 'veg',
    description: 'A robust, warming mix of fragrant spices for a thick, velvety and comforting homestyle Punjabi Rajma.',
    badge: '',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-10',
  },

  // -------------------------------------------------------------
  // 2. Non-Veg Masalas
  // -------------------------------------------------------------
  {
    id: 'chicken-masala',
    title: 'Chicken Masala',
    hindiTitle: 'चिकन मसाला',
    category: 'non-veg',
    dietaryType: 'non-veg', // Non-Veg
    description: 'A perfectly balanced peppery and savory blend crafted for cooking unforgettable, richly spiced homestyle chicken curries.',
    badge: 'Top Seller',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-11',
  },
  {
    id: 'meat-masala',
    title: 'Meat Masala',
    hindiTitle: 'मीट मसाला',
    category: 'non-veg',
    dietaryType: 'non-veg', // Non-Veg
    description: 'A masterful combination of intense, aromatic spices to tenderize and deeply flavor rich mutton and meat gravies.',
    badge: 'Special',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-12',
  },

  // -------------------------------------------------------------
  // 3. Snacks & Street Food
  // -------------------------------------------------------------
  {
    id: 'pav-bhaji-masala',
    title: 'Pav Bhaji Masala',
    hindiTitle: 'पाव भाजी मसाला',
    category: 'snacks',
    dietaryType: 'veg',
    description: 'A fiery, fragrant street-food blend to make the ultimate buttery, spicy and flavorful Mumbai-style Pav Bhaji.',
    badge: 'Street Style',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-13',
  },
  {
    id: 'chaat-masala',
    title: 'Chaat Masala',
    hindiTitle: 'चाट मसाला',
    category: 'snacks',
    dietaryType: 'both', // Can be sprinkled on fruit salads, eggs, kebabs, tikkas
    description: 'A lip-smacking, zesty, and tangy spice mix to sprinkle over snacks, salads, fruits, papdi chaat, and grilled appetisers.',
    badge: 'All-Rounder',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-14',
  },
  {
    id: 'pani-puri-masala',
    title: 'Pani Puri Masala',
    hindiTitle: 'पानी पूरी मसाला',
    category: 'snacks',
    dietaryType: 'veg',
    description: 'A refreshing, minty, and spicy blend to recreate the authentic, tangy and digestive flavor of street-side Pani Puri ka teekha paani.',
    badge: 'Fun Times',
    featured: false,
    inStock: true,
    weights: [
      { weight: '35g', price: 20 },
      { weight: '70g', price: 38 },
      { weight: '100g', price: 55 },
    ],
    createdAt: '2026-01-15',
  },
  {
    id: 'pasta-masala',
    title: 'Pasta Masala',
    hindiTitle: 'पास्ता मसाला',
    category: 'snacks',
    dietaryType: 'both', // Good for both veg macaroni and chicken pasta
    description: 'An exciting Indo-Italian fusion blend that adds the perfect savory, spicy kick to your macaroni, noodles, and pasta.',
    badge: 'Kids Favorite',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-16',
  },
  {
    id: 'raita-masala',
    title: 'Raita Masala',
    hindiTitle: 'रायता मसाला',
    category: 'snacks',
    dietaryType: 'veg',
    description: 'A cooling, roasted-cumin and black-salt forward mix to instantly elevate the flavor of fresh curd, boondi, and vegetable raita.',
    badge: '',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-17',
  },

  // -------------------------------------------------------------
  // 4. Premium Blends
  // -------------------------------------------------------------
  {
    id: 'garam-masala',
    title: 'Premium Garam Masala',
    hindiTitle: 'शाही गरम मसाला',
    category: 'premium',
    dietaryType: 'both', // Garam masala is the crown spice for both veg and non-veg delicacies!
    description: 'A highly aromatic, royal traditional blend of hand-selected whole spices providing the perfect fragrant finishing touch.',
    badge: 'Premium',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-18',
  },
  {
    id: 'biryani-masala',
    title: 'Biryani Masala',
    hindiTitle: 'बिरयानी मसाला',
    category: 'premium',
    dietaryType: 'both', // Both Veg Dum Biryani and Chicken/Mutton Dum Biryani!
    description: 'A fragrant, exotic spice mix infused with mace, cardamom and royal aromatics that imparts regal aroma and deep flavor to layered rice.',
    badge: 'Royal Blend',
    featured: true,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-19',
  },

  // -------------------------------------------------------------
  // 5. Pure Spices (Shuddh Masale)
  // -------------------------------------------------------------
  {
    id: 'deggi-mirch',
    title: 'Deggi Mirch',
    hindiTitle: 'देगी मिर्च',
    category: 'pure-spices',
    dietaryType: 'both', // Used in both veg and non-veg curries for natural crimson color
    description: 'A vibrant, mild chili powder specially crafted to impart curries a stunning natural deep red color without excessive pungency.',
    badge: 'Natural Color',
    featured: false,
    inStock: true,
    weights: standardPackWeights,
    createdAt: '2026-01-20',
  },
  {
    id: 'kasuri-methi',
    title: 'Kasuri Methi',
    hindiTitle: 'कसूरी मेथी',
    category: 'pure-spices',
    dietaryType: 'both',
    description: 'Selected premium shade-dried fenugreek leaves that instantly add an unforgettable earthy aroma and restaurant depth to gravies.',
    badge: 'Fragrant',
    featured: false,
    inStock: true,
    weights: [
      { weight: '12g', price: 15 },
      { weight: '25g', price: 25 },
      { weight: '50g', price: 45 },
      { weight: '100g', price: 90 },
    ],
    createdAt: '2026-01-21',
  },
  {
    id: 'lal-mirch-powder',
    title: 'Lal Mirch (Red Chilli Powder)',
    hindiTitle: 'लाल मिर्च पाउडर',
    category: 'pure-spices',
    dietaryType: 'both',
    description: 'A bold, fiery red chili powder ground from handpicked sundried chilies for an authentic, pure and unadulterated spicy punch.',
    badge: 'Pure & Hot',
    featured: false,
    inStock: true,
    weights: [
      { weight: '25g', price: 15 },
      { weight: '50g', price: 25 },
      { weight: '100g', price: 45 },
      { weight: '200g', price: 85 },
    ],
    createdAt: '2026-01-22',
  },
  {
    id: 'haldi-powder',
    title: 'Haldi (Turmeric Powder)',
    hindiTitle: 'शुद्ध हल्दी पाउडर',
    category: 'pure-spices',
    dietaryType: 'both',
    description: 'Pure, radiant golden turmeric with naturally high curcumin content for authentic taste, rich color, and traditional immunity benefits.',
    badge: 'High Curcumin',
    featured: false,
    inStock: true,
    weights: [
      { weight: '35g', price: 15 },
      { weight: '75g', price: 25 },
      { weight: '100g', price: 45 },
      { weight: '200g', price: 85 },
    ],
    createdAt: '2026-01-23',
  },
  {
    id: 'dhania-powder',
    title: 'Dhania (Coriander Powder)',
    hindiTitle: 'धनिया पाउडर',
    category: 'pure-spices',
    dietaryType: 'both',
    description: 'Freshly ground, highly aromatic coriander powder offering a refreshing citrusy aroma and rich herbal base for every dish.',
    badge: 'Farm Fresh',
    featured: false,
    inStock: true,
    weights: [
      { weight: '45g', price: 15 },
      { weight: '90g', price: 25 },
      { weight: '200g', price: 75 },
    ],
    createdAt: '2026-01-24',
  },

  // -------------------------------------------------------------
  // 6. Dry Ingredients
  // -------------------------------------------------------------
  {
    id: 'besan-gram-flour',
    title: 'Besan (Gram Flour)',
    hindiTitle: 'शुद्ध चना बेसन',
    category: 'dry-ingredients',
    dietaryType: 'veg',
    description: 'Finely milled 100% pure chana dal gram flour, perfect for crispy pakoras, festive sweets like laddoos, and thick creamy kadhi.',
    badge: '100% Chana Dal',
    featured: false,
    inStock: true,
    weights: [
      { weight: '200g', price: 35 },
      { weight: '500g', price: 65 },
    ],
    createdAt: '2026-01-25',
  },
  {
    id: 'shahi-bhog-dalia',
    title: 'Shahi Bhog Dalia',
    hindiTitle: 'शाही भोग दलिया',
    category: 'dry-ingredients',
    dietaryType: 'veg',
    description: 'Wholesome, high-fiber broken wheat dalia for a nutritious, light and comforting traditional breakfast porridge or khichdi.',
    badge: 'High Fiber',
    featured: false,
    inStock: true,
    weights: [
      { weight: '140g', price: 15 },
      { weight: '300g', price: 25 },
    ],
    createdAt: '2026-01-26',
  },
  {
    id: 'bandhani-heeng',
    title: 'Bandhani Heeng (Asafoetida)',
    hindiTitle: 'बंधानी हींग',
    category: 'dry-ingredients',
    dietaryType: 'veg',
    description: 'A potent, highly fragrant medicinal resin that provides an unmistakable aroma and soothing digestive support for dal tadkas.',
    badge: 'Essential',
    featured: false,
    inStock: true,
    weights: [
      { weight: '5g', price: 15 },
      { weight: '10g', price: 25 },
    ],
    createdAt: '2026-01-27',
  },
];

/**
 * Default Site Configuration:
 * Brand info, numbers, address, FSSAI, story, stats.
 * Ye sab Admin Panel me live edit ho sakta hai.
 */
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'KASHISH BY M/S SHANKAR FOOD PRODUCTS',
  shortBrand: 'Kashish Masale',
  logoUrl: '/images/kashish-logo.png',
  logoBgColor: '#FAF8ED',
  tagline: 'Purity & Taste, A Unique Blend',
  taglineHindi: 'शुद्धता और स्वाद का अनूठा संगम',
  fssaiNumber: '22723105000242',
  sinceYear: '2017',
  
  heroSubtitle: 'WELCOME TO SHANKAR FOOD PRODUCTS',
  heroBrand: 'KASHISH MASALE',
  
  companyName: 'Shankar Food Products',
  address: 'Packed & Marketed by: Shankar Food Products, Ghaziabad, Uttar Pradesh (U.P.), India-201013',
  primaryPhone: '+91 9213544074',
  secondaryPhone: '7683063554',
  email: 'foodproductsshankar@gmail.com',
  whatsappNumber: '919213544074',
  web3formsAccessKey: '',
  
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  wordpressUrl: 'https://shankarfoodproducts.wordpress.com/',
  
  aboutHeading: 'The Secret to Every Perfect Indian Dish',
  aboutParagraph1: 'At Shankar Food Products, we believe that the soul of every Indian meal lies in its spices. For years, Kashish Masale has been dedicated to bringing you the most authentic, aromatic, and pure spice blends straight from the heart of India.',
  aboutParagraph2: 'We source only the freshest ingredients directly from farms. Each of our masalas is carefully crafted using traditional recipes passed down through generations, ensuring you get that authentic "ghar ka swaad" (homemade taste) in every bite.',
  
  statBlendsCount: 27,
  statNaturalPercent: 100,
  statDistributors: 50,
  statPurePromise: 100,
};
