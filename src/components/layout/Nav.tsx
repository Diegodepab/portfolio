import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { navLinks } from '../../data/config';
import { useLanguage } from '../../context/LanguageContext';
import './Nav.css';

export const Nav: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const { lang, setLanguage } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (menuOpen) {
      setHidden(false);
    } else if (latest > lastY.current && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastY.current = latest;
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-100%', opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="site-header"
    >
      <div className="site-logo">
        <Link to="/">DDP</Link>
      </div>

      <nav className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label={lang === 'en' ? 'Main navigation' : 'Navegación principal'}>
        <button
          type="button"
          className="nav-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={lang === 'en' ? 'Toggle navigation menu' : 'Abrir o cerrar el menú de navegación'}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <ul className="nav-list" id="primary-navigation">
          {navLinks.map((link, i) => (
            <motion.li 
              key={link.name.en}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={link.url} className="nav-link" onClick={() => setMenuOpen(false)}>
                <span className="nav-number">0{i + 1}.</span>
                {link.name[lang]}
              </Link>
            </motion.li>
          ))}
        </ul>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: navLinks.length * 0.1 }}
          className="language-picker"
          role="group"
          aria-label={lang === 'en' ? 'Choose language' : 'Elegir idioma'}
        >
          {([
            { code: 'es', flag: '🇪🇸', label: 'ES' },
            { code: 'en', flag: '🇬🇧', label: 'EN' },
          ] as const).map((language) => {
            const isActive = lang === language.code;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => setLanguage(language.code)}
                aria-pressed={isActive}
                aria-label={language.code === 'es' ? 'Español' : 'English'}
                title={language.code === 'es' ? 'Español' : 'English'}
                className={`language-option${isActive ? ' is-active' : ''}`}
              >
                <span aria-hidden="true">{language.flag}</span>
                <span>{language.label}</span>
              </button>
            );
          })}
        </motion.div>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (navLinks.length + 1) * 0.1 }}
          className="resume-button-container"
        >
          <a
            href="/cv_diego_de_pablos.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-button"
          >
            {lang === 'en' ? 'Resume' : 'Currículum'}
          </a>
        </motion.div>
      </nav>
    </motion.header>
  );
};
