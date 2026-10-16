import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  FiFolder,
  FiFileText,
  FiExternalLink,
  FiGithub,
  FiLayers,
  FiSearch,
  FiGlobe,
  FiCpu,
  FiShield,
  FiSliders,
  FiTerminal,
  FiCheck,
  FiDatabase,
  FiLock,
  FiZap,
  FiCode,
} from 'react-icons/fi';
import './DataSpaceEcosystemViewer.css';

export type RepoKey = 'extract' | 'sphere' | 'search';

type ExtractSubview = 'formats' | 'ontology' | 'topology';
type SphereSubview = 'policies' | 'mesh' | 'topology';
type SearchSubview = 'agent' | 'rrf' | 'topology';

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
      en: 'Security-first automated pipeline extracting structural metadata from 30+ scientific formats into DCAT-AP v2.0 JSON-LD without disclosing raw files.',
      es: 'Pipeline security-first que extrae metadatos técnicos de +30 formatos científicos y genera JSON-LD conforme a DCAT-AP v2.0 sin ceder el dato privado.',
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
        name: '  extractors/ (+30 Formats)',
        isFolder: true,
        depth: 1,
        tag: 'Parsers',
        role: { en: 'Format Family Handlers', es: 'Manejadores por Familias de Formato' },
        desc: {
          en: 'Specialized extractors: NetCDF4, HDF5, GeoTIFF, Zarr, DuckDB, Parquet, SQLite, Shapefiles, tabular, and RDF graphs.',
          es: 'Extractores para NetCDF4, HDF5, GeoTIFF, Zarr, DuckDB, Parquet, SQLite, Shapefiles, datos tabulares y grafos RDF.',
        },
        tech: ['netCDF4', 'HDF5', 'GeoPandas', 'DuckDB', 'RDFLib'],
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

/* --- FORMAT MATRIX DATA FOR METADATAXTRACT --- */
interface FormatSpec {
  id: string;
  name: string;
  ext: string;
  category: 'geo' | 'tabular' | 'rdf' | 'doc';
  categoryLabel: { en: string; es: string };
  badge: string;
  extractedProps: { en: string[]; es: string[] };
  snippet: string;
}

