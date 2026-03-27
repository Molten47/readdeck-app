import React from 'react';
import {
  Package, Store, BookOpen, Calendar, Handshake,
  Sun, Moon, LayoutDashboard, Menu, X,
  LogOut, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavbar } from './useNavbar';
import ExploreDropdown from './components/ExploreDropdown';
import CartDropdown    from './components/Cartdropdown';
import AvatarMenu      from './components/AvatarMenu';
import './navbar.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  Package:   <Package         size={15} />,
  Store:     <Store           size={15} />,
  BookOpen:  <BookOpen        size={15} />,
  Calendar:  <Calendar        size={15} />,
  Handshake: <Handshake       size={15} />,
  Dashboard: <LayoutDashboard size={15} />,
};

const DRAWER_ICON_MAP: Record<string, React.ReactNode> = {
  Package:   <Package         size={18} />,
  Store:     <Store           size={18} />,
  BookOpen:  <BookOpen        size={18} />,
  Calendar:  <Calendar        size={18} />,
  Handshake: <Handshake       size={18} />,
};

const Navbar: React.FC = () => {
  const {
    isScrolled,
    dropdownOpen,   setDropdownOpen,
    avatarMenuOpen, setAvatarMenuOpen,
    cartOpen,       setCartOpen,
    drawerOpen,     setDrawerOpen,
    dropdownRef, avatarRef, cartRef,
    user, handleLogout,
    isDark, toggleTheme,
    navItems, navigate,
    ordersCount,
    isVendor,
    handleTouchStart,
    handleTouchEnd,
  } = useNavbar();

  const themeClass  = isDark ? '' : 'navbar--light';
  const scrollClass = isScrolled ? 'navbar--scrolled' : '';
  const initials    = user?.username ? user.username.slice(0, 2).toUpperCase() : '?';

  return (
    <>
      {/* ── Swipe zone (invisible, catches left-edge swipe on mobile) ── */}
      <div
        className="navbar__swipe-zone"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <nav
        className={`navbar ${scrollClass} ${themeClass}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="navbar__inner">

          {/* ── Hamburger — mobile only ── */}
          <button
            className="navbar__hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* ── Logo — desktop full / mobile compact ── */}
          <span className="navbar__logo" onClick={() => navigate('/dashboard')}>
            {/* Desktop: readdeck */}
            <span className="navbar__logo--desktop">
              read<span>deck</span>
            </span>
            {/* Mobile: rd */}
            <span className="navbar__logo--mobile">
              r<span>d</span>
            </span>
          </span>

          {/* ── Explore dropdown — desktop only ── */}
          <div className="navbar__desktop-only">
            <ExploreDropdown
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              navItems={navItems}
              iconMap={ICON_MAP}
              dropdownRef={dropdownRef}
              navigate={navigate}
            />
          </div>

          {/* ── Vendor pill — desktop only ── */}
          {isVendor && (
            <motion.button
              className={`navbar__vendor-pill navbar__desktop-only${isDark ? '' : ' navbar__vendor-pill--light'}`}
              onClick={() => navigate('/vendor')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              title="Vendor Dashboard"
            >
              <LayoutDashboard size={13} />
              <span>Vendor</span>
            </motion.button>
          )}

          <div className="navbar__spacer" />

          {/* ── Find a Book CTA — desktop only ── */}
          <button
            className="navbar__cta navbar__desktop-only"
            onClick={() => navigate('/books')}
          >
            Find a Book
          </button>

          {/* ── Theme toggle ── */}
          <button
            className={`navbar__toggle ${isDark ? '' : 'navbar__toggle--light'}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="navbar__toggle-icon navbar__toggle-icon--moon">
              <Moon size={11} />
            </span>
            <span className="navbar__toggle-icon navbar__toggle-icon--sun">
              <Sun size={11} />
            </span>
            <motion.span
              className="navbar__toggle-thumb"
              animate={{ x: isDark ? '0.15rem' : '1.45rem' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              {isDark
                ? <Moon size={12} color="#0F0C09" />
                : <Sun  size={12} color="#0F0C09" />
              }
            </motion.span>
          </button>

          {/* ── Orders tracker icon ── */}
          <button
            className="navbar__orders-btn"
            onClick={() => navigate('/orders')}
            aria-label="Track orders"
            title="Track orders"
          >
            <Package size={17} />
            <AnimatePresence>
              {ordersCount > 0 && (
                <motion.span
                  className="navbar__orders-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {ordersCount > 9 ? '9+' : ordersCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* ── Cart ── */}
          <CartDropdown
            open={cartOpen}
            setOpen={setCartOpen}
            cartRef={cartRef}
            navigate={navigate}
          />

          {/* ── Avatar — desktop only ── */}
          <div className="navbar__desktop-only">
            <AvatarMenu
              open={avatarMenuOpen}
              setOpen={setAvatarMenuOpen}
              avatarRef={avatarRef}
              username={user?.username}
              email={user?.email}
              initials={initials}
              navigate={navigate}
              onLogout={handleLogout}
              isVendor={isVendor}
            />
          </div>

        </div>
      </nav>

      {/* ── Mobile slide drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="navbar__drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className={`navbar__drawer${isDark ? '' : ' navbar__drawer--light'}`}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Drawer header */}
              <div className="navbar__drawer-header">
                <span className="navbar__drawer-logo">
                  r<span>d</span>
                </span>
                <div className="navbar__drawer-user">
                  <p className="navbar__drawer-username">{user?.username}</p>
                  <p className="navbar__drawer-email">{user?.email}</p>
                  {isVendor && (
                    <span className="navbar__drawer-vendor-badge">Vendor</span>
                  )}
                </div>
                <button
                  className="navbar__drawer-close"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Vendor dashboard link — only for vendors */}
              {isVendor && (
                <button
                  className="navbar__drawer-item navbar__drawer-item--vendor"
                  onClick={() => { navigate('/vendor'); setDrawerOpen(false); }}
                >
                  <span className="navbar__drawer-item-icon">
                    <LayoutDashboard size={18} />
                  </span>
                  <span className="navbar__drawer-item-label">Vendor Dashboard</span>
                  <ChevronRight size={14} className="navbar__drawer-item-arrow" />
                </button>
              )}

              {/* Nav items */}
              <div className="navbar__drawer-nav">
                <p className="navbar__drawer-section-label">Explore</p>
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    className="navbar__drawer-item"
                    onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                  >
                    <span className="navbar__drawer-item-icon">
                      {DRAWER_ICON_MAP[item.icon]}
                    </span>
                    <span className="navbar__drawer-item-label">{item.label}</span>
                    <ChevronRight size={14} className="navbar__drawer-item-arrow" />
                  </motion.button>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="navbar__drawer-footer">
                <button
                  className="navbar__drawer-item navbar__drawer-item--books"
                  onClick={() => { navigate('/books'); setDrawerOpen(false); }}
                >
                  <span className="navbar__drawer-item-icon">
                    <BookOpen size={18} />
                  </span>
                  <span className="navbar__drawer-item-label">Find a Book</span>
                  <ChevronRight size={14} className="navbar__drawer-item-arrow" />
                </button>

                <button
                  className="navbar__drawer-item navbar__drawer-item--logout"
                  onClick={handleLogout}
                >
                  <span className="navbar__drawer-item-icon">
                    <LogOut size={18} />
                  </span>
                  <span className="navbar__drawer-item-label">Sign out</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;