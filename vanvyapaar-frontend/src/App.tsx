import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

// Public Pages
import LandingPage from './pages/public/LandingPageNew'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import ArtisansPage from './pages/public/ArtisansPage'
import AboutPage from './pages/public/AboutPage'
import StoriesPage from './pages/public/StoriesPage'

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import BuyerProducts from './pages/buyer/BuyerProducts'
import BuyerCart from './pages/buyer/BuyerCart'
import BuyerCheckout from './pages/buyer/BuyerCheckout'
import BuyerOrders from './pages/buyer/BuyerOrders'
import BuyerProfile from './pages/buyer/BuyerProfile'

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import SellerOrders from './pages/seller/SellerOrders'
import SellerProfile from './pages/seller/SellerProfile'
import AddProduct from './pages/seller/AddProduct'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSellers from './pages/admin/AdminSellers'
import AdminBuyers from './pages/admin/AdminBuyers'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'

// Layout Components
import PublicLayout from './components/layout/PublicLayout'
import BuyerLayout from './components/layout/BuyerLayout'
import SellerLayout from './components/layout/SellerLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ComingSoon from './pages/common/ComingSoon'

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="artisans" element={<ArtisansPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Buyer Routes */}
      <Route path="/buyer" element={
        <ProtectedRoute allowedRoles={['BUYER']}>
          <BuyerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<BuyerDashboard />} />
        <Route path="products" element={<BuyerProducts />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<BuyerCart />} />
        <Route path="checkout" element={<BuyerCheckout />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="profile" element={<BuyerProfile />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>

      {/* Seller Routes */}
      <Route path="/seller" element={
        <ProtectedRoute allowedRoles={['SELLER']}>
          <SellerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="profile" element={<SellerProfile />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="buyers" element={<AdminBuyers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  )
}

export default App
