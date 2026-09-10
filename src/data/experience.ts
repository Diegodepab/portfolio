import { imageAssets } from './imageAssets';
import type { JobExperience } from '../types/portfolio';

export const experiences: JobExperience[] = [
  {
    id: 'khaos',
    company: 'Khaos Research',
    companyUrl: 'https://khaos.uma.es/',
    role: {
      en: 'Software Engineer',
      es: 'Ingeniero de Software',
    },
    summary: {
      en: 'Khaos Research is a University of Málaga research group focused on large-scale data management and analysis. As a full-stack engineer, I build and evolve end-to-end applications, integrating services, validation and deployment infrastructure.',
      es: 'Khaos Research es un grupo de investigación de la Universidad de Málaga especializado en gestión y análisis de datos a gran escala. Como ingeniero full-stack, desarrollo y evoluciono aplicaciones end-to-end, integrando servicios, validación e infraestructura de despliegue.',
    },
    startDate: { month: { en: 'Sep', es: 'Sept' }, year: 2025 },
    current: true,
    location: { en: 'Málaga, Spain', es: 'Málaga, España' },
    locationType: 'hybrid',
    employmentType: 'full-time',
    highlights: {
      en: [
        'End-to-end development of full-stack applications for a multi-domain data space.',
        'Designed an advanced search engine with LLM for natural language queries and data recommendation.',
        'Built integrated tools for automatic metadata extraction (+30 formats) and LLM-driven analysis workflow automation.',
      ],
      es: [
        'Desarrollo end-to-end de aplicaciones full-stack para un espacio de datos de diversa índole.',
        'Diseño de un buscador avanzado con LLM para consultas en lenguaje natural y recomendación de datos.',
        'Desarrollo de herramientas integradas para extracción automática de metadatos (+30 formatos) y automatización de workflows de análisis con LLM.',
      ],
    },
    projectIds: ['metadataxtract', 'metadatasearch', 'alignx', 'titan-workflow', 'edaan-data-space'],
    photos: [
      {
        ...imageAssets['/images/khaos/logo.png'],
        sizes: '(max-width: 768px) 90vw, 608px',
        kind: 'logo',
        alt: { es: 'Logo de Khaos Research', en: 'Khaos Research logo' },
        caption: { es: 'Khaos Research · Universidad de Málaga', en: 'Khaos Research · University of Malaga' },
      },
      {
        ...imageAssets['/images/khaos/equipo-interior.webp'],
        sizes: '(max-width: 768px) 90vw, 608px',
        kind: 'photo',
        alt: { es: 'Equipo de Khaos Research reunido en sus instalaciones', en: 'Khaos Research team gathered at their facilities' },
        caption: { es: 'Equipo de Khaos Research', en: 'Khaos Research team' }
      },
      {
        ...imageAssets['/images/khaos/equipo-exterior.webp'],
        sizes: '(max-width: 768px) 90vw, 608px',
        kind: 'photo',
        alt: { es: 'Equipo de Khaos Research en la Universidad de Málaga', en: 'Khaos Research team at the University of Malaga' },
        caption: { es: 'Equipo de Khaos Research', en: 'Khaos Research team' }
      }
    ],
  },
  {
    id: 'msurgery',
    company: 'Msurgery',
    companyUrl: 'https://msurgery.com/',
    role: {
      en: 'FullStack Developer',
      es: 'Desarrollador FullStack',
    },
    summary: {
      en: 'mSurgery is an advanced immersive surgical telepresence and collaboration platform that enables remote medical training and assistance. During my internship, I worked as a full-stack developer contributing to core infrastructure and new digital health features.',
      es: 'mSurgery es una plataforma avanzada de telepresencia y colaboración quirúrgica inmersiva que permite la formación médica a distancia y la asistencia remota. Durante mis prácticas, trabajé como desarrollador full-stack contribuyendo a la infraestructura central y nuevas funcionalidades de salud digital.',
    },
    startDate: { month: { en: 'Mar', es: 'Marzo' }, year: 2025 },
    endDate: { month: { en: 'Jul', es: 'Julio' }, year: 2025 },
    location: { en: 'Málaga, Spain', es: 'Málaga, España' },
    locationType: 'hybrid',
    employmentType: 'internship',
    highlights: {
      en: [
        'Structural migration of main repositories from Svelte 4 to Svelte 5.',
        'Developed new features for SMOTTS projects and digital twins.',
        'Managed international stakeholders and presented the project technically at Polo Digital.',
      ],
      es: [
        'Migración estructural de repositorios principales de Svelte 4 a Svelte 5.',
        'Desarrollo de nuevas funcionalidades para proyectos SMOTTS y gemelos digitales.',
        'Gestión de stakeholders internacionales y presentación técnica del proyecto en el Polo Digital.',
      ],
    },
    projectIds: ['msurgery-platform', 'smotts', 'digital-twins'],
    photos: [
      {
        ...imageAssets['/images/msurgery/favicon.png'],
        sizes: '(max-width: 768px) 90vw, 608px',
        kind: 'logo',
        alt: { en: 'mSurgery Logo', es: 'Logo de mSurgery' },
        caption: { es: 'Plataforma mSurgery', en: 'mSurgery Platform' },
        brandText: 'mSurgery',
        brandSubtext: 'Live Immersive Surgical Experience'
      },
      {
        ...imageAssets['/images/msurgery/foto.webp'],
        sizes: '(max-width: 768px) 90vw, 608px',
        kind: 'photo',
        alt: { es: 'Equipo médico operando', en: 'Medical team operating' },
        caption: { es: 'Experiencia inmersiva en quirófano', en: 'Immersive surgical experience' }
      }
    ],
  },
  {
    id: 'tb-company',
    company: 'T&B Company Group',
    companyUrl: undefined,
    role: {
      en: 'Junior Software Engineer',
      es: 'Ingeniero de Software Júnior',
    },
    startDate: { month: { en: 'Jun', es: 'Junio' }, year: 2021 },
    endDate: { month: { en: 'Dec', es: 'Diciembre' }, year: 2021 },
    employmentType: 'internship',
    highlights: {
      en: [
        'Created API documentation and reviewed outdated projects.',
        'Improved user experience and resolved bugs.',
        'Migrated legacy code and refactored for Java and Angular.',
      ],
      es: [
        'Creación de documentación para APIs y revisión de proyectos desactualizados.',
        'Ajuste de experiencia de usuario y resolución de bugs.',
        'Migración de código legacy y mejora para Java y Angular.',
      ],
    },
    projectIds: [],
  },
];
