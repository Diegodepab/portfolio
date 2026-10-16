import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  FiFolder,
  FiFileText,
  FiExternalLink,
  FiGithub,
  FiLayers,
  FiSearch,
  FiCpu,
  FiShield,
  FiSliders,
  FiTerminal,
  FiCheck,
  FiLock,
  FiZap,
  FiShare2,
  FiActivity,
  FiCheckCircle,
} from 'react-icons/fi';
import './DataSpaceEcosystemViewer.css';

type RepoKey = 'extract' | 'sphere' | 'search';

type ExtractSubview = 'graph' | 'modules' | 'repo_tree';
type SphereSubview = 'policies' | 'mesh' | 'repo_tree';
type SearchSubview = 'agent' | 'rrf' | 'repo_tree';

interface TreeItem {
  id: string;
  name: string;
  isFolder: boolean;
  depth: number;
  tag?: string;
  role: { en: string; es: string };
  desc: { en: string; es: string };
  tech: string[];
}

interface RepoData {
  key: RepoKey;
  step: string;
  name: string;
  repoBadge: { en: string; es: string };
  mission: { en: string; es: string };
  github?: string;
  demo?: string;
  tree: TreeItem[];
  defaultItem: string;
}

const REPOS_DATA: Record<RepoKey, RepoData> = {
  extract: {
    key: 'extract',
    step: 'Repo 01',
    name: 'MetaDataXtract',
    repoBadge: {
      en: 'Independent Research Line · Paper in Prep · v1.5.0',
      es: 'Línea de Investigación · Paper en Preparación · v1.5.0',
    },
    mission: {
      en: 'Security-first automated pipeline extracting structural metadata from +14 format families into DCAT-AP v2.0 JSON-LD without disclosing raw files.',
      es: 'Pipeline security-first que extrae metadatos técnicos de +14 familias de formatos y genera JSON-LD conforme a DCAT-AP v2.0 sin ceder el dato privado.',
    },
    github: 'https://github.com/KhaosResearch/MetaDataXtract',
    demo: 'https://khaos.uma.es/metadataextract/es/login',
    defaultItem: 'extractors',
    tree: [
      {
        id: 'backend_core',
        name: 'src/backend/api-core/',
        isFolder: true,
        depth: 0,
        role: { en: 'Core Validation & JWT Auth', es: 'Validación Central y Auth JWT' },
        desc: {
          en: 'FastAPI core handling JSON Schema 2020-12 strict validation (v2.0), user authentication, and profile caches.',
          es: 'Backend FastAPI con validación estricta v2.0 bajo JSON Schema 2020-12, autenticación JWT y gestión de perfiles.',
        },
        tech: ['FastAPI', 'Pydantic v2', 'JSON Schema', 'Argon2'],
      },
      {
        id: 'schema_validator',
        name: '  schemas/esquema.json (DCAT-AP v2)',
        isFolder: false,
        depth: 1,
        tag: 'Contract',
        role: { en: 'Strict JSON-LD Schema Contract', es: 'Contrato Estricto JSON-LD' },
        desc: {
          en: 'Defines mandatory EU Data Theme, licenses, access rights, and UNE 0087:2025 agricultural vocabularies.',
          es: 'Define temas oficiales de la UE, licencias, derechos de acceso y alineación con la norma UNE 0087:2025.',
        },
        tech: ['JSON Schema 2020-12', 'DCAT-AP v2.0', 'UNE 0087:2025'],
      },
      {
        id: 'extractor_engine',
        name: 'src/backend/metadata-extractor/',
        isFolder: true,
        depth: 0,
        role: { en: 'Deterministic Extraction Mesh', es: 'Malla de Extracción Determinista' },
        desc: {
          en: 'Modular format handlers inspecting headers, bands, projection EPSG, dimensions, and types without requiring an LLM.',
          es: 'Manejadores modulares que extraen cabeceras, bandas, EPSG, dimensiones y tipos sin depender obligatoriamente de LLMs.',
        },
        tech: ['FastAPI', 'Apache Tika', 'PyArrow', 'Rasterio'],
      },
      {
        id: 'security_pipeline',
        name: '  security_pipeline.py (Anti-Malware)',
        isFolder: false,
        depth: 1,
        tag: 'Security',
        role: { en: 'Pre-Ingestion Threat Sanitization', es: 'Sanitización y Amenazas' },
        desc: {
          en: 'Computes immutable SHA-256 hashes, scans magic bytes, blocks zip-bombs, and integrates with 70+ antivirus engines.',
          es: 'Genera huellas SHA-256 inmutables, analiza bytes mágicos, neutraliza zip-bombs e integra 70+ motores antivirus.',
        },
        tech: ['SHA-256', 'Magic Bytes', 'VirusTotal API', 'Path-Traversal Guard'],
      },
      {
        id: 'extractors',
        name: '  extractors/ (+14 Format Families)',
        isFolder: true,
        depth: 1,
        tag: 'Parsers',
        role: { en: 'Format Family Handlers', es: 'Manejadores por Familias de Formato' },
        desc: {
          en: 'Specialized extractors: Tabular, Columnar, Geospatial, Raster, Scientific NetCDF/HDF5, Multimedia, Database, Scripts, and Archives.',
          es: 'Extractores especializados: Tabular, Columnar, Geoespacial, Ráster, Científico NetCDF/HDF5, Multimedia, Bases de datos, Scripts y Archivos.',
        },
        tech: ['netCDF4', 'HDF5', 'GeoPandas', 'DuckDB', 'PyArrow', 'ffprobe', 'RDFLib'],
      },
      {
        id: 'vocab_service',
        name: 'src/backend/vocab-api/',
        isFolder: true,
        depth: 0,
        role: { en: 'Ontological Lookup & SPARQL', es: 'Consultas Ontológicas y SPARQL' },
        desc: {
          en: 'High-speed Fastify service querying European authority endpoints: FAO AGROVOC, EuroVoc, and EU Data Themes with in-memory caching.',
          es: 'Servicio en Fastify con caché en memoria que resuelve conceptos en SPARQL de AGROVOC (FAO), EuroVoc y temas de la UE.',
        },
        tech: ['Fastify 5', 'TypeScript', 'SPARQL', 'AGROVOC', 'N3'],
      },
      {
        id: 'frontend_next',
        name: 'src/frontend/ (Next.js 16)',
        isFolder: true,
        depth: 0,
        role: { en: 'Data Publisher Web Portal', es: 'Portal Web del Publicador' },
        desc: {
          en: 'Form state machine, drag-and-drop secure uploads, interactive guided tour, live validation feedback, and JSON-LD export preview.',
          es: 'Gestión reactiva de formularios, subida de archivos, tour guiado, validación en vivo y descarga de JSON-LD validado.',
        },
        tech: ['Next.js 16', 'React 19', 'Tailwind CSS', 'TypeScript'],
      },
      {
        id: 'docs_paper',
        name: 'docs/paper/ (Scientific Manuscript)',
        isFolder: false,
        depth: 0,
        tag: 'Research',
        role: { en: 'Peer-Reviewed Publication in Prep', es: 'Artículo Científico en Preparación' },
        desc: {
          en: 'Academic manuscript detailing the deterministic extraction architecture, ontological enrichment benchmark, and security model.',
          es: 'Manuscrito científico formal documentando la arquitectura de extracción soberana, benchmark de enriquecimiento y seguridad.',
        },
        tech: ['LaTeX', 'Peer Review', 'Khaos Research'],
      },
    ],
  },
  sphere: {
    key: 'sphere',
    step: 'Repo 02',
    name: 'ÁGORA Data Sphere (EDAAN)',
    repoBadge: {
      en: 'Official Regional Data Space · Sovereign Contracts · Kubernetes HA',
      es: 'Espacio de Datos Agroalimentario de Andalucía · Contratos Soberanos · Kubernetes',
    },
    mission: {
      en: 'Official web gateway for the Agri-food Data Space of Andalusia (EDAAN). Manages dataset offers, ODRL access policies, and bilateral sovereign contracts.',
      es: 'Portal oficial del Espacio de Datos Agroalimentario de Andalucía (EDAAN). Gestiona ofertas, políticas de acceso ODRL y contratos bilaterales soberanos.',
    },
    demo: 'https://edaan.agora-datalab.eu/',
    defaultItem: 'contracts_feature',
    tree: [
      {
        id: 'contracts_feature',
        name: 'src/components/features/contracts/',
        isFolder: true,
        depth: 0,
        tag: 'Governance',
        role: { en: 'Bilateral Sovereign Contracts', es: 'Contratos Soberanos Bilaterales' },
        desc: {
          en: 'UI workflows to negotiate terms of use, verify participant identities, and sign data contracts before any transfer begins.',
          es: 'Flujos para negociar términos de uso, validar identidades de participantes y firmar contratos antes de transferir datos.',
        },
        tech: ['Data Contracts', 'Bilateral Negotiation', 'Identity Verification'],
      },
      {
        id: 'policies_feature',
        name: 'src/components/features/policies/',
        isFolder: true,
        depth: 0,
        tag: 'ODRL',
        role: { en: 'Access & Usage Policy Manager', es: 'Gestor de Políticas de Acceso ODRL' },
        desc: {
          en: 'Configures usage constraints (commercial usage, non-derivative clauses, geographic bounds, and temporal expiration).',
          es: 'Configura restricciones de uso soberano (fines comerciales, cláusulas no derivadas, ámbito geográfico y expiración).',
        },
        tech: ['ODRL 2.2 Standard', 'Access Rules', 'Usage Constraints'],
      },
      {
        id: 'offers_feature',
        name: 'src/components/features/offers/',
        isFolder: true,
        depth: 0,
        role: { en: 'Transactional Dataset Offering', es: 'Publicación de Ofertas de Datasets' },
        desc: {
          en: 'Connects metadata descriptions produced by MetaDataXtract with commercial or research agreements in the official market.',
          es: 'Vincula los metadatos generados en MetaDataXtract con acuerdos transaccionales en el catálogo oficial.',
        },
        tech: ['Data Offerings', 'Service Catalog', 'Federated Registry'],
      },
      {
        id: 'edc_services',
        name: 'src/services/edc/ (Connector Client)',
        isFolder: true,
        depth: 0,
        tag: 'EDC Bridge',
        role: { en: 'Sovereign Dataspace Connector Bridge', es: 'Puente con Conectores Soberanos' },
        desc: {
          en: 'API client communicating with the ÁGORA Connector (Eclipse Dataspace Components) for policy enforcement and peer-to-peer data transfers.',
          es: 'Cliente API que dialoga con el Conector ÁGORA (EDC) para ejecución de políticas y transferencias punto a punto.',
        },
        tech: ['Eclipse Dataspace Components', 'REST Client', 'Token Security'],
      },
      {
        id: 'k8s_scripts',
        name: 'scripts/ & Dockerfile (K8s Deploy)',
        isFolder: false,
        depth: 0,
        tag: 'DevOps',
        role: { en: 'Cloud-Native Kubernetes Cluster', es: 'Clúster Kubernetes en Producción' },
        desc: {
          en: 'Containerized deployment hosted on institutional infrastructure at UMA: replicas, zero-downtime rolling updates, and NGINX Ingress.',
          es: 'Despliegue contenerizado en servidores de la UMA: réplicas de servicios, actualizaciones sin interrupciones e Ingress NGINX.',
        },
        tech: ['Kubernetes', 'Docker Compose', 'NGINX Ingress', 'MongoDB Replicas'],
      },
    ],
  },
  search: {
    key: 'search',
    step: 'Repo 03',
    name: 'metadataSearchTool',
    repoBadge: {
      en: 'Multimodal Discovery Broker · Pydantic AI · Qdrant & Elasticsearch 8',
      es: 'Broker de Descubrimiento Multimodal · Pydantic AI · Qdrant y Elasticsearch 8',
    },
    mission: {
      en: 'Multimodal discovery layer combining lexical precision (BM25) and dense multilingual vector embeddings via RRF, guided by autonomous Pydantic AI agents.',
      es: 'Capa de descubrimiento multimodal que combina precisión léxica (BM25) y embeddings vectoriales densos multilingües mediante RRF y agentes Pydantic AI.',
    },
    github: 'https://github.com/KhaosResearch/metadataSearchTool',
    defaultItem: 'hybrid_engine',
    tree: [
      {
        id: 'backend_engines',
        name: 'src/backend/engines/',
        isFolder: true,
        depth: 0,
        role: { en: 'Multi-Strategy Search Engines', es: 'Motores de Búsqueda Multi-Estrategia' },
        desc: {
          en: 'Orchestrates 4 distinct search modes: elastic (lexical), embedding (dense vectors), recommendation (hybrid RRF), and election (auto-routing).',
          es: 'Orquesta 4 modos de búsqueda: elastic (léxico), embedding (vectores densos), recommendation (híbrido RRF) y election (auto-enrutado).',
        },
        tech: ['Elasticsearch 8', 'Qdrant 1.15', 'Sentence Transformers', 'RRF'],
      },
      {
        id: 'hybrid_engine',
        name: '  hybrid_engine.py (RRF Fusion)',
        isFolder: false,
        depth: 1,
        tag: 'Algorithm',
        role: { en: 'Reciprocal Rank Fusion Engine', es: 'Fusión de Rankings RRF' },
        desc: {
          en: 'Merges BM25 lexical scores and Qdrant cosine similarities into a single normalized relevance ranking, eliminating term mismatch.',
          es: 'Fusiona las puntuaciones BM25 de Elasticsearch con la similitud coseno de Qdrant normalizando el orden de relevancia.',
        },
        tech: ['Reciprocal Rank Fusion', 'NumPy', 'Cosine Distance'],
      },
      {
        id: 'embedding_engine',
        name: '  embedding_engine.py (Vector Search)',
        isFolder: false,
        depth: 1,
        tag: 'Vectors',
        role: { en: 'Multilingual Dense Retrieval', es: 'Recuperación Vectorial Multilingüe' },
        desc: {
          en: 'Encodes queries using paraphrase-multilingual-mpnet-base-v2 and searches semantic projections in Qdrant collections.',
          es: 'Codifica consultas usando mpnet multilingüe y ejecuta búsqueda semántica en colecciones vectoriales de Qdrant.',
        },
        tech: ['Qdrant 1.15', 'Sentence Transformers', 'HNSW Index'],
      },
      {
        id: 'agent_service',
        name: 'src/backend/services/agent_service.py',
        isFolder: false,
        depth: 0,
        tag: 'Agentic AI',
        role: { en: 'Pydantic AI Conversational Agent', es: 'Agente Conversacional Pydantic AI' },
        desc: {
          en: 'Autonomous assistant with catalog tools: interprets natural language, searches endpoints live, inspects schemas, and cites assets.',
          es: 'Asistente autónomo con herramientas de catálogo: interpreta peticiones, consulta endpoints en vivo y cita datasets precisos.',
        },
        tech: ['Pydantic AI', 'OpenAI API Spec', 'Function Calling'],
      },
      {
        id: 'graph_service',
        name: 'src/backend/services/graph_service.py',
        isFolder: false,
        depth: 0,
        tag: 'Graph',
        role: { en: 'Knowledge Graph Constructor', es: 'Constructor de Grafo de Conocimiento' },
        desc: {
          en: 'Derives relationships from shared metadata fields in MongoDB, exposing topological links between datasets and consuming Data Apps.',
          es: 'Deriva enlaces relacionales a partir de campos comunes en MongoDB, vinculando datasets con aplicaciones de datos.',
        },
        tech: ['MongoDB Aggregations', 'Force Graph 2D/3D', 'Data Lineage'],
      },
      {
        id: 'sync_service',
        name: 'src/backend/services/sync_service.py',
        isFolder: false,
        depth: 0,
        role: { en: 'Continuous Index Reconciliation', es: 'Reconciliación Continua de Índices' },
        desc: {
          en: 'Keeps disposable Elasticsearch and Qdrant projections synchronized with authoritative MongoDB catalog records.',
          es: 'Mantiene las proyecciones desechables de Elasticsearch y Qdrant sincronizadas con MongoDB como fuente de verdad.',
        },
        tech: ['MongoDB Change Streams', 'Cron Reconciler', 'Elastic Bulk API'],
      },
      {
        id: 'search_frontend',
        name: 'src/frontend/ (Next.js 16 UI)',
        isFolder: true,
        depth: 0,
        role: { en: 'Bilingual Discovery Portal', es: 'Portal Bilingüe de Descubrimiento' },
        desc: {
          en: 'Faceted search with Boolean filters, streaming chat drawer, and 2D/3D force-directed relationship graph.',
          es: 'Búsqueda facetada con filtros booleanos, panel de chat con streaming y grafo interactivo 2D/3D.',
        },
        tech: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Three.js / Force-Graph'],
      },
    ],
  },
};

