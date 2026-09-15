import React from 'react';
import { socialLinks } from '../../data/config';
import { Icon } from '../icons/Icon';
import './Footer.css';
import { useLanguage } from '../../context/LanguageContext';
import { useVisualEffects } from '../../performance/useVisualEffects';
import { setUserReducedEffects } from '../../performance/effectsStore';

interface FooterProps {
  themeName: string;
}

export const Footer: React.FC<FooterProps> = ({ themeName }) => {
  const { lang } = useLanguage();
  const { userReduced } = useVisualEffects();
  return (
    <footer className="site-footer">
      <div className="social-links-mobile">
        {socialLinks.map(link => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
            <Icon name={link.icon} size={20} ariaHidden />
          </a>
        ))}
      </div>

      <div className="site-footer__credit">
        <a href="https://github.com/Diegodepab" target="_blank" rel="noopener noreferrer">
          Built by Diego De Pablo
        </a>
      </div>

      <div className="site-footer__theme">
        Theme: {themeName}
      </div>
      <button className="effects-toggle" type="button" aria-pressed={userReduced} onClick={() => setUserReducedEffects(!userReduced)}>
        {lang === 'es' ? 'Reducir efectos' : 'Reduce effects'}
      </button>
    </footer>
  );
};
