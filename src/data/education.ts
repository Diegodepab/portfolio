import type { Education, Certificate, Language } from '../types/portfolio';

// ─── DEGREES / CARRERAS ────────────────────────────────────────────────────────
// Add new degrees by appending objects to this array.
// No component changes needed — the UI renders dynamically.

export const education: Education[] = [
  {
    id: 'uma-master',
    institution: 'Universidad de Málaga',
    institutionUrl: 'https://www.uma.es/etsi-informatica/info/152999/master-universitario-en-ingenieria-informaticaplan-2025/',
    degree: {
      en: "Master's Degree",
      es: 'Máster Universitario',
    },
    field: {
      en: 'Computer Engineering (Plan 2026)',
      es: 'Ingeniería Informática (Plan 2026)',
    },
    discipline: {
      en: 'Data Science & Engineering',
      es: 'Especialidad en Ingeniería y Ciencia de datos',
    },
    startDate: {
      month: { en: 'August', es: 'Agosto' },
      year: 2026,
    },
    // No endDate — hasn't started yet
    description: {
      en: 'Graduate program in software engineering, focused on advanced system design, architecture, and data science.',
      es: 'Programa de posgrado en ingeniería de software, enfocado en diseño y arquitectura de sistemas avanzados y ciencia de datos.',
    },
  },
  {
    id: 'uma-grado',
    institution: 'Universidad de Málaga',
    institutionUrl: 'https://www.uma.es/grado-en-ingenieria-de-la-salud/',
    degree: {
      en: "Bachelor's Degree",
      es: 'Grado',
    },
    field: {
      en: 'Health Engineering',
      es: 'Ingeniería de la Salud',
    },
    discipline: {
      en: 'Bioinformatics Engineering',
      es: 'Ingeniería bioinformática',
    },
    startDate: {
      month: { en: 'September', es: 'Septiembre' },
      year: 2021,
    },
    endDate: {
      month: { en: 'July', es: 'Julio' },
      year: 2025,
    },
    grade: '7.94',
    description: {
      en: `Bachelor's Degree in Health Engineering, specialisation in Bioinformatics. School of Computer Science and Telecommunications Engineering (ETSI IT), University of Málaga, Spain.

- Honours in several subjects: Fundamentals of Programming, Intelligent Systems, Bioinformatics Projects, and the Final Degree Thesis.
- Top 5 of the 2021–2025 cohort.
- Active participant in extracurricular faculty events such as Hackers Week, datathons, seminars, etc.`,
      es: `Grado en Ingeniería de la Salud, especialización en Bioinformática. Escuela Técnica Superior de Ingeniería Informática y Telecomunicaciones, Universidad de Málaga, España.

- Matrícula de honor en varias asignaturas como Fundamentos de Programación, Sistemas Inteligentes, Proyectos Bioinformáticos y en el Trabajo de Fin de Grado.
- Top 5 (promoción 2021-2025).
- Presente y participativo en actividades extras de la facultad como las Hackers Week, datathon, seminarios, etc.`,
    },
    skills: [
      'Python',
      'R',
      'Deep Learning',
      'Machine Learning',
      'Data Analysis',
      'Data Visualization',
      'Bioinformatics',
      'Computer Vision',
      'Digital Image Processing',
      'Artificial Intelligence',
      'Git',
      'Linux',
      'Databases',
      'Software Development',
      'Back-end Development',
      'Critical Thinking',
    ],
    media: [
      {
        type: 'image',
        src: '/education/degree-preview-2025.jpg',
        alt: 'Título Grado en Ingeniería de la Salud',
      },
    ],
  },
];

// ─── CERTIFICATES / CERTIFICACIONES ────────────────────────────────────────────
// Add new certificates by appending objects to this array.

