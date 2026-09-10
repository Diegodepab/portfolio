import type { NavLink, SocialLink } from '../types/portfolio';

export const siteConfig = {
  name: 'Diego De Pablo',
  url: import.meta.env.VITE_SITE_URL || '',
  title: {
    en: 'Software Engineer',
    es: 'Ingeniero de Software',
  },
  description: {
    en: 'Full-stack engineer focused on use-case deployment and infrastructure, where the most interesting problems live.',
    es: 'Ingeniero full-stack especializado en despliegue de casos de uso e infraestructura, donde se resuelven los problemas más interesantes.',
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
    url: '/projects',
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
    name: 'Linkedin',
    url: 'https://www.linkedin.com/in/diego-de-pablo/',
    icon: 'Linkedin',
  },
];
