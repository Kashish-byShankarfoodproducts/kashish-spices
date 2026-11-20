/**
 * ==============================================================================
 * KASHISH MASALE - MasalaManager Component
 * ==============================================================================
 * Admin Panel ka sabse main feature: Naye masale list karna, existing masalo
 * ko edit karna, delete karna, package photo upload karna, aur category / dietary
 * (Veg, Non-Veg, Both) select karna.
 * 
 * Saare changes IndexedDB me turant save hote hain, bina kisi server/code change ke!
 * ==============================================================================
 */

import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { MasalaProduct, DietaryType, ProductWeight } from '../../types';
import { VegBadge } from '../common/VegBadge';
import { PackagePlaceholder } from '../common/PackagePlaceholder';
import { storageService } from '../../services/storageService';

export const MasalaManager: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();

  // Search filter inside admin table
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('all');

  // Modal open state for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [hindiTitle, setHindiTitle] = useState('');
  const [category, setCategory] = useState('masala-blends');
  const [dietaryType, setDietaryType] = useState<DietaryType>('veg');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Pack weights & prices state
  const [weights, setWeights] = useState<ProductWeight[]>([
    { weight: '12g', price: 15 },
    { weight: '25g', price: 25 },
    { weight: '50g', price: 45 },
    { weight: '100g', price: 90 },
  ]);
  const [newWeightInput, setNewWeightInput] = useState('');
  const [newPriceInput, setNewPriceInput] = useState('');

  // Status message
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Open Form for Adding New Masala
  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setHindiTitle('');
    setCategory('masala-blends');
    setDietaryType('veg');
    setDescription('');
    setBadge('');
    setInStock(true);
    setFeatured(false);
    setImages([]);
    setWeights([
      { weight: '12g', price: 15 },
      { weight: '25g', price: 25 },
      { weight: '50g', price: 45 },
      { weight: '100g', price: 90 },
    ]);
    setIsFormOpen(true);
  };

  // Open Form for Editing Existing Masala
  const handleEdit = (prod: MasalaProduct) => {
    setEditingId(prod.id);
    setTitle(prod.title);
    setHindiTitle(prod.hindiTitle || '');
    setCategory(prod.category);
    setDietaryType(prod.dietaryType);
    setDescription(prod.description);
    setBadge(prod.badge || '');
    setInStock(prod.inStock);
    setFeatured(prod.featured);

    const existingImages: string[] = [];
    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
      existingImages.push(...prod.images);
    } else if (prod.imageUrl) {
      existingImages.push(prod.imageUrl);
    }
    setImages(existingImages);

    setWeights(prod.weights || []);
    setIsFormOpen(true);
  };

  // Handle Multiple Images Upload (Convert and compress to Base64)
  const handleImagesFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const newBase64Images: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const base64 = await storageService.compressAndReadImage(files[i]);
        newBase64Images.push(base64);
      }
      setImages((prev) => [...prev, ...newBase64Images]);
    } catch (err) {
      alert('Photos process karne me error aaya. Kripya doosri photo chunein.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  // Remove individual photo
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Set selected photo as primary cover photo (move to index 0)
  const handleSetCover = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  // Add weight row
  const handleAddWeight = () => {
    if (!newWeightInput.trim() || !newPriceInput.trim()) return;
    const priceNum = parseInt(newPriceInput, 10);
    if (isNaN(priceNum) || priceNum <= 0) return;

    setWeights([...weights, { weight: newWeightInput.trim(), price: priceNum }]);
    setNewWeightInput('');
    setNewPriceInput('');
  };

  // Remove weight row
  const handleRemoveWeight = (index: number) => {
    setWeights(weights.filter((_, i) => i !== index));
  };

  // Save (Create or Update) Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Masala ka naam likhna anivarya hai!');
      return;
    }

    const prodId = editingId || title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);

    const productPayload: MasalaProduct = {
      id: prodId,
      title: title.trim(),
      hindiTitle: hindiTitle.trim() || undefined,
      category,
      dietaryType,
      description: description.trim() || `${title} blend with traditional spices.`,
      weights,
      badge: badge.trim() || undefined,
      imageUrl: images.length > 0 ? images[0] : undefined,
      images: images.length > 0 ? images : undefined,
      inStock,
      featured,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      await updateProduct(productPayload);
      setStatusNotice(`"${title}" ko safalta-purvak update kar diya gaya!`);
    } else {
      await addProduct(productPayload);
      setStatusNotice(`Naya masala "${title}" safalta-purvak list ho gaya!`);
    }

    setIsFormOpen(false);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  // Delete Product
  const handleDelete = async (id: string, prodTitle: string) => {
    if (window.confirm(`Kya aap sach me "${prodTitle}" ko website se delete karna chahte hain?`)) {
      await deleteProduct(id);
      setStatusNotice(`"${prodTitle}" ko list se delete kar diya gaya.`);
      setTimeout(() => setStatusNotice(null), 3500);
    }
  };

  // Filtered table rows
  const displayRows = products.filter((p) => {
    const matchesSearch =
      adminSearch === '' ||
      p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (p.hindiTitle && p.hindiTitle.toLowerCase().includes(adminSearch.toLowerCase()));
    const matchesCategory = adminCategory === 'all' || p.category === adminCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.5rem' }}>
            Masala Packages Catalog ({products.length})
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
            Naya masala jodein, photo upload karein, ya existing products ki details update karein.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAddNew}>
          <i className="fa-solid fa-plus"></i>
          <span>Add New Masala</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {statusNotice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            marginBottom: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <i className="fa-solid fa-circle-check"></i>
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Table Search & Category Filter */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          background: 'var(--cream-card)',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)',
        }}
      >
        <div style={{ flex: '1', minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by masala name..."
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
          />
        </div>

        <div style={{ width: '220px' }}>
          <select
            className="form-control"
            value={adminCategory}
            onChange={(e) => setAdminCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div
        style={{
          background: 'var(--cream-card)',
          borderRadius: '14px',
          border: '1px solid var(--gray-200)',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem', fontFamily: 'var(--font-admin)' }}>
          <thead>
            <tr style={{ background: '#F8F5EE', borderBottom: '2px solid #E2D9CC' }}>
              <th style={{ padding: '14px 16px', color: '#2B160C', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Package</th>
              <th style={{ padding: '14px 16px', color: '#2B160C', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Masala Title</th>
              <th style={{ padding: '14px 16px', color: '#2B160C', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '14px 16px', color: '#2B160C', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Dietary Type</th>
              <th style={{ padding: '14px 16px', color: '#2B160C', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Packs & MRP</th>
              <th style={{ padding: '14px 16px', color: '#2B160C', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Stock</th>
              <th style={{ padding: '14px 16px', color: '#2B160C', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.length > 0 ? (
              displayRows.map((prod) => (
                <tr
                  key={prod.id}
                  style={{ borderBottom: '1px solid var(--gray-200)', transition: 'background 0.2s' }}
                >
                  {/* Thumbnail / Pouch */}
                  <td style={{ padding: '12px 16px', width: '70px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        background: 'rgba(212, 160, 23, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid var(--gray-300)',
                      }}
                    >
                      {(() => {
                        const thumb = (prod.images && prod.images.length > 0) ? prod.images[0] : prod.imageUrl;
                        const count = (prod.images && prod.images.length > 0) ? prod.images.length : (prod.imageUrl ? 1 : 0);
                        return thumb ? (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <img
                              src={thumb}
                              alt={prod.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {count > 1 && (
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: '1px',
                                  right: '1px',
                                  background: 'rgba(26, 14, 6, 0.85)',
                                  color: 'var(--gold)',
                                  fontSize: '0.6rem',
                                  padding: '1px 3px',
                                  borderRadius: '3px',
                                  fontWeight: 700,
                                  lineHeight: 1,
                                }}
                              >
                                +{count - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <i className="fa-solid fa-mortar-pestle text-gold" style={{ fontSize: '1.2rem' }}></i>
                        );
                      })()}
                    </div>
                  </td>

                  {/* Title & Hindi Title */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#1A0E06', fontSize: '0.96rem', letterSpacing: '-0.01em' }}>{prod.title}</div>
                    {prod.hindiTitle && (
                      <div style={{ fontSize: '0.84rem', color: '#8B1A1A', fontWeight: 600, fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif", marginTop: '2px' }}>
                        {prod.hindiTitle}
                      </div>
                    )}
                    {prod.badge && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          background: '#8B1A1A',
                          color: '#FFFFFF',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginTop: '3px',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {prod.badge}
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td style={{ padding: '12px 16px', textTransform: 'capitalize', color: '#3A281C', fontWeight: 500, fontSize: '0.88rem' }}>
                    {prod.category.replace('-', ' ')}
                  </td>

                  {/* Dietary Type (Veg / Non-Veg / Both) */}
                  <td style={{ padding: '12px 16px' }}>
                    <VegBadge type={prod.dietaryType} showText={true} />
                  </td>

                  {/* Pack Weights & Prices */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxWidth: '250px' }}>
                      {prod.weights.map((w, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.8rem',
                            padding: '3px 8px',
                            background: '#F8F5EE',
                            borderRadius: '5px',
                            border: '1px solid #D8CEBE',
                            color: '#28170D',
                            fontWeight: 500,
                          }}
                        >
                          {w.weight}: <strong style={{ color: '#1A0E06' }}>₹{w.price}</strong>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: prod.inStock ? '#E2F3E7' : '#FDE8E8',
                        color: prod.inStock ? '#146C36' : '#9B1C1C',
                        border: prod.inStock ? '1px solid #B8E4C4' : '1px solid #F8B4B4',
                        display: 'inline-block',
                      }}
                    >
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Actions (Edit / Delete) */}
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(prod)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(212, 160, 23, 0.15)',
                          color: 'var(--gold-dark)',
                          border: '1px solid var(--gold)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                        title="Edit Masala"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        onClick={() => handleDelete(prod.id, prod.title)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(196, 30, 58, 0.1)',
                          color: 'var(--deep-red)',
                          border: '1px solid var(--deep-red)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                        title="Delete Masala"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--gray-400)' }}>
                  Koi masala nahi mila. Naya masala add karne ke liye upar "+ Add New Masala" dabayein.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          ADD / EDIT MASALA MODAL POPUP
          ========================================================================= */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '840px', padding: '0' }}>
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'var(--maroon-dark)',
                color: 'white',
                borderBottom: '2px solid var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
                {editingId ? 'Edit Masala Package' : 'List New Masala Package'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                style={{ color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                {/* Left Side: Text Fields */}
                <div>
                  {/* Title & Hindi Title */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label className="form-label">Masala Title (English) *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Matar Paneer Masala"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Hindi Title (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. मटर पनीर मसाला"
                        value={hindiTitle}
                        onChange={(e) => setHindiTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div style={{ marginBottom: '14px' }}>
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dietary Preference (Veg / Non-Veg / Both) */}
                  <div style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ marginBottom: '8px' }}>
                      Dietary Type (Masala kiske liye hai?) *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '10px' }}>
                      {/* Veg Card */}
                      <div
                        onClick={() => setDietaryType('veg')}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: dietaryType === 'veg' ? '2px solid #28a745' : '1px solid var(--gray-300)',
                          background: dietaryType === 'veg' ? 'rgba(40, 167, 69, 0.1)' : 'var(--cream-card)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span className="diet-symbol-veg" style={{ marginBottom: '4px' }}></span>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e7e34' }}>
                          🌱 Pure Veg
                        </div>
                      </div>

                      {/* Non-Veg Card */}
                      <div
                        onClick={() => setDietaryType('non-veg')}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: dietaryType === 'non-veg' ? '2px solid #c41e3a' : '1px solid var(--gray-300)',
                          background: dietaryType === 'non-veg' ? 'rgba(196, 30, 58, 0.1)' : 'var(--cream-card)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span className="diet-symbol-non-veg" style={{ marginBottom: '4px' }}></span>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c41e3a' }}>
                          🍗 Non-Veg
                        </div>
                      </div>

                      {/* Both Card */}
                      <div
                        onClick={() => setDietaryType('both')}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: dietaryType === 'both' ? '2px solid var(--gold)' : '1px solid var(--gray-300)',
                          background: dietaryType === 'both' ? 'rgba(212, 160, 23, 0.15)' : 'var(--cream-card)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        <i className="fa-solid fa-star text-gold" style={{ fontSize: '0.85rem' }}></i>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-dark)' }}>
                          ✨ Both (Veg & Non-Veg)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '14px' }}>
                    <label className="form-label">Description / Taste Notes</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      placeholder="e.g. A rich and aromatic blend that perfectly balances spices for a creamy restaurant taste..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Badge & Stock */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label className="form-label">Badge (Optional)</label>
                      <select
                        className="form-control"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                      >
                        <option value="">None</option>
                        <option value="Top Seller">Top Seller</option>
                        <option value="Premium">Premium</option>
                        <option value="Must Have">Must Have</option>
                        <option value="Popular">Popular</option>
                        <option value="Street Style">Street Style</option>
                        <option value="Pure & Hot">Pure & Hot</option>
                        <option value="Farm Fresh">Farm Fresh</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => setInStock(e.target.checked)}
                        />
                        <span>In Stock (Available)</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                        />
                        <span>Show on Home Featured</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Side: Image Upload & Pack Weights/Pricing */}
                <div>
                  {/* Package Images Upload System (Multiple Images Supported) */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label className="form-label" style={{ margin: 0 }}>
                        Package Photos ({images.length} uploaded)
                      </label>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        Website par hover karne par bari-bari slide hongi
                      </span>
                    </div>

                    <div
                      style={{
                        border: '2px dashed var(--gold)',
                        borderRadius: '12px',
                        padding: '16px',
                        background: 'rgba(212, 160, 23, 0.04)',
                        position: 'relative',
                      }}
                    >
                      {images.length > 0 ? (
                        <div>
                          {/* Grid of uploaded images */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                              gap: '12px',
                              marginBottom: '14px',
                            }}
                          >
                            {images.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                style={{
                                  position: 'relative',
                                  borderRadius: '8px',
                                  border: idx === 0 ? '2px solid var(--gold)' : '1px solid var(--gray-300)',
                                  background: '#FFFFFF',
                                  padding: '4px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  boxShadow: idx === 0 ? '0 0 0 1px var(--gold)' : 'var(--shadow-sm)',
                                }}
                              >
                                {idx === 0 && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: '4px',
                                      left: '4px',
                                      background: 'var(--gold)',
                                      color: '#1a0e06',
                                      fontSize: '0.62rem',
                                      fontWeight: 800,
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      zIndex: 2,
                                    }}
                                  >
                                    ★ Cover
                                  </span>
                                )}
                                <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                  <img
                                    src={imgUrl}
                                    alt={`Upload ${idx + 1}`}
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '4px', width: '100%', marginTop: '6px' }}>
                                  {idx !== 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetCover(idx)}
                                      title="Set as Cover Photo"
                                      style={{
                                        flex: 1,
                                        padding: '3px 0',
                                        fontSize: '0.68rem',
                                        background: 'rgba(212, 160, 23, 0.15)',
                                        color: 'var(--maroon)',
                                        border: '1px solid var(--gold)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                      }}
                                    >
                                      Set Cover
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    title="Delete this photo"
                                    style={{
                                      padding: '3px 8px',
                                      fontSize: '0.68rem',
                                      background: '#fee2e2',
                                      color: '#dc2626',
                                      border: '1px solid #fca5a5',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      marginLeft: idx === 0 ? 'auto' : '0',
                                    }}
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add More Photos Button */}
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              id="addMoreImagesInput"
                              onChange={handleImagesFilesChange}
                              style={{ display: 'none' }}
                            />
                            <label
                              htmlFor="addMoreImagesInput"
                              className="btn btn-outline"
                              style={{ padding: '6px 16px', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <i className="fa-solid fa-plus"></i>
                              <span>+ Add More Photos</span>
                            </label>
                            {uploadingImages && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--maroon)', fontWeight: 600 }}>
                                <i className="fa-solid fa-spinner fa-spin"></i> Processing photos...
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <i className="fa-solid fa-images text-gold" style={{ fontSize: '2.2rem', marginBottom: '8px' }}></i>
                          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 600, marginBottom: '4px' }}>
                            Upload Masala Package Photos
                          </p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: '12px' }}>
                            Aap ek saath kitni bhi photos select kar sakte hain (PNG / JPG / WebP).
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            id="packageImageInput"
                            onChange={handleImagesFilesChange}
                            style={{ display: 'none' }}
                          />
                          <label
                            htmlFor="packageImageInput"
                            className="btn btn-outline"
                            style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                          >
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                            <span>Choose Photos (Select Multiple)</span>
                          </label>
                          {uploadingImages && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--maroon)', fontWeight: 600, marginTop: '8px' }}>
                              <i className="fa-solid fa-spinner fa-spin"></i> Processing photos...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pack Sizes & MRP Pricing Config */}
                  <div>
                    <label className="form-label">Pack Sizes & MRP (Prices)</label>
                    <div
                      style={{
                        background: 'var(--gray-100)',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid var(--gray-300)',
                        marginBottom: '10px',
                        maxHeight: '160px',
                        overflowY: 'auto',
                      }}
                    >
                      {weights.map((w, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 0',
                            borderBottom: '1px dashed var(--gray-300)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <span><strong>{w.weight}</strong> Pack</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: 'var(--maroon)', fontWeight: 700 }}>₹{w.price}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveWeight(idx)}
                              style={{ color: '#c41e3a', fontSize: '0.85rem' }}
                              title="Delete pack size"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add new weight row inputs */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Size (e.g. 50g)"
                        className="form-control"
                        style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                        value={newWeightInput}
                        onChange={(e) => setNewWeightInput(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="₹ MRP"
                        className="form-control"
                        style={{ padding: '6px 10px', fontSize: '0.82rem', width: '90px' }}
                        value={newPriceInput}
                        onChange={(e) => setNewPriceInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddWeight}
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--gray-200)',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsFormOpen(false)}
                  style={{ borderColor: 'var(--gray-400)', color: 'var(--gray-600)' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 28px' }}>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Save Masala</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