export const certificates: Certificate[] = [
  {
    id: 'os-basics-cisco',
    name: {
      en: 'Operating Systems Basics',
      es: 'Operating Systems Basics',
    },
    issuer: 'Cisco Networking Academy',
    issuerUrl: 'https://www.netacad.com/',
    issueDate: {
      month: { en: 'August', es: 'Agosto' },
      year: 2026,
    },
    description: {
      en: `Training in operating system administration, configuration, and security for server, desktop, and mobile environments.

Key modules:
• Windows & Linux Architecture: Server administration, shell usage, and file system management.
• Connectivity & Networking: Wireless connections configuration, communication protocols, and service synchronization.
• Base Security: Implementation of protection protocols in operating systems and access control.`,
      es: `Formación en administración, configuración y seguridad de sistemas operativos para entornos de servidores, escritorio y dispositivos móviles.

Módulos principales:
• Arquitectura Windows y Linux: Administración de servidores, manejo de la terminal (Shell) y gestión de sistemas de archivos.
• Conectividad y redes: Configuración de conexiones inalámbricas, protocolos de comunicación y sincronización de servicios.
• Seguridad base: Implementación de protocolos de protección en sistemas operativos y control de accesos.`,
    },
    skills: [
      'Linux',
      'Windows',
      'Windows Server',
      'Cisco Security Firewall',
      'Android',
      'Apple Products',
    ],
    media: [
      {
        type: 'image',
        src: '/education/os-certificate-preview.jpg',
        alt: 'Operating Systems Basics Certificate',
      },
    ],
  },
  {
    id: 'intro-cybersec-cisco',
    name: {
      en: 'Introduction to Cybersecurity',
      es: 'Introduction to Cybersecurity',
    },
    issuer: 'Cisco Networking Academy',
    issuerUrl: 'https://www.netacad.com/',
    issueDate: {
      month: { en: 'February', es: 'Febrero' },
      year: 2026,
    },
    description: {
      en: `Cybersecurity fundamentals focused on data protection, risk mitigation, and defense of organizational infrastructures.

Key modules:
• Attack Vectors: Analysis of infiltration methods, vulnerability identification, and system exploitation.
• Information Protection: Management of corporate data privacy and secure maintenance policies.
• Corporate Defense: Application of security devices, network technologies, and threat behavior analysis.`,
      es: `Fundamentos de ciberseguridad orientados a la protección de datos, mitigación de riesgos y defensa de infraestructuras organizacionales.

Módulos principales:
• Vectores de ataque: Análisis de métodos de infiltración, identificación de vulnerabilidades y explotación de sistemas.
• Protección de la información: Gestión de la privacidad de los datos corporativos y políticas de mantenimiento seguro.
• Defensa corporativa: Aplicación de dispositivos de seguridad, tecnologías de red y análisis de comportamiento frente a amenazas.`,
    },
    media: [
      {
        type: 'image',
        src: '/education/cybersecurity-cisco-preview.jpg',
        alt: 'Introduction to Cybersecurity Certificate',
      },
    ],
  },
  {
    id: 'cybersec-hacking-bigschool',
    name: {
      en: 'Introduction to Cybersecurity & Technical Hacking',
      es: 'Introducción a Ciberseguridad y Hacking Técnico',
    },
    issuer: 'BigSchool',
    issueDate: {
      month: { en: 'April', es: 'Abril' },
      year: 2026,
    },
    description: {
      en: `Systems auditing and software infrastructure hardening training (via dockerlabs.es).

Key modules:
• Web Auditing: Container-based lab deployment for security assessment and privilege escalation in CMS architectures (WordPress).
• Threat Analysis: Study of attack vectors (ransomware, phishing) to design resilient systems.
• Malware Containment: Malicious code lifecycle analysis to strengthen defences.`,
      es: `Formación en auditoría de sistemas y fortificación de infraestructuras de software (a través de dockerlabs.es).

Módulos principales:
• Auditoría web: Despliegue de laboratorios en contenedores para evaluar seguridad y escalada de privilegios en arquitecturas CMS (WordPress).
• Análisis de amenazas: Estudio de vectores de ataque (ransomware, phishing) para diseñar sistemas resilientes.
• Contención de malware: Análisis del ciclo de vida del código malicioso para reforzar defensas.`,
    },
    skills: [
      'Cybersecurity',
      'Ethical Hacking',
      'Vulnerability Assessment',
      'Docker',
      'Risk Analysis',
    ],
    media: [
      {
        type: 'image',
        src: '/education/hacking-certificate-preview.jpg',
        alt: 'Certificado Ciberseguridad y Hacking Técnico',
      },
    ],
  },
];

// ─── LANGUAGES ─────────────────────────────────────────────────────────────────

export const languages: Language[] = [
  {
    name: {
      en: 'Spanish',
      es: 'Español',
    },
    level: {
      en: 'C2',
      es: 'C2',
    },
    flag: '🇪🇸',
  },
  {
    name: {
      en: 'English',
      es: 'Inglés',
    },
    level: {
      en: 'B2',
      es: 'B2',
    },
    flag: '🇬🇧',
  },
  {
    name: {
      en: 'Italian',
      es: 'Italiano',
    },
    level: {
      en: 'A2',
      es: 'A2',
    },
    flag: '🇮🇹',
  },
];
