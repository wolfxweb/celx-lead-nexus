import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import Produtos from '@/pages/Produtos';
import Sobre from '@/pages/Sobre';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BlogAdmin from '@/pages/BlogAdmin';
import UserAdmin from '@/pages/UserAdmin';
import Unauthorized from '@/pages/Unauthorized';
import Store from '@/pages/Store';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import MyAccount from '@/pages/MyAccount';
import ProductAdmin from '@/pages/ProductAdmin';
import OrderAdmin from '@/pages/OrderAdmin';
import AdminDashboard from '@/pages/AdminDashboard';
import BaserowTest from '@/components/BaserowTest';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin Routes with AdminLayout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/produtos"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <ProductAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/pedidos"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <OrderAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <UserAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/blog-admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <BlogAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Public Routes with Header */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-gray-50">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/produtos" element={<Produtos />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogPost />} />
                      <Route path="/sobre" element={<Sobre />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      
                      {/* E-commerce Routes */}
                      <Route path="/loja" element={<Store />} />
                      <Route path="/produto/:id" element={<ProductDetail />} />
                      <Route path="/carrinho" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      
                      {/* Baserow Test Route */}
                      <Route path="/baserow-test" element={<BaserowTest />} />
                      
                      {/* Protected User Routes */}
                      <Route
                        path="/minha-conta"
                        element={
                          <ProtectedRoute allowedRoles={['user', 'admin']}>
                            <MyAccount />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
