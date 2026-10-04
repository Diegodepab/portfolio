import React from 'react';
import { socialLinks } from '../../data/config';
import { Icon } from '../icons/Icon';
import './Footer.css';
import { useLanguage } from '../../context/LanguageContext';
import { useVisualEffects } from '../../performance/useVisualEffects';
import { setUserReducedEffects } from '../../performance/effectsStore';
import { pokePalettes } from '../../utils/palettes';

interface FooterProps {
  themeName: string;
  onPokemonSelect?: (name: string) => void;
  onPokemonRandom?: () => void;
}

const ALL_POKEMON_NAMES = [...pokePalettes]
  .map((p) => p.name)
  .sort((a, b) => a.localeCompare(b));

export const Footer: React.FC<FooterProps> = ({
  themeName,
  onPokemonSelect,
  onPokemonRandom,
}) => {
  const { lang } = useLanguage();
  const { userReduced } = useVisualEffects();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__random__') {
      onPokemonRandom?.();
    } else if (val) {
      onPokemonSelect?.(val);
    }
  };

  return (
    <footer className="site-footer">
      <div className="social-links-mobile">
        {socialLinks.map((link) => (
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
        <span className="site-footer__theme-prefix">Theme:</span>
        <select
          className="site-footer__theme-select"
          value={themeName}
          onChange={handleSelectChange}
          aria-label={lang === 'es' ? 'Seleccionar tema de Pokémon' : 'Select Pokémon theme'}
          title={lang === 'es' ? 'Haz clic para cambiar de Pokémon' : 'Click to change Pokémon'}
        >
          <option value="__random__">🎲 {lang === 'es' ? 'Aleatorio' : 'Random'}</option>
          {ALL_POKEMON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <button className="effects-toggle" type="button" aria-pressed={userReduced} onClick={() => setUserReducedEffects(!userReduced)}>
        {lang === 'es' ? 'Reducir efectos' : 'Reduce effects'}
      </button>
    </footer>
  );
};
