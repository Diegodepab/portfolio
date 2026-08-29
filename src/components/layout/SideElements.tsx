import React from 'react';
import { socialLinks, siteConfig } from '../../data/config';
import { Icon } from '../icons/Icon';
import { motion, useReducedMotion } from 'motion/react';
import type { Palette } from '../../utils/palettes';
import './SideElements.css';

interface SideElementsProps {
  pokemon: Palette;
  onPokemonChange: () => void;
}

interface PokemonButtonProps extends SideElementsProps {
  compact?: boolean;
}

export const PokemonButton: React.FC<PokemonButtonProps> = ({ pokemon, onPokemonChange, compact = false }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`pokemon-trigger-wrap${compact ? ' pokemon-trigger-wrap--compact' : ''}`}>
    <motion.button
      type="button"
      className="pokemon-trigger"
      onClick={onPokemonChange}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: [1, 1.3, 0.9, 1], rotate: [0, -12, 12, 0] }}
      transition={{ duration: 0.35 }}
      aria-label={`Cambiar paleta Pokémon. Pokémon actual: ${pokemon.name}`}
      aria-describedby="pokemon-palette-status"
    >
      <motion.img
        key={pokemon.sprite}
        src={pokemon.sprite}
        alt=""
        width={compact ? 44 : 40}
        height={compact ? 44 : 40}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
        className="pokemon-trigger__image"
      />
    </motion.button>
    <span className="pokemon-tooltip" aria-hidden="true">{pokemon.name}</span>
    </div>
  );
};

export const SideElements: React.FC<SideElementsProps> = ({ pokemon, onPokemonChange }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Left side: Social Links */}
      <div className="side-elements side-elements-left">
        <ul className="side-list">
          <motion.li
            className="side-line side-line-leading"
            initial={shouldReduceMotion ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          />
          {socialLinks.map((link, i) => (
            <motion.li 
              key={link.name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + (i * 0.1) }}
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="side-social-link" aria-label={link.name}>
                <Icon name={link.icon} size={20} />
              </a>
            </motion.li>
          ))}
          <motion.li
            className="side-line side-line-divider"
            initial={shouldReduceMotion ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1 + ((socialLinks.length + 1) * 0.1), duration: 0.5 }}
          />
          <motion.li
            className="side-pokemon"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + (socialLinks.length * 0.1) }}
          >
            <PokemonButton pokemon={pokemon} onPokemonChange={onPokemonChange} />
          </motion.li>
        </ul>
      </div>

      {/* Right side: Email */}
      <div className="side-elements side-elements-right">
        <div className="side-email-wrap">
          <motion.div
            className="side-line side-email-line"
            initial={shouldReduceMotion ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.75, duration: 0.5 }}
          />
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <a 
              href={`mailto:${siteConfig.email}`} 
              className="side-email"
            >
              {siteConfig.email}
            </a>
          </motion.div>
          <motion.div 
            className="side-line side-email-line"
            initial={shouldReduceMotion ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          />
        </div>
      </div>



      <span id="pokemon-palette-status" className="visually-hidden" aria-live="polite">
        Paleta de {pokemon.name} activada
      </span>
      
    </>
  );
};
