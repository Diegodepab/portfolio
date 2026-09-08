import React, { lazy, Suspense, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import './ChatWidget.css';

const ChatWindow = lazy(() =>
  import('./ChatWindow').then(m => ({ default: m.ChatWindow }))
);

interface ChatWidgetProps {
  /** When true, the widget button is hidden (e.g. during the tour) */
  hidden?: boolean;
  /** External control to force open */
  forceOpen?: boolean;
  /** Callback when chat opens */
  onOpen?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ hidden = false, forceOpen = false, onOpen }) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to hide trigger if AvatarGuide is visible
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle forceOpen from external (AvatarGuide "Chat" button)
  useEffect(() => {
    if (forceOpen && !isOpen) {
      setIsOpen(true);
      onOpen?.(); // Reset force-open in parent to avoid re-open bug
    }
  }, [forceOpen, isOpen, onOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // AvatarGuide is shown on home page before scrolling. 
  // We hide the chat trigger when AvatarGuide is shown so they don't conflict.
  const shouldHideTrigger = hidden || (!isScrolled && location.pathname === '/');

  // Don't render the trigger button when hidden 
  // but always render the portal for the window if open
  return (
    <>
      <AnimatePresence>
        {!shouldHideTrigger && !isOpen && (
          <motion.button
            key="chat-trigger"
            className="chat-widget-trigger"
            onClick={handleOpen}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 25, delay: 0.5 } }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.15, delay: 0 } }}
            aria-label={lang === 'en' ? 'Open chat with dIAgo' : 'Abrir chat con dIAgo'}
            aria-expanded={false}
            aria-haspopup="dialog"
          >
            <img
              src="/images/avatar-pixel.webp"
              alt="dIAgo"
              width={38}
              height={38}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2364ffda" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <Suspense fallback={null}>
                <ChatWindow onClose={handleClose} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
