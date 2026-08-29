import React from 'react';
import { Nav } from './Nav';
import { SideElements } from './SideElements';
import { Footer } from './Footer';
import type { Palette } from '../../utils/palettes';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  themeName: string;
  pokemon: Palette;
  onPokemonChange: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, themeName, pokemon, onPokemonChange }) => {
  return (
    <div className="site-shell">
      <Nav />
      <SideElements pokemon={pokemon} onPokemonChange={onPokemonChange} />

      <div className="main-content">
        {children}
      </div>

      <Footer themeName={themeName} />
    </div>
  );
};
