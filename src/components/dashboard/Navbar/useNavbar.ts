import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate }    from 'react-router-dom';
import { useAuth }        from '../../../context/AuthContext';
import { useTheme }       from '../../../context/ThemeContext';
import { useCartContext } from '../../../context/CartContext';
import axiosInstance      from '../../../api/axiosInstance';

export const useNavbar = () => {
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [cartOpen,       setCartOpen]       = useState(false);
  const [ordersCount,    setOrdersCount]    = useState(0);
  const [drawerOpen,     setDrawerOpen]     = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef   = useRef<HTMLDivElement>(null);
  const cartRef     = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const navigate                                         = useNavigate();
  const { user, loading: authLoading, logout, isVendor } = useAuth();
  const { theme, toggleTheme, isDark }                   = useTheme();
  const { cart, loading: cartLoading }                   = useCartContext();

  // ── Scroll detection ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close drawer on resize to desktop ─────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setDrawerOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Lock body scroll when drawer is open ──────────────────────
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // ── Click outside to close dropdowns ─────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Swipe gesture handlers ────────────────────────────────────
  // Swipe right from left edge → open drawer
  // Swipe left anywhere when open → close drawer
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

    // Only register horizontal swipes (not accidental vertical scrolls)
    if (deltaY > 60) return;

    // Swipe right from left edge → open
    if (!drawerOpen && deltaX > 50 && touchStartX.current < 60) {
      setDrawerOpen(true);
    }

    // Swipe left when open → close
    if (drawerOpen && deltaX < -50) {
      setDrawerOpen(false);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [drawerOpen]);

  // ── Fetch active orders count ─────────────────────────────────
  useEffect(() => {
    if (authLoading || !user) {
      setOrdersCount(0);
      return;
    }
    const controller = new AbortController();
    axiosInstance
      .get('/orders', { signal: controller.signal })
      .then(r => {
        const active = (r.data.orders ?? []).filter((o: { status: string }) =>
          ['pending', 'confirmed', 'preparing', 'in_transit'].includes(o.status)
        );
        setOrdersCount(active.length);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [user, authLoading]);

  const handleLogout = async () => {
    setOrdersCount(0);
    setDrawerOpen(false);
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Orders',          icon: 'Package',   path: '/orders'        },
    { label: 'Bookstores',      icon: 'Store',     path: '/bookstores'    },
    { label: 'Books',           icon: 'BookOpen',  path: '/books'         },
    { label: 'Events',          icon: 'Calendar',  path: '/events'        },
    { label: 'Become a Vendor', icon: 'Handshake', path: '/become-vendor' },
  ];

  return {
    isScrolled,
    dropdownOpen,   setDropdownOpen,
    avatarMenuOpen, setAvatarMenuOpen,
    cartOpen,       setCartOpen,
    drawerOpen,     setDrawerOpen,
    dropdownRef, avatarRef, cartRef,
    user, handleLogout,
    theme, toggleTheme, isDark,
    navItems, navigate,
    cart, cartLoading,
    ordersCount,
    isVendor,
    handleTouchStart,
    handleTouchEnd,
  };
};