/* --- METADATA GRAPH DATA MODEL: 14 FORMAT FAMILIES & DYNAMIC NODES --- */
interface MetadataPropertyNode {
  id: string;
  name: { en: string; es: string };
  value: string;
  type: 'base' | 'specific';
  badge: string;
  desc: { en: string; es: string };
  standard: string;
}

interface FormatFamilySpec {
  id: string;
  name: { en: string; es: string };
  exts: string;
  sampleFile: string;
  qualitySection: string;
  representativeFormats: string;
  badge: string;
  specificProperties: MetadataPropertyNode[];
}

const BASE_METADATA_PROPERTIES: MetadataPropertyNode[] = [
  {
    id: 'base_format',
    name: { en: 'Format / MIME Detection', es: 'Formato / MIME Detectado' },
    value: 'Strict Binary Magic Bytes (RFC 6838)',
    type: 'base',
    badge: 'MIME Detector',
    desc: {
      en: 'Identified deterministically by inspecting the initial binary magic bytes, never trusting forged file extensions.',
      es: 'Identificación determinista analizando los bytes mágicos binarios iniciales; nunca confía en extensiones falsificadas.',
    },
    standard: 'RFC 6838 / IANA Media Types',
  },
  {
    id: 'base_title',
    name: { en: 'Technical Title', es: 'Título Técnico Normalizado' },
    value: 'dct:title derived from header or metadata profile',
    type: 'base',
    badge: 'DCAT-AP v2',
    desc: {
      en: 'Extracted directly from embedded internal document properties, dataset headers, or cleaned canonical artifact filename.',
      es: 'Extraído de las propiedades internas del documento, cabeceras del dataset o nombre canónico normalizado.',
    },
    standard: 'DCAT-AP v2.0 / Dublin Core',
  },
  {
    id: 'base_desc',
    name: { en: 'Structural Description', es: 'Descripción Estructural' },
    value: 'Deterministic quality report profile & internal schema sketch',
    type: 'base',
    badge: 'Quality Report',
    desc: {
      en: 'Comprehensive structural overview detailing dimensions, completeness, detected schemas, and encoding without requiring an LLM.',
      es: 'Resumen estructural que detalla dimensiones, completitud, esquemas detectados y codificación sin requerir un LLM.',
    },
    standard: 'EDAAn Quality Profile',
  },
  {
    id: 'base_llm',
    name: { en: 'LLM Deep Description & Utility', es: 'Descripción Profunda (Inferencia LLM)' },
    value: 'Semantic narrative generated when SUGGESTIONS_LLM is configured',
    type: 'base',
    badge: 'Optional LLM',
    desc: {
      en: 'Generated when SUGGESTIONS_LLM_BASE_URL is active. Synthesizes purpose and data utility; safely degrades if LLM is disabled.',
      es: 'Generada cuando SUGGESTIONS_LLM_BASE_URL está activo. Sintetiza propósito y utilidad; degradación segura si no hay LLM.',
    },
    standard: 'AI Semantic Narrative',
  },
  {
    id: 'base_hash',
    name: { en: 'Immutable SHA-256 Checksum', es: 'Huella SHA-256 (Inmutable)' },
    value: 'sha256:7a8b9c4d2e... (Verified Stream)',
    type: 'base',
    badge: 'Pre-Ingest Security',
    desc: {
      en: 'Cryptographic fingerprint guaranteeing zero file tampering. Enables remote 70+ antivirus scans without transferring raw data.',
      es: 'Huella criptográfica que garantiza integridad inmutable. Permite consultas antivirus sin subir el dato privado.',
    },
    standard: 'FIPS 180-4 / SPDX Checksum',
  },
  {
    id: 'base_size',
    name: { en: 'Size & Distribution License', es: 'Tamaño en Bytes y Licencia' },
    value: 'dcat:byteSize & dct:license suggested URI',
    type: 'base',
    badge: 'Distribution',
    desc: {
      en: 'Exact filesystem byte count and suggested European licence URI conforming to standard data space distribution rules.',
      es: 'Conteo exacto de bytes y sugerencia de licencia de la UE conforme a las reglas de distribución de espacios de datos.',
    },
    standard: 'DCAT-AP v2.0 / IDS Profile',
  },
];

