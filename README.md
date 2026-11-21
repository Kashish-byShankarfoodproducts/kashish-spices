# KASHISH MASALE & SPICES (कशीश मसाले)
### Premium Indian Spice Catalog & Auth-Based Admin Customizer
Rebuilt with **React 19**, **TypeScript**, and **Vite**.

---

## 🌟 Key Highlights & Features (मुख्य विशेषताएं)

1. **Purani Images Cleaned**: Folders se saari purani image files delete kar di gayi hain taaki aap Admin Panel se fresh high-quality package photos upload kar sakein.
2. **Auth-Based Admin Panel**:
   - **Default Login**:
     - **Username**: `admin`
     - **Password**: `kashish@123`
   - Password change karne ki suvidha bhi Admin Panel ke andar hi di gayi hai.
3. **Live Multi-Device Cloud Sync & Admin Customizer**:
   - **Supabase Cloud Database Integration**: Admin panel ke changes duniya ke har phone aur laptop me bina code push kiye turant live dikhte hain.
   - **1-Click Direct Code Publish**: Bina kisi database ke bhi `defaultData.ts` file download karke 1-click me commit kar sakte hain.
   - Masala ka Title, Hindi Title, Description, Categories.
   - **Package Photo Upload System**: Click ya Drag-and-Drop karke photo upload karein. Multi-image auto-slide on hover aur modal slider.
   - **Automatic Cache Sync**: Purane visitors ke browser ka cache auto-refresh hota hai taaki unhe hamesha latest catalog dikhe.
   - **Dietary Classification**:
     - 🌱 **Pure Veg** (100% Shakahari)
     - 🍗 **Non-Veg** (Mansahari Jaise Chicken, Meat)
     - ✨ **Both (Veg & Non-Veg)** (Multi-purpose masale jaise Garam Masala, Deggi Mirch, Biryani Masala jo dono me upyog hote hain).
   - **Pack Sizes & MRP**: Har pack size (12g, 25g, 50g, 100g, 200g etc.) aur unke rate custom define kar sakte hain.
   - **Live Site Customizer**: Brand Name, Subtitle, Hindi Taglines, Phone Numbers, WhatsApp Number, Email, Address, FSSAI Number, Story aur Stats counter live badlein.
   - **Backup & Restore**: Poore catalog aur uploaded photos ka 1-click JSON backup download & restore.
4. **Customer-Facing Design & Layout**:
   - Original website ka traditional Indian royal layout, maroon & gold color palette, aur Cinzel/Poppins fonts 100% preserve kiye gaye hain.
   - 3D Interactive Card Tilt, Veg/Non-Veg badges, Quick View Modal, WhatsApp bulk order inquiry, aur Dark/Light Mode Theme Toggle.
5. **Code Quality & Optimization**:
   - Har ek file, component, hook aur utility me beginner-friendly comments likhe gaye hain taaki koi bhi aasaani se samajh sake ki konsa code kisse connect hai.

---

## 🚀 How to Run the Project (Website Kaise Chalayein)

### 1. Development Mode (Live Editing & Instant Preview):
```bash
npm run dev
```
Open browser at: `http://localhost:3000`

### 2. Production Build:
```bash
npm run build
```
Creates production bundle in `dist/` folder.

### 3. Preview Production Build:
```bash
npm run preview
```

---

## 📁 Project Architecture (Code Structure)

```
WEB-PROJECT/
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite bundler configuration
├── index.html                # Entry HTML with Cinzel & FontAwesome fonts
└── src/
    ├── main.tsx              # React 19 app entry point with Providers
    ├── App.tsx               # Main layout & Customer vs Admin view router
    ├── index.css             # Traditional Indian theme styling & Dark mode
    ├── types/
    │   └── index.ts          # MasalaProduct, SiteConfig, DietaryType definitions
    ├── services/
    │   ├── defaultData.ts    # 24 authentic default Kashish spice blends
    │   └── storageService.ts # IndexedDB unlimited storage & image compressor
    ├── context/
    │   ├── ProductContext.tsx# Central catalog state, filters & search
    │   ├── AuthContext.tsx   # Admin session & password management
    │   └── ThemeContext.tsx  # Dark / Light theme toggle
    └── components/
        ├── common/
        │   ├── Navbar.tsx             # Sticky header with FSSAI & Admin link
        │   ├── Footer.tsx             # Complete footer with contacts & links
        │   ├── SpiceCard.tsx          # 3D interactive card with Veg/Non-Veg tag
        │   ├── ProductModal.tsx       # Quick view pack sizes & WhatsApp inquiry
        │   ├── VegBadge.tsx           # Standard Indian Veg/Non-Veg/Both emblem
        │   └── PackagePlaceholder.tsx # Royal vector spice pouch illustration
        ├── customer/
        │   ├── HeroSection.tsx        # Hero banner with Hindi tagline & badges
        │   ├── AboutSection.tsx       # Our story & heritage since 2017
        │   ├── FeaturedSection.tsx    # Top-selling masalas showcase
        │   ├── WhyChooseUs.tsx        # The Kashish Promise
        │   ├── StatsSection.tsx       # Live counters (27+ Blends, etc.)
        │   ├── CatalogPage.tsx        # Full shop with Veg/Non-Veg/Category filters
        │   └── ContactPage.tsx        # Contact details & interactive inquiry form
        └── admin/
            ├── AdminLogin.tsx         # Secure admin login portal
            ├── AdminDashboard.tsx     # KPI metrics & navigation tabs
            ├── MasalaManager.tsx      # Add/Edit/Delete products + Image uploader
            ├── SiteCustomizer.tsx     # Live website text & contact customizer
            └── DataBackup.tsx         # 1-Click JSON backup, restore & password change
```

---

## 🔐 Admin Credentials

- **Username**: `admin`
- **Password**: `kashish@123`
*(Aap Admin Panel ke "Backup & Security" tab me jaakar apna password kabhi bhi badal sakte hain).*
