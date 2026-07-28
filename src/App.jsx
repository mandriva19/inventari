import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import './i18n/index.js';

import ScrollToTop from './components/layout/ScrollToTop';
import TopBar      from './components/layout/TopBar';
import Footer      from './components/layout/Footer';
import HomePage    from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import StudioPage  from './pages/StudioPage';
import { ContactModalProvider } from './contexts/ContactModalContext';
import ContactModal from './components/layout/ContactModal';
import { SettingsProvider } from './contexts/SettingsContext';

import './styles/global.css';

function ProductPageWrapper() {
  const { slug } = useParams();
  return <ProductPage slug={slug} />;
}

function AppShell() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Skip to main content (accessibility) */}
      <a
        href="#main-content"
        style={{
          position: 'absolute', top: '-100%', left: 0,
          padding: '8px 16px', background: 'var(--color-primary)',
          color: '#000', zIndex: 9999, borderRadius: '0 0 8px 0',
          fontWeight: 600, transition: 'top 0.2s',
        }}
        onFocus={(e) => (e.currentTarget.style.top = '0')}
        onBlur={(e)  => (e.currentTarget.style.top = '-100%')}
      >
        Skip to main content
      </a>

      <TopBar isScrolled={isScrolled} />

      <div className="pt-40 min-h-screen flex flex-col">
        <Routes>
          <Route path="/"              element={<HomePage    isScrolled={isScrolled} />} />
          <Route path="/product/:slug" element={<ProductPageWrapper />} />
          <Route path="/studio/*"      element={<StudioPage />} />
          <Route path="*"              element={<HomePage    isScrolled={isScrolled} />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ContactModalProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppShell />
          <ContactModal />
        </BrowserRouter>
      </ContactModalProvider>
    </SettingsProvider>
  );
}