const FORMAT_FAMILIES_ALL: FormatFamilySpec[] = [
  {
    id: 'tabular',
    name: { en: 'Tabular & Spreadsheets', es: 'Tabular y Hojas de Cálculo' },
    exts: '.csv, .tsv, .xlsx, .parquet, .arff',
    sampleFile: 'parcelas_agricolas_andalucia.parquet',
    qualitySection: 'tabular',
    representativeFormats: 'CSV, TSV, XLSX, XLS, Parquet, ARFF',
    badge: 'PyArrow & Polars',
    specificProperties: [
      {
        id: 'tab_schema',
        name: { en: 'Column Names & Types', es: 'Esquema de Columnas y Tipos' },
        value: '24 columnas tipadas con tipos lógicos normalizados (Int64, Float32, String)',
        type: 'specific',
        badge: 'Column Schema',
        desc: { en: 'Inspects column headers and types zero-copy.', es: 'Inspecciona cabeceras y tipos en memoria zero-copy.' },
        standard: 'PyArrow Schema',
      },
      {
        id: 'tab_rows',
        name: { en: 'Verified Row Count', es: 'Recuento Exacto de Filas' },
        value: '1,420,500 registros procesados',
        type: 'specific',
        badge: 'Cardinality',
        desc: { en: 'Determines exact table cardinality without memory saturation.', es: 'Determina la cardinalidad exacta sin saturar la memoria.' },
        standard: 'EDAAn Cardinality',
      },
      {
        id: 'tab_delim',
        name: { en: 'Delimiter & Encoding', es: 'Delimitador y Codificación' },
        value: 'Coma (,) · UTF-8 sin BOM · Detección de cabeceras',
        type: 'specific',
        badge: 'Parser Config',
        desc: { en: 'Detects text encoding and delimiter automatically.', es: 'Detección automática de delimitador y juego de caracteres.' },
        standard: 'RFC 4180',
      },
      {
        id: 'tab_stats',
        name: { en: 'Block Statistics', es: 'Estadísticas Min/Max por Bloque' },
        value: 'Mínimo, Máximo, Mediana y Desviación estándar por columna',
        type: 'specific',
        badge: 'Summary Stats',
        desc: { en: 'Computes statistical summaries for numeric columns.', es: 'Calcula resúmenes estadísticos en columnas numéricas.' },
        standard: 'Parquet Statistics',
      },
      {
        id: 'tab_nulls',
        name: { en: 'Completeness & Nulls', es: 'Completitud y Ratio de Nulos' },
        value: '0.02% de valores nulos detectados · 0 filas duplicadas',
        type: 'specific',
        badge: 'Data Quality',
        desc: { en: 'Evaluates data quality metrics for ingestion readiness.', es: 'Evalúa la calidad del dato para su catalogación.' },
        standard: 'UNE 0087:2025',
      },
    ],
  },
  {
    id: 'columnar',
    name: { en: 'Columnar & Big Data', es: 'Columnar y Big Data' },
    exts: '.arrow, .feather, .avro, .orc',
    sampleFile: 'telemetria_iot_sensores.arrow',
    qualitySection: 'columnar',
    representativeFormats: 'Arrow/Feather, Avro, ORC',
    badge: 'Apache Arrow',
    specificProperties: [
      {
        id: 'col_zerocopy',
        name: { en: 'Zero-Copy Memory Map', es: 'Mapeo Zero-Copy en Memoria' },
        value: 'Inspección de buffers de memoria sin deserialización pesada',
        type: 'specific',
        badge: 'Performance',
        desc: { en: 'Direct IPC memory inspection.', es: 'Inspección IPC directa sin duplicación de memoria.' },
        standard: 'Apache Arrow IPC',
      },
      {
        id: 'col_types',
        name: { en: 'Advanced Logical Types', es: 'Tipos Lógicos Avanzados' },
        value: 'Decimal128, Timestamp con zona horaria, Arrays y Estructuras anidadas',
        type: 'specific',
        badge: 'Type System',
        desc: { en: 'Preserves high precision data types.', es: 'Conserva tipos de alta precisión sin truncado.' },
        standard: 'Arrow Type System',
      },
      {
        id: 'col_compression',
        name: { en: 'Compression Encodings', es: 'Compresión y Codificación' },
        value: 'Compresión Snappy / ZSTD por grupo de registros (RecordBatch)',
        type: 'specific',
        badge: 'Storage',
        desc: { en: 'Reports compression efficiency.', es: 'Reporta la eficiencia de compresión interna.' },
        standard: 'RecordBatch Spec',
      },
    ],
  },
  {
    id: 'geovector',
    name: { en: 'Geospatial Vector', es: 'Vector Geoespacial' },
    exts: '.geojson, .shp, .kml, .gpkg',
    sampleFile: 'recintos_sigpac_andalucia.geojson',
    qualitySection: 'geo',
    representativeFormats: 'GeoJSON, Shapefile, KML/KMZ, GeoPackage',
    badge: 'GeoPandas & OGR',
    specificProperties: [
      {
        id: 'geo_crs',
        name: { en: 'Coordinate Reference System (CRS)', es: 'Sistema de Coordenadas (CRS)' },
        value: 'EPSG:25830 (ETRS89 / UTM zone 30N) y WGS 84 (EPSG:4326)',
        type: 'specific',
        badge: 'Spatial CRS',
        desc: { en: 'Identifies projection authority codes.', es: 'Identifica códigos EPSG oficiales de proyección.' },
        standard: 'OGC / ISO 19111',
      },
      {
        id: 'geo_bbox',
        name: { en: 'Bounding Box (BBox)', es: 'Bounding Box Espacial (BBox)' },
        value: 'POLYGON((-6.12 36.45, -5.92 36.45, -5.92 36.62, -6.12 36.62, -6.12 36.45))',
        type: 'specific',
        badge: 'Geometry Extent',
        desc: { en: 'Calculates geographical extent for spatial search.', es: 'Calcula el envolvente para indexación espacial.' },
        standard: 'DCAT-AP locn:geometry',
      },
      {
        id: 'geo_features',
        name: { en: 'Feature Count & Geometry', es: 'Recuento y Tipos de Geometría' },
        value: '8,420 geometrías (MultiPolygon y LineString)',
        type: 'specific',
        badge: 'Feature Collection',
        desc: { en: 'Summarizes vector feature layers.', es: 'Resume capas y tipos de geometrías vectoriales.' },
        standard: 'GeoJSON RFC 7946',
      },
    ],
  },
  {
    id: 'raster',
    name: { en: 'Raster & Satellite Imagery', es: 'Ráster e Imágenes Satelitales' },
    exts: '.tif, .tiff, .cog, .png, .jpg',
    sampleFile: 'sentinel2_ndvi_humedad.tif',
    qualitySection: 'raster / geo',
    representativeFormats: 'GeoTIFF, COG, satellite drivers, common images',
    badge: 'Rasterio & GDAL',
    specificProperties: [
      {
        id: 'ras_bands',
        name: { en: 'Spectral Bands', es: '12 Bandas Espectrales' },
        value: 'Bandas B1 a B12 (Sentinel-2 MSI) con calibración radiométrica',
        type: 'specific',
        badge: 'Multispectral',
        desc: { en: 'Inspects multispectral band metadata.', es: 'Inspecciona bandas espectrales satelitales.' },
        standard: 'raster:bands',
      },
      {
        id: 'ras_res',
        name: { en: 'Spatial Ground Resolution', es: 'Resolución Espacial de Píxel' },
        value: '10.0 metros por píxel',
        type: 'specific',
        badge: 'Resolution',
        desc: { en: 'Pixel ground resolution mapped to DCAT-AP.', es: 'Resolución proyectada a dcat:spatialResolutionInMeters.' },
        standard: 'dcat:spatialResolutionInMeters',
      },
      {
        id: 'ras_cog',
        name: { en: 'Cloud Optimized GeoTIFF', es: 'Cloud Optimized GeoTIFF (COG)' },
        value: 'Indicador COG con pirámides de teselas internas (Overviews)',
        type: 'specific',
        badge: 'Cloud Native',
        desc: { en: 'Checks HTTP range request optimization.', es: 'Verifica optimización para streaming en la nube.' },
        standard: 'COG Spec',
      },
      {
        id: 'ras_nodata',
        name: { en: 'NoData Mask & Type', es: 'Valor NoData y Tipo de Dato' },
        value: 'Valor -9999 registrado · Float32',
        type: 'specific',
        badge: 'Masking',
        desc: { en: 'Identifies unmeasured masked pixels.', es: 'Identifica píxeles sin cobertura o nulos.' },
        standard: 'GDAL NoData',
      },
    ],
  },
  {
    id: 'scientific',
    name: { en: 'Scientific & Climatology', es: 'Científico y Climatología' },
    exts: '.nc, .hdf5, .h5, .zarr',
    sampleFile: 'era5_reanalisis_clima_iberia.nc',
    qualitySection: 'scientific',
    representativeFormats: 'NetCDF, HDF5, Zarr',
    badge: 'netCDF4 & H5py',
    specificProperties: [
      {
        id: 'sci_cf',
        name: { en: 'Climate Convention CF-1.8', es: 'Convención Oficial CF-1.8' },
        value: 'Conformidad estándar con Climate & Forecast metadata conventions',
        type: 'specific',
        badge: 'Standard CF',
        desc: { en: 'Validates international climate metadata.', es: 'Valida la norma internacional de datos climáticos.' },
        standard: 'CF Conventions 1.8',
      },
      {
        id: 'sci_dims',
        name: { en: 'Spatio-Temporal Dimensions', es: 'Dimensiones Espacio-Temporales' },
        value: 'time (365 días), lat (180), lon (360), level (10 niveles)',
        type: 'specific',
        badge: 'Multi-Dim',
        desc: { en: 'Reports coordinate and time axes.', es: 'Extrae ejes de tiempo y espaciales.' },
        standard: 'NetCDF Classic / 4',
      },
      {
        id: 'sci_vars',
        name: { en: 'Climatological Variables', es: 'Variables Físicas Embebidas' },
        value: 'soil_temperature, volumetric_soil_water, surface_solar_radiation',
        type: 'specific',
        badge: 'Variables',
        desc: { en: 'Catalogs variables with SI measurement units.', es: 'Cataloga variables con unidades del SI.' },
        standard: 'UDUNITS-2',
      },
      {
        id: 'sci_chunk',
        name: { en: 'Deflate Chunking & Compression', es: 'Chunking y Compresión Deflate' },
        value: 'Chunks internos de 50x50x10 con compresión gzip integrada',
        type: 'specific',
        badge: 'HDF5 Storage',
        desc: { en: 'Chunking topology for fast slice access.', es: 'Topología de chunks para acceso rápido.' },
        standard: 'HDF5 Storage Spec',
      },
    ],
  },
  {
    id: 'multimedia',
    name: { en: 'Multimedia (Audio & Video)', es: 'Multimedia (Audio y Video)' },
    exts: '.mp3, .wav, .mp4, .mkv, .webm',
    sampleFile: 'inspeccion_dron_olivar.mp4',
    qualitySection: 'audio / video',
    representativeFormats: 'MP3, WAV, OGG, FLAC, MP4, MKV, AVI, MOV, WebM',
    badge: 'ffprobe & AV',
    specificProperties: [
      {
        id: 'med_codec',
        name: { en: 'Audio & Video Codecs', es: 'Códecs de Audio y Video' },
        value: 'H.264 / AVC (High Profile) y AAC estéreo',
        type: 'specific',
        badge: 'Media Streams',
        desc: { en: 'Discovers stream codecs safely via ffprobe.', es: 'Descubre códecs de los flujos multimedia vía ffprobe.' },
        standard: 'ISO/IEC 14496',
      },
      {
        id: 'med_dur',
        name: { en: 'Duration & Bitrate', es: 'Duración y Tasa de Bits' },
        value: '00:14:32 (bitrate medio 4,500 kbps)',
        type: 'specific',
        badge: 'Duration',
        desc: { en: 'Calculates exact playback duration.', es: 'Calcula duración exacta y tasa de transferencia.' },
        standard: 'FFmpeg Timestamps',
      },
      {
        id: 'med_res',
        name: { en: 'Resolution & Framerate', es: 'Resolución y Tasa de Cuadros' },
        value: '1920x1080 @ 60.0 fps (Full HD progresivo)',
        type: 'specific',
        badge: 'Video Geometry',
        desc: { en: 'Video dimensions and frame rates.', es: 'Dimensiones de cuadro y velocidad de fotogramas.' },
        standard: 'ITU-R BT.709',
      },
    ],
  },
  {
    id: 'document',
    name: { en: 'Documents & Text', es: 'Documentos y Texto' },
    exts: '.pdf, .docx, .md, .tex, .txt',
    sampleFile: 'informe_tecnico_aforo_olivar.pdf',
    qualitySection: 'document / text',
    representativeFormats: 'PDF, TXT, Markdown, LaTeX, Office/Tika',
    badge: 'Apache Tika',
    specificProperties: [
      {
        id: 'doc_dc',
        name: { en: 'Dublin Core Embedded Metadata', es: 'Metadatos Dublin Core Embebidos' },
        value: 'Título, autor institucional (IFAPA), software productor y fechas',
        type: 'specific',
        badge: 'Dublin Core',
        desc: { en: 'Extracts embedded document properties.', es: 'Extrae propiedades embebidas del documento.' },
        standard: 'ISO 15836',
      },
      {
        id: 'doc_pages',
        name: { en: 'Page Count & Text Layer', es: 'Recuento de Páginas y Capa de Texto' },
        value: '48 páginas con texto seleccionable disponible',
        type: 'specific',
        badge: 'Text Layer',
        desc: { en: 'Detects text availability without requiring OCR.', es: 'Detecta texto disponible sin forzar OCR.' },
        standard: 'PDF/A Spec',
      },
      {
        id: 'doc_perm',
        name: { en: 'Permissions & Encryption', es: 'Permisos y Cifrado' },
        value: 'Documento sin cifrar con permisos de lectura y accesibilidad',
        type: 'specific',
        badge: 'Security',
        desc: { en: 'Validates document protection flags.', es: 'Comprueba banderas de protección del documento.' },
        standard: 'PDF Security Spec',
      },
    ],
  },
  {
    id: 'presentation',
    name: { en: 'Presentations', es: 'Presentaciones' },
    exts: '.pptx, .pptm',
    sampleFile: 'resultados_campana_agricola.pptx',
    qualitySection: 'presentation / doc',
    representativeFormats: 'PPTX, PPTM',
    badge: 'OpenXML Parser',
    specificProperties: [
      {
        id: 'pres_slides',
        name: { en: 'Slide Count', es: 'Recuento de Diapositivas' },
        value: '32 diapositivas analizadas',
        type: 'specific',
        badge: 'Structure',
        desc: { en: 'Counts presentation slides and layout components.', es: 'Cuenta diapositivas y componentes de diseño.' },
        standard: 'ECMA-376 OpenXML',
      },
      {
        id: 'pres_notes',
        name: { en: 'Speaker Notes Indexing', es: 'Extracción de Notas de Orador' },
        value: 'Notas embebidas extraídas para indexación semántica',
        type: 'specific',
        badge: 'Text Index',
        desc: { en: 'Harvests hidden speaker notes for discovery.', es: 'Recolecta notas de orador para indexación.' },
        standard: 'PresentationML',
      },
    ],
  },
  {
    id: 'structured',
    name: { en: 'Structured Data', es: 'Datos Estructurados' },
    exts: '.json, .jsonl, .xml, .yaml, .toml',
    sampleFile: 'sensores_iot_estacion_meteo.jsonl',
    qualitySection: 'structured',
    representativeFormats: 'JSON, JSONL, XML, YAML, PLIST, TOML',
    badge: 'Structure Parser',
    specificProperties: [
      {
        id: 'str_depth',
        name: { en: 'Root Type & Max Depth', es: 'Tipo Raíz y Profundidad Máxima' },
        value: 'Colección de eventos en serie temporal con profundidad 4',
        type: 'specific',
        badge: 'Topology',
        desc: { en: 'Evaluates JSON/XML nesting complexity.', es: 'Evalúa la complejidad del anidamiento de claves.' },
        standard: 'RFC 8259',
      },
      {
        id: 'str_keys',
        name: { en: 'Unique Key Inventory', es: 'Inventario de Claves Únicas' },
        value: '142 claves de atributos detectadas',
        type: 'specific',
        badge: 'Key Sketch',
        desc: { en: 'Creates an attribute inventory sketch.', es: 'Crea un inventario normalizado de atributos.' },
        standard: 'Schema Inference',
      },
    ],
  },
  {
    id: 'semantic',
    name: { en: 'Semantic Graph & RDF', es: 'Grafos y Web Semántica' },
    exts: '.ttl, .rdf, .nt, .jsonld',
    sampleFile: 'ontologia_agricola_edaan.ttl',
    qualitySection: 'semantic',
    representativeFormats: 'RDF/XML, Turtle, N-Triples, JSON-LD',
    badge: 'RDFLib & N3',
    specificProperties: [
      {
        id: 'sem_triples',
        name: { en: 'Triple Count', es: '84,200 Tripletas Sujeto-Predicado-Objeto' },
        value: '84,200 tripletas indexadas deterministamente',
        type: 'specific',
        badge: 'Triples',
        desc: { en: 'Counts distinct semantic assertions.', es: 'Conteo de aserciones semánticas exactas.' },
        standard: 'W3C RDF 1.1',
      },
      {
        id: 'sem_ns',
        name: { en: 'Namespace Registry', es: 'Namespaces y Ontologías' },
        value: 'dcat, dcterms, skos, owl, foaf, une0087:2025',
        type: 'specific',
        badge: 'Vocabularies',
        desc: { en: 'Discovers declared RDF prefix namespaces.', es: 'Detecta los prefijos ontológicos declarados.' },
        standard: 'RDF Namespaces',
      },
      {
        id: 'sem_classes',
        name: { en: 'OWL Classes & SKOS Concepts', es: 'Clases OWL y Conceptos SKOS' },
        value: 'dcat:Dataset, dcat:Distribution, skos:Concept, une:AgriParcel',
        type: 'specific',
        badge: 'OWL / SKOS',
        desc: { en: 'Validates ontology types and schema conformity.', es: 'Valida tipos de clases y conformidad de esquema.' },
        standard: 'W3C SKOS / OWL',
      },
    ],
  },
  {
    id: 'database',
    name: { en: 'Databases & SQL', es: 'Bases de Datos y SQL' },
    exts: '.sql, .sqlite, .duckdb',
    sampleFile: 'registro_explotaciones_andalucia.duckdb',
    qualitySection: 'sql / database',
    representativeFormats: 'SQL dumps, SQLite, DuckDB, backup inspection',
    badge: 'DuckDB & SQLite',
    specificProperties: [
      {
        id: 'db_tables',
        name: { en: 'Reconstructed Tables', es: 'Tablas Reconstruidas' },
        value: 'parcelas_sigpac, cultivos_declarados, riegos_autorizados',
        type: 'specific',
        badge: 'Table Schema',
        desc: { en: 'Extracts relational catalog without running a server.', es: 'Extrae catálogo relacional sin levantar servidores.' },
        standard: 'SQL:2016 / DuckDB',
      },
      {
        id: 'db_keys',
        name: { en: 'Keys & Relations', es: 'Claves Primarias y Relaciones' },
        value: 'PRIMARY KEY y FOREIGN KEY identificadas para integridad',
        type: 'specific',
        badge: 'Relational',
        desc: { en: 'Maps relational integrity constraints.', es: 'Mapea claves foráneas e integridad referencial.' },
        standard: 'Relational Model',
      },
      {
        id: 'db_safety',
        name: { en: 'Safety Audit', es: 'Auditoría de Sentencias de Riesgo' },
        value: 'Sin sentencias destructivas DROP TABLE detectadas (95% DML / 5% DDL)',
        type: 'specific',
        badge: 'SQL Audit',
        desc: { en: 'Audits script statements for destructive commands.', es: 'Audita sentencias destructivas en scripts SQL.' },
        standard: 'Security Filter',
      },
    ],
  },
  {
    id: 'archive',
    name: { en: 'Compressed Archives', es: 'Archivos Comprimidos' },
    exts: '.zip, .tar, .gz, .rar',
    sampleFile: 'paquete_campana_olivar_2024.zip',
    qualitySection: 'archive',
    representativeFormats: 'ZIP, TAR, RAR, and supported compression wrappers',
    badge: 'Safe Unpack Guard',
    specificProperties: [
      {
        id: 'arc_count',
        name: { en: 'Bounded Entry Count', es: 'Entradas Acotadas (120 Ficheros)' },
        value: '120 ficheros contenidos respetando límites seguros de memoria',
        type: 'specific',
        badge: 'Bounded Bounds',
        desc: { en: 'Enforces hard limits on archive processing.', es: 'Aplica límites duros en la descompresión.' },
        standard: 'Ingress Bounds',
      },
      {
        id: 'arc_bomb',
        name: { en: 'Zip-Bomb Protection', es: 'Mitigación de Zip-Bombs' },
        value: 'Ratio de compresión 1:3.2 (verificado como archivo no malicioso)',
        type: 'specific',
        badge: 'Anti-Malware',
        desc: { en: 'Blocks decompression bombs before memory exhaustion.', es: 'Bloquea bombas de compresión antes de agotar memoria.' },
        standard: 'Security Pipeline',
      },
      {
        id: 'arc_path',
        name: { en: 'Path-Traversal Guard', es: 'Guardia contra Path-Traversal' },
        value: 'Sanitización estricta de rutas relativas (bloqueo ../)',
        type: 'specific',
        badge: 'Sanitization',
        desc: { en: 'Neutralizes relative directory traversal exploits.', es: 'Neutraliza ataques de escape de directorio.' },
        standard: 'CWE-22 Mitigation',
      },
    ],
  },
  {
    id: 'scripts',
    name: { en: 'Scripts & Applications', es: 'Scripts y Aplicaciones' },
    exts: '.py, .r, .sh, .ipynb, Dockerfile',
    sampleFile: 'pipeline_calidad_agua.py',
    qualitySection: 'script / app profile',
    representativeFormats: 'Supported source files and application packages',
    badge: 'Code Profiler',
    specificProperties: [
      {
        id: 'scr_lang',
        name: { en: 'Language & Environment', es: 'Lenguaje y Entorno Detectado' },
        value: 'Python 3.12 (shebang #!/usr/bin/env python)',
        type: 'specific',
        badge: 'Interpreter',
        desc: { en: 'Detects programming runtime and version targets.', es: 'Detecta runtime y versiones objetivo de ejecución.' },
        standard: 'Runtime Profile',
      },
      {
        id: 'scr_deps',
        name: { en: 'Detected Dependencies', es: 'Dependencias Requeridas' },
        value: 'pandas, rasterio, fastapi, pydantic, numpy',
        type: 'specific',
        badge: 'Dependencies',
        desc: { en: 'Scans import statements and manifest files.', es: 'Escanea importaciones y requisitos de librerías.' },
        standard: 'Dependency Graph',
      },
      {
        id: 'scr_entry',
        name: { en: 'Entrypoint Profile', es: 'Puntos de Entrada' },
        value: 'Bloques if __name__ == "__main__": y funciones CLI',
        type: 'specific',
        badge: 'Entrypoints',
        desc: { en: 'Identifies executable routines and CLI interfaces.', es: 'Identifica rutinas ejecutables e interfaces CLI.' },
        standard: 'AST Inspection',
      },
    ],
  },
  {
    id: 'other',
    name: { en: 'Generic Detection / Tika', es: 'Detección Genérica / Tika' },
    exts: 'MIME fallback, .dat, .bin',
    sampleFile: 'fichero_binario_personalizado.dat',
    qualitySection: 'unsupported / generic',
    representativeFormats: 'Content handled only by generic detection / Tika',
    badge: 'Safe Fallback',
    specificProperties: [
      {
        id: 'oth_mime',
        name: { en: 'Best-Effort MIME', es: 'Detección Best-Effort' },
        value: 'Detección por cabeceras y bytes iniciales con Apache Tika',
        type: 'specific',
        badge: 'Tika Fallback',
        desc: { en: 'Safe degradation when no native parser exists.', es: 'Degradación segura cuando no existe un parser nativo.' },
        standard: 'Generic Detection',
      },
      {
        id: 'oth_safe',
        name: { en: 'Safe Degradation', es: 'Degradación Segura sin Error' },
        value: 'Emite advertencias informativas sin interrumpir el proceso de catalogación',
        type: 'specific',
        badge: 'Resilience',
        desc: { en: 'Guarantees the pipeline never crashes on obscure formats.', es: 'Garantiza que el sistema nunca caiga ante formatos extraños.' },
        standard: 'Pipeline Resilience',
      },
    ],
  },
];

