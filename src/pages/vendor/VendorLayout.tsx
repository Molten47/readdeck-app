import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, ShoppingBag, Package, LogOut,
  Store, ChevronLeft, ChevronRight, Sun, Moon,
} from 'lucide-react';
import './vendor.css';

const NAV = [
  { label: 'Dashboard',  icon: LayoutDashboard, path: '/vendor' },
  { label: 'Orders',     icon: ShoppingBag,     path: '/vendor/orders' },
  { label: 'Inventory',  icon: Package,         path: '/vendor/inventory' },
];

const VendorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'V';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`vd-shell${isDark ? '' : ' vd-shell--light'}`}>

      {/* ── Sidebar ── */}
      <aside className={`vd-sidebar${collapsed ? ' vd-sidebar--collapsed' : ''}`}>

        {/* Logo */}
        <div className="vd-sidebar__logo" onClick={() => navigate('/dashboard')}>
          {collapsed ? (
            <span className="vd-sidebar__logo-icon">r</span>
          ) : (
            <span className="vd-sidebar__logo-full">
              read<strong>deck</strong>
              <span className="vd-sidebar__logo-tag">vendor</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="vd-sidebar__nav">
          {NAV.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/vendor' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                className={`vd-sidebar__item${active ? ' vd-sidebar__item--active' : ''}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={17} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="vd-sidebar__spacer" />

        {/* Store link */}
        <button
          className="vd-sidebar__item vd-sidebar__item--muted"
          onClick={() => navigate('/dashboard')}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <Store size={17} />
          {!collapsed && <span>Back to Store</span>}
        </button>

        {/* Theme toggle */}
        <button
          className="vd-sidebar__item vd-sidebar__item--muted"
          onClick={toggleTheme}
          title={collapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          {!collapsed && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
        </button>

        {/* User + logout */}
        <div className="vd-sidebar__user">
          <div className="vd-sidebar__avatar">{initials}</div>
          {!collapsed && (
            <div className="vd-sidebar__user-info">
              <p className="vd-sidebar__user-name">{user?.username}</p>
              <p className="vd-sidebar__user-role">Vendor</p>
            </div>
          )}
          <button
            className="vd-sidebar__logout"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          className="vd-sidebar__collapse"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="vd-main">
        <Outlet />
      </main>

    </div>
  );
};

export default VendorLayout;