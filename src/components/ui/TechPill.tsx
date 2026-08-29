import React from 'react';
import './TechPill.css';

interface TechPillProps {
  name: string;
}

export const TechPill: React.FC<TechPillProps> = ({ name }) => {
  return (
    <span className="tech-pill">
      {name}
    </span>
  );
};
