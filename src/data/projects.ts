import type { Project } from '../types/portfolio';

/**
 * Project catalog — scalable structure.
 * 
 * To add a new project, copy any entry below and fill in:
 *   id, name (en/es), description (en/es), technologies[], tag, category
 *   Optional: company, github, link, image, featured
 * 
 * Tags:    'professional' | 'personal'
 * Categories: 'full-stack' | 'backend' | 'infrastructure' | 'data-science' | 'use-case'
 */
export const featuredProjects: Project[] = [
  // ─── Selected work shown on the home page ───────────────────────
  {
    id: 'kubernetes-platform',
    name: { en: 'Kubernetes Operations & GitOps', es: 'Operaciones Kubernetes & GitOps' },
    description: {
      en: 'A hands-on environment focused on real-world architecture and operations for cloud-native applications. This project illustrates the complete migration and scaling path of an application: starting with local containers and ending in a robust ecosystem on Kubernetes.',
      es: 'Un entorno práctico centrado en la arquitectura y operaciones del mundo real para aplicaciones nativas de la nube. Este proyecto ilustra el camino completo de migración y escalado de una aplicación: comenzando con contenedores locales y finalizando en un ecosistema robusto en Kubernetes.',
    },
    shortDescription: {
      en: 'Kubernetes & GitOps Infrastructure Lab',
      es: 'Laboratorio de Infraestructura Kubernetes y GitOps',
    },
    technologies: ['Kubernetes', 'Docker', 'Helm', 'Argo CD', 'Sealed Secrets', 'Envoy', 'Longhorn', 'Prometheus', 'Grafana'],
    tag: 'professional',
    category: 'infrastructure',
    github: 'https://github.com/Diegodepab/kubernetes-deployment',
    roleHighlight: {
      en: 'Architected the progression from local Docker Compose to a production-ready Kubernetes cluster, implementing GitOps workflows, secret management, and distributed storage.',
      es: 'Diseñé la evolución desde un entorno local con Docker Compose hasta un clúster productivo de Kubernetes, implementando flujos GitOps, gestión de secretos y almacenamiento distribuido.',
    },
    caseStudy: {
      challenge: {
        en: 'Deploying a full-stack application involves more than just writing code; it requires a deep understanding of packaging, networking, security, and scalability in a Cloud Native environment.',
        es: 'Desplegar una aplicación full-stack implica mucho más que escribir código; requiere un profundo conocimiento de empaquetado, redes, seguridad y escalabilidad en un entorno Cloud Native.',
      },
      solution: {
        en: 'Designed a progressive Infrastructure and DevOps Learning Path. It documents and automates the evolution of an application through 7 practical phases (00 to 06), moving from a simple Docker Compose setup to a complete Kubernetes cluster.',
        es: 'Diseñé un Laboratorio Progresivo de Infraestructura y DevOps. Documenta y automatiza la evolución de una aplicación a través de 7 fases prácticas (00 a 06), pasando de un entorno local sencillo con Docker Compose a un clúster de Kubernetes productivo.',
      },
      contribution: {
        en: 'Implemented industry best practices including Infrastructure as Code with Helm, automated deployments via Argo CD (GitOps), configuration encryption with Sealed Secrets, distributed block storage with Longhorn, and advanced traffic routing using Envoy Gateway and Gateway API.',
        es: 'Implementé prácticas clave de la industria, incluyendo Infraestructura como Código con Helm, automatización de despliegues vía Argo CD (GitOps), cifrado de secretos con Sealed Secrets, almacenamiento distribuido con Longhorn y gestión avanzada de tráfico usando Envoy Gateway API.',
      },
      evolution: {
        en: 'Phase 00: Local Compose. Phase 01 & 02: Kubernetes Basics & Raw YAMLs. Phase 03: Helm Package Management. Phase 04: Sealed Secrets for GitOps security. Phase 05: Longhorn Distributed Storage. Phase 06: Envoy Gateway API & Traffic Routing.',
        es: 'Fase 00: Local Compose. Fase 01 y 02: K8s Basics y manifiestos puros. Fase 03: Empaquetado con Helm. Fase 04: Seguridad con Sealed Secrets. Fase 05: Almacenamiento distribuido Longhorn. Fase 06: Tráfico y certificados con Envoy Gateway.',
      },
    },
    featured: true,
  },
  {
    id: 'tfg-patient-monitoring',
    name: {
      en: 'Patient Monitoring Bracelet',
      es: 'Pulsera de Seguimiento de Pacientes',
    },
    description: {
      en: 'An end-to-end remote monitoring system combining an IoT wristband prototype with a telemedicine web platform.',
      es: 'Sistema de telemonitorización que combina un prototipo de pulsera IoT con una plataforma web de telemedicina.',
    },
    technologies: ['IoT', 'ESP32', 'FastAPI', 'SvelteKit', 'PostgreSQL', 'MQTT'],
    tag: 'personal',
    category: 'use-case',
    github: 'https://github.com/Diegodepab/TFG_Pulsera_Seguimiento_Pacientes_Avanzada_Edad',
    media: [
      {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=w0fhrWlky6o',
        title: { en: 'Web Platform Demo', es: 'Demo de la Plataforma Web' },
      }
    ],
    caseStudy: {
      challenge: {
        en: 'Design and implement an end-to-end remote monitoring system combining an IoT wristband prototype with a telemedicine web platform. It needed to record vital signs, detect potential falls, and publish events over MQTT for healthcare professionals to review.',
        es: 'Diseñar e implementar un sistema de telemonitorización end-to-end combinando un prototipo de pulsera IoT con una plataforma web. Debía registrar constantes vitales, detectar caídas y publicar eventos mediante MQTT para que los profesionales sanitarios pudieran revisarlos.',
      },
      solution: {
        en: 'Built an on-device interface using an ESP32-based LilyGO TTGO T-Display, MAX30102 for SpO₂ and heart rate, and MPU-6050 for fall detection. Developed a backend with Python (FastAPI/SQLAlchemy), PostgreSQL, and Redis, along with a frontend in SvelteKit.',
        es: 'Construí una interfaz en un ESP32 LilyGO TTGO T-Display, un MAX30102 para SpO₂ y frecuencia cardíaca, y un MPU-6050 para detectar caídas. Desarrollé un backend con Python (FastAPI/SQLAlchemy), PostgreSQL y Redis, junto a un frontend en SvelteKit.',
      },
      contribution: {
        en: 'Developed the complete system spanning electronics, embedded C++ firmware, IoT communications, REST API design, data modeling, frontend development, and container-based deployment infrastructure. The project received a grade of 10.0 with Honours.',
        es: 'Desarrollé el sistema completo abarcando electrónica, firmware en C++, comunicaciones IoT, diseño de API REST, modelado de datos, desarrollo frontend e infraestructura de despliegue con contenedores. El proyecto obtuvo una calificación de 10.0 con Matrícula de Honor.',
      },
    },
    featured: true,
  },

  // ─── Khaos Research ───────────────────────────────────────────────
  {
    id: 'metadataxtract',
    name: { en: 'MetaDataXtract', es: 'MetaDataXtract' },
    description: {
      en: 'Security-first pipeline that validates, extracts and enriches file metadata into interoperable JSON-LD for federated data spaces.',
      es: 'Pipeline security-first que valida, extrae y enriquece metadatos de archivos en JSON-LD interoperable para espacios de datos federados.',
    },
    shortDescription: {
      en: 'Metadata extraction & validation pipeline',
      es: 'Pipeline de extracción y validación de metadatos',
    },
    technologies: ['Next.js', 'FastAPI', 'Python', 'JSON-LD', 'DCAT-AP', 'Docker'],
    tag: 'professional',
    category: 'use-case',
    company: 'Khaos Research',
    link: 'https://khaos.uma.es/metadataextract/es/login',
    github: 'https://github.com/KhaosResearch/MetaDataXtract/tree/main',
    media: [
      {
        type: 'image',
        src: '/images/khaos/metadataxtract/example-of-use.png',
        title: { en: 'Assisted publishing workflow', es: 'Flujo de publicación asistida' },
        alt: { en: 'MetaDataXtract application interface', es: 'Interfaz de la aplicación MetaDataXtract' },
      },
    ],
    roleHighlight: {
      en: 'End-to-end ownership of a SEDIA deliverable — architecture, security pipeline, extraction engine, LLM integrations and production deployment.',
      es: 'Responsabilidad end-to-end sobre un entregable SEDIA — arquitectura, pipeline de seguridad, motor de extracción, integraciones LLM y despliegue en producción.',
    },
    repositoryNotice: {
      en: 'Institutional repository. Access may require authorization from the organization.',
      es: 'Repositorio institucional. El acceso puede requerir autorización de la organización.',
    },
    caseStudy: {
      title: {
        en: 'From raw files to interoperable metadata',
        es: 'De archivos en bruto a metadatos interoperables',
      },
      challenge: {
        en: 'Data providers must manually document schemas, temporal ranges and geospatial systems before publishing. This bottleneck slows cataloguing and introduces inconsistencies across the data space.',
        es: 'Los proveedores deben documentar manualmente esquemas, rangos temporales y sistemas geoespaciales antes de publicar. Este cuello de botella ralentiza la catalogación e introduce inconsistencias en el espacio de datos.',
      },
      solution: {
        en: 'A modular pipeline that validates file integrity (SHA-256, magic bytes, 70+ AV engines), extracts structure with specialized parsers for 30+ formats, enriches with LLM-generated descriptions and controlled vocabularies (AGROVOC, EuroVoc), and outputs validated JSON-LD aligned with DCAT-AP.',
        es: 'Un pipeline modular que valida la integridad del archivo (SHA-256, bytes mágicos, 70+ motores AV), extrae estructura con parsers especializados para +30 formatos, enriquece con descripciones LLM y vocabularios controlados (AGROVOC, EuroVoc), y produce JSON-LD validado conforme a DCAT-AP.',
      },
      contribution: {
        en: 'Full ownership of this SEDIA deliverable: security pipeline, modular extraction engine, semantic enrichment, LLM integrations, validation layer and production deployment infrastructure.',
        es: 'Responsabilidad total sobre este entregable SEDIA: pipeline de seguridad, motor modular de extracción, enriquecimiento semántico, integraciones LLM, capa de validación e infraestructura de despliegue.',
      },
      evolution: {
        en: 'Next: VirusTotal-inspired threat analysis and SHACL validation for cross-tool interoperability.',
        es: 'Próximo: análisis de amenazas inspirado en VirusTotal y validación SHACL para interoperabilidad entre herramientas.',
      },
    },
    featured: false,
  },
  {
    id: 'metadatasearch',
    name: { en: 'MetaDataSearch', es: 'MetaDataSearch' },
    description: {
      en: 'Multimodal metadata broker enabling conversational AI search, semantic filtering and knowledge graph exploration for federated data spaces.',
      es: 'Broker de metadatos multimodal con búsqueda semántica, IA conversacional y exploración mediante grafos de conocimiento para espacios de datos federados.',
    },
    shortDescription: {
      en: 'Multimodal Search Broker',
      es: 'Buscador Multimodal IA',
    },
    technologies: ['Next.js', 'FastAPI', 'Elasticsearch', 'Qdrant', 'MongoDB', 'LLMs'],
    tag: 'professional',
    category: 'full-stack',
    company: 'Khaos Research',
    github: 'https://github.com/KhaosResearch/metadataSearchTool',
    media: [
      {
        type: 'image',
        src: '/images/khaos/metadatasearch/exampleView.png',
        title: { en: 'Discovery Interface', es: 'Interfaz de descubrimiento' },
        alt: { en: 'MetaDataSearch user interface', es: 'Interfaz de usuario de MetaDataSearch' },
      },
    ],
    roleHighlight: {
      en: 'End-to-end development covering search engines, inference handling, LLM orchestration and web UI.',
      es: 'Desarrollo integral abarcando motores de búsqueda, manejo de inferencias, orquestación de LLMs e interfaz web.',
    },
    caseStudy: {
      title: {
        en: 'Architecting a Multi-Index Discovery Layer',
        es: 'Arquitectura de una Capa de Descubrimiento Multi-Índice',
      },
      challenge: {
        en: 'In federated data architectures, discovering assets is difficult due to technical heterogeneity and rigid keyword-based search systems.',
        es: 'En arquitecturas federadas de datos, localizar información es complejo debido a la variabilidad en vocabularios técnicos y la dependencia de búsquedas léxicas estrictas.',
      },
      solution: {
        en: 'A decoupled architecture featuring an intelligent orchestration engine that dynamically routes queries to Lexical (Elasticsearch 8) or Semantic (Qdrant) engines based on query intent. The system is backed by MongoDB as the source of truth, synchronizing data to disposable search indexes. An interactive Pydantic AI agent provides conversational context.',
        es: 'Una arquitectura desacoplada con un orquestador inteligente que enruta peticiones a motores Léxicos (Elasticsearch 8) o Semánticos (Qdrant) según la intención. Respaldado por MongoDB como fuente de verdad, sincronizando datos hacia índices de búsqueda desechables. Un agente conversacional con Pydantic AI proporciona contexto adicional.',
      },
      contribution: {
        en: 'Total ownership of the project architecture, from vector embeddings and index synchronization pipelines to the Next.js frontend, authentication middleware, and robust containerized deployments.',
        es: 'Responsabilidad total sobre la arquitectura del proyecto, desde embeddings y sincronización de índices hasta el frontend en Next.js, middleware de autenticación y despliegue robusto en contenedores.',
      },
    },
    featured: false,
  },
  {
    id: 'titan-workflow',
    name: { en: 'TITAN Workflow Agent', es: 'Agente de Flujos TITAN' },
    description: {
      en: 'Autonomous LLM agent integrated into TITAN, a semantic Big Data software platform. It manages the lifecycle of scientific workflows, seamlessly translating natural language requests into complex orchestrated pipelines.',
      es: 'Agente LLM autónomo integrado en TITAN, una plataforma semántica de Big Data. Gestiona el ciclo de vida de flujos de trabajo científicos, traduciendo peticiones en lenguaje natural a pipelines orquestados complejos.',
    },
    shortDescription: {
      en: 'Semantic Workflow LLM Agent',
      es: 'Agente LLM para Flujos Semánticos',
    },
    technologies: ['LLMs', 'Python', 'Agentic Workflows', 'Apache Spark', 'Kafka'],
    tag: 'professional',
    category: 'use-case',
    company: 'Khaos Research',
    link: 'https://www.sciencedirect.com/science/article/pii/S0950705121007516',
    roleHighlight: {
      en: 'Evolved the LLM inclusion, improving its analytical reasoning and transforming it into an active agent capable of constructing and integrating pipelines directly into the web platform.',
      es: 'Evolucioné la inclusión del LLM, mejorando su análisis y transformándolo en un agente activo capaz de armar e integrar pipelines de forma autónoma en la plataforma web.',
    },
    caseStudy: {
      challenge: {
        en: 'Modern Big Data applications require tools to not only process data but also exploit underlying knowledge. The challenge was bridging the gap between natural language and the complex, semantic composition of scientific workflows (e.g., human activity recognition, land monitoring).',
        es: 'Las aplicaciones modernas de Big Data requieren herramientas para explotar el conocimiento subyacente. El desafío era cerrar la brecha entre el lenguaje natural y la composición semántica compleja de flujos de trabajo científicos (ej. monitorización satelital).',
      },
      solution: {
        en: 'Transformed a basic chatbot into an autonomous reasoning agent. I integrated it into the web platform so it could understand the problem domain and automatically assemble pipelines using TITAN\'s semantic components (backed by Kafka, Avro, and Spark).',
        es: 'Transformé un chatbot básico en un agente de razonamiento autónomo. Lo integré en la plataforma web para que comprendiera el dominio del problema y ensamblara automáticamente pipelines utilizando los componentes semánticos de TITAN.',
      },
      evolution: {
        en: 'The agent streamlined workflow composition, proving its validity across academic and real-world Big Data scopes by orchestrating tools without manual node-by-node construction.',
        es: 'El agente agilizó la composición de flujos de trabajo, demostrando su validez en ámbitos académicos y reales de Big Data al orquestar herramientas sin necesidad de construcción manual nodo a nodo.',
      },
      contribution: {
        en: 'Spearheaded the LLM web integration, enhanced its reasoning prompts, and developed the execution hooks to generate actionable pipeline structures on the TITAN interface.',
        es: 'Lideré la integración web del LLM, mejoré sus prompts de razonamiento y desarrollé los hooks de ejecución para generar estructuras de pipeline funcionales en la interfaz de TITAN.',
      }
    },
    featured: false,
  },

  {
    id: 'edaan-data-space',
    name: { en: 'EDAAN Data Space', es: 'Espacio de Datos EDAAN' },
    description: {
      en: 'Agri-food Data Space of Andalusia (EDAAN). I contributed as a junior developer, focusing on frontend implementations and connecting features. This project provided essential hands-on learning in advanced data infrastructure, particularly Kubernetes and data connectors.',
      es: 'Espacio de Datos Agroalimentario de Andalucía (EDAAN). Contribuí como desarrollador junior, enfocándome en diseños y conexión de funcionalidades. Este proyecto proporcionó un aprendizaje práctico en infraestructura avanzada, destacando Kubernetes y el uso de conectores.',
    },
    shortDescription: {
      en: 'Agri-food Data Space',
      es: 'Espacio de Datos Agroalimentario',
    },
    technologies: ['Kubernetes', 'Data Connectors', 'React', 'Infrastructure'],
    tag: 'professional',
    category: 'use-case',
    company: 'Khaos Research',
    link: 'https://edaan.agora-datalab.eu/',
    roleHighlight: {
      en: 'Assisted with UI design implementation and functional connections while learning robust infrastructure deployments (Kubernetes) directly from senior engineers.',
      es: 'Asistí en la implementación del diseño UI y conexiones funcionales, mientras aprendía sobre despliegues robustos de infraestructura (Kubernetes) directamente de ingenieros senior.',
    },
    caseStudy: {
      challenge: {
        en: 'As one of the most critical projects within SEDIA, the platform needed a robust, user-friendly interface to handle complex agricultural datasets, manage offers, and present data intuitively.',
        es: 'Como uno de los proyectos más críticos dentro de SEDIA, la plataforma necesitaba una interfaz robusta y accesible para gestionar datasets agrícolas complejos, manejar ofertas y presentar datos de forma intuitiva.',
      },
      solution: {
        en: 'An evolving platform designed to streamline dataset operations, backed by a resilient Kubernetes infrastructure for high availability and scalability.',
        es: 'Una plataforma en evolución diseñada para agilizar las operaciones con datasets, respaldada por una infraestructura resiliente en Kubernetes para alta disponibilidad y escalabilidad.',
      },
      contribution: {
        en: 'Driven by the group\'s growth, I took on UI/UX design and development tasks, significantly improving how users upload offers, manage datasets, and visualize information. This project also served as a vital hands-on learning experience in working with Kubernetes.',
        es: 'Motivado por el crecimiento del grupo, asumí tareas de diseño y desarrollo UI/UX, mejorando significativamente la subida de ofertas, gestión de datasets y representación visual. Este proyecto también fue clave para mi aprendizaje práctico con Kubernetes.',
      },
    },
    featured: false,
  },

  {
    id: 'alignx',
    name: { en: 'AlignX Ontology Mapper', es: 'Mapeador de Ontologías AlignX' },
    description: {
      en: 'Multi-strategy ontology alignment engine that orchestrates an extensible catalog of mappers (lexical, semantic, structural, Gromov-Wasserstein, cross-lingual, and more) together with external OAEI-compatible matchers (LogMap, AML, BERTMap). A smart recommender profiles the input ontologies and selects the optimal execution plan automatically.',
      es: 'Motor de alineación de ontologías multi-estrategia que orquesta un catálogo extensible de mapeadores (léxicos, semánticos, estructurales, Gromov-Wasserstein, cross-lingual, y más) junto con motores externos compatibles con OAEI (LogMap, AML, BERTMap). Un recomendador inteligente perfila las ontologías de entrada y selecciona el plan de ejecución óptimo automáticamente.',
    },
    shortDescription: {
      en: 'Multi-Strategy Ontology Alignment',
      es: 'Alineación de Ontologías Multi-Estrategia',
    },
    technologies: ['Python', 'FastAPI', 'Next.js', 'RDFLib', 'Docker', 'S-BERT'],
    tag: 'professional',
    category: 'use-case',
    company: 'Khaos Research',
    link: 'https://github.com/KhaosResearch/AlignX',
    repositoryNotice: {
      en: 'Private repository — Khaos Research internal tool.',
      es: 'Repositorio privado — herramienta interna de Khaos Research.',
    },
    roleHighlight: {
      en: 'Expanded the mapper catalog with multiple internal signals and external OAEI matchers, implemented consensus logic (voting/Borda), and built the Next.js/FastAPI web interface with HTML reporting.',
      es: 'Amplié el catálogo de mapeadores con múltiples señales internas y motores OAEI externos, implementé la lógica de consenso (voting/Borda), y construí la interfaz web Next.js/FastAPI con reportes HTML.',
    },
    caseStudy: {
      challenge: {
        en: 'Aligning heterogeneous ontologies is one of the hardest problems in the Semantic Web. No single algorithm works for every case: lexical mappers miss synonyms, semantic embeddings confuse related-but-not-equal concepts, and structural analysis fails when hierarchies diverge. The OAEI benchmark demands both precision and recall across very different domains.',
        es: 'Alinear ontologías heterogéneas es uno de los problemas más complejos de la Web Semántica. Ningún algoritmo funciona para todos los casos: los mapeadores léxicos pierden sinónimos, los embeddings semánticos confunden conceptos relacionados pero no equivalentes, y el análisis estructural falla cuando las jerarquías divergen. El benchmark OAEI exige precisión y recall en dominios muy distintos.',
      },
      solution: {
        en: 'Built an extensible catalog of 10+ internal mappers (lexical, semantic, structural, Gromov-Wasserstein, cross-lingual, instance-based, onto-kmer, OWL constraints) and integrated external OAEI engines (LogMap, AML, BERTMap). A smart profiler analyzes input ontologies and a recommender selects the optimal plan. Two execution modes (ensemble and cascaded) fuse signals through voting or Borda consensus, followed by Gale-Shapley 1:1 filtering and optional LLM judge review.',
        es: 'Construí un catálogo extensible con más de 10 mapeadores internos (léxicos, semánticos, estructurales, Gromov-Wasserstein, cross-lingual, instancias, onto-kmer, restricciones OWL) e integré motores OAEI externos (LogMap, AML, BERTMap). Un perfilador inteligente analiza las ontologías de entrada y un recomendador selecciona el plan óptimo. Dos modos de ejecución (ensemble y cascaded) fusionan señales mediante consenso voting o Borda, seguidos de filtrado 1:1 Gale-Shapley y revisión opcional con juez LLM.',
      },
      contribution: {
        en: 'Incorporated the majority of internal mappers into the catalog, implemented the OAEI-compatible external matcher integration, developed the consensus/fusion engine, and built the complete web platform (Next.js frontend + FastAPI backend) with interactive HTML alignment reports and multi-format export (RDF, TTL, OWL, JSON).',
        es: 'Incorporé la mayoría de los mapeadores internos al catálogo, implementé la integración de matchers externos compatibles con OAEI, desarrollé el motor de consenso/fusión, y construí la plataforma web completa (frontend Next.js + backend FastAPI) con reportes HTML interactivos y exportación multi-formato (RDF, TTL, OWL, JSON).',
      },
    },
    media: [
      {
        type: 'image' as const,
        src: '/images/khaos/alignx/screenshot.png',
        alt: { en: 'AlignX alignment report with signal weights and match results', es: 'Reporte de alineación AlignX con pesos de señales y resultados de matching' },
        title: { en: 'AlignX Alignment Report — 98% confidence matches with MetaAnalyzer signal weights', es: 'Reporte de Alineación AlignX — matches con 98% de confianza y pesos del MetaAnalyzer' },
      }
    ],
    featured: false,
  },

  // ─── Msurgery ─────────────────────────────────────────────────────
  {
    id: 'msurgery-platform',
    name: { en: 'mSurgery Platform', es: 'Plataforma mSurgery' },
    description: {
      en: 'Advanced telepresence platform for real-time surgical collaboration. Streams operations in HD and 3D, integrating mixed and virtual reality so remote professionals can visualize and participate in surgeries as if inside the operating room.',
      es: 'Plataforma avanzada de telepresencia para colaboración quirúrgica en tiempo real. Transmite operaciones en alta definición y 3D, integrando realidad mixta y virtual para que profesionales remotos visualicen y participen en intervenciones como si estuvieran en el quirófano.',
    },
    shortDescription: {
      en: 'Surgical Telepresence Platform',
      es: 'Plataforma de Telepresencia Quirúrgica',
    },
    technologies: ['Svelte', 'TypeScript', 'WebRTC', '3D Streaming'],
    tag: 'professional',
    category: 'full-stack',
    company: 'Msurgery',
    link: 'https://msurgery.net/',
    roleHighlight: {
      en: 'Developed platform features as a junior developer and represented the company in English-language presentations to international investors at Polo Digital, demonstrating the product and its capabilities.',
      es: 'Desarrollé funcionalidades de la plataforma como desarrollador junior y representé a la empresa en presentaciones en inglés para inversores internacionales en el Polo Digital, demostrando el producto y sus capacidades.',
    },
    media: [
      {
        type: 'youtube' as const,
        src: 'https://www.youtube.com/watch?v=qKQZmAaBIIc',
        title: { en: 'mSurgery — Surgical Telepresence Demo', es: 'mSurgery — Demo de Telepresencia Quirúrgica' },
      }
    ],
    caseStudy: {
      challenge: {
        en: 'Remote medical training and real-time assistance demand high-fidelity, zero-latency immersive collaboration to effectively bridge the gap between surgeons, mentors, and students.',
        es: 'La formación médica a distancia y la asistencia remota exigen una colaboración inmersiva de alta fidelidad y latencia cero para conectar eficazmente a cirujanos, mentores y estudiantes.',
      },
      solution: {
        en: 'An advanced surgical telepresence platform founded in Malaga (2019) that leverages Virtual Reality (VR), Mixed Reality (MR), and 5G connectivity to enable remote telementoring and interactive operations.',
        es: 'Una plataforma avanzada de telepresencia quirúrgica fundada en Málaga (2019) que utiliza Realidad Virtual (RV), Realidad Mixta (RM) y conectividad 5G para permitir telementoría remota y operaciones interactivas.',
      },
      contribution: {
        en: 'Implemented minor visual fixes and UI corrections. Crucially, I acted as a technical representative, conducting presentations in English, explaining the platform\'s usage, and guiding international users through first-hand testing experiences.',
        es: 'Implementé correcciones visuales menores en la interfaz. De manera crucial, actué como representante técnico, realizando charlas en inglés, explicando el uso de la plataforma y guiando a usuarios internacionales en pruebas de primera mano.',
      },
    },
    featured: false,
  },
  {
    id: 'smotts',
    name: { en: 'SMOTTS Sleep Diagnostics', es: 'SMOTTS Diagnóstico del Sueño' },
    description: {
      en: 'Medical device project for the portable, intelligent diagnosis and treatment of REM Sleep Behavior Disorder (RBD). Captures biometric signals and processes them to detect anomalous patterns during REM phases.',
      es: 'Proyecto de dispositivo médico para el diagnóstico y tratamiento portátil e inteligente del Trastorno de Conducta de Sueño REM (TCSREM). Captura señales biométricas y las procesa para detectar patrones anómalos durante fases REM.',
    },
    shortDescription: {
      en: 'REM Sleep Disorder Diagnostics',
      es: 'Diagnóstico del Trastorno de Sueño REM',
    },
    technologies: ['Svelte', 'TypeScript', 'D3.js', 'Data Processing'],
    tag: 'professional',
    category: 'use-case',
    company: 'Msurgery',
    roleHighlight: {
      en: 'Built improved data visualizers for biomedical signal analysis and implemented data processing pipelines to support the diagnostic workflow.',
      es: 'Construí visualizadores de datos mejorados para el análisis de señales biomédicas e implementé pipelines de procesamiento de datos para soportar el flujo de diagnóstico.',
    },
    caseStudy: {
      challenge: {
        en: 'REM Sleep Behavior Disorder (RBD) requires accurate, ambulatory diagnostic methods outside of traditional sleep labs.',
        es: 'El Trastorno de Conducta de Sueño REM (TCSREM) requiere métodos de diagnóstico ambulatorios y precisos fuera de los laboratorios de sueño tradicionales.',
      },
      solution: {
        en: 'SMOTTS is a research project designed to create a portable and intelligent device focused specifically on the diagnosis and ambulatory therapy of RBD.',
        es: 'SMOTTS es un proyecto de investigación para crear un dispositivo portátil e inteligente enfocado en el diagnóstico y la terapia ambulatoria del Trastorno de Conducta de Sueño REM (TCSREM).',
      },
      contribution: {
        en: 'Once the biometric data is received from the device, I handle all the preprocessing logic and facilitate its visualization within a dedicated application for doctors.',
        es: 'Una vez se reciben los datos, me encargo de hacer todo el preprocesamiento y facilitar la visualización en una aplicación interactiva para médicos.',
      }
    },
    featured: false,
  },
  {
    id: 'digital-twins',
    name: { en: '3D Digital Twins', es: 'Gemelos Digitales 3D' },
    description: {
      en: 'Medical platform housing a database of 3D-scanned organs for research and surgical planning. Provides interactive visualization and exploration of anatomical digital twins.',
      es: 'Plataforma médica con una base de datos de órganos escaneados en 3D para investigación y planificación quirúrgica. Proporciona visualización interactiva y exploración de gemelos digitales anatómicos.',
    },
    shortDescription: {
      en: '3D Organ Digital Twins',
      es: 'Gemelos Digitales de Órganos 3D',
    },
    technologies: ['Svelte 5', 'TypeScript', '3D Rendering', 'Migration'],
    tag: 'professional',
    category: 'full-stack',
    company: 'Msurgery',
    roleHighlight: {
      en: 'Led the structural migration from Svelte 4 to Svelte 5 (runes, snippets, new reactivity model) while delivering feature improvements and maintenance tasks.',
      es: 'Lideré la migración estructural de Svelte 4 a Svelte 5 (runes, snippets, nuevo modelo de reactividad) mientras entregaba mejoras de funcionalidades y tareas de mantenimiento.',
    },
    caseStudy: {
      challenge: {
        en: 'A sophisticated medical platform handling complex 3D objects, such as patient organs for surgical planning, required modernization to maintain performance and developer velocity.',
        es: 'Una sofisticada plataforma médica que maneja objetos 3D complejos, como órganos de pacientes para planificación quirúrgica, requería modernización para mantener el rendimiento y la agilidad de desarrollo.',
      },
      solution: {
        en: 'Upgrading the entire architecture to leverage the latest framework advancements, ensuring the interactive 3D anatomical models render smoothly and reactively.',
        es: 'Actualizar toda la arquitectura para aprovechar los últimos avances del framework, asegurando que los modelos anatómicos 3D interactivos se rendericen de forma fluida y reactiva.',
      },
      contribution: {
        en: 'Executed a complete, structural migration of the entire project from Svelte 4 to Svelte 5. I updated the core reactivity models and components to ensure the 3D digital twins platform remained highly performant and robust.',
        es: 'Ejecuté una migración estructural completa de todo el proyecto de Svelte 4 a Svelte 5. Actualicé los modelos de reactividad y componentes base para garantizar que la plataforma de gemelos digitales 3D mantuviera un alto rendimiento y robustez.',
      },
    },
    featured: false,
  },

  // ─── Personal ─────────────────────────────────────────────────────
  {
    id: 'instagram-epic-tool',
    name: { en: 'CircleScope: Instagram Graph', es: 'CircleScope: Grafo de Instagram' },
    description: {
      en: 'CircleScope turns an official Instagram data export into an understandable relationship map. It calculates followers, followed accounts, mutual relationships, people who only follow you, and people who do not follow you back.',
      es: 'CircleScope convierte una exportación oficial de datos de Instagram en un mapa de relaciones comprensible. Calcula seguidores, seguidos, relaciones mutuas, y analiza quién no te sigue de vuelta.',
    },
    shortDescription: {
      en: 'Instagram Relationship Map',
      es: 'Mapa de Relaciones de Instagram',
    },
    technologies: ['FastAPI', 'React', 'Vite', 'Force Graph', 'Data Analysis'],
    tag: 'personal',
    category: 'full-stack',
    github: 'https://github.com/Diegodepab/instagram-epic-tool',
    caseStudy: {
      challenge: {
        en: 'The primary export-analysis flow never asks for an Instagram password, does not scrape Instagram, and makes no external API calls. Uploaded ZIP files are processed temporarily and are not retained by the application.',
        es: 'El flujo de análisis principal nunca pide contraseñas, no hace web scraping, ni realiza llamadas a APIs externas. Los archivos ZIP se procesan de forma temporal y no se almacenan.',
      },
      solution: {
        en: 'A separate, visibly experimental lab can be enabled by an operator for bounded access to an owned or expressly authorized account. The laboratory is informational, educational, and defensive.',
        es: 'Un laboratorio experimental separado puede ser habilitado por un operador para acceso limitado a una cuenta propia o expresamente autorizada. El laboratorio es informativo, educativo y defensivo.',
      },
      contribution: {
        en: 'Developed an interface that includes a fictional demo, exact relationship metrics, a performance-aware interactive graph, multiple authorized ZIP merging, complete paginated lists, category filters, and CSV export.',
        es: 'Desarrollé una interfaz con una demo ficticia, métricas exactas, un grafo interactivo de alto rendimiento, fusión de múltiples ZIPs autorizados, listas paginadas, filtros por categoría y exportación a CSV.',
      },
    },
    featured: false,
  },
];
