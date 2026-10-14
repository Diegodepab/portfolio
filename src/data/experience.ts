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
        'Architected and delivered 3 core platforms (MetaDataXtract, MetaDataSearch, AlignX) for the SEDIA federated data space.',
        'Designed a hybrid search engine combining Qdrant vector embeddings and Elasticsearch 8, orchestrated by Pydantic AI conversational agents.',
        'Engineered an automated ingestion pipeline supporting 30+ scientific formats, SHA-256 validation, 70+ antivirus engines, and DCAT-AP JSON-LD export.',
      ],
      es: [
        'Arquitectura y desarrollo integral de 3 plataformas clave (MetaDataXtract, MetaDataSearch, AlignX) para el espacio de datos federado SEDIA.',
        'Diseño de un motor de búsqueda híbrido combinando embeddings vectoriales en Qdrant y Elasticsearch 8, orquestado por agentes conversacionales Pydantic AI.',
        'Implementación de un pipeline de ingesta automatizado para +30 formatos científicos con validación SHA-256, 70+ motores antivirus y exportación JSON-LD DCAT-AP.',
      ],
    },
    projectIds: ['metadataxtract', 'metadatasearch', 'landcoverpy', 'alignx', 'titan-workflow', 'edaan-data-space'],
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
        'Spearheaded structural migration of core repositories from Svelte 4 to Svelte 5 (runes & new reactivity), optimizing 3D model rendering.',
        'Engineered biometric signal visualizers and clinical workflows for SMOTTS diagnostic devices and anatomical digital twins.',
        'Delivered technical product demonstrations in English to international stakeholders and investors at Polo Digital Málaga.',
      ],
      es: [
        'Lideré la migración estructural de repositorios centrales de Svelte 4 a Svelte 5 (runas y reactividad moderna), optimizando el renderizado 3D.',
        'Desarrollo de visualizadores de señales biomédicas y flujos clínicos para dispositivos de diagnóstico SMOTTS y gemelos digitales anatómicos.',
        'Presentación y defensa técnica del producto en inglés ante stakeholders e inversores internacionales en el Polo Digital de Málaga.',
      ],
    },
    projectIds: ['msurgery-platform', 'smotts', 'digital-twins'],
    photos: [
      {
        ...imageAssets['/images/msurgery/logo.png'],
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
        'Refactored and modernized legacy business services into modular Java and Angular architectures, reducing tech debt.',
        'Diagnosed and resolved critical production defects, collaborating closely with senior engineering staff.',
        'Authored technical REST API specifications and developer documentation to accelerate cross-team integration.',
      ],
      es: [
        'Refactorización y modernización de servicios legados hacia arquitecturas modulares con Java y Angular, reduciendo deuda técnica.',
        'Diagnóstico y resolución de incidencias en producción, colaborando estrechamente con el equipo de ingeniería.',
        'Elaboración de especificaciones técnicas de APIs REST y documentación de integración para acelerar el desarrollo entre equipos.',
      ],
    },
    projectIds: [],
  },
];
