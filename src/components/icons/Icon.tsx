import React from 'react';
import { FiGithub, FiLinkedin, FiInstagram, FiExternalLink, FiMail, FiFolder, FiBookmark, FiChevronDown, FiAward, FiFileText } from 'react-icons/fi';
import { FaPython, FaLinux, FaDocker, FaJava, FaRProject, FaGraduationCap } from 'react-icons/fa';
import { SiTypescript, SiSvelte } from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaHidden?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '', style, ariaHidden = true }) => {
  const accessibilityProps = ariaHidden ? { 'aria-hidden': true as const, focusable: false as const } : {};
  switch (name.toLowerCase()) {
    case 'github':
      return <FiGithub size={size} className={className} style={style} {...accessibilityProps} />;
    case 'linkedin':
      return <FiLinkedin size={size} className={className} style={style} {...accessibilityProps} />;
    case 'instagram':
      return <FiInstagram size={size} className={className} style={style} {...accessibilityProps} />;
    case 'external':
    case 'externallink':
      return <FiExternalLink size={size} className={className} style={style} />;
    case 'mail':
      return <FiMail size={size} className={className} style={style} />;
    case 'folder':
      return <FiFolder size={size} className={className} style={style} />;
    case 'bookmark':
      return <FiBookmark size={size} className={className} style={style} />;
    case 'chevron-down':
      return <FiChevronDown size={size} className={className} style={style} />;
    case 'award':
    case 'certificate':
      return <FiAward size={size} className={className} style={style} />;
    case 'graduation':
      return <FaGraduationCap size={size} className={className} style={style} />;
    case 'file':
    case 'document':
      return <FiFileText size={size} className={className} style={style} />;
    case 'python':
      return <FaPython size={size} className={className} style={style} />;
    case 'linux':
      return <FaLinux size={size} className={className} style={style} />;
    case 'docker':
      return <FaDocker size={size} className={className} style={style} />;
    case 'java':
      return <FaJava size={size} className={className} style={style} />;
    case 'r':
      return <FaRProject size={size} className={className} style={style} />;
    case 'typescript':
      return <SiTypescript size={size} className={className} style={style} />;
    case 'svelte':
      return <SiSvelte size={size} className={className} style={style} />;
    case 'c#':
      return <TbBrandCSharp size={size} className={className} style={style} />;
    default:
      return <FiExternalLink size={size} className={className} style={style} />;
  }
};
