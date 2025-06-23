import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import Header from '@/components/Header';
import WhatsAppButton from '@/components/WhatsAppButton';
import PopupModal from '@/components/PopupModal';
import { CONTACT_CONFIG } from '@/config/contact';
import { usePopup } from '@/hooks/usePopup';
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
import CourseAdmin from '@/pages/CourseAdmin';
import CourseModulesAdmin from '@/pages/CourseModulesAdmin';
import OrderAdmin from '@/pages/OrderAdmin';
import AdminDashboard from '@/pages/AdminDashboard';
import PopupAdmin from '@/pages/PopupAdmin';
import AuthTest from '@/components/AuthTest';
import MeusCursos from './pages/MeusCursos';
import CursoDetalhes from './pages/CursoDetalhes';
import UserLayout from '@/components/UserLayout';
import TestCourseAPI from '@/components/TestCourseAPI';
import './index.css';

// Componente para gerenciar pop-ups nas páginas públicas
const PublicLayout = () => {
  const location = useLocation();
  
  // Mapear rotas para nomes de página
  const getCurrentPage = (pathname: string) => {
    const path = pathname.replace('/', '');
    if (!path) return 'home';
    
    // Mapear rotas específicas
    const pageMap: { [key: string]: string } = {
      '': 'home',
      'home': 'home',
      'sobre': 'sobre',
      'produtos': 'produtos',
      'blog': 'blog',
      'loja': 'loja',
      'carrinho': 'carrinho',
      'checkout': 'checkout',
      'login': 'login',
      'register': 'register'
    };
    
    // Verificar se é uma rota de produto específico
    if (path.startsWith('produto/')) {
      return 'produtos';
    }
    
    // Verificar se é uma rota de blog específico
    if (path.startsWith('blog/')) {
      return 'blog';
    }
    
    return pageMap[path] || path;
  };
  
  const currentPage = getCurrentPage(location.pathname);
  const { popupConfig, showPopup, closePopup, saveEmail, loading } = usePopup(currentPage);

  return (
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
          
          {/* Test Routes */}
          <Route path="/auth-test" element={<AuthTest />} />
          
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
      
      {/* WhatsApp Button - aparece em todas as páginas públicas */}
      <WhatsAppButton 
        phoneNumber={CONTACT_CONFIG.whatsapp.phoneNumber}
        message={CONTACT_CONFIG.whatsapp.defaultMessage}
      />

      {/* Pop-up Modal */}
      {showPopup && popupConfig && !loading && (
        <PopupModal
          config={popupConfig}
          currentPage={currentPage}
          onClose={closePopup}
          onEmailSubmit={saveEmail}
        />
      )}
    </div>
  );
};

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
              path="/admin/cursos"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <CourseAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/cursos/:courseId/modulos"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <CourseModulesAdmin />
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

            <Route
              path="/admin/popups"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <PopupAdmin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Rotas de Cursos Protegidas */}
            <Route
              path="/meus-cursos"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserLayout>
                    <MeusCursos />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/curso/:cursoId"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <CursoDetalhes />
                </ProtectedRoute>
              }
            />

            {/* Rota temporária para teste da API */}
            <Route path="/test-course-api" element={<TestCourseAPI />} />

            {/* Public Routes with Header */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
