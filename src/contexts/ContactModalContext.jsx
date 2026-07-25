import { createContext, useContext, useState, useCallback } from 'react';

const ContactModalContext = createContext(null);

export function ContactModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productContext, setProductContext] = useState(null);

  const openContactModal = useCallback((product = null) => {
    setProductContext(product);
    setIsOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setProductContext(null), 300); // clear after animation
  }, []);

  return (
    <ContactModalContext.Provider value={{ isOpen, productContext, openContactModal, closeContactModal }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
}
