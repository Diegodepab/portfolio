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
        en: 'Modern full-stack systems require reproducible, declarative infrastructure. The challenge was transitioning an application from a local Docker Compose setup to an enterprise-grade Kubernetes cluster with automated GitOps, encrypted secrets, and high-availability storage without downtime.',
        es: 'Los sistemas full-stack modernos exigen infraestructura declarativa y reproducible. El reto consistió en evolucionar una aplicación desde Docker Compose local hasta un clúster de Kubernetes de grado empresarial con GitOps automatizado, gestión cifrada de secretos y almacenamiento de alta disponibilidad sin interrupciones.',
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
    featured: false,
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
    technologies: ['IoT', 'ESP32', 'C++', 'FastAPI', 'SvelteKit', 'PostgreSQL', 'MQTT', 'Docker'],
    tag: 'personal',
    category: 'use-case',
    github: 'https://github.com/Diegodepab/TFG_Pulsera_Seguimiento_Pacientes_Avanzada_Edad',
    awardBadge: {
      en: 'Biomedical Hardware · Database Connectivity · Clinical Platform & Patient Management',
      es: 'Hardware biomédico · Conexión a base de datos · Plataforma clínica y gestión de pacientes',
    },
    stats: [
      {
        label: { en: 'Final Grade', es: 'Calificación' },
        value: '10.0 / 10',
        subtext: { en: 'Honours Degree (Matrícula de Honor)', es: 'Matrícula de Honor' },
      },
      {
        label: { en: 'Sampling Rate', es: 'Muestreo Óptico' },
        value: '100 Hz',
        subtext: { en: 'MAX30102 PPG Red/IR', es: 'Fotopletismografía I2C' },
      },
      {
        label: { en: 'Offline Resilience', es: 'Resiliencia de Red' },
        value: 'RAM Buffer',
        subtext: { en: 'Zero loss on Wi-Fi drops', es: 'Buffer circular sin pérdida' },
      },
      {
        label: { en: 'Ecosystem', es: 'Ecosistema' },
        value: 'End-to-End',
        subtext: { en: 'C++ · MQTT · FastAPI · SvelteKit', es: 'C++ · MQTT · FastAPI · SvelteKit' },
      },
    ],
    architectureType: 'iot-telemetry',
    sections: [
      {
        id: 'challenge',
        number: '01',
        title: {
          en: 'The Clinical & Engineering Challenge',
          es: 'El Desafío Clínico y de Ingeniería',
        },
        subtitle: {
          en: 'Passive home telemonitoring with guaranteed reliability',
          es: 'Telemonitorización domiciliaria no invasiva y de alta fidelidad',
        },
        content: {
          en: 'Demographic aging demands continuous, non-invasive home monitoring that enables clinicians to supervise patient vitals without requiring technical intervention from the elderly. \n\nThe core challenge was designing a complete **end-to-end** system: from custom biomedical sensor circuitry and embedded firmware up to a multi-tenant clinical web platform. The system needed to guarantee data integrity across unstable home Wi-Fi networks, detect falls in real-time, and provide clinicians with actionable historical trends.',
          es: 'El envejecimiento de la población exige sistemas de monitorización domiciliaria continuos y no invasivos que permitan a los profesionales sanitarios vigilar la salud de personas de edad avanzada sin exigirles interactuar con tecnología compleja.\n\nEl desafío central consistió en diseñar una solución integral **end-to-end**: desde el circuito electrónico y el firmware embebido hasta una plataforma web clínica multi-rol. El sistema debía garantizar la continuidad de las lecturas ante cortes de conexión Wi-Fi doméstica, detectar caídas en tiempo real y presentar historiales comparativos listos para el triaje médico.',
        },
        keyPoints: [
          { en: 'Passive telemetry without elder burden', es: 'Telemetría pasiva sin sobrecarga para el paciente' },
          { en: 'Multi-sensor fusion: Optical PPG + 6-Axis IMU', es: 'Fusión sensorial: PPG óptico + IMU inercial de 6 ejes' },
          { en: 'Automatic fallback during wireless dropouts', es: 'Tolerancia a fallos automática ante cortes de red' },
        ],
        featuredImage: {
          src: '/images/projects/tfg/prototipo-hardware.png',
          caption: {
            es: 'Banco de pruebas en protoboard con microcontrolador ESP32 LilyGO y sensores I2C encendidos.',
            en: 'Laboratory breadboard circuit integrating the ESP32 TTGO T-Display and operational I2C sensors.',
          },
          alt: {
            es: 'Prototipo hardware en placa de pruebas',
            en: 'Hardware test bench on breadboard',
          },
        },
      },
      {
        id: 'firmware',
        number: '02',
        title: {
          en: 'Embedded Firmware & Edge Processing',
          es: 'Firmware Embebido y Procesamiento en el Edge',
        },
        subtitle: {
          en: 'Dual-core ESP32, optical PPG sampling & offline circular buffer',
          es: 'ESP32 dual-core, muestreo PPG óptico y búfer circular en memoria',
        },
        content: {
          en: 'The wearable device is built on an **ESP32 LilyGO TTGO T-Display** SoC with an integrated 1.14" color TFT screen. The C++ firmware orchestrates two primary biomedical sensors over an I2C bus:\n\n- **MAX30102 Optical PPG:** Emits red and infrared wavelengths at 100 Hz through capillary tissue to extract raw photoplethysmogram waveforms, estimating pulse (BPM) and blood oxygen saturation (SpO₂).\n- **MPU-6050 6-Axis IMU:** Samples triaxial accelerometer and gyroscope vectors. An edge algorithm computes signal vector magnitude (SVM) to detect abrupt impact spikes followed by post-fall immobility.\n- **Resilient Circular Buffer:** If Wi-Fi connectivity drops, readings are preserved in a local RAM ring buffer with synchronized NTP timestamps, avoiding data loss until the broker becomes reachable again.',
          es: 'El dispositivo físico se sustenta en un SoC **ESP32 LilyGO TTGO T-Display** con pantalla TFT a color de 1.14". El firmware en C++ gestiona dos sensores biomédicos principales a través del bus I2C:\n\n- **MAX30102 (PPG Óptico):** Emite luz roja e infrarroja a 100 Hz a través del lecho capilar para capturar la onda fotopletismográfica, calculando la frecuencia cardíaca (BPM) y la saturación de oxígeno (SpO₂).\n- **MPU-6050 (IMU 6 ejes):** Muestrea acelerometría y giroscopio triaxial. Un algoritmo en el microcontrolador analiza la magnitud del vector de aceleración para identificar picos de impacto seguidos de inmovilidad (patrón de caída).\n- **Búfer Circular de Resiliencia:** Si la señal Wi-Fi se interrumpe, el firmware encola los datos en un búfer circular en RAM con marcas de tiempo NTP, descargándolos en ráfaga en cuanto recupera la conexión.',
        },
        keyPoints: [
          { en: 'C++ firmware with modular sensor drivers', es: 'Firmware en C++ con controladores de sensores modulares' },
          { en: 'NTP epoch timestamping for analytical consistency', es: 'Marcas temporales NTP sincronizadas por red' },
          { en: 'Local TFT visual status and battery feedback', es: 'Feedback visual inmediato en pantalla TFT integrada' },
        ],
        featuredImage: {
          src: '/images/projects/tfg/analizando.jpg',
          caption: {
            es: 'Adquisición real de fotopletismografía óptica y presentación de métricas en la pantalla integrada de la pulsera.',
            en: 'Live optical photoplethysmography acquisition and on-screen metrics presentation on the wearable prototype.',
          },
          alt: {
            es: 'Pulsera midiendo constantes vitales en el dedo',
            en: 'Wristband prototype measuring heart rate on finger',
          },
        },
      },
      {
        id: 'iot-messaging',
        number: '03',
        title: {
          en: 'IoT Messaging & Decoupled Broker Pipeline',
          es: 'Mensajería IoT y Desacoplamiento con MQTT',
        },
        subtitle: {
          en: 'Lightweight publish/subscribe model using Eclipse Mosquitto',
          es: 'Modelo publicación/suscripción ligero con Eclipse Mosquitto',
        },
        content: {
          en: 'To optimize battery life and minimize network overhead on the wearable, the system implements **MQTT** through an **Eclipse Mosquitto** broker:\n\n- **Structured Topics:** Clear namespace partitioning (`patient/{id}/vitals`, `patient/{id}/alerts/fall`, `patient/{id}/events`).\n- **Compact JSON Payloads:** Efficient data serialization containing biometric metrics, signal quality indicators, and NTP timestamps.\n- **Quality of Service (QoS 1):** Critical events like emergency button triggers and detected falls use confirmed delivery to ensure reception by medical ingest services.',
          es: 'Para minimizar el consumo energético de la pulsera y reducir la sobrecarga de red, el sistema adopta el protocolo **MQTT** sobre un broker **Eclipse Mosquitto**:\n\n- **Tópicos Jerárquicos:** Espacio de nombres estructurado (`patient/{id}/vitals`, `patient/{id}/alerts/fall`, `patient/{id}/events`).\n- **Cargas JSON Compactas:** Serialización eficiente con métricas biomédicas, calidad de señal y sellos temporales NTP.\n- **Calidad de Servicio (QoS 1):** Las alarmas críticas de caída y pulsaciones de emergencia se envían con confirmación de entrega para garantizar su recepción en el servidor.',
        },
        keyPoints: [
          { en: 'Asynchronous event decoupling', es: 'Desacoplamiento asíncrono de eventos' },
          { en: 'Minimal byte transmission overhead', es: 'Mínimo ancho de banda y sobrecarga de red' },
          { en: 'QoS guarantees for patient safety alerts', es: 'Garantía QoS para alertas críticas de salud' },
        ],
      },
      {
        id: 'web-platform',
        number: '04',
        title: {
          en: 'Telemedicine Web Platform & Clinical UX',
          es: 'Plataforma Web de Telemedicina y UX Clínica',
        },
        subtitle: {
          en: 'SvelteKit frontend, async FastAPI backend & role-based workflows',
          es: 'Frontend reactivo en SvelteKit, backend asíncrono en FastAPI y acceso multi-rol',
        },
        content: {
          en: 'The clinical web application was built with a modern containerized microservice architecture using Docker Compose:\n\n- **Asynchronous FastAPI Core:** REST API written in Python with SQLAlchemy and Pydantic validation, storing long-term clinical records in PostgreSQL and temporal sessions in Redis.\n- **SvelteKit Clinical Portal:** Highly responsive frontend providing three role-tailored dashboards:\n  - **Doctor Portal:** Patient cohort overview, pathology tagging, alarm resolution center, and daily study charts with interactive time-series powered by Chart.js.\n  - **Patient Portal:** Accessible self-monitoring view with intuitive health status indicators and secure doctor chat.\n  - **Administrator Portal:** System configuration and access management.',
          es: 'La plataforma web clínica se diseñó con una arquitectura modular contenerizada mediante Docker Compose y Nginx:\n\n- **Núcleo Asíncrono en FastAPI:** API REST en Python con SQLAlchemy y validación estricta en Pydantic. Almacena historiales en PostgreSQL y gestiona sesiones y estados en Redis.\n- **Portal Clínico en SvelteKit:** Frontend reactivo con tres paneles según el rol del usuario:\n  - **Portal Médico:** Supervisión de pacientes asignados, vinculación de patologías, centro de resolución de alarmas y gráficas interactivas de constantes con Chart.js.\n  - **Portal del Paciente:** Consulta amigable de su evolución diaria y chat directo con su especialista.\n  - **Portal del Administrador:** Gestión de usuarios y catálogos globales del sistema.',
        },
        keyPoints: [
          { en: 'Interactive daily studies and Chart.js graphs', es: 'Estudios diarios con gráficas interactivas en Chart.js' },
          { en: 'Color-coded risk ranges for abnormal vitals', es: 'Semáforo clínico de constantes fuera de rango' },
          { en: 'Complete containerized Docker Compose deployment', es: 'Despliegue reproducible con Docker Compose y Nginx' },
        ],
        featuredImage: {
          src: '/images/projects/tfg/estudio-clinico.png',
          caption: {
            es: 'Panel médico interactivo con gráficas temporales de constantes, semáforo de riesgo y actividad.',
            en: 'Interactive doctor dashboard with vital sign progression charts, risk ranges, and activity breakdown.',
          },
          alt: {
            es: 'Panel de estudio clínico diario',
            en: 'Clinical daily study screen',
          },
        },
      },
    ],
    media: [
      {
        type: 'image',
        src: '/images/projects/tfg/analizando.jpg',
        category: 'hardware',
        title: {
          en: 'Live Wristband Prototype Measuring Vitals',
          es: 'Prototipo en pruebas reales midiendo constantes',
        },
        caption: {
          en: 'Real optical pulse acquisition and OLED/TFT display feedback during laboratory evaluation.',
          es: 'Adquisición óptica real de pulso y saturación con feedback visual en pantalla durante las pruebas.',
        },
        alt: {
          en: 'Wristband prototype measuring heart rate on finger',
          es: 'Prototipo de pulsera midiendo constantes vitales en el dedo',
        },
      },
      {
        type: 'image',
        src: '/images/projects/tfg/prototipo-hardware.png',
        category: 'hardware',
        title: {
          en: 'Breadboard Circuit with ESP32 & Sensors',
          es: 'Montaje de laboratorio con ESP32 y sensores I2C',
        },
        caption: {
          en: 'Integrated test bench showing LilyGO TTGO T-Display connected to MAX30102 and MPU-6050 modules.',
          es: 'Banco de pruebas integrado con la pantalla TTGO T-Display conectada a los módulos MAX30102 y MPU-6050.',
        },
        alt: {
          en: 'Hardware test bench with ESP32 TTGO T-Display and sensors',
          es: 'Banco de pruebas de hardware con ESP32 y sensores',
        },
      },
      {
        type: 'image',
        src: '/images/projects/tfg/esquema-electronico.jpg',
        category: 'hardware',
        title: {
          en: 'Electronic Wiring & Pinout Schematic',
          es: 'Esquema de conexionado electrónico y pines',
        },
        caption: {
          en: 'Hardware wiring diagram connecting TTGO GPIOs to I2C lines (SDA/SCL), power rails (3.3V), and physical push buttons.',
          es: 'Esquema de conexiones eléctricas entre los GPIOs del microcontrolador, buses I2C, alimentación a 3.3V y botones.',
        },
        alt: {
          en: 'Electronic circuit schematic diagram',
          es: 'Esquema del circuito electrónico',
        },
      },
      {
        type: 'image',
        src: '/images/projects/tfg/estudio-clinico.png',
        category: 'platform',
        title: {
          en: 'Daily Clinical Study & Vital Signs Charts',
          es: 'Estudio clínico diario y gráficas de constantes',
        },
        caption: {
          en: 'Medical dashboard view displaying daily steps, average BPM, SpO₂ levels, activity breakdown, and time-series progression.',
          es: 'Vista médica con desglose de pasos, BPM medios, saturación SpO₂, picos de actividad y evolución temporal.',
        },
        alt: {
          en: 'Clinical daily study screen with vital signs charts',
          es: 'Pantalla de estudio clínico diario con gráficas de constantes',
        },
      },
      {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=y1xrh9f9NOg',
        category: 'demo',
        title: {
          en: 'Physical Wristband Hardware Demonstration',
          es: 'Demostración de la pulsera física en funcionamiento',
        },
        caption: {
          en: 'Video walkthrough demonstrating sensor reading, step counting, and on-screen TFT interface on the physical prototype.',
          es: 'Recorrido en vídeo mostrando la adquisición de sensores, el conteo de pasos y la interfaz en la pantalla de la pulsera.',
        },
      },
      {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=w0fhrWlky6o',
        category: 'demo',
        title: {
          en: 'Telemedicine Web Platform Demonstration',
          es: 'Demostración de la plataforma web de telemedicina',
        },
        caption: {
          en: 'Video walkthrough of the web application: authentication, patient monitoring, charts, alarms, and doctor-patient chat.',
          es: 'Recorrido en vídeo por la plataforma web: autenticación, seguimiento de constantes, gráficas, alarmas y mensajería.',
        },
      },
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
    id: 'edaan-data-space',
    name: {
      en: 'Federated Data Space Ecosystem (EDAAN)',
      es: 'Ecosistema de Espacios de Datos Federados (EDAAN)',
    },
    description: {
      en: 'An enterprise-grade data space architecture combining automated DCAT-AP metadata extraction, hybrid AI search with conversational agents, and sovereign data exchange over high-availability Kubernetes infrastructure.',
      es: 'Arquitectura de espacio de datos federado que integra extracción automatizada de metadatos DCAT-AP, motor de búsqueda híbrido con agentes IA conversacionales y gobernanza soberana sobre infraestructura Kubernetes de alta disponibilidad.',
    },
    shortDescription: {
      en: 'Sovereign Data Space & AI Discovery Ecosystem',
      es: 'Ecosistema de Espacio de Datos e IA de Descubrimiento',
    },
    technologies: [
      'Next.js 16',
      'FastAPI',
      'Python',
      'Qdrant (Vectors)',
      'Elasticsearch 8',
      'Pydantic AI',
      'DCAT-AP v2',
      'JSON-LD',
      'Kubernetes',
      'Docker',
      'Apache Tika',
      'MongoDB',
    ],
    tag: 'professional',
    category: 'use-case',
    company: 'Khaos Research',
    link: 'https://edaan.agora-datalab.eu/',
    github: 'https://github.com/KhaosResearch/MetaDataXtract',
    awardBadge: {
      en: 'Federated Ecosystem · DCAT-AP Metadata Pipeline · Hybrid AI Search Broker',
      es: 'Ecosistema Federado · Pipeline de Metadatos DCAT-AP · Broker de Búsqueda Híbrida IA',
    },
    stats: [
      {
        label: { en: 'Supported Formats', es: 'Formatos Soportados' },
        value: '30+',
        subtext: { en: 'Geospatial, Raster, Tabular, RDF', es: 'Geoespacial, Ráster, Tablas, RDF' },
      },
      {
        label: { en: 'Semantic Standard', es: 'Estándar Semántico' },
        value: 'DCAT-AP v2',
        subtext: { en: 'UNE 0087:2025 · AGROVOC · EuroVoc', es: 'UNE 0087:2025 · AGROVOC · EuroVoc' },
      },
      {
        label: { en: 'Discovery Engine', es: 'Motor de Búsqueda' },
        value: 'Híbrido RRF',
        subtext: { en: 'Qdrant (Vectors) + Elasticsearch', es: 'Qdrant (Vectores) + Elasticsearch' },
      },
      {
        label: { en: 'Autonomous Assistant', es: 'Asistencia IA' },
        value: 'Pydantic AI',
        subtext: { en: 'Graph Navigation & Ingestion', es: 'Navegación e Inferencia en Grafo' },
      },
    ],
    architectureType: 'metadata-pipeline',
    sections: [
      {
        id: 'bottleneck',
        number: '01',
        title: {
          en: 'The Annotation Bottleneck: Describing Without Disclosing',
          es: 'El Cuello de Botella: Describir el Dato sin Entregarlo',
        },
        subtitle: {
          en: 'From Kaggle and Zenodo deficiencies to critical data space requirements',
          es: 'De las deficiencias en Zenodo y Kaggle al rigor de los espacios de datos',
        },
        content: {
          en: `In open portals like **Zenodo** or **Kaggle**, dataset annotation is notoriously inconsistent: files are frequently uploaded without structural descriptions, missing spatial/temporal references, and lacking domain context. While inconvenient in open science, this ambiguity is a **fatal blocker in a Federated Data Space**.

In a data space governed by data sovereignty, providers must describe what their data offers to potential consumers **before any raw file transfer takes place**. Potential buyers and collaborating researchers cannot evaluate a dataset without rigorous schema definitions, variable profiles, and licensing terms—yet providers cannot simply hand over proprietary or sensitive files uncontracted.

To resolve this paradox, we engineered an **automated, format-agnostic metadata extraction pipeline**: no matter what file format is provided, the system inspects internal structure, derives technical properties, and formats the metadata precisely into the required organizational forms.`,
          es: `En portales abiertos como **Zenodo** o **Kaggle**, la anotación de datasets suele ser deficiente: los archivos se suben frecuentemente sin descripciones estructurales claras, sin rangos temporales ni contexto de dominio. Si bien esto es problemático en ciencia abierta, en un **Espacio de Datos Federado se convierte en un cuello de botella crítico e insalvable**.

En un espacio de datos regulado por la soberanía del dato, las organizaciones deben explicar exactamente qué ofrecen a los potenciales consumidores **sin entregarles el archivo todavía**. Nadie puede evaluar la utilidad de un dataset ni negociar un contrato bilateral sin conocer sus esquemas, cobertura temporal, sistemas de coordenadas y licencias; pero el proveedor tampoco puede exponer datos privados o comerciales sin un acuerdo previo.

Para resolver este desafío, diseñamos un **pipeline automatizado y agnóstico al formato**: sin importar qué archivo suba el usuario, una herramienta inteligente inspecciona su estructura interna, extrae metadatos técnicos y genera especificaciones adaptadas a cualquier formulario de publicación requerido.`,
        },
        keyPoints: [
          {
            en: 'Automated structure and schema extraction across 30+ tabular, scientific, and geospatial formats.',
            es: 'Extracción automatizada de estructura y esquemas para más de 30 formatos científicos y tabulares.',
          },
          {
            en: 'Multi-engine pre-ingestion security checks: SHA-256 integrity, path-traversal guards, and 70+ AV scans.',
            es: 'Pipeline de seguridad previa a la ingesta: integridad SHA-256, prevención de path traversal y escaneo con 70+ motores antivirus.',
          },
          {
            en: 'Drastic reduction of human curation effort from hours of manual profiling to seconds of automated analysis.',
            es: 'Reducción drástica del esfuerzo humano de catalogación, pasando de horas de redacción manual a segundos de procesado automático.',
          },
        ],
        featuredImage: {
          src: '/images/khaos/data-space/extract-upload.png',
          alt: {
            en: 'MetaDataXtract file upload interface',
            es: 'Interfaz de subida y detección de formato en MetaDataXtract',
          },
          caption: {
            en: 'Multi-format ingestion interface with automated MIME detection, security inspection, and assisted profiling.',
            es: 'Interfaz de ingesta multi-formato con detección MIME, inspección de seguridad y perfilado asistido.',
          },
        },
      },
      {
        id: 'extraction-evolution',
        number: '02',
        title: {
          en: 'MetaDataXtract: Deterministic Extraction & Active Research Line',
          es: 'MetaDataXtract: Extracción Determinista y Línea de Investigación',
        },
        subtitle: {
          en: 'From an assisted publication form to an independent platform and scientific paper',
          es: 'De un formulario asistido para EDAAN a plataforma institucional y paper en preparación',
        },
        content: {
          en: `What originally began as a form helper to streamline dataset publishing on the **Agri-food Data Space of Andalusia ([EDAAN](https://edaan.agora-datalab.eu/))** quickly outgrew its initial scope. Observing how vital and technically demanding automated metadata extraction was across institutional data spaces, the system was decoupled and evolved into an independent flagship platform: **[MetaDataXtract](https://khaos.uma.es/metadataextract/es/login)**.

The platform combines deterministic extraction handlers (by format family: NetCDF, GeoTIFF, HDF5, Parquet, DuckDB, RDF) with Apache Tika for embedded document metadata. Crucially, it maps domain properties against authoritative European SPARQL endpoints including **FAO AGROVOC** and **EuroVoc**, aligning outputs with the **DCAT-AP v2.0** and **UNE 0087:2025** standards. Optional LLM integrations synthesize narrative abstracts and utility recommendations while preserving strict deterministic schema validation.

Recognizing the originality and architectural depth of this approach, the project evolved into an active institutional **scientific research line**, with a comprehensive research paper currently in preparation.`,
          es: `Lo que originalmente comenzó como un formulario asistido para facilitar la publicación de conjuntos de datos y servicios en el **Espacio de Datos Agroalimentario de Andalucía ([EDAAN](https://edaan.agora-datalab.eu/))** superó rápidamente su alcance inicial. Al comprobar el valor estratégico y la complejidad técnica de la anotación en espacios de datos federados, la solución se desacopló y evolucionó hacia una plataforma de referencia institucional independiente: **[MetaDataXtract](https://khaos.uma.es/metadataextract/es/login)**.

La arquitectura combina manejadores deterministas especializados por familias de formato (NetCDF, GeoTIFF, HDF5, Parquet, DuckDB, RDF) con Apache Tika para documentos embebidos. Fundamentalmente, conecta conceptos con autoridades ontológicas oficiales como **AGROVOC (FAO)** y **EuroVoc**, exportando JSON-LD estrictamente validado conforme al estándar europeo **DCAT-AP v2.0** y la norma española **UNE 0087:2025**. Integraciones auxiliares con LLMs sintetizan descripciones narrativas y resúmenes de utilidad sin comprometer la validación determinista.

La madurez y solvencia técnica alcanzadas impulsaron el proyecto hacia una **línea de investigación científica formal**, contando actualmente con un manuscrito en preparación para su publicación en revista de impacto.`,
        },
        keyPoints: [
          {
            en: 'Strict JSON Schema v2.0 contract aligned with DCAT-AP and UNE 0087:2025 for interoperable data spaces.',
            es: 'Contrato estricto JSON Schema v2.0 conforme a DCAT-AP y UNE 0087:2025 para máxima interoperabilidad federada.',
          },
          {
            en: 'Dynamic ontological mapping to AGROVOC and EuroVoc vocabularies via server-side SPARQL caching.',
            es: 'Mapeo ontológico dinámico hacia vocabularios AGROVOC y EuroVoc con caché SPARQL en backend.',
          },
          {
            en: 'Institutional research line with a scientific manuscript currently in preparation for high-impact publication.',
            es: 'Línea de investigación institucional activa con artículo científico en fase de redacción para revista internacional.',
          },
        ],
        featuredImage: {
          src: '/images/khaos/data-space/extract-form.png',
          alt: {
            en: 'MetaDataXtract metadata form interface',
            es: 'Formulario de metadatos estandarizados en MetaDataXtract',
          },
          caption: {
            en: 'Assisted metadata editorial form with controlled vocabulary lookup and automated DCAT-AP schema validation.',
            es: 'Formulario asistido con consulta de vocabularios controlados y validación automática de esquemas DCAT-AP.',
          },
        },
      },
      {
        id: 'hybrid-discovery',
        number: '03',
        title: {
          en: 'MetaDataSearch: Hybrid Discovery & Conversational AI Agents',
          es: 'MetaDataSearch: Búsqueda Híbrida y Agentes Conversacionales IA',
        },
        subtitle: {
          en: 'Overcoming technical vocabulary barriers with dense vectors and Pydantic AI',
          es: 'Superando la disparidad de vocabulario con vectores densos y Pydantic AI',
        },
        content: {
          en: `Once datasets are annotated and published, locating the right asset in a federated architecture presents another major challenge. Conventional keyword search systems fail when independent organizations describe similar resources with divergent vocabularies.

To overcome this, **MetaDataSearch** introduces a multimodal discovery engine that bridges lexical and semantic retrieval. Queries are dynamically routed to **Elasticsearch 8** (BM25 lexical scoring) or **Qdrant** (cosine similarity over \`paraphrase-multilingual-mpnet-base-v2\` embeddings), and unified using **Reciprocal Rank Fusion (RRF)**. 

Furthermore, an autonomous conversational agent engineered with **Pydantic AI** maintains interactive chat sessions. The agent invokes live catalog search tools, explains table structures, and pinpoints suitable datasets. An interactive 2D/3D knowledge graph visualizes asset-to-app dependencies and domain relationships.`,
          es: `Una vez que los datasets están anotados y publicados, localizarlos dentro de una arquitectura federada plantea un reto equivalente: los buscadores léxicos tradicionales fallan debido a la disparidad terminológica entre entidades independientes que describen conceptos afines con palabras distintas.

Para superar esta barrera, **MetaDataSearch** implementa una capa de descubrimiento multimodal que combina recuperación léxica y semántica. El motor enruta las peticiones de forma inteligente hacia **Elasticsearch 8** (relevancia léxica BM25) y **Qdrant** (similitud vectorial densa con embeddings multilingües mpnet), unificando los resultados mediante el algoritmo **Reciprocal Rank Fusion (RRF)**.

Además, un agente conversacional autónomo desarrollado con **Pydantic AI** asiste interactivamente al usuario. El agente ejecuta herramientas del catálogo en tiempo real, desglosa esquemas tabulares y sugiere recursos relevantes, mientras un visualizador de grafos 2D/3D expone las dependencias y el linaje entre datasets y aplicaciones de datos.`,
        },
        keyPoints: [
          {
            en: 'Hybrid search architecture uniting Elasticsearch 8 lexical BM25 and Qdrant dense vector embeddings via RRF.',
            es: 'Arquitectura de búsqueda híbrida que une BM25 en Elasticsearch 8 con embeddings densos en Qdrant vía RRF.',
          },
          {
            en: 'Autonomous conversational assistant built with Pydantic AI and dynamic catalog tool calling.',
            es: 'Asistente conversacional autónomo construido con Pydantic AI y ejecución dinámica de herramientas del catálogo.',
          },
          {
            en: 'Interactive 2D/3D knowledge graph illustrating relationships, providers, and consuming Data Apps.',
            es: 'Grafo de conocimiento 2D/3D interactivo que ilustra relaciones, proveedores y aplicaciones consumidoras.',
          },
        ],
        featuredImage: {
          src: '/images/khaos/data-space/search-agent.png',
          alt: {
            en: 'Conversational agent in MetaDataSearch',
            es: 'Agente conversacional en MetaDataSearch',
          },
          caption: {
            en: 'Conversational AI agent in MetaDataSearch invoking backend catalog tools to answer natural language queries.',
            es: 'Agente conversacional IA en MetaDataSearch invocando herramientas del catálogo para resolver dudas en lenguaje natural.',
          },
        },
      },
      {
        id: 'sovereign-datasphere',
        number: '04',
        title: {
          en: 'ÁGORA Data Sphere & Cloud-Native Kubernetes Infrastructure',
          es: 'ÁGORA Data Sphere y Despliegue Cloud-Native en Kubernetes',
        },
        subtitle: {
          en: 'Official web platform for the Agri-food Data Space of Andalusia (EDAAN)',
          es: 'Plataforma oficial del Espacio de Datos Agroalimentario de Andalucía (EDAAN)',
        },
        content: {
          en: `The full ecosystem culminates in the **ÁGORA Data Sphere**, the official web portal for the **Espacio de Datos Agroalimentario de Andalucía ([EDAAN](https://edaan.agora-datalab.eu/))**. 

The portal orchestrates both sides of the federated market: **Provisioning** (asset upload, access policies, and transactional offers) and **Consumption** (catalog browsing, bilateral contract negotiations, and sovereign transfers). 

Behind the interface, the ecosystem runs on a resilient **Kubernetes** cluster hosted at Khaos Research / UMA. The infrastructure features MongoDB replica sets as the authoritative source of truth, automated synchronization pipelines that reconcile disposable Elasticsearch and Qdrant search projections, and strict isolation of institutional authentication credentials in MariaDB with Argon2 hashing.`,
          es: `El ecosistema culmina en **ÁGORA Data Sphere**, el portal web oficial del **Espacio de Datos Agroalimentario de Andalucía ([EDAAN](https://edaan.agora-datalab.eu/))**.

El portal orquesta ambas vertientes del mercado federado: **Provisión** (publicación de recursos, definición de políticas de acceso ODRL y creación de ofertas transaccionales) y **Consumo** (exploración del catálogo, negociación bilateral de contratos y transferencias de datos seguras).

En la capa de infraestructura, todo el ecosistema opera sobre un clúster de **Kubernetes** de alta disponibilidad alojado en Khaos Research / Universidad de Málaga. Cuenta con réplicas de MongoDB como fuente de verdad inmutable, sincronización continua hacia índices de búsqueda desechables en Elasticsearch y Qdrant, y aislamiento estricto de credenciales institucionales en MariaDB con hashing Argon2.`,
        },
        keyPoints: [
          {
            en: 'Sovereign contract negotiation and ODRL policy management within the official regional data space.',
            es: 'Negociación bilateral de contratos y gestión de políticas ODRL en el espacio de datos agroalimentario regional.',
          },
          {
            en: 'Modern bilingual web portal engineered with Next.js 16, React 19, and tailored UX workflows.',
            es: 'Portal web bilingüe moderno desarrollado con Next.js 16, React 19 y flujos UX optimizados para provisión y consumo.',
          },
          {
            en: 'Production-ready Kubernetes deployment with automated index reconciliation and zero-downtime microservices.',
            es: 'Despliegue en producción sobre Kubernetes con reconciliación automática de índices y microservicios resilientes.',
          },
        ],
        featuredImage: {
          src: '/images/khaos/data-space/search-graph.png',
          alt: {
            en: 'Knowledge graph interface in MetaDataSearch',
            es: 'Grafo de conocimiento y dependencias en MetaDataSearch',
          },
          caption: {
            en: 'Topological relationship graph displaying links between cataloged datasets and consuming applications.',
            es: 'Grafo topológico de relaciones que visualiza enlaces entre datasets catalogados y aplicaciones consumidoras.',
          },
        },
      },
    ],
    media: [
      {
        type: 'image',
        src: '/images/khaos/data-space/extract-upload.png',
        title: { en: 'Multi-Format Ingestion', es: 'Ingesta Multi-Formato' },
        alt: { en: 'MetaDataXtract ingestion interface', es: 'Interfaz de subida y detección de formato' },
        caption: {
          en: 'Automated structure detection for 30+ scientific and tabular formats.',
          es: 'Detección automática de estructura para más de 30 formatos científicos y tabulares.',
        },
      },
      {
        type: 'image',
        src: '/images/khaos/data-space/extract-form.png',
        title: { en: 'Assisted Metadata Profiling', es: 'Perfilado de Metadatos Asistido' },
        alt: { en: 'MetaDataXtract metadata form', es: 'Formulario de metadatos estandarizados' },
        caption: {
          en: 'Dynamic ontological enrichment with AGROVOC and EuroVoc vocabularies.',
          es: 'Enriquecimiento ontológico dinámico con vocabularios AGROVOC y EuroVoc.',
        },
      },
      {
        type: 'image',
        src: '/images/khaos/data-space/extract-preview.png',
        title: { en: 'DCAT-AP v2 JSON-LD Export', es: 'Exportación JSON-LD DCAT-AP v2' },
        alt: { en: 'MetaDataXtract JSON-LD preview', es: 'Previsualización y exportación JSON-LD' },
        caption: {
          en: 'Strict schema validation compliant with European interoperability standards.',
          es: 'Validación estricta de esquemas conforme a estándares europeos de interoperabilidad.',
        },
      },
      {
        type: 'image',
        src: '/images/khaos/data-space/search-catalog.png',
        title: { en: 'Multimodal Discovery Layer', es: 'Capa de Descubrimiento Multimodal' },
        alt: { en: 'MetaDataSearch catalog view', es: 'Vista de catálogo y filtros en MetaDataSearch' },
        caption: {
          en: 'Faceted search interface backed by Elasticsearch 8 and Qdrant dense vector indexes.',
          es: 'Interfaz de búsqueda facetada respaldada por índices en Elasticsearch 8 y Qdrant.',
        },
      },
      {
        type: 'image',
        src: '/images/khaos/data-space/search-agent.png',
        title: { en: 'Pydantic AI Conversational Agent', es: 'Agente Conversacional Pydantic AI' },
        alt: { en: 'MetaDataSearch AI assistant', es: 'Asistente conversacional IA en MetaDataSearch' },
        caption: {
          en: 'Autonomous assistant invoking live catalog tools to explain schemas and guide queries.',
          es: 'Asistente autónomo que ejecuta herramientas en vivo para explicar esquemas y guiar consultas.',
        },
      },
      {
        type: 'image',
        src: '/images/khaos/data-space/search-graph.png',
        title: { en: 'Knowledge Graph & Lineage', es: 'Grafo de Conocimiento y Linaje' },
        alt: { en: 'Knowledge graph view', es: 'Vista de grafo de conocimiento' },
        caption: {
          en: 'Interactive topological view revealing connections between datasets and Data Apps.',
          es: 'Visualizador topológico interactivo que expone conexiones entre datasets y aplicaciones.',
        },
      },
    ],
    roleHighlight: {
      en: 'Architected and developed the federated data space ecosystem: from deterministic extraction and security pipelines to hybrid vector search, Pydantic AI agent integration, and Kubernetes operations.',
      es: 'Diseñé y desarrollé integralmente el ecosistema de espacios de datos: desde los pipelines de extracción y seguridad hasta la búsqueda híbrida vectorial, agentes en Pydantic AI y despliegue en Kubernetes.',
    },
    featured: true,
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

  {
    id: 'landcoverpy',
    name: {
      en: 'LandCoverPy: Distributed Satellite Pipeline',
      es: 'LandCoverPy: Pipeline Satelital Distribuido',
    },
    description: {
      en: 'Scalable distributed workflow for high-resolution land cover and land use classification across large geographic areas (Mediterranean Basin). Orchestrates Sentinel-2 satellite granule ingestion with Dask, atomic MongoDB coordination locks, and MinIO/S3 lifecycle management, reducing data processing overhead by 80%.',
      es: 'Flujo de trabajo distribuido y escalable para la clasificación de cobertura terrestre de alta resolución en grandes áreas geográficas (Cuenca del Mediterráneo). Orquesta la ingesta de imágenes Sentinel-2 con Dask, sincronización atómica en MongoDB y ciclo de vida en MinIO/S3, reduciendo un 80% los tiempos de procesamiento.',
    },
    shortDescription: {
      en: 'Distributed Satellite Imagery & ML Pipeline',
      es: 'Pipeline Distribuido Satelital e Inferencia ML',
    },
    technologies: ['Python', 'Dask', 'Sentinel-2', 'MongoDB', 'Docker', 'MinIO', 'GeoTIFF', 'Rasterio'],
    tag: 'professional',
    category: 'data-science',
    company: 'Khaos Research',
    github: 'https://github.com/KhaosResearch/landcoverpy',
    link: 'https://doi.org/10.1186/s40537-023-00770-z',
    awardBadge: {
      en: 'Published in Springer Nature Journal of Big Data (DOI: 10.1186/s40537-023-00770-z)',
      es: 'Publicado en Journal of Big Data · Springer Nature (DOI: 10.1186/s40537-023-00770-z)',
    },
    stats: [
      {
        label: { en: 'Processing Speedup', es: 'Aceleración de Ingesta' },
        value: '80%',
        subtext: { en: 'Dask Tile & Season Sharding', es: 'Particionado Dask por Tiles y Estaciones' },
      },
      {
        label: { en: 'Geographic Scale', es: 'Escala Territorial' },
        value: '540+ Tiles',
        subtext: { en: 'Mediterranean Basin (Spain & Portugal)', es: 'Cuenca Mediterránea (Península Ibérica)' },
      },
      {
        label: { en: 'Spatial Resolution', es: 'Resolución Espacial' },
        value: '10 m',
        subtext: { en: 'Sentinel-2 L2A MSI & ASTER GDEM', es: 'Bandas L2A Sentinel-2 y ASTER GDEM' },
      },
    ],
    roleHighlight: {
      en: 'Architected and optimized the distributed ingestion pipeline for massive Sentinel-2 satellite granules, achieving an 80% reduction in processing time through Dask parallelization, seasonal tile partitioning, and atomic MongoDB claim locks.',
      es: 'Diseñé y optimicé la arquitectura distribuida para la ingesta de gránulos satelitales Sentinel-2 masivos, reduciendo un 80% los tiempos de procesamiento mediante paralelización con Dask, particionamiento por tiles/estaciones y locks atómicos en MongoDB.',
    },
    caseStudy: {
      title: {
        en: 'Scaling Earth Observation & Machine Learning Pipelines',
        es: 'Escalando Pipelines de Observación de la Tierra e IA',
      },
      challenge: {
        en: 'Classifying multi-temporal land cover over extensive geographic areas such as the Mediterranean Basin requires processing hundreds of Sentinel-2 granule tiles across four seasons. The sheer volume of raw multi-band raster data (terabytes) easily causes network bottlenecks, disk exhaustion, race conditions between workers, and days of computing overhead.',
        es: 'Clasificar la cobertura vegetal y usos del suelo en áreas tan extensas como la Cuenca Mediterránea exige procesar cientos de gránulos satelitales Sentinel-2 a lo largo de las cuatro estaciones. El volumen masivo de datos ráster multibanda (terabytes) provoca cuellos de botella en red, saturación de disco, condiciones de carrera entre nodos y días de cómputo acumulados.',
      },
      solution: {
        en: 'Designed a divide-and-conquer distributed architecture decoupling compute workers from storage. Workers coordinate dynamically via an atomic tile_claims collection in MongoDB with TTL-based crash recovery, download granules on demand, compute 11 multi-spectral and biophysical composite bands (NDVI, NDWI, SAVI, BSI), and stream intermediate products into MinIO/S3 object storage with automated chunked purge lifecycles.',
        es: 'Diseñé una arquitectura distribuida divide-y-vencerás desacoplando el cómputo del almacenamiento. Los nodos de procesamiento se coordinan dinámicamente mediante una colección tile_claims en MongoDB con recuperación automática de caídas por TTL, descargan gránulos bajo demanda, calculan 11 compuestos multiespectrales e índices biofísicos (NDVI, NDWI, SAVI, BSI), y transfieren productos intermedios a MinIO/S3 con purgado cíclico automático.',
      },
      contribution: {
        en: 'Engineered the Dask distributed pipeline and parallel tile/season execution flow, achieving an 80% speedup in end-to-end dataset generation. Implemented distributed synchronization locks preventing duplicate tile downloads, and containerized the end-to-end pipeline with Docker Compose for reproducible execution across heterogeneous compute nodes.',
        es: 'Implementé el pipeline distribuido en Dask y el flujo de ejecución paralela por partición de tiles y estaciones, logrando un 80% de reducción en los tiempos de generación del dataset. Diseñé los locks de sincronización atómicos para evitar descargas duplicadas entre workers y contenericé todo el flujo con Docker Compose para su ejecución reproducible en nodos heterogéneos.',
      },
      evolution: {
        en: 'Published in Springer Nature Journal of Big Data (DOI: 10.1186/s40537-023-00770-z). Serves as an institutional foundation for automated land use classification and agricultural monitoring models in European research programs.',
        es: 'Publicado en Journal of Big Data de Springer Nature (DOI: 10.1186/s40537-023-00770-z). Constituye una base institucional para modelos de monitorización agrícola y clasificación del suelo en proyectos de investigación europeos.',
      },
    },
    media: [
      {
        type: 'image' as const,
        src: '/images/landcoverpy/forests_example.jpg',
        alt: {
          en: 'LandCoverPy Iberian Peninsula Forest Classification Map',
          es: 'Mapa de Clasificación Forestal de la Península Ibérica generado con LandCoverPy',
        },
        title: {
          en: 'LandCoverPy — High-Resolution Land Cover Classification Map',
          es: 'LandCoverPy — Mapa de Clasificación de Cobertura Terrestre de Alta Resolución',
        },
        caption: {
          en: 'High-resolution classification map generated from multi-temporal Sentinel-2 composites and DEM data over the Iberian Peninsula.',
          es: 'Mapa de clasificación de alta resolución generado a partir de compuestos multi-temporales Sentinel-2 y datos DEM sobre la Península Ibérica.',
        },
      },
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
