import type { NavLink, SocialLink } from '../types/portfolio';

export const siteConfig = {
  name: 'Diego De Pablo',
  url: (import.meta.env.VITE_SITE_URL || 'https://diegodepablo.is-a.dev').replace(/\/$/, ''),
  title: {
    en: 'Software Engineer',
    es: 'Ingeniero de Software',
  },
  description: {
    en: 'Software engineer and bioinformatics graduate specializing in full-stack applications, applied AI, and DevOps with Docker and Kubernetes.',
    es: 'Ingeniero de software y bioinformático especializado en aplicaciones full-stack, IA aplicada y DevOps con Docker y Kubernetes.',
  },
  email: 'diegodepablo.programa@gmail.com',
};

export const navLinks: NavLink[] = [
  {
    name: { en: 'About', es: 'Sobre mí' },
    url: '/#about',
  },
  {
    name: { en: 'Experience', es: 'Experiencia' },
    url: '/#jobs',
  },
  {
    name: { en: 'Work', es: 'Trabajo' },
    url: '/#projects',
  },
  {
    name: { en: 'Contact', es: 'Contacto' },
    url: '/#contact',
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Diegodepab',
    icon: 'Github',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/diego-de-pablo/',
    icon: 'Linkedin',
  },
];
