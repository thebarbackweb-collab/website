import React, { useState, useEffect } from 'react';
import { getAllEquipments, createEquipment, updateEquipment, deleteEquipment } from '../../services/firebase/equipments';
import type { Equipment } from '../../types';
import Button from '../ui/Button';
import { Trash2, Edit, Plus } from 'lucide-react';

const EquipmentManager: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as string[],
    category: 'Rent' as 'Rent' | 'Sales',
    pricingType: 'per hour' as 'per hour' | 'per day' | 'per unit',
    price: 0,
    status: 'available' as 'available' | 'rented'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllEquipments();
      setEquipments(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'rented' : 'available';
    try {
      await updateEquipment(id, { status: newStatus as any });
      loadData();
    } catch (e) {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipment(id);
        loadData();
      } catch (e) {
        alert("Error deleting");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImages = [...formData.images];
        newImages[index] = base64String;
        setFormData({ ...formData, images: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages[index] = '';
    setFormData({ ...formData, images: newImages });
  };

  const openEditModal = (equipment: Equipment) => {
    setEditingId(equipment.id);
    setFormData({
      title: equipment.title,
      description: equipment.description || '',
      images: [...equipment.images],
      category: equipment.category || 'Rent',
      pricingType: equipment.pricingType,
      price: equipment.price,
      status: equipment.status
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', images: [], category: 'Rent', pricingType: 'per hour', price: 0, status: 'available' });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0 || !formData.images[0]) {
      alert("At least one image is mandatory.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        images: formData.images.filter(img => img), // Remove empties
        category: formData.category,
        pricingType: formData.category === 'Sales' ? 'per unit' : formData.pricingType,
        price: formData.price,
        status: formData.status,
      };

      if (editingId) {
        await updateEquipment(editingId, payload);
      } else {
        await createEquipment(payload);
      }
      
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', description: '', images: [], category: 'Rent', pricingType: 'per hour', price: 0, status: 'available' });
      loadData();
    } catch (err) {
      alert("Failed to save equipment");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading equipments...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Ingredients & Rent Equipment</h2>
        <Button onClick={openAddModal}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Equipment
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Pricing</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={e.images[0]} alt={e.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{e.title}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>₹{e.price} {e.pricingType}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)' }}>
                    {e.category || 'Rent'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    background: e.status === 'available' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: e.status === 'available' ? '#4ade80' : '#f87171'
                  }}>
                    {e.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Button variant="ghost" onClick={() => handleToggleStatus(e.id, e.status)} style={{ padding: '0.5rem', marginRight: '0.5rem' }}>
                    {e.status === 'available' ? 'Mark Rented' : 'Mark Available'}
                  </Button>
                  <Button variant="ghost" onClick={() => openEditModal(e)} style={{ padding: '0.5rem', marginRight: '0.5rem', color: '#60a5fa' }}>
                    <Edit size={18} />
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(e.id)} style={{ padding: '0.5rem', color: '#f87171' }}>
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
            {equipments.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No equipments found. Add some!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
              {editingId ? 'Edit Item' : 'Add Item'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Image Upload Row */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Product Images (1 Required, Max 3) <span style={{ color: '#f87171' }}>*</span></label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[0, 1, 2].map((index) => (
                    <div key={index} style={{ flex: 1, position: 'relative' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id={`equip-img-${index}`} 
                        onChange={(e) => handleImageUpload(e, index)}
                        style={{ display: 'none' }}
                      />
                      {formData.images[index] ? (
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <img src={formData.images[index]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button" 
                            onClick={() => removeImage(index)}
                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <label 
                          htmlFor={`equip-img-${index}`}
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: '100%', 
                            aspectRatio: '1/1', 
                            background: '#1f2937', 
                            border: index === 0 ? '2px dashed var(--color-primary)' : '2px dashed rgba(255,255,255,0.2)', 
                            borderRadius: '12px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: index === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)'
                          }}
                        >
                          <Plus size={24} style={{ marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{index === 0 ? 'Main Image' : 'Optional'}</span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Title <span style={{ color: '#f87171' }}>*</span></label>
                <input required type="text" placeholder="e.g. Premium Portable Bar Counter" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.875rem 1rem', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Category <span style={{ color: '#f87171' }}>*</span></label>
                  <select value={formData.category} onChange={e => {
                      const cat = e.target.value as 'Rent' | 'Sales';
                      setFormData({...formData, category: cat, pricingType: cat === 'Sales' ? 'per unit' : 'per hour'});
                    }} style={{ width: '100%', padding: '0.875rem 1rem', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="Rent">Rent Equipment</option>
                    <option value="Sales">Ingredients Sales</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Cost Amount (₹) <span style={{ color: '#f87171' }}>*</span></label>
                  <input required type="number" min="0" placeholder="e.g. 1500" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{ width: '100%', padding: '0.875rem 1rem', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
                {formData.category === 'Rent' ? (
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Pricing Model</label>
                    <select value={formData.pricingType} onChange={e => setFormData({...formData, pricingType: e.target.value as any})} style={{ width: '100%', padding: '0.875rem 1rem', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                      <option value="per hour">Per Hour</option>
                      <option value="per day">Per Day</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Pricing Model</label>
                    <input disabled type="text" value="Per Unit" style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', borderRadius: '8px', outline: 'none' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} style={{ width: '100%', padding: '0.875rem 1rem', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                  <option value="available">Available in Stock</option>
                  <option value="rented">Currently Rented Out</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Description (Optional)</label>
                <textarea placeholder="Provide any specifications, dimensions, or details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.875rem 1rem', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', minHeight: '100px', resize: 'vertical' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" variant="ghost" onClick={() => { setShowModal(false); setEditingId(null); }} style={{ flex: 1 }} disabled={isSaving}>Cancel</Button>
                <Button type="submit" size="lg" style={{ flex: 2 }} disabled={isSaving}>
                  {isSaving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Item')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManager;