/* --- PYDANTIC AI AGENT SCENARIOS FOR METADATASEARCHTOOL --- */
interface AgentScenario {
  id: string;
  query: { en: string; es: string };
  thought: { en: string; es: string };
  toolCall: string;
  rrfScore: string;
  resultName: string;
  resultDesc: { en: string; es: string };
  datasetId: string;
  contractPolicy: string;
}

const AGENT_SCENARIOS: AgentScenario[] = [
  {
    id: 'drought',
    query: {
      en: 'Find drought and soil moisture datasets in Andalusia in GeoTIFF format with resolution under 20m',
      es: 'Busca datasets de sequía y humedad del suelo en Andalucía en formato GeoTIFF con resolución menor a 20 metros',
    },
    thought: {
      en: 'Detected geospatial query intent. Extracting entities: region="Andalusia (ES61)", theme="drought/moisture", format="image/tiff", resolution="<=20m".',
      es: 'Detectada intención de búsqueda geoespacial. Extrayendo entidades: región="Andalucía (ES61)", temática="sequía/humedad", formato="image/tiff", resolución="<=20m".',
    },
    toolCall: 'execute_hybrid_search(theme="AGRI", format="image/tiff", max_resolution=20.0, bbox=[-7.5, 36.0, -1.6, 38.7])',
    rrfScore: 'RRF Fused Score: 0.0324 · BM25: 0.88 · Qdrant Cosine: 0.94',
    resultName: 'Índice de Humedad y Estrés Hídrico en Cuencas del Guadalquivir (Sentinel-2 10m)',
    resultDesc: {
      en: 'Multi-temporal raster collection (10m ground resolution, EPSG:25830) validated with DCAT-AP v2.0 and FAO AGROVOC.',
      es: 'Colección ráster multi-temporal (10m de resolución, EPSG:25830) validada con DCAT-AP v2.0 y AGROVOC.',
    },
    datasetId: 'edaan-sentinel2-moisture-2024',
    contractPolicy: 'ODRL 2.2: Free for Academic Research (Non-Commercial, Attribution Required)',
  },
  {
    id: 'olive_model',
    query: {
      en: 'Locate olive yield prediction models aligned with AGROVOC ontologies',
      es: 'Localiza modelos de predicción de rendimiento de olivar alineados con ontología AGROVOC',
    },
    thought: {
      en: 'Targeting controlled vocabularies. Mapping term "olivar" to AGROVOC URI c_5348 (Olea europaea). Searching vector collection with dense semantics.',
      es: 'Búsqueda orientada a vocabularios controlados. Mapeando término "olivar" a AGROVOC URI c_5348 (Olea europaea). Consultando colección vectorial con semántica densa.',
    },
    toolCall: 'search_by_sparql_concept(concept_uri="http://aims.fao.org/aos/agrovoc/c_5348", target_format="parquet")',
    rrfScore: 'RRF Fused Score: 0.0319 · BM25: 0.82 · Qdrant Cosine: 0.96',
    resultName: 'Monitorización Fenológica y Rendimiento de Olivar en Jaén y Córdoba',
    resultDesc: {
      en: 'Structured dataset in Apache Parquet conforming to Spanish National Standard UNE 0087:2025 for agricultural data spaces.',
      es: 'Dataset estructurado en Apache Parquet conforme a la norma UNE 0087:2025 para espacios de datos agroalimentarios.',
    },
    datasetId: 'edaan-olivar-rendimiento-jaen',
    contractPolicy: 'ODRL 2.2: Bilateral B2B Contract Required (Data Sovereign Gateway)',
  },
  {
    id: 'commercial',
    query: {
      en: 'Which assets in the catalog have active ODRL policies allowing commercial exploitation?',
      es: '¿Qué activos del catálogo tienen políticas ODRL que permitan explotación comercial directa?',
    },
    thought: {
      en: 'Filtering metadata catalog by verified ODRL permissions: odrl:purpose = "http://w3id.org/edaan/purpose/commercial".',
      es: 'Filtrando catálogo de metadatos por permisos ODRL verificados: odrl:purpose = "http://w3id.org/edaan/purpose/commercial".',
    },
    toolCall: 'query_catalog_by_policy(permission="commercial_use", require_edc=True)',
    rrfScore: '14 Active Commercial Offerings Found',
    resultName: 'Red de Estaciones Agrometeorológicas en Tiempo Real (Red RIA)',
    resultDesc: {
      en: 'Automated telemetry stream providing hourly temperatures, humidity, and solar radiation with Eclipse Dataspace Connector endpoints.',
      es: 'Flujo de telemetría horaria con temperatura, humedad y radiación solar a través de endpoints Eclipse Dataspace Connector.',
    },
    datasetId: 'edaan-red-ria-telemetria',
    contractPolicy: 'ODRL 2.2: Commercial License Available (Annual Bilateral Agreement)',
  },
];