const FORMAT_MATRIX: FormatSpec[] = [
  {
    id: 'geotiff',
    name: 'GeoTIFF / Cloud Optimized GeoTIFF',
    ext: '.tif, .tiff',
    category: 'geo',
    categoryLabel: { en: 'Geospatial / Raster', es: 'Geoespacial / Ráster' },
    badge: 'Rasterio & GDAL',
    extractedProps: {
      en: ['Coordinate System (EPSG:25830 / 4326)', 'Bounding Box (BBox Polygon)', '12 Spectral Bands Metadata', 'Pixel Ground Resolution (10m/px)', 'NoData Value & Data Type (Float32)'],
      es: ['Sistema de Proyección (EPSG:25830 / 4326)', 'Bounding Box Espacial (Polígono BBox)', '12 Bandas Espectrales (B1-B12)', 'Resolución Espacial (10m/px)', 'Valor NoData y Tipo de Dato (Float32)'],
    },
    snippet: `{\n  "@type": "dcat:Distribution",\n  "dct:format": "image/tiff; application=geotiff",\n  "locn:geometry": "POLYGON((-6.12 36.45, -5.92 36.45, -5.92 36.62, -6.12 36.62, -6.12 36.45))",\n  "dcat:spatialResolutionInMeters": 10.0,\n  "proj:epsg": 25830,\n  "raster:bands": 12,\n  "spdx:checksum": "sha256:7a8b9c..."\n}`,
  },
  {
    id: 'netcdf',
    name: 'NetCDF4 / HDF5 Climatology',
    ext: '.nc, .hdf5, .h5',
    category: 'geo',
    categoryLabel: { en: 'Geospatial / Scientific', es: 'Geoespacial / Científico' },
    badge: 'netCDF4 & HDF5',
    extractedProps: {
      en: ['Climate Conventions (CF-1.8)', 'Spatio-Temporal Dimensions (time, lat, lon)', 'Variable Schema (soil_temp, moisture)', 'Internal Deflate Chunking & Compression'],
      es: ['Convención Climática Oficial (CF-1.8)', 'Dimensiones Espacio-Temporales (time, lat, lon)', 'Variables Físicas (temperatura, humedad)', 'Chunking Interno y Compresión Deflate'],
    },
    snippet: `{\n  "@type": "dcat:Distribution",\n  "dct:format": "application/x-netcdf",\n  "dct:conformsTo": "http://cfconventions.org/cf-conventions/v1.8.html",\n  "dcat:temporalResolution": "P1D",\n  "netcdf:variables": ["soil_temperature", "volumetric_moisture"],\n  "spdx:checksum": "sha256:d4e5f6..."\n}`,
  },
  {
    id: 'parquet',
    name: 'Apache Parquet / Arrow Tables',
    ext: '.parquet',
    category: 'tabular',
    categoryLabel: { en: 'Columnar & Big Data', es: 'Columnar & Big Data' },
    badge: 'PyArrow Zero-Copy',
    extractedProps: {
      en: ['Zero-Copy Schema Inspection', 'Column Names & Logical Types', 'Min / Max Statistics per Row Group', 'Row Count & Snappy Compression', 'Null Value Percentage Detection'],
      es: ['Inspección de Esquema Zero-Copy', 'Nombres de Columna y Tipos Lógicos', 'Estadísticas Min/Max por Bloque', 'Recuento de Filas y Compresión Snappy', 'Porcentaje de Detección de Nulos'],
    },
    snippet: `{\n  "@type": "dcat:Distribution",\n  "dct:format": "application/vnd.apache.parquet",\n  "parquet:numRows": 1420500,\n  "parquet:columns": 24,\n  "parquet:compression": "SNAPPY",\n  "spdx:checksum": "sha256:9f8e7d..."\n}`,
  },
  {
    id: 'duckdb',
    name: 'DuckDB / SQLite Database',
    ext: '.duckdb, .sqlite',
    category: 'tabular',
    categoryLabel: { en: 'Embedded Relational', es: 'Relacional Embebido' },
    badge: 'DuckDB In-Process',
    extractedProps: {
      en: ['Auto-table Discovery & Column Names', 'Primary Keys & Relational Schema', 'Exact Cardinality / Row Counts', 'Zero Server Footprint Inspection'],
      es: ['Detección de Tablas y Esquemas', 'Claves Primarias y Relaciones', 'Cardinalidad Exacta de Registros', 'Inspección sin Desplegar Servidores'],
    },
    snippet: `{\n  "@type": "dcat:Distribution",\n  "dct:format": "application/x-duckdb",\n  "duckdb:tables": ["parcelas_cultivo", "sensores_iot"],\n  "duckdb:totalRecords": 358900,\n  "spdx:checksum": "sha256:3c2b1a..."\n}`,
  },
  {
    id: 'turtle',
    name: 'RDF Turtle & Semantic Graphs',
    ext: '.ttl, .rdf, .jsonld',
    category: 'rdf',
    categoryLabel: { en: 'Semantic Web & Graphs', es: 'Web Semántica y Grafos' },
    badge: 'RDFLib & N3 Parser',
    extractedProps: {
      en: ['Total Triple Count (Subject-Predicate-Object)', 'Ontology Namespace Discovery', 'OWL Class & SKOS Property Parsing', 'DCAT-AP v2 Profile Validation'],
      es: ['Conteo Total de Tripletas', 'Detección de Namespaces Ontológicos', 'Parseo de Clases OWL y Propiedades SKOS', 'Validación del Perfil DCAT-AP v2'],
    },
    snippet: `{\n  "@type": "dcat:Distribution",\n  "dct:format": "text/turtle",\n  "void:triples": 84200,\n  "void:vocabulary": ["http://www.w3.org/ns/dcat#", "http://aims.fao.org/aos/agrovoc/"],\n  "spdx:checksum": "sha256:1a2b3c..."\n}`,
  },
  {
    id: 'tika',
    name: 'Apache Tika Document Engine',
    ext: '.pdf, .docx, .xlsx, .zip',
    category: 'doc',
    categoryLabel: { en: 'Documents & Threat Scan', es: 'Documentos y Seguridad' },
    badge: 'Apache Tika + ClamAV',
    extractedProps: {
      en: ['Dublin Core Metadata (Title, Author, Dates)', 'Embedded Text & Page Count Extraction', 'Zip-Bomb & Magic-Byte Anti-Malware Scan', 'Immutable SHA-256 Checksum Computation'],
      es: ['Metadatos Dublin Core (Título, Autor, Fechas)', 'Extracción de Texto y Número de Páginas', 'Escaneo Anti-Malware y Protección Zip-Bomb', 'Generación de Hash Criptográfico SHA-256'],
    },
    snippet: `{\n  "@type": "dcat:Distribution",\n  "dct:format": "application/pdf",\n  "dct:title": "Informe de Monitorización Agraria 2024",\n  "dct:creator": "IFAPA Junta de Andalucía",\n  "tika:pageCount": 48,\n  "security:threatLevel": "CLEAN_0_DETECTIONS"\n}`,
  },
];

