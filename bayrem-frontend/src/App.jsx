// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Accueil from './pages/Accueil/Accueil';
import Catalogue from './pages/Catalogue/Catalogue';
import DetailProduit from './pages/DetailProduit/DetailProduit';
import Contact from './pages/Contact/Contact';
import AdminLogin from './pages/admin/Login/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Layout>
        <Routes>
          {/* ── Pages publiques ── */}
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:categorieSlug" element={<Catalogue />} />
          <Route path="/produits/:id" element={<DetailProduit />} />
          <Route path="/contact" element={<Contact />} />

          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
