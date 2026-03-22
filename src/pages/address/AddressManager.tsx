import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Star, Trash2, MapPin, Loader, Check } from 'lucide-react';
import { useAddresses, type SavedAddress } from '../../context/AddressContext';
import { useTheme } from '../../context/ThemeContext';
import './addressManager.css';

interface AddressManagerProps {
  onClose: () => void;
}

interface AddressFormState {
  label:   string;
  address: string;
  city:    string;
  phone:   string;
}

const EMPTY_FORM: AddressFormState = { label: '', address: '', city: '', phone: '' };

const AddressManager: React.FC<AddressManagerProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const {
    addresses, loading,
    createAddress, deleteAddress, setDefaultAddress,
  } = useAddresses();

  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState<AddressFormState>(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const [settingId,   setSettingId]   = useState<string | null>(null);
  const [formError,   setFormError]   = useState<string | null>(null);
  const [successId,   setSuccessId]   = useState<string | null>(null);

  const themeClass = isDark ? '' : ' addr-manager--light';

  const handleField = (field: keyof AddressFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.address.trim() || !form.city.trim() || !form.phone.trim()) {
      setFormError('Address, city and phone are required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await createAddress({
        label:      form.label.trim() || 'Home',
        address:    form.address.trim(),
        city:       form.city.trim(),
        phone:      form.phone.trim(),
        is_default: addresses.length === 0,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      setFormError('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addr: SavedAddress) => {
    if (addr.is_default) return;
    setSettingId(addr.id);
    try {
      await setDefaultAddress(addr.id);
      setSuccessId(addr.id);
      setTimeout(() => setSuccessId(null), 1500);
    } finally {
      setSettingId(null);
    }
  };

  return (
    <motion.div
      className={`addr-manager${themeClass}`}
      initial={{ opacity: 0, scale: 0.97, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      {/* Header */}
      <div className="addr-manager__header">
        <div className="addr-manager__header-left">
          <MapPin size={14} color="#E8622A" />
          <span>Saved Addresses</span>
        </div>
        <button className="addr-manager__close" onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      {/* Address list */}
      <div className="addr-manager__list">
        {loading && (
          <div className="addr-manager__loading">
            <Loader size={16} color="#8A7968" className="addr-manager__spin" />
          </div>
        )}

        {!loading && addresses.length === 0 && !showForm && (
          <p className="addr-manager__empty">No saved addresses yet.</p>
        )}

        <AnimatePresence mode="popLayout">
          {addresses.map(addr => (
            <motion.div
              key={addr.id}
              className="addr-manager__item"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <div className="addr-manager__item-body">
                <div className="addr-manager__item-top">
                  <span className="addr-manager__label">{addr.label}</span>
                  {addr.is_default && (
                    <span className="addr-manager__default-pill">
                      <Star size={9} /> Default
                    </span>
                  )}
                </div>
                <p className="addr-manager__address">{addr.address}</p>
                <p className="addr-manager__meta">{addr.city} · {addr.phone}</p>
              </div>

              <div className="addr-manager__item-actions">
                {/* Set default */}
                <button
                  className={`addr-manager__action-btn${addr.is_default ? ' addr-manager__action-btn--active' : ''}`}
                  onClick={() => handleSetDefault(addr)}
                  title="Set as default"
                  disabled={addr.is_default || settingId === addr.id}
                >
                  {settingId === addr.id
                    ? <Loader size={12} className="addr-manager__spin" />
                    : successId === addr.id
                      ? <Check size={12} color="#22C55E" />
                      : <Star size={12} />
                  }
                </button>

                {/* Delete */}
                <button
                  className="addr-manager__action-btn addr-manager__action-btn--delete"
                  onClick={() => handleDelete(addr.id)}
                  title="Delete address"
                  disabled={deletingId === addr.id}
                >
                  {deletingId === addr.id
                    ? <Loader size={12} className="addr-manager__spin" />
                    : <Trash2 size={12} />
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="addr-manager__form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="addr-manager__form-row">
              <input
                className="addr-manager__input"
                placeholder="Label (Home, Office…)"
                value={form.label}
                onChange={handleField('label')}
              />
              <input
                className="addr-manager__input"
                placeholder="City *"
                value={form.city}
                onChange={handleField('city')}
              />
            </div>
            <textarea
              className="addr-manager__input addr-manager__textarea"
              placeholder="Full address *"
              value={form.address}
              onChange={handleField('address')}
              rows={2}
            />
            <input
              className="addr-manager__input"
              placeholder="Phone number for rider *"
              value={form.phone}
              onChange={handleField('phone')}
            />
            {formError && (
              <p className="addr-manager__form-error">{formError}</p>
            )}
            <div className="addr-manager__form-actions">
              <button
                className="addr-manager__cancel-btn"
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(null); }}
              >
                Cancel
              </button>
              <button
                className="addr-manager__save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader size={12} className="addr-manager__spin" /> : null}
                Save address
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add button */}
      {!showForm && (
        <button
          className="addr-manager__add-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={13} />
          Add new address
        </button>
      )}
    </motion.div>
  );
};

export default AddressManager;