/* --- ONTOLOGY ENRICHMENT DEMO DATA --- */
interface OntologyConcept {
  id: string;
  name: { en: string; es: string };
  term: string;
  agrovocId: string;
  agrovocUri: string;
  eurovocId: string;
  theme: string;
  themeDesc: { en: string; es: string };
  related: string[];
}

const ONTOLOGY_CONCEPTS: OntologyConcept[] = [
  {
    id: 'olive',
    name: { en: 'Extra Virgin Olive Oil (EVOO)', es: 'Aceite de Oliva Virgen Extra (AOVE)' },
    term: 'aceite de oliva virgen',
    agrovocId: 'c_5348',
    agrovocUri: 'http://aims.fao.org/aos/agrovoc/c_5348',
    eurovocId: 'c_2142 (Vegetable fats and oils)',
    theme: 'AGRI',
    themeDesc: { en: 'Agriculture, Fisheries and Forestry', es: 'Agricultura, Pesca y Silvicultura' },
    related: ['Olea europaea', 'almazara', 'acidez oleica', 'aceituna'],
  },
  {
    id: 'wheat',
    name: { en: 'Durum Wheat & Cereal Yield', es: 'Trigo Duro y Rendimiento Cereal' },
    term: 'trigo duro secano',
    agrovocId: 'c_7951',
    agrovocUri: 'http://aims.fao.org/aos/agrovoc/c_7951',
    eurovocId: 'c_3211 (Cereals)',
    theme: 'AGRI',
    themeDesc: { en: 'Agriculture, Fisheries and Forestry', es: 'Agricultura, Pesca y Silvicultura' },
    related: ['Triticum durum', 'rendimiento de grano', 'proteína bruta', 'secano'],
  },
  {
    id: 'irrigation',
    name: { en: 'Deficit Irrigation & Soil Moisture', es: 'Riego Deficitario y Humedad del Suelo' },
    term: 'riego deficitario controlado',
    agrovocId: 'c_2206',
    agrovocUri: 'http://aims.fao.org/aos/agrovoc/c_2206',
    eurovocId: 'c_561 (Water management)',
    theme: 'ENVI',
    themeDesc: { en: 'Environment & Natural Resources', es: 'Medio Ambiente y Recursos Naturales' },
    related: ['evapotranspiración', 'estrés hídrico', 'teledetección', 'cuenca Guadalquivir'],
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
  const [extractSubview, setExtractSubview] = useState<ExtractSubview>('formats');
  const [sphereSubview, setSphereSubview] = useState<SphereSubview>('policies');
  const [searchSubview, setSearchSubview] = useState<SearchSubview>('agent');

  // Interactive states: Formats
  const [selectedFormatId, setSelectedFormatId] = useState<string>('geotiff');
  const [formatFilter, setFormatFilter] = useState<'all' | 'geo' | 'tabular' | 'rdf' | 'doc'>('all');

  // Interactive states: Ontology
  const [selectedConceptId, setSelectedConceptId] = useState<string>('olive');

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

  const selectedFormat = FORMAT_MATRIX.find(f => f.id === selectedFormatId) || FORMAT_MATRIX[0];
  const filteredFormats = formatFilter === 'all'
    ? FORMAT_MATRIX
    : FORMAT_MATRIX.filter(f => f.category === formatFilter);

  const selectedConcept = ONTOLOGY_CONCEPTS.find(c => c.id === selectedConceptId) || ONTOLOGY_CONCEPTS[0];
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
                  ? 'Inspects 30+ scientific formats and produces validated DCAT-AP JSON-LD enriched with AGROVOC ontologies.'
                  : 'Inspecciona +30 formatos científicos y genera JSON-LD validado conforme a DCAT-AP y ontologías AGROVOC.'}
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
                  className={`dse-subnav-pill ${extractSubview === 'formats' ? 'active' : ''}`}
                  onClick={() => setExtractSubview('formats')}
                >
                  <FiDatabase size={12} />
                  <span>{lang === 'en' ? '30+ Formats Matrix' : 'Matriz de +30 Formatos'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${extractSubview === 'ontology' ? 'active' : ''}`}
                  onClick={() => setExtractSubview('ontology')}
                >
                  <FiGlobe size={12} />
                  <span>{lang === 'en' ? 'AGROVOC / EuroVoc Ontologies' : 'Ontologías AGROVOC / EuroVoc'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${extractSubview === 'topology' ? 'active' : ''}`}
                  onClick={() => setExtractSubview('topology')}
                >
                  <FiCpu size={12} />
                  <span>{lang === 'en' ? 'Containers & Code Modules' : 'Topología y Módulos de Código'}</span>
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
                  <span>{lang === 'en' ? 'Sovereign Mesh & EDC' : 'Malla Soberana y Conector EDC'}</span>
                </button>
                <button
                  type="button"
                  className={`dse-subnav-pill ${sphereSubview === 'topology' ? 'active' : ''}`}
                  onClick={() => setSphereSubview('topology')}
                >
                  <FiCpu size={12} />
                  <span>{lang === 'en' ? 'K8s Cluster & Code Modules' : 'Clúster K8s y Módulos de Código'}</span>
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
                  <span>{lang === 'en' ? 'Pydantic AI Agent Simulator' : 'Simulador de Agente Pydantic AI'}</span>
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
                  className={`dse-subnav-pill ${searchSubview === 'topology' ? 'active' : ''}`}
                  onClick={() => setSearchSubview('topology')}
                >
                  <FiCpu size={12} />
                  <span>{lang === 'en' ? 'Multi-Engine & Code Modules' : 'Topología y Módulos de Código'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUBVIEW CONTENT PANELS                                         */}
        {/* ============================================================== */}

        {/* -------------------------------------------------------------- */}
        {/* REPO 1: METADATAXTRACT SUBVIEWS                                */}
        {/* -------------------------------------------------------------- */}
        {activeRepo === 'extract' && extractSubview === 'formats' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>{lang === 'en' ? 'Deterministic Extraction Across 30+ Scientific Formats' : 'Extracción Determinista de +30 Formatos Científicos'}</h4>
                <p>{lang === 'en'
                  ? 'MetaDataXtract inspects raw file structures without uploading data to external LLMs. Click any format to see properties extracted directly into DCAT-AP JSON-LD:'
                  : 'MetaDataXtract inspecciona la estructura binaria del archivo sin enviarlo a LLMs externos ni filtrar datos privados. Selecciona un formato para ver los campos extraídos:'}
                </p>
              </div>

              {/* Filters */}
              <div className="dse-filter-group">
                <button
                  type="button"
                  className={`dse-filter-btn ${formatFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setFormatFilter('all')}
                >
                  {lang === 'en' ? 'All Formats' : 'Todos'}
                </button>
                <button
                  type="button"
                  className={`dse-filter-btn ${formatFilter === 'geo' ? 'active' : ''}`}
                  onClick={() => setFormatFilter('geo')}
                >
                  {lang === 'en' ? 'Geospatial & Raster' : 'Geoespacial / Ráster'}
                </button>
                <button
                  type="button"
                  className={`dse-filter-btn ${formatFilter === 'tabular' ? 'active' : ''}`}
                  onClick={() => setFormatFilter('tabular')}
                >
                  {lang === 'en' ? 'Tabular & Parquet' : 'Tabular / Columnar'}
                </button>
                <button
                  type="button"
                  className={`dse-filter-btn ${formatFilter === 'rdf' ? 'active' : ''}`}
                  onClick={() => setFormatFilter('rdf')}
                >
                  RDF / Semantic
                </button>
                <button
                  type="button"
                  className={`dse-filter-btn ${formatFilter === 'doc' ? 'active' : ''}`}
                  onClick={() => setFormatFilter('doc')}
                >
                  {lang === 'en' ? 'Documents & Security' : 'Docs & Seguridad'}
                </button>
              </div>
            </div>

            {/* Matrix Dual Split */}
            <div className="dse-feature-grid">
              {/* Left format cards */}
              <div className="dse-format-cards">
                {filteredFormats.map(fmt => (
                  <button
                    type="button"
                    key={fmt.id}
                    className={`dse-format-card ${selectedFormatId === fmt.id ? 'active' : ''}`}
                    onClick={() => setSelectedFormatId(fmt.id)}
                  >
                    <div className="dse-format-card__top">
                      <span className="dse-format-ext">{fmt.ext}</span>
                      <span className="dse-format-badge">{fmt.badge}</span>
                    </div>
                    <strong className="dse-format-title">{fmt.name}</strong>
                    <ul className="dse-format-props-list">
                      {fmt.extractedProps[lang].map((prop, i) => (
                        <li key={i}><FiCheck className="check-icon" /> {prop}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {/* Right JSON-LD Live Preview */}
              <div className="dse-json-preview">
                <div className="dse-json-preview__head">
                  <span className="dse-json-preview__tag">
                    <FiCode /> {lang === 'en' ? 'DCAT-AP v2.0 JSON-LD Distribution Output' : 'Salida JSON-LD conforme a DCAT-AP v2.0'}
                  </span>
                  <span className="dse-json-preview__file">{selectedFormat.ext}</span>
                </div>
                <pre className="dse-json-code">
                  <code>{selectedFormat.snippet}</code>
                </pre>
                <div className="dse-json-preview__footer">
                  <span className="dse-security-pill">
                    <FiShield size={12} /> {lang === 'en' ? 'SHA-256 Verified · Zero Raw Data Disclosure' : 'SHA-256 Verificado · Cero Exposición del Dato Crudo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRepo === 'extract' && extractSubview === 'ontology' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>{lang === 'en' ? 'Autonomous Ontological Enrichment (AGROVOC, EuroVoc & UNE 0087:2025)' : 'Enriquecimiento Ontológico Autónomo (AGROVOC, EuroVoc y UNE 0087:2025)'}</h4>
                <p>{lang === 'en'
                  ? 'Datasets published without standard ontologies become dark data. MetaDataXtract queries European authority SPARQL endpoints with high-speed in-memory caching to bind raw terms to persistent semantic URIs:'
                  : 'Los datasets publicados con texto libre sin ontologías son imposibles de encontrar federadamente. MetaDataXtract consulta endpoints SPARQL de la FAO y de la UE con caché en Fastify para enlazar conceptos a URIs persistentes:'}
                </p>
              </div>
            </div>

            {/* Concept Selector Buttons */}
            <div className="dse-concept-selector">
              {ONTOLOGY_CONCEPTS.map(c => (
                <button
                  type="button"
                  key={c.id}
                  className={`dse-concept-btn ${selectedConceptId === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedConceptId(c.id)}
                >
                  <span className="concept-term">"{c.term}"</span>
                  <strong className="concept-label">{c.name[lang]}</strong>
                </button>
              ))}
            </div>

            {/* Pipeline Visual Flow */}
            <div className="dse-pipeline-flow-box">
              <div className="dse-pipeline-step">
                <span className="flow-step-badge">{lang === 'en' ? '1. Free Text Input' : '1. Término del Publicador'}</span>
                <div className="flow-card">
                  <code>"{selectedConcept.term}"</code>
                  <small>{lang === 'en' ? 'Extracted from file header or metadata form' : 'Extraído de cabecera o formulario'}</small>
                </div>
              </div>

              <div className="dse-pipeline-arrow">→</div>

              <div className="dse-pipeline-step">
                <span className="flow-step-badge">{lang === 'en' ? '2. SPARQL Cache & Lookup' : '2. Resolución SPARQL en Fastify'}</span>
                <div className="flow-card highlight">
                  <span className="flow-highlight-tag">Fastify Cache (&lt;15ms)</span>
                  <code>PREFIX skos: &lt;...&gt;</code>
                  <code>SELECT ?concept ?label ...</code>
                </div>
              </div>

              <div className="dse-pipeline-arrow">→</div>

              <div className="dse-pipeline-step">
                <span className="flow-step-badge">{lang === 'en' ? '3. Resolved Authority URIs' : '3. Concepto Oficial FAO / UE'}</span>
                <div className="flow-card authority">
                  <div className="auth-row">
                    <span className="auth-name">FAO AGROVOC:</span>
                    <a href={selectedConcept.agrovocUri} target="_blank" rel="noopener noreferrer">
                      {selectedConcept.agrovocId} <FiExternalLink size={10} />
                    </a>
                  </div>
                  <div className="auth-row">
                    <span className="auth-name">EuroVoc:</span>
                    <span>{selectedConcept.eurovocId}</span>
                  </div>
                  <div className="auth-row">
                    <span className="auth-name">EU Data Theme:</span>
                    <span className="theme-pill">{selectedConcept.theme} - {selectedConcept.themeDesc[lang]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Terms Cloud */}
            <div className="dse-related-box">
              <span className="related-title">{lang === 'en' ? 'Semantic Synonyms & Graph Expansion:' : 'Sinónimos Semánticos y Expansión en Grafo:'}</span>
              <div className="related-tags">
                {selectedConcept.related.map(r => (
                  <span className="related-chip" key={r}>+ {r}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* REPO 2: ÁGORA DATA SPHERE SUBVIEWS                             */}
        {/* -------------------------------------------------------------- */}
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
                {/* 1. Purpose */}
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

                {/* 2. Geographic Boundary */}
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

                {/* 3. Validity */}
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

                {/* 4. Non-Derivative clause */}
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

        {/* -------------------------------------------------------------- */}
        {/* REPO 3: METADATASEARCHTOOL SUBVIEWS                            */}
        {/* -------------------------------------------------------------- */}
        {activeRepo === 'search' && searchSubview === 'agent' && (
          <div className="dse-feature-view">
            <div className="dse-feature-header">
              <div>
                <h4>{lang === 'en' ? 'Pydantic AI Conversational Agent with Catalog Function Calling' : 'Simulador de Agente Pydantic AI con Llamadas a Herramientas de Catálogo'}</h4>
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
                <span className="terminal-title">pydantic_ai_agent_runtime.log</span>
              </div>

              <div className="dse-terminal-body">
                {/* 1. User Message */}
                <div className="log-entry user">
                  <span className="log-prefix">USER:</span>
                  <span className="log-text">"{activeAgentScenario.query[lang]}"</span>
                </div>

                {/* 2. Agent Reasoning */}
                <div className="log-entry thought">
                  <span className="log-prefix">THOUGHT:</span>
                  <span className="log-text">{activeAgentScenario.thought[lang]}</span>
                </div>

                {/* 3. Tool Call */}
                <div className="log-entry tool">
                  <span className="log-prefix">TOOL CALL:</span>
                  <code>{activeAgentScenario.toolCall}</code>
                </div>

                {/* 4. RRF Rank */}
                <div className="log-entry rank">
                  <span className="log-prefix">RRF FUSION:</span>
                  <span className="log-badge">{activeAgentScenario.rrfScore}</span>
                </div>

                {/* 5. Final Synthesized Answer */}
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

            {/* RRF Formula Callout */}
            <div className="dse-rrf-formula-box">
              <span className="formula-tag">Algoritmo Reciprocal Rank Fusion (k = 60)</span>
              <code className="formula-math">RRF(d) = ∑ [ 1 / (60 + r_lexical(d)) ] + ∑ [ 1 / (60 + r_vector(d)) ]</code>
            </div>

            {/* RRF Comparison Table */}
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

        {/* -------------------------------------------------------------- */}
        {/* COMMON SUBVIEW: TOPOLOGY & CODE MODULE EXPLORER                 */}
        {/* -------------------------------------------------------------- */}
        {((activeRepo === 'extract' && extractSubview === 'topology') ||
          (activeRepo === 'sphere' && sphereSubview === 'topology') ||
          (activeRepo === 'search' && searchSubview === 'topology')) && (
          <div className="dse-repo-grid">
            {/* LEFT: FILE & MODULE EXPLORER */}
            <div className="dse-tree-pane">
              <div className="dse-tree-pane__header">
                <span>{lang === 'en' ? 'Repository Modules' : 'Módulos del Repositorio'}</span>
                <span>{currentRepo.tree.length} {lang === 'en' ? 'entries' : 'componentes'}</span>
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

            {/* RIGHT: NATIVE ARCHITECTURE DIAGRAM & MODULE DETAILS */}
            <div className="dse-arch-pane">
              {/* ARCHITECTURE DIAGRAM FROM ARCHITECTURE.MD */}
              <div className="dse-arch-box">
                <div className="dse-arch-box__title-row">
                  <h4 className="dse-arch-box__title">
                    <FiCpu /> {lang === 'en' ? `${currentRepo.name} Container Topology` : `Topología de Contenedores (${currentRepo.name})`}
                  </h4>
                </div>

                {/* RENDER SPECIFIC ARCHITECTURE DIAGRAM PER REPO */}
                <div className="dse-arch-svg-wrap">
                  {activeRepo === 'extract' && (
                    <svg className="dse-arch-svg" viewBox="0 0 680 220" fill="none">
                      <rect x="0" y="0" width="680" height="220" rx="10" fill="#0b1220" stroke="rgba(56, 189, 248, 0.15)" />

                      <rect x="20" y="85" width="105" height="50" rx="8" fill="#15233b" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="72" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Data Publisher</text>
                      <text x="72" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">30+ Formats</text>

                      <line x1="125" y1="110" x2="165" y2="110" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                      <rect x="165" y="85" width="115" height="50" rx="8" fill="#15233b" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="222" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Next.js Web</text>
                      <text x="222" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">:3001 Form State</text>

                      <line x1="280" y1="100" x2="330" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
                      <line x1="280" y1="120" x2="330" y2="160" stroke="#38bdf8" strokeWidth="1.5" />

                      <rect x="330" y="35" width="135" height="50" rx="8" fill="#15233b" stroke="#10b981" strokeWidth="1.5" />
                      <text x="397" y="56" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Metadata Extractor</text>
                      <text x="397" y="72" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">:8002 Multi-Parsers</text>

                      <rect x="330" y="135" width="135" height="50" rx="8" fill="#15233b" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="397" y="156" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">API Core & Auth</text>
                      <text x="397" y="172" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">:8003 Schema v2.0</text>

                      <line x1="465" y1="50" x2="515" y2="30" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" />
                      <line x1="465" y1="70" x2="515" y2="90" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" />

                      <rect x="515" y="15" width="145" height="35" rx="6" fill="#111c2e" stroke="rgba(16, 185, 129, 0.4)" />
                      <text x="587" y="36" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Apache Tika :9998</text>

                      <rect x="515" y="75" width="145" height="42" rx="6" fill="#111c2e" stroke="rgba(56, 189, 248, 0.5)" />
                      <text x="587" y="93" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Vocab API (SPARQL)</text>
                      <text x="587" y="107" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">AGROVOC · EuroVoc</text>

                      <line x1="465" y1="160" x2="515" y2="160" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                      <rect x="515" y="140" width="145" height="42" rx="6" fill="#111c2e" stroke="rgba(245, 158, 11, 0.5)" />
                      <text x="587" y="158" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">MongoDB + MariaDB</text>
                      <text x="587" y="172" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">Credentials & DCAT-AP</text>
                    </svg>
                  )}

                  {activeRepo === 'sphere' && (
                    <svg className="dse-arch-svg" viewBox="0 0 680 220" fill="none">
                      <rect x="0" y="0" width="680" height="220" rx="10" fill="#0b1220" stroke="rgba(16, 185, 129, 0.18)" />

                      <rect x="20" y="45" width="125" height="50" rx="8" fill="#15233b" stroke="#10b981" strokeWidth="1.5" />
                      <text x="82" y="66" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Data Provider</text>
                      <text x="82" y="82" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Offers & Datasets</text>

                      <rect x="20" y="125" width="125" height="50" rx="8" fill="#15233b" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="82" y="146" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Data Consumer</text>
                      <text x="82" y="162" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Catalog & Requests</text>

                      <line x1="145" y1="70" x2="200" y2="95" stroke="#10b981" strokeWidth="1.5" />
                      <line x1="145" y1="150" x2="200" y2="125" stroke="#38bdf8" strokeWidth="1.5" />

                      <rect x="200" y="75" width="160" height="70" rx="8" fill="#15233b" stroke="#10b981" strokeWidth="1.5" />
                      <text x="280" y="98" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">ÁGORA Data Sphere</text>
                      <text x="280" y="114" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">Bilateral Contracts</text>
                      <text x="280" y="128" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">ODRL Policy Engine</text>

                      <line x1="360" y1="110" x2="410" y2="110" stroke="#10b981" strokeWidth="1.5" />

                      <rect x="410" y="85" width="115" height="50" rx="8" fill="#15233b" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="467" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">EDC Connector</text>
                      <text x="467" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Peer-to-Peer Transfer</text>

                      <line x1="525" y1="110" x2="565" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />

                      <rect x="565" y="65" width="100" height="90" rx="8" fill="#111c2e" stroke="rgba(16, 185, 129, 0.4)" />
                      <text x="615" y="95" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="600" textAnchor="middle">Kubernetes</text>
                      <text x="615" y="110" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">UMA Cluster</text>
                      <text x="615" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">HA Replicas</text>
                      <text x="615" y="140" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">NGINX Ingress</text>
                    </svg>
                  )}

                  {activeRepo === 'search' && (
                    <svg className="dse-arch-svg" viewBox="0 0 680 220" fill="none">
                      <rect x="0" y="0" width="680" height="220" rx="10" fill="#0b1220" stroke="rgba(168, 85, 247, 0.18)" />

                      <rect x="20" y="85" width="95" height="50" rx="8" fill="#15233b" stroke="#a855f7" strokeWidth="1.5" />
                      <text x="67" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Browser UI</text>
                      <text x="67" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Multimodal</text>

                      <line x1="115" y1="110" x2="155" y2="110" stroke="#a855f7" strokeWidth="1.5" />

                      <rect x="155" y="85" width="115" height="50" rx="8" fill="#15233b" stroke="#a855f7" strokeWidth="1.5" />
                      <text x="212" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Next.js 16</text>
                      <text x="212" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">2D/3D Force Graph</text>

                      <line x1="270" y1="110" x2="310" y2="110" stroke="#a855f7" strokeWidth="1.5" />

                      <rect x="310" y="75" width="130" height="70" rx="8" fill="#15233b" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="375" y="98" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">FastAPI Core</text>
                      <text x="375" y="114" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="middle">RRF Hybrid Router</text>
                      <text x="375" y="128" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Pydantic AI Agent</text>

                      <line x1="440" y1="90" x2="490" y2="45" stroke="#f59e0b" strokeWidth="1.2" />
                      <line x1="440" y1="110" x2="490" y2="110" stroke="#f59e0b" strokeWidth="1.2" />
                      <line x1="440" y1="130" x2="490" y2="175" stroke="#f59e0b" strokeWidth="1.2" />

                      <rect x="490" y="25" width="170" height="40" rx="6" fill="#111c2e" stroke="rgba(16, 185, 129, 0.5)" />
                      <text x="575" y="44" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Elasticsearch 8.14</text>
                      <text x="575" y="57" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">BM25 Lexical · Faceted Stats</text>

                      <rect x="490" y="90" width="170" height="40" rx="6" fill="#111c2e" stroke="rgba(168, 85, 247, 0.5)" />
                      <text x="575" y="109" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Qdrant Vector DB 1.15</text>
                      <text x="575" y="122" fill="#a855f7" fontSize="8" fontFamily="monospace" textAnchor="middle">Cosine Sim · mpnet Embeddings</text>

                      <rect x="490" y="155" width="170" height="40" rx="6" fill="#111c2e" stroke="rgba(56, 189, 248, 0.5)" />
                      <text x="575" y="174" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">MongoDB (Catalog)</text>
                      <text x="575" y="187" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Authoritative Truth & Sync</text>
                    </svg>
                  )}
                </div>
              </div>

              {/* SELECTED MODULE INSPECTOR CARD */}
              <div className="dse-module-inspector">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
