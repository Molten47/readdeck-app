import { useState, useEffect } from 'react';
import { useCartContext, type CartGroup, type CartItem } from '../../context/CartContext';
import { useAddresses, type SavedAddress } from '../../context/AddressContext';
import { useNavigate } from 'react-router-dom';

export type CheckoutStage = 'select' | 'address' | 'confirm' | 'success';

export interface OrderResult {
  id:           string;
  bookstore_id: string;
  status:       string;
  total_amount: number;
  delivery_fee: number;
  placed_at:    string;
}

export function useCheckout(group: CartGroup | null, onClose: () => void) {
  const { placeOrder }                                    = useCartContext();
  const { addresses, defaultAddress, createAddress }      = useAddresses();
  const navigate                                          = useNavigate();

  const [stage,       setStage]       = useState<CheckoutStage>('select');
  const [selected,    setSelected]    = useState<Set<string>>(
    new Set(group?.items.map(i => i.id) ?? [])
  );

  // Address state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewForm,       setShowNewForm]        = useState(false);
  const [newLabel,          setNewLabel]           = useState('Home');
  const [newAddress,        setNewAddress]         = useState('');
  const [newCity,           setNewCity]            = useState('');
  const [newPhone,          setNewPhone]           = useState('');
  const [saveNewAddress,    setSaveNewAddress]      = useState(true);

  const [notes,       setNotes]       = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  // Pre-select default address when modal opens
  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
    // If no saved addresses exist, show the new form immediately
    if (addresses.length === 0) {
      setShowNewForm(true);
    }
  }, [defaultAddress, addresses.length]);

  // ── Item selection ────────────────────────────────────────────

  const toggleItem = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!group) return;
    selected.size === group.items.length
      ? setSelected(new Set())
      : setSelected(new Set(group.items.map(i => i.id)));
  };

  const selectedItems: CartItem[] = group?.items.filter(i => selected.has(i.id)) ?? [];
  const selectedSubtotal = selectedItems.reduce((sum, i) => sum + i.subtotal, 0);
  const deliveryFee      = 500; // flat until bookstore fee is in cart response
  const grandTotal       = selectedSubtotal + deliveryFee;

  // ── Address helpers ───────────────────────────────────────────

  const selectedAddress: SavedAddress | null =
    addresses.find(a => a.id === selectedAddressId) ?? null;

  // The address string we send to the backend
  const resolvedAddress = selectedAddress
    ? `${selectedAddress.address}, ${selectedAddress.city} — ${selectedAddress.phone}`
    : newAddress.trim()
      ? `${newAddress.trim()}, ${newCity.trim()} — ${newPhone.trim()}`
      : '';

  // ── Validation ────────────────────────────────────────────────

  const canProceedToAddress = selected.size > 0;

  const canConfirm = showNewForm || !selectedAddressId
    ? newAddress.trim().length > 5 && newCity.trim().length > 0 && newPhone.trim().length > 6
    : !!selectedAddressId;

  // ── Confirm ───────────────────────────────────────────────────

  const handleConfirm = async () => {
    if (!group || !canConfirm) return;
    setSubmitting(true);
    setError(null);

    try {
      // If user filled new form and wants to save it
      if ((showNewForm || !selectedAddressId) && saveNewAddress) {
        await createAddress({
          label:      newLabel || 'Home',
          address:    newAddress.trim(),
          city:       newCity.trim(),
          phone:      newPhone.trim(),
          is_default: addresses.length === 0,
        });
      }

      const data = await placeOrder({
        bookstore_id:  group.bookstore_id,
        cart_item_ids: Array.from(selected),
        address:       resolvedAddress,
        notes:         notes.trim() || undefined,
      });

      setOrderResult(data);
      setStage('success');
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackOrder = () => {
    onClose();
    navigate('/orders');
  };

  const handleContinueShopping = () => onClose();

  return {
    stage, setStage,
    selected, toggleItem, toggleAll,
    selectedItems, selectedSubtotal,
    deliveryFee, grandTotal,
    // address
    addresses, selectedAddressId, setSelectedAddressId,
    showNewForm, setShowNewForm,
    newLabel, setNewLabel,
    newAddress, setNewAddress,
    newCity, setNewCity,
    newPhone, setNewPhone,
    saveNewAddress, setSaveNewAddress,
    resolvedAddress,
    notes, setNotes,
    submitting, error,
    orderResult,
    canProceedToAddress, canConfirm,
    handleConfirm,
    handleTrackOrder,
    handleContinueShopping,
  };
}