export const DataSpaceEcosystemViewer: React.FC = () => {
  const { lang } = useLanguage();
  const [activeRepo, setActiveRepo] = useState<RepoKey>('extract');

  // Subview states per repo
  const [extractSubview, setExtractSubview] = useState<ExtractSubview>('graph');
  const [sphereSubview, setSphereSubview] = useState<SphereSubview>('policies');
  const [searchSubview, setSearchSubview] = useState<SearchSubview>('agent');

  // Interactive state: Format Family & Node Selection for Knowledge Graph
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('tabular');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('base_llm');

  // Interactive state: 4 Architecture Modules
  const [activeModuleTab, setActiveModuleTab] = useState<'security' | 'engine' | 'llm' | 'form'>('security');

  // Interactive states: ODRL Simulator
  const [policyPurpose, setPolicyPurpose] = useState<'research' | 'commercial' | 'gov'>('research');
  const [policyGeo, setPolicyGeo] = useState<'andalusia' | 'spain' | 'eu'>('andalusia');
  const [policyValidity, setPolicyValidity] = useState<'1y' | '3y' | 'perpetual'>('1y');
  const [policyNonDeriv, setPolicyNonDeriv] = useState<boolean>(true);

  // Interactive states: Agent Simulator
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0);

  // File tree state
  const [selectedFileId, setSelectedFileId] = useState<string>(REPOS_DATA.extract.defaultItem);

  const currentRepo = REPOS_DATA[activeRepo];
  const activeTreeItem = currentRepo.tree.find(item => item.id === selectedFileId) || currentRepo.tree[0];

  const handleSelectRepo = (key: RepoKey) => {
    setActiveRepo(key);
    setSelectedFileId(REPOS_DATA[key].defaultItem);
  };

  const selectedFamily = FORMAT_FAMILIES_ALL.find(f => f.id === selectedFamilyId) || FORMAT_FAMILIES_ALL[0];

  // Resolve currently active metadata node for inspector card
  const allCurrentNodes = [...BASE_METADATA_PROPERTIES, ...selectedFamily.specificProperties];
  const activeNode = allCurrentNodes.find(n => n.id === selectedNodeId) || allCurrentNodes[0];

  const activeAgentScenario = AGENT_SCENARIOS[selectedAgentIndex];

  return (
    <div className="dse-container">
      {/* 1. MACRO ARCHITECTURE DIAGRAM: Tri-Repo Flywheel */}
      <div className="dse-macro-card">
        <div className="dse-macro-header">
          <span className="dse-macro-badge">
            <FiLayers /> {lang === 'en' ? 'Inter-Repository Architecture' : 'Arquitectura Inter-Repositorio'}
          </span>
          <h3 className="dse-macro-title">
            {lang === 'en'
              ? 'The Data Space Triad: Ingestion, Search & Sovereign Governance'
              : 'La Tríada del Espacio de Datos: Ingesta, Búsqueda y Gobernanza'}
          </h3>
          <p className="dse-macro-subtitle">
            {lang === 'en'
              ? 'A data space cannot function with missing metadata, nor can published assets be discovered without intelligent search. These 3 independent repositories work in concert to power the regional data ecosystem.'
              : 'Un espacio de datos no puede operar sin metadatos rigurosos, ni un catálogo federado puede explotarse sin un buscador inteligente. Estos 3 repositorios independientes colaboran para dar vida al ecosistema.'}
          </p>
        </div>

        <div className="dse-macro-diagram">
          {/* NODE 1: METADATAXTRACT */}
          <div
            className={`dse-macro-node ${activeRepo === 'extract' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('extract')}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className="dse-macro-node__top">
                <div className="dse-macro-node__icon-wrap extract"><FiCpu /></div>
                <span className="dse-macro-node__step">Repo 01</span>
              </div>
              <h4 className="dse-macro-node__title">MetaDataXtract</h4>
              <p className="dse-macro-node__role">
                {lang === 'en' ? 'Extraction & Semantics · Paper in Prep' : 'Ingesta y Semántica · Paper en Preparación'}
              </p>
              <p className="dse-macro-node__desc">
                {lang === 'en'
                  ? 'Inspects +14 format families, extracts deterministic structural schemas, and generates strict DCAT-AP JSON-LD.'
                  : 'Inspecciona +14 familias de formatos, extrae esquemas deterministas y genera JSON-LD conforme a DCAT-AP.'}
              </p>
            </div>
            <div className="dse-macro-node__flow-tag">
              <span>{lang === 'en' ? 'Exports validated JSON-LD →' : 'Exporta JSON-LD validado →'}</span>
            </div>
          </div>

          {/* NODE 2: ÁGORA DATA SPHERE (EDAAN) */}
          <div
            className={`dse-macro-node ${activeRepo === 'sphere' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('sphere')}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className="dse-macro-node__top">
                <div className="dse-macro-node__icon-wrap sphere"><FiShield /></div>
                <span className="dse-macro-node__step">Repo 02</span>
              </div>
              <h4 className="dse-macro-node__title">ÁGORA Data Sphere</h4>
              <p className="dse-macro-node__role">
                {lang === 'en' ? 'Sovereign Portal & ODRL Contracts' : 'Portal Soberano y Contratos ODRL'}
              </p>
              <p className="dse-macro-node__desc">
                {lang === 'en'
                  ? 'Official gateway for EDAAN: transactional dataset offers, bilateral access contracts, and Kubernetes cluster.'
                  : 'Portal oficial de EDAAN: ofertas de datasets, contratos bilaterales de acceso y clúster Kubernetes.'}
              </p>
            </div>
            <div className="dse-macro-node__flow-tag">
              <span>{lang === 'en' ? 'Synchronizes catalog assets →' : 'Sincroniza activos del catálogo →'}</span>
            </div>
          </div>

          {/* NODE 3: METADATASEARCHTOOL */}
          <div
            className={`dse-macro-node ${activeRepo === 'search' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('search')}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className="dse-macro-node__top">
                <div className="dse-macro-node__icon-wrap search"><FiSearch /></div>
                <span className="dse-macro-node__step">Repo 03</span>
              </div>
              <h4 className="dse-macro-node__title">metadataSearchTool</h4>
              <p className="dse-macro-node__role">
                {lang === 'en' ? 'Hybrid RRF Search & Pydantic AI' : 'Búsqueda Híbrida RRF y Pydantic AI'}
              </p>
              <p className="dse-macro-node__desc">
                {lang === 'en'
                  ? 'Bridges vocabulary barriers uniting Elasticsearch 8 lexical BM25 and Qdrant dense vectors with conversational agents.'
                  : 'Supera barreras terminológicas uniendo BM25 en Elasticsearch con vectores densos en Qdrant y agentes autónomos.'}
              </p>
            </div>
            <div className="dse-macro-node__flow-tag">
              <span>{lang === 'en' ? 'Guides consumers to data assets' : 'Guía al consumidor hacia el dato'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REPO DETAILED WORKSPACE */}
      <div className="dse-repo-workspace">
        {/* REPO SELECTOR NAV - STRICT SEQUENTIAL ORDER: REPO 1 -> REPO 2 -> REPO 3 */}
        <div className="dse-repo-nav">
          <button
            type="button"
            className={`dse-repo-tab ${activeRepo === 'extract' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('extract')}
          >
            <span className="dse-repo-tab__dot extract" />
            <span>Repo 01 · KhaosResearch/MetaDataXtract</span>
          </button>
          <button
            type="button"
            className={`dse-repo-tab ${activeRepo === 'sphere' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('sphere')}
          >
            <span className="dse-repo-tab__dot sphere" />
            <span>Repo 02 · ÁGORA Data Sphere (EDAAN)</span>
          </button>
          <button
            type="button"
            className={`dse-repo-tab ${activeRepo === 'search' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('search')}
          >
            <span className="dse-repo-tab__dot search" />
            <span>Repo 03 · KhaosResearch/metadataSearchTool</span>
          </button>
        </div>

        {/* REPO HERO BAR */}
        <div className="dse-repo-header">
          <div className="dse-repo-header__left">
            <h3>
              {currentRepo.name}
              <span className="dse-repo-header__badge">{currentRepo.repoBadge[lang]}</span>
            </h3>
            <p className="dse-repo-header__mission">{currentRepo.mission[lang]}</p>
          </div>
          <div className="dse-repo-header__actions">
            {currentRepo.github && (
              <a href={currentRepo.github} target="_blank" rel="noopener noreferrer" className="dse-repo-action-btn github">
                <FiGithub /> GitHub Repo
              </a>
            )}
            {currentRepo.demo && (
              <a href={currentRepo.demo} target="_blank" rel="noopener noreferrer" className="dse-repo-action-btn demo">
                <FiExternalLink /> {lang === 'en' ? 'Live Platform' : 'Ver Plataforma'}
              </a>
            )}
          </div>
        </div>

        {/* SUBVIEW SELECTOR BAR PER REPO */}
        <div className="dse-subnav-bar">
          <div className="dse-subnav-label">
            <FiSliders size={12} />
            <span>{lang === 'en' ? 'Explore Capability:' : 'Explorar Funcionalidad:'}</span>
          </div>

          <div className="dse-subnav-pills">
            {activeRepo === 'extract' && (
              <>
                <button
                  type="button"
                  className={`dse-subnav-pill ${extractSubview === 'graph' ? 'active' : ''}`}
                  onClick={() => setExtractSubview('graph')}
                >
                  <FiShare2 size={12} />
                  <span>{lang === 'en' ? '+14 Families & Metadata Graph' : '+14 Familias y Grafo de Metadatos'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${extractSubview === 'modules' ? 'active' : ''}`}
                  onClick={() => setExtractSubview('modules')}
                >
                  <FiLayers size={12} />
                  <span>{lang === 'en' ? 'The 4 Core Architecture Modules' : 'Los 4 Módulos de la Arquitectura'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${extractSubview === 'repo_tree' ? 'active' : ''}`}
                  onClick={() => setExtractSubview('repo_tree')}
                >
                  <FiFolder size={12} />
                  <span>{lang === 'en' ? 'Repository Structure' : 'Esquema del Repositorio'}</span>
                </button>
              </>
            )}

            {activeRepo === 'sphere' && (
              <>
                <button
                  type="button"
                  className={`dse-subnav-pill ${sphereSubview === 'policies' ? 'active' : ''}`}
                  onClick={() => setSphereSubview('policies')}
                >
                  <FiLock size={12} />
                  <span>{lang === 'en' ? 'ODRL 2.2 Policy Simulator' : 'Simulador de Políticas ODRL 2.2'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${sphereSubview === 'mesh' ? 'active' : ''}`}
                  onClick={() => setSphereSubview('mesh')}
                >
                  <FiShield size={12} />
                  <span>{lang === 'en' ? 'Sovereign Mesh vs Centralized' : 'Malla Soberana vs Centralizado'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${sphereSubview === 'repo_tree' ? 'active' : ''}`}
                  onClick={() => setSphereSubview('repo_tree')}
                >
                  <FiFolder size={12} />
                  <span>{lang === 'en' ? 'Repository Structure' : 'Esquema del Repositorio'}</span>
                </button>
              </>
            )}

            {activeRepo === 'search' && (
              <>
                <button
                  type="button"
                  className={`dse-subnav-pill ${searchSubview === 'agent' ? 'active' : ''}`}
                  onClick={() => setSearchSubview('agent')}
                >
                  <FiTerminal size={12} />
                  <span>{lang === 'en' ? 'MetadataSearch Agent Simulator' : 'Simulador de Agente MetadataSearch'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${searchSubview === 'rrf' ? 'active' : ''}`}
                  onClick={() => setSearchSubview('rrf')}
                >
                  <FiZap size={12} />
                  <span>{lang === 'en' ? 'Hybrid RRF Engine (BM25 + Qdrant)' : 'Motor Fusión RRF (BM25 + Qdrant)'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${searchSubview === 'repo_tree' ? 'active' : ''}`}
                  onClick={() => setSearchSubview('repo_tree')}
                >
                  <FiFolder size={12} />
                  <span>{lang === 'en' ? 'Repository Structure' : 'Esquema del Repositorio'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUBVIEW 1: METADATA GRAPH (+14 FORMAT FAMILIES)                */}
        {/* ============================================================== */}
        {activeRepo === 'extract' && extractSubview === 'graph' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>
                  {lang === 'en'
                    ? 'Interactive Metadata Knowledge Graph Across +14 Format Families'
                    : 'Grafo Interactivo de Metadatos sobre +14 Familias de Formatos'}
                </h4>
                <p>
                  {lang === 'en'
                    ? 'Select any format family from the official reference. The graph dynamically branches both common base metadata (always present) and format-specific technical properties extracted deterministically:'
                    : 'Selecciona cualquier familia de formatos soportada. El grafo ramifica tanto los metadatos base comunes (siempre presentes en todo archivo) como las propiedades técnicas específicas extraídas sin filtrar el dato bruto:'}
                </p>
              </div>
            </div>

            {/* Format Families Grid Selector */}
            <div className="dse-families-scroller">
              {FORMAT_FAMILIES_ALL.map(fam => (
                <button
                  type="button"
                  key={fam.id}
                  className={`dse-family-pill-btn ${selectedFamilyId === fam.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFamilyId(fam.id);
                    setSelectedNodeId(fam.specificProperties[0]?.id || 'base_format');
                  }}
                >
                  <strong className="family-name">{fam.name[lang]}</strong>
                  <span className="family-exts">{fam.exts}</span>
                </button>
              ))}
            </div>

            {/* DYNAMIC KNOWLEDGE GRAPH DISPLAY */}
            <div className="dse-graph-workspace">
              {/* Center Root File Header */}
              <div className="dse-graph-file-banner">
                <span className="banner-tag">
                  <FiFileText /> {lang === 'en' ? 'Artifact Ingested:' : 'Archivo Analizado:'}
                </span>
                <code className="banner-filename">{selectedFamily.sampleFile}</code>
                <span className="banner-section">
                  section: <code>{selectedFamily.qualitySection}</code>
                </span>
              </div>

              {/* DUAL CLUSTER GRAPH CANVAS */}
              <div className="dse-graph-canvas">
                {/* Visual Branch Lines & Hubs */}
                <div className="dse-graph-columns">
                  {/* LEFT CLUSTER: COMMON BASE METADATA (ALWAYS PRESENT) */}
                  <div className="dse-graph-cluster base">
                    <div className="cluster-header">
                      <FiCheckCircle className="cluster-icon" />
                      <span>{lang === 'en' ? 'Common Base Metadata (Always Present)' : 'Metadatos Base (Siempre Presentes)'}</span>
                    </div>

                    <div className="cluster-nodes-list">
                      {BASE_METADATA_PROPERTIES.map(node => (
                        <button
                          type="button"
                          key={node.id}
                          className={`dse-graph-node-btn base ${selectedNodeId === node.id ? 'active' : ''}`}
                          onClick={() => setSelectedNodeId(node.id)}
                        >
                          <span className="node-badge-pill">{node.badge}</span>
                          <span className="node-text">{node.name[lang]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CENTER CONNECTOR WITH ANIMATED DATA PULSE */}
                  <div className="dse-graph-center-pillar">
                    <div className="pillar-pulse-line" />
                    <div className="pillar-core-node">
                      <FiCpu size={16} />
                      <span>MetaDataXtract</span>
                    </div>
                  </div>

                  {/* RIGHT CLUSTER: FORMAT-SPECIFIC DYNAMIC NODES */}
                  <div className="dse-graph-cluster specific">
                    <div className="cluster-header">
                      <FiActivity className="cluster-icon" />
                      <span>
                        {lang === 'en'
                          ? `Specific Properties: ${selectedFamily.name[lang]}`
                          : `Propiedades Específicas: ${selectedFamily.name[lang]}`}
                      </span>
                    </div>

                    <div className="cluster-nodes-list">
                      {selectedFamily.specificProperties.map(node => (
                        <button
                          type="button"
                          key={node.id}
                          className={`dse-graph-node-btn specific ${selectedNodeId === node.id ? 'active' : ''}`}
                          onClick={() => setSelectedNodeId(node.id)}
                        >
                          <span className="node-badge-pill spec">{node.badge}</span>
                          <span className="node-text">{node.name[lang]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* NODE DETAIL INSPECTOR CARD */}
              <div className="dse-node-inspector-box">
                <div className="inspector-head">
                  <div className="inspector-title-row">
                    <span className={`inspector-badge ${activeNode.type === 'base' ? 'base' : 'spec'}`}>
                      {activeNode.type === 'base' ? 'Metadato Base Común' : selectedFamily.name[lang]}
                    </span>
                    <h5>{activeNode.name[lang]}</h5>
                  </div>
                  <span className="inspector-standard">{activeNode.standard}</span>
                </div>

                <div className="inspector-body">
                  <div className="inspector-val-row">
                    <span className="inspector-val-label">{lang === 'en' ? 'Extracted Value / Schema:' : 'Valor Extraído / Esquema:'}</span>
                    <code className="inspector-val-code">{activeNode.value}</code>
                  </div>
                  <p className="inspector-desc">{activeNode.desc[lang]}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUBVIEW 2: THE 4 CORE ARCHITECTURE MODULES                     */}
        {/* ============================================================== */}
        {activeRepo === 'extract' && extractSubview === 'modules' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>
                  {lang === 'en'
                    ? 'The 4 Core Architectural Modules of MetaDataXtract'
                    : 'Los 4 Módulos Principales de la Arquitectura de MetaDataXtract'}
                </h4>
                <p>
                  {lang === 'en'
                    ? 'Designed for resilient data spaces: a security gatekeeper, an offline deterministic parser mesh, an optional LLM narrative generator, and a strict DCAT-AP v2 schema contract:'
                    : 'Diseñado para espacios de datos soberanos: guardia de seguridad, malla determinista sin conexión externa, generador narrativo LLM opcional y contrato estricto DCAT-AP v2:'}
                </p>
              </div>
            </div>

            {/* 4 MODULE TABS */}
            <div className="dse-module-tabs">
              <button
                type="button"
                className={`dse-module-tab-btn ${activeModuleTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveModuleTab('security')}
              >
                <FiShield />
                <div>
                  <strong>01. {lang === 'en' ? 'Security & Pre-Ingest' : 'Seguridad y Pre-ingesta'}</strong>
                  <small>SHA-256 · Magic Bytes · Anti-Malware</small>
                </div>
              </button>

              <button
                type="button"
                className={`dse-module-tab-btn ${activeModuleTab === 'engine' ? 'active' : ''}`}
                onClick={() => setActiveModuleTab('engine')}
              >
                <FiCpu />
                <div>
                  <strong>02. {lang === 'en' ? 'Deterministic Engine' : 'Motor de Extracción'}</strong>
                  <small>+14 Familias sin dependencia LLM</small>
                </div>
              </button>

              <button
                type="button"
                className={`dse-module-tab-btn ${activeModuleTab === 'llm' ? 'active' : ''}`}
                onClick={() => setActiveModuleTab('llm')}
              >
                <FiZap />
                <div>
                  <strong>03. {lang === 'en' ? 'LLM Deep Inference' : 'Inferencia y LLM'}</strong>
                  <small>Narrativa · Degradación Segura</small>
                </div>
              </button>

              <button
                type="button"
                className={`dse-module-tab-btn ${activeModuleTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveModuleTab('form')}
              >
                <FiFileText />
                <div>
                  <strong>04. {lang === 'en' ? 'Form & DCAT-AP v2' : 'Formulario y DCAT-AP'}</strong>
                  <small>JSON Schema 2020-12 · UNE 0087</small>
                </div>
              </button>
            </div>

            {/* ACTIVE MODULE DEEP DIVE CARD */}
            <div className="dse-module-detail-card">
              {activeModuleTab === 'security' && (
                <div>
                  <div className="mod-head">
                    <span className="mod-tag">Módulo 01</span>
                    <h4>{lang === 'en' ? 'Pre-Ingestion Threat Sanitization & Anti-Malware Guard' : 'Sanitización de Amenazas y Seguridad Pre-ingesta'}</h4>
                  </div>
                  <p className="mod-desc">
                    {lang === 'en'
                      ? 'No untrusted file is parsed before strict security boundary checks. Computes immutable cryptographic hashes and guards against weaponized archives:'
                      : 'Ningún archivo de origen no confiable se analiza sin pasar estrictos filtros de seguridad perimetral. Genera huellas inmutables y protege contra ataques de descompresión:'}
                  </p>
                  <div className="mod-points-grid">
                    <div className="mod-point">
                      <strong>Huella Criptográfica SHA-256</strong>
                      <p>Generada en streaming durante la subida, garantizando integridad inmutable y trazabilidad forense.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Inspección de Magic Bytes</strong>
                      <p>Verifica las cabeceras binarias reales (libmagic / MIME), impidiendo camuflar ejecutables como imágenes o documentos.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Mitigación de Zip-Bombs y Traversal</strong>
                      <p>Límites estrictos de ratio de compresión y descompresión acotada; neutraliza rutas relativas maliciosas (../../).</p>
                    </div>
                    <div className="mod-point">
                      <strong>Escaneo Remoto con +70 Antivirus</strong>
                      <p>Consulta por hash contra bases de malware (VirusTotal/ClamAV) protegiendo el clúster sin exponer el contenido privado.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeModuleTab === 'engine' && (
                <div>
                  <div className="mod-head">
                    <span className="mod-tag">Módulo 02</span>
                    <h4>{lang === 'en' ? 'Deterministic Extraction Mesh (Zero-LLM Core)' : 'Malla de Extracción Determinista (Núcleo sin LLM)'}</h4>
                  </div>
                  <p className="mod-desc">
                    {lang === 'en'
                      ? 'The core of MetaDataXtract extracts concrete, verifiable engineering metrics using native high-speed binary parsers:'
                      : 'El núcleo de MetaDataXtract extrae métricas técnicas verificables usando analizadores binarios nativos optimizados en memoria:'}
                  </p>
                  <div className="mod-points-grid">
                    <div className="mod-point">
                      <strong>+14 Familias de Formatos Científicos</strong>
                      <p>Tabular (Parquet, Arrow, CSV), Geoespacial (GeoTIFF, Shapefile), Científico (NetCDF, HDF5, Zarr), Multimedia y Bases de datos.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Parsers Especializados de Bajo Nivel</strong>
                      <p>Librerías nativas optimizadas: PyArrow para columnar, Rasterio/GDAL para ráster, netCDF4 para clima, ffprobe para multimedia.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Métricas de Calidad Estructural</strong>
                      <p>Detección de recuentos de filas, estadísticas Min/Max por bloque, resoluciones en metros, proyecciones EPSG y nulos.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Aislamiento y Eficiencia</strong>
                      <p>Procesamiento determinista y reproducible sin costos recurrentes de API ni latencias de red impredecibles.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeModuleTab === 'llm' && (
                <div>
                  <div className="mod-head">
                    <span className="mod-tag">Módulo 03</span>
                    <h4>{lang === 'en' ? 'Deep LLM Inference & Semantic Enrichment' : 'Inferencia Profunda y Enriquecimiento con LLM'}</h4>
                  </div>
                  <p className="mod-desc">
                    {lang === 'en'
                      ? 'When enabled via SUGGESTIONS_LLM_BASE_URL, the extractor generates semantic descriptions and natural language titles, with guaranteed safe degradation:'
                      : 'Cuando se habilita SUGGESTIONS_LLM_BASE_URL, el extractor genera descripciones narrativas profundas y títulos legibles con degradación segura garantizada:'}
                  </p>
                  <div className="mod-points-grid">
                    <div className="mod-point">
                      <strong>Descripción Profunda del Dataset</strong>
                      <p>Sintetiza qué representa el dato, su contexto de aplicación y posibles casos de uso agroalimentarios o científicos.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Sugerencia de Taxonomías Europeas</strong>
                      <p>Propone temas de la UE (EU Data Themes) y conceptos normalizados de la FAO (AGROVOC) y EuroVoc.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Degradación Segura sin Errores</strong>
                      <p>Si el endpoint del LLM no está configurado, responde lento o falla, la extracción técnica se completa con éxito al 100%.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Privacidad Respetada</strong>
                      <p>Solo se transfieren muestras acotadas y esquemas de cabecera; el fichero masivo nunca se envía al modelo.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeModuleTab === 'form' && (
                <div>
                  <div className="mod-head">
                    <span className="mod-tag">Módulo 04</span>
                    <h4>{lang === 'en' ? 'Form Insertion & Strict DCAT-AP v2 Contract' : 'Inserción en Formulario y Contrato Estricto DCAT-AP v2'}</h4>
                  </div>
                  <p className="mod-desc">
                    {lang === 'en'
                      ? 'Automatically populates the web publisher portal inputs and validates output against JSON Schema 2020-12 conforming to UNE 0087:2025:'
                      : 'Rellena automáticamente los campos del portal web Next.js y valida la salida bajo JSON Schema 2020-12 conforme a la norma UNE 0087:2025:'}
                  </p>
                  <div className="mod-points-grid">
                    <div className="mod-point">
                      <strong>Validación Estricta Schema v2.0</strong>
                      <p>Contrato JSON Schema 2020-12 estricto (schemas/esquema.json) que impide publicar metadatos incompletos o malformados.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Mapeo Automático al Formulario</strong>
                      <p>Inserta automáticamente títulos, descripciones, temas, formatos y resoluciones en la máquina de estados del frontend.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Norma Española UNE 0087:2025</strong>
                      <p>Alineación oficial con los requisitos de interoperabilidad del Espacio de Datos Agroalimentario de España y Europa.</p>
                    </div>
                    <div className="mod-point">
                      <strong>Exportación JSON-LD Listo para Fedérase</strong>
                      <p>Genera grafos JSON-LD estándar consumibles por ÁGORA Data Sphere y el broker de búsqueda metadataSearchTool.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUBVIEW 3 / COMMON: REPOSITORY STRUCTURE                       */}
        {/* ============================================================== */}
        {((activeRepo === 'extract' && extractSubview === 'repo_tree') ||
          (activeRepo === 'sphere' && sphereSubview === 'repo_tree') ||
          (activeRepo === 'search' && searchSubview === 'repo_tree')) && (
          <div className="dse-repo-grid">
            {/* LEFT: FILE & MODULE EXPLORER */}
            <div className="dse-tree-pane">
              <div className="dse-tree-pane__header">
                <span>{lang === 'en' ? 'Repository Directory Tree' : 'Esquema de Carpetas del Repositorio'}</span>
                <span>{currentRepo.tree.length} {lang === 'en' ? 'modules' : 'módulos'}</span>
              </div>
              <div className="dse-tree-list">
                {currentRepo.tree.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    className={`dse-tree-item ${item.isFolder ? 'folder' : ''} ${selectedFileId === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedFileId(item.id)}
                    style={{ paddingLeft: `${item.depth * 14 + 10}px` }}
                  >
                    <span className="dse-tree-item__icon">
                      {item.isFolder ? <FiFolder style={{ color: '#38bdf8' }} /> : <FiFileText style={{ color: '#94a3b8' }} />}
                    </span>
                    <span className="dse-tree-item__name">{item.name}</span>
                    {item.tag && <span className="dse-tree-item__tag">{item.tag}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: CLEAN MODULE INSPECTOR */}
            <div className="dse-arch-pane">
              <div className="dse-module-inspector full">
                <div className="dse-module-inspector__head">
                  <span className="dse-module-inspector__path">{activeTreeItem.name.trim()}</span>
                  <div className="dse-module-inspector__techs">
                    {activeTreeItem.tech.map(t => (
                      <span className="dse-tech-chip" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <h5 className="dse-module-inspector__title">{activeTreeItem.role[lang]}</h5>
                <p className="dse-module-inspector__desc">{activeTreeItem.desc[lang]}</p>

                <div className="dse-module-inspector__repo-note">
                  <span className="repo-note-label">Repository Context:</span>
                  <p>
                    {activeRepo === 'extract'
                      ? 'Part of the MetaDataXtract standalone extraction and schema verification microservice mesh.'
                      : activeRepo === 'sphere'
                      ? 'Part of the official ÁGORA Data Sphere (EDAAN) portal, managing dataset offers and ODRL agreements.'
                      : 'Part of metadataSearchTool discovery service uniting Elasticsearch, Qdrant vectors, and Pydantic AI.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* REPO 2: ÁGORA DATA SPHERE SUBVIEWS                             */}
        {/* ============================================================== */}
        {activeRepo === 'sphere' && sphereSubview === 'policies' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>{lang === 'en' ? 'Interactive ODRL 2.2 Sovereign Policy & Contract Simulator' : 'Simulador Interactivo de Políticas ODRL 2.2 y Contratos Bilaterales'}</h4>
                <p>{lang === 'en'
                  ? 'In a sovereign data space, datasets are never copied indiscriminately. Access requires cryptographically enforceable terms under W3C ODRL 2.2. Configure policy constraints and inspect the generated agreement:'
                  : 'En un espacio de datos soberano, los activos nunca se copian sin control. El acceso exige contratos bilaterales computables bajo el estándar W3C ODRL 2.2. Modifica los parámetros para generar la política en vivo:'}
                </p>
              </div>
            </div>

            <div className="dse-feature-grid">
              {/* Interactive Form Controls */}
              <div className="dse-policy-controls">
                <div className="dse-ctrl-group">
                  <label className="dse-ctrl-label">{lang === 'en' ? 'Usage Purpose:' : 'Propósito de Uso Autorizado:'}</label>
                  <div className="dse-ctrl-options">
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyPurpose === 'research' ? 'active' : ''}`}
                      onClick={() => setPolicyPurpose('research')}
                    >
                      {lang === 'en' ? 'Academic Research' : 'Investigación Científica'}
                    </button>
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyPurpose === 'commercial' ? 'active' : ''}`}
                      onClick={() => setPolicyPurpose('commercial')}
                    >
                      {lang === 'en' ? 'B2B Commercial' : 'Comercial B2B'}
                    </button>
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyPurpose === 'gov' ? 'active' : ''}`}
                      onClick={() => setPolicyPurpose('gov')}
                    >
                      {lang === 'en' ? 'Public Monitoring' : 'Monitorización Pública'}
                    </button>
                  </div>
                </div>

                <div className="dse-ctrl-group">
                  <label className="dse-ctrl-label">{lang === 'en' ? 'Geographic Scope:' : 'Ámbito Territorial:'}</label>
                  <div className="dse-ctrl-options">
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyGeo === 'andalusia' ? 'active' : ''}`}
                      onClick={() => setPolicyGeo('andalusia')}
                    >
                      Andalucía (ES61)
                    </button>
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyGeo === 'spain' ? 'active' : ''}`}
                      onClick={() => setPolicyGeo('spain')}
                    >
                      España (ES)
                    </button>
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyGeo === 'eu' ? 'active' : ''}`}
                      onClick={() => setPolicyGeo('eu')}
                    >
                      Unión Europea (EU27)
                    </button>
                  </div>
                </div>

                <div className="dse-ctrl-group">
                  <label className="dse-ctrl-label">{lang === 'en' ? 'Contract Validity Duration:' : 'Vigencia Temporal del Contrato:'}</label>
                  <div className="dse-ctrl-options">
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyValidity === '1y' ? 'active' : ''}`}
                      onClick={() => setPolicyValidity('1y')}
                    >
                      12 {lang === 'en' ? 'Months' : 'Meses'}
                    </button>
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyValidity === '3y' ? 'active' : ''}`}
                      onClick={() => setPolicyValidity('3y')}
                    >
                      36 {lang === 'en' ? 'Months' : 'Meses'}
                    </button>
                    <button
                      type="button"
                      className={`dse-opt-btn ${policyValidity === 'perpetual' ? 'active' : ''}`}
                      onClick={() => setPolicyValidity('perpetual')}
                    >
                      {lang === 'en' ? 'Perpetual' : 'Indefinido'}
                    </button>
                  </div>
                </div>

                <div className="dse-ctrl-group">
                  <label className="dse-checkbox-label">
                    <input
                      type="checkbox"
                      checked={policyNonDeriv}
                      onChange={e => setPolicyNonDeriv(e.target.checked)}
                    />
                    <span>{lang === 'en' ? 'Forbid Commercial Derivatives (odrl:prohibition)' : 'Prohibir Obras Derivadas Comerciales (odrl:prohibition)'}</span>
                  </label>
                </div>
              </div>

              {/* Generated ODRL JSON-LD */}
              <div className="dse-json-preview">
                <div className="dse-json-preview__head">
                  <span className="dse-json-preview__tag">
                    <FiLock /> {lang === 'en' ? 'Live ODRL 2.2 Contract Agreement' : 'Acuerdo de Contrato ODRL 2.2 en Vivo'}
                  </span>
                  <span className="dse-json-preview__file">odrl:Agreement</span>
                </div>
                <pre className="dse-json-code">
                  <code>{`{
  "@context": "http://www.w3.org/ns/odrl.jsonld",
  "@type": "odrl:Agreement",
  "odrl:uid": "urn:edaan:contract:2026-0842",
  "odrl:profile": "http://w3id.org/edaan/odrl-profile/v1",
  "odrl:permission": [{
    "odrl:target": "urn:edaan:dataset:agri-sentinel-01",
    "odrl:action": "odrl:use",
    "odrl:constraint": [
      {
        "odrl:leftOperand": "odrl:purpose",
        "odrl:operator": "odrl:eq",
        "odrl:rightOperand": "http://w3id.org/edaan/purpose/${policyPurpose}"
      },
      {
        "odrl:leftOperand": "odrl:spatial",
        "odrl:operator": "odrl:isPartOf",
        "odrl:rightOperand": "https://sws.geonames.org/${policyGeo === 'andalusia' ? '2593110' : policyGeo === 'spain' ? '2510769' : '6695072'}/"
      },
      {
        "odrl:leftOperand": "odrl:dateTime",
        "odrl:operator": "odrl:lteq",
        "odrl:rightOperand": "${policyValidity === '1y' ? '2027-10-16T00:00:00Z' : policyValidity === '3y' ? '2029-10-16T00:00:00Z' : 'PERPETUAL'}"
      }
    ]
  }]${policyNonDeriv ? `,\n  "odrl:prohibition": [{\n    "odrl:action": "odrl:derive",\n    "odrl:target": "urn:edaan:dataset:agri-sentinel-01"\n  }]` : ''}
}`}</code>
                </pre>
                <div className="dse-json-preview__footer">
                  <span className="dse-security-pill">
                    <FiCheck size={12} /> {lang === 'en' ? 'Bilateral Cryptographic Handshake Verified' : 'Firma Criptográfica Bilateral Verificada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRepo === 'sphere' && sphereSubview === 'mesh' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>{lang === 'en' ? 'Sovereign Mesh vs Centralized Cloud Storage' : 'Malla Soberana vs Almacenamiento Centralizado Tradicional'}</h4>
                <p>{lang === 'en'
                  ? 'Why EDAAN is not just another data portal: Data never resides in a centralized database where ownership is lost. Data remains on-premise at the producer, transferred peer-to-peer strictly upon cryptographic contract verification:'
                  : 'Por qué EDAAN no es un portal web corriente: Los datos nunca se suben a un servidor central donde se pierde la custodia. El dato permanece en el servidor del productor y solo se transfiere punto a punto tras validar el contrato:'}
                </p>
              </div>
            </div>

            <div className="dse-comparison-grid">
              <div className="dse-comp-box old">
                <div className="comp-badge old">❌ {lang === 'en' ? 'Traditional Portal / Data Lake' : 'Portal Tradicional / Data Lake'}</div>
                <h5>{lang === 'en' ? 'Centralized Custody & Loss of Control' : 'Custodia Centralizada y Pérdida de Control'}</h5>
                <p>{lang === 'en'
                  ? 'Producers upload raw data to a central platform. The platform owner now controls the file. If terms change, the producer has no technical way to revoke access.'
                  : 'El productor sube el archivo a un servidor central. La plataforma asume el control del fichero. Si las condiciones cambian, el productor no puede revocar el acceso técnicamente.'}
                </p>
                <div className="comp-schematic">
                  <span>Producer</span> → <span className="warning">Central Server (Single Point of Leak)</span> → <span>Consumer</span>
                </div>
              </div>

              <div className="dse-comp-box new">
                <div className="comp-badge new">✓ {lang === 'en' ? 'EDAAN Sovereign Data Space' : 'Espacio de Datos Soberano EDAAN'}</div>
                <h5>{lang === 'en' ? 'Peer-to-Peer Transfer via EDC Connectors' : 'Transferencia Punto a Punto vía Conectores EDC'}</h5>
                <p>{lang === 'en'
                  ? 'Only DCAT-AP metadata is cataloged. The raw dataset stays behind the producer\'s Eclipse Dataspace Connector (EDC). Transferred solely after bilateral token issuance.'
                  : 'Solo se cataloga el metadato DCAT-AP. El dataset bruto reside en la infraestructura del productor tras su conector EDC y solo se transfiere tras emitir un token firmado.'}
                </p>
                <div className="comp-schematic sovereign">
                  <span>Producer EDC</span> ↔ <span className="sovereign">Bilateral DSP Tunnel</span> ↔ <span>Consumer EDC</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* REPO 3: METADATASEARCHTOOL SUBVIEWS                            */}
        {/* ============================================================== */}
        {activeRepo === 'search' && searchSubview === 'agent' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>{lang === 'en' ? 'MetadataSearch Conversational Agent with Catalog Function Calling' : 'Simulador de Agente MetadataSearch con Llamadas a Herramientas de Catálogo'}</h4>
                <p>{lang === 'en'
                  ? 'Recruiters and data consumers can ask natural language questions. The agent analyzes intent, executes hybrid RRF search tools, verifies ODRL contract terms, and delivers precise citations:'
                  : 'El visitante puede formular preguntas en lenguaje natural. El agente analiza la intención, ejecuta herramientas de búsqueda híbrida RRF, valida contratos ODRL y cita los activos con exactitud:'}
                </p>
              </div>
            </div>

            {/* Prompt Selector Pills */}
            <div className="dse-agent-prompts">
              {AGENT_SCENARIOS.map((scen, idx) => (
                <button
                  type="button"
                  key={scen.id}
                  className={`dse-agent-prompt-btn ${selectedAgentIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedAgentIndex(idx)}
                >
                  <span className="prompt-num">Query 0{idx + 1}</span>
                  <span className="prompt-text">"{scen.query[lang]}"</span>
                </button>
              ))}
            </div>

            {/* Agent Execution Flow Display */}
            <div className="dse-agent-terminal">
              <div className="dse-terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title">metadata_search_agent_runtime.log</span>
              </div>

              <div className="dse-terminal-body">
                <div className="log-entry user">
                  <span className="log-prefix">USER:</span>
                  <span className="log-text">"{activeAgentScenario.query[lang]}"</span>
                </div>

                <div className="log-entry thought">
                  <span className="log-prefix">THOUGHT:</span>
                  <span className="log-text">{activeAgentScenario.thought[lang]}</span>
                </div>

                <div className="log-entry tool">
                  <span className="log-prefix">TOOL CALL:</span>
                  <code>{activeAgentScenario.toolCall}</code>
                </div>

                <div className="log-entry rank">
                  <span className="log-prefix">RRF FUSION:</span>
                  <span className="log-badge">{activeAgentScenario.rrfScore}</span>
                </div>

                <div className="log-entry assistant">
                  <span className="log-prefix">ASSISTANT RESPONSE:</span>
                  <div className="assistant-card">
                    <strong>{activeAgentScenario.resultName}</strong>
                    <p>{activeAgentScenario.resultDesc[lang]}</p>
                    <div className="assistant-meta">
                      <span className="meta-id">ID: {activeAgentScenario.datasetId}</span>
                      <span className="meta-policy">{activeAgentScenario.contractPolicy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRepo === 'search' && searchSubview === 'rrf' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>{lang === 'en' ? 'Reciprocal Rank Fusion (RRF): Bridging Lexical BM25 & Dense Vectors' : 'Fusión de Rankings RRF: Uniendo Precisión Léxica BM25 y Vectores Densos'}</h4>
                <p>{lang === 'en'
                  ? 'Pure keyword search fails when users express queries in different dialects or synonym terms. Pure vector search fails when users request exact EPSG codes or license strings. RRF fuses both ranks mathematically without arbitrary weighting:'
                  : 'La búsqueda por palabras clave falla si el usuario usa sinónimos. La búsqueda vectorial pura falla si el usuario busca códigos técnicos exactos (EPSG, licencias). RRF fusiona ambos mundos matemáticamente sin calibración manual de pesos:'}
                </p>
              </div>
            </div>

            <div className="dse-rrf-formula-box">
              <span className="formula-tag">Algoritmo Reciprocal Rank Fusion (k = 60)</span>
              <code className="formula-math">RRF(d) = ∑ [ 1 / (60 + r_lexical(d)) ] + ∑ [ 1 / (60 + r_vector(d)) ]</code>
            </div>

            <div className="dse-rrf-table-wrap">
              <table className="dse-rrf-table">
                <thead>
                  <tr>
                    <th>{lang === 'en' ? 'Candidate Dataset' : 'Dataset Candidato'}</th>
                    <th>{lang === 'en' ? 'Lexical (Elasticsearch BM25)' : 'Léxico (Elasticsearch BM25)'}</th>
                    <th>{lang === 'en' ? 'Vector (Qdrant Cosine)' : 'Vectorial (Qdrant Coseno)'}</th>
                    <th>{lang === 'en' ? 'RRF Fused Rank' : 'Resultado RRF'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="winner">
                    <td>
                      <strong>Índice de Humedad y Estrés Hídrico</strong>
                      <small>Describe "sequía" mediante conceptos de humedad</small>
                    </td>
                    <td>
                      <span className="rank-pill yellow">Rank #3</span> (BM25: 0.74)
                    </td>
                    <td>
                      <span className="rank-pill green">Rank #1</span> (Cosine: 0.94)
                    </td>
                    <td>
                      <strong className="rank-pill trophy">Rank #1 · Score: 0.0324</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Protocolo de Riego en Parcela Experimental</strong>
                      <small>Repite la palabra clave "sequía" 12 veces en el resumen</small>
                    </td>
                    <td>
                      <span className="rank-pill green">Rank #1</span> (BM25: 0.92)
                    </td>
                    <td>
                      <span className="rank-pill red">Rank #8</span> (Cosine: 0.68)
                    </td>
                    <td>
                      <span className="rank-pill neutral">Rank #3 · Score: 0.0298</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Cartografía de Cultivos de Regadío 2024</strong>
                      <small>Contiene términos agrícolas generales</small>
                    </td>
                    <td>
                      <span className="rank-pill neutral">Rank #4</span> (BM25: 0.70)
                    </td>
                    <td>
                      <span className="rank-pill neutral">Rank #3</span> (Cosine: 0.86)
                    </td>
                    <td>
                      <span className="rank-pill neutral">Rank #2 · Score: 0.0315</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
