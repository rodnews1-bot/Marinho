import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { ClientProvider } from '@/context/ClientContext';
import { AdminProvider } from '@/context/AdminContext';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ClientLogin from '@/components/ClientLogin';
import ClientDashboard from '@/components/ClientDashboard';
import ProcessDetailPage from '@/components/ProcessDetailPage';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ClientDetailPage from '@/components/admin/ClientDetailPage';

// Main Landing Page Component
const LandingPage = () => (
  <main className="flex-1 w-full flex flex-col">
    <Hero />
    <Services />
    <About />
    <Testimonials />
    <Contact />
    <Footer />
  </main>
);

function App() {
  const metaTitle = "MARINHO ADVOCACIA | Advocacia de Elite";
  const metaDesc = "Escritório de advocacia full-service focado em entregar resultados jurídicos de alta performance com ética, transparência e combatividade. Especialistas em Penal, Tributário e Previdenciário.";
  const metaImage = "https://horizons-cdn.hostinger.com/fc1a8f30-56b6-4386-b03a-0cb5e72f383b/96cf0b8bdd18b2092b65cbc915d1e49d.png";

  return (
    <AdminProvider>
      <ClientProvider>
        <Router>
          <Helmet>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDesc} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={metaImage} />
            
            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDesc} />
            <meta property="twitter:image" content={metaImage} />
          </Helmet>
          
          {/* Main container optimized for vertical scrolling */}
          <div className="min-h-screen w-full flex flex-col overflow-x-hidden">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Client Area */}
              <Route path="/client-login" element={<ClientLogin />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/process/:processId" element={<ProcessDetailPage />} />

              {/* Admin Area */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/clients/:id" element={<ClientDetailPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </ClientProvider>
    </AdminProvider>
  );
}

export default App;