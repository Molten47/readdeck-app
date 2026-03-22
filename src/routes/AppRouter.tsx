import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from '../context/AuthContext';
import { ThemeProvider }   from '../context/ThemeContext';
import { CartProvider }    from '../context/CartContext';
import ProtectedRoute      from './ProtectedRoute';
import VendorRoute         from './VendorRoute';
import DashboardLayout     from '../components/layouts/DashboardLayout';
import { AddressProvider } from '../context/AddressContext';

// ── Eager imports ─────────────────────────────────────────────────
import LoginPage    from '../pages/LoginPage';
import SignupPage   from '../pages/SignupPage';
import LandingPage  from '../pages/LandingPage';
import NotFoundPage from '../pages/NotFoundPage';

// ── Lazy imports — reader ─────────────────────────────────────────
const DashboardPage       = lazy(() => import('../pages/DashboardPage'));
const CartPage            = lazy(() => import('../pages/cart/CartPage'));
const BooksPage           = lazy(() => import('../pages/books/BookPage'));
const BookDetailPage      = lazy(() => import('../pages/books/BookDetailsPage'));
const BookstoresPage      = lazy(() => import('../pages/bookstores/BookstorePage'));
const BookstoreDetailPage = lazy(() => import('../pages/bookstores/BookstoreDetailPage'));
const OrdersPage          = lazy(() => import('../pages/orders/OrdersPage'));
const OrderDetailPage     = lazy(() => import('../pages/orders/OrderDetailsPage'));
const EventsPage          = lazy(() => import('../pages/events/EventsPage'));
const BecomeVendorPage    = lazy(() => import('../pages/vendors/BecomeVendorsPage'));

// ── Lazy imports — vendor ─────────────────────────────────────────
const VendorLayout      = lazy(() => import('../pages/vendor/VendorLayout'));
const VendorDashboard   = lazy(() => import('../pages/vendor/VendorDashboard'));
const VendorOrders      = lazy(() => import('../pages/vendor/VendorOrders'));
const VendorOrderDetail = lazy(() => import('../pages/vendor/VendorOrderDetails'));
const VendorInventory   = lazy(() => import('../pages/vendor/VendorInventory'));
const VendorSetupPage = lazy(() => import('../pages/vendor/VendorSetupPage'));

// ── Suspense fallback ─────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#0F0C09',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      border: '2px solid #2A2118',
      borderTopColor: '#E8622A',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── Router ────────────────────────────────────────────────────────
const AppRouter: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AddressProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>

                {/* ── Public ── */}
                <Route path="/"       element={<LandingPage />} />
                <Route path="/login"  element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* ── Protected reader routes ── */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard"     element={<DashboardPage />} />
                    <Route path="/cart"          element={<CartPage />} />
                    <Route path="/books"         element={<BooksPage />} />
                    <Route path="/books/:id"     element={<BookDetailPage />} />
                    <Route path="/bookstores"    element={<BookstoresPage />} />
                    <Route path="/bookstores/:id" element={<BookstoreDetailPage />} />
                    <Route path="/orders"        element={<OrdersPage />} />
                    <Route path="/orders/:id"    element={<OrderDetailPage />} />
                    <Route path="/events"        element={<EventsPage />} />
                    <Route path="/become-vendor" element={<BecomeVendorPage />} />
                  </Route>
                </Route>

                {/* ── Protected vendor routes — role = vendor | admin ── */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<VendorRoute />}>
                    <Route element={<VendorLayout />}>
                      <Route path="/vendor"              element={<VendorDashboard />} />
                      <Route path="/vendor/orders"       element={<VendorOrders />} />
                      <Route path="/vendor/orders/:id"   element={<VendorOrderDetail />} />
                      <Route path="/vendor/inventory"    element={<VendorInventory />} />
                      <Route path="/vendor/setup"        element={<VendorSetupPage />} /> 
                    </Route>
                  </Route>
                </Route>

                {/* ── Fallback ── */}
                <Route path="*" element={<NotFoundPage />} />

              </Routes>
            </Suspense>
          </AddressProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default AppRouter;