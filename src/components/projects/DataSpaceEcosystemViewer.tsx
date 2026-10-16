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
} from 'react-icons/fi';
import './DataSpaceEcosystemViewer.css';

type RepoKey = 'extract' | 'search' | 'sphere';

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
    name: 'MetaDataXtract',
    repoBadge: {
      en: 'Independent Research Line · Paper in Preparation · v1.5.0',
      es: 'Línea de Investigación · Manuscrito Científico en Preparación · v1.5.0',
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
  search: {
    key: 'search',
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
  sphere: {
    key: 'sphere',
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
};

export const DataSpaceEcosystemViewer: React.FC = () => {
  const { lang } = useLanguage();
  const [activeRepo, setActiveRepo] = useState<RepoKey>('extract');
  const [selectedFileId, setSelectedFileId] = useState<string>(REPOS_DATA.extract.defaultItem);

  const currentRepo = REPOS_DATA[activeRepo];
  const activeTreeItem = currentRepo.tree.find(item => item.id === selectedFileId) || currentRepo.tree[0];

  const handleSelectRepo = (key: RepoKey) => {
    setActiveRepo(key);
    setSelectedFileId(REPOS_DATA[key].defaultItem);
  };

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
                <div className="dse-macro-node__icon-wrap extract"><FiShield /></div>
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
                <div className="dse-macro-node__icon-wrap sphere"><FiGlobe /></div>
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
        {/* REPO SELECTOR NAV */}
        <div className="dse-repo-nav">
          <button
            type="button"
            className={`dse-repo-tab ${activeRepo === 'extract' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('extract')}
          >
            <span className="dse-repo-tab__dot" />
            <span>KhaosResearch/MetaDataXtract</span>
          </button>
          <button
            type="button"
            className={`dse-repo-tab ${activeRepo === 'search' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('search')}
          >
            <span className="dse-repo-tab__dot" />
            <span>KhaosResearch/metadataSearchTool</span>
          </button>
          <button
            type="button"
            className={`dse-repo-tab ${activeRepo === 'sphere' ? 'active' : ''}`}
            onClick={() => handleSelectRepo('sphere')}
          >
            <span className="dse-repo-tab__dot" />
            <span>ÁGORA Data Sphere (EDAAN)</span>
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

        {/* DUAL WORKSPACE: INTERACTIVE TREE + REPO ARCHITECTURE DIAGRAM */}
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
                    {/* Background Grid Accent */}
                    <rect x="0" y="0" width="680" height="220" rx="10" fill="#0b1220" stroke="rgba(56, 189, 248, 0.15)" />

                    {/* Nodes */}
                    {/* Publisher */}
                    <rect x="20" y="85" width="105" height="50" rx="8" fill="#15233b" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="72" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Data Publisher</text>
                    <text x="72" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">30+ Formats</text>

                    {/* Arrow 1 */}
                    <line x1="125" y1="110" x2="165" y2="110" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Next.js Frontend */}
                    <rect x="165" y="85" width="115" height="50" rx="8" fill="#15233b" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="222" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Next.js Web</text>
                    <text x="222" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">:3001 Form State</text>

                    {/* Arrows from Web to Extractor and Core */}
                    <line x1="280" y1="100" x2="330" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1="280" y1="120" x2="330" y2="160" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Metadata Extractor */}
                    <rect x="330" y="35" width="135" height="50" rx="8" fill="#15233b" stroke="#10b981" strokeWidth="1.5" />
                    <text x="397" y="56" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Metadata Extractor</text>
                    <text x="397" y="72" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">:8002 Multi-Parsers</text>

                    {/* API Core */}
                    <rect x="330" y="135" width="135" height="50" rx="8" fill="#15233b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="397" y="156" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">API Core & Auth</text>
                    <text x="397" y="172" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">:8003 Schema v2.0</text>

                    {/* Extractor to Tika & Vocab */}
                    <line x1="465" y1="50" x2="515" y2="30" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" />
                    <line x1="465" y1="70" x2="515" y2="90" stroke="#10b981" strokeWidth="1.2" strokeDasharray="2 2" />

                    {/* Apache Tika */}
                    <rect x="515" y="15" width="145" height="35" rx="6" fill="#111c2e" stroke="rgba(16, 185, 129, 0.4)" />
                    <text x="587" y="36" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Apache Tika :9998</text>

                    {/* Vocab API SPARQL */}
                    <rect x="515" y="75" width="145" height="42" rx="6" fill="#111c2e" stroke="rgba(56, 189, 248, 0.5)" />
                    <text x="587" y="93" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Vocab API (SPARQL)</text>
                    <text x="587" y="107" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">AGROVOC · EuroVoc</text>

                    {/* API Core to MongoDB / MariaDB */}
                    <line x1="465" y1="160" x2="515" y2="160" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                    <rect x="515" y="140" width="145" height="42" rx="6" fill="#111c2e" stroke="rgba(245, 158, 11, 0.5)" />
                    <text x="587" y="158" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">MongoDB + MariaDB</text>
                    <text x="587" y="172" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">Credentials & DCAT-AP</text>
                  </svg>
                )}

                {activeRepo === 'search' && (
                  <svg className="dse-arch-svg" viewBox="0 0 680 220" fill="none">
                    <rect x="0" y="0" width="680" height="220" rx="10" fill="#0b1220" stroke="rgba(168, 85, 247, 0.18)" />

                    {/* Browser / User */}
                    <rect x="20" y="85" width="95" height="50" rx="8" fill="#15233b" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="67" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Browser UI</text>
                    <text x="67" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Multimodal</text>

                    {/* Arrow */}
                    <line x1="115" y1="110" x2="155" y2="110" stroke="#a855f7" strokeWidth="1.5" />

                    {/* Next.js Frontend */}
                    <rect x="155" y="85" width="115" height="50" rx="8" fill="#15233b" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="212" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Next.js 16</text>
                    <text x="212" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">2D/3D Force Graph</text>

                    {/* Arrow */}
                    <line x1="270" y1="110" x2="310" y2="110" stroke="#a855f7" strokeWidth="1.5" />

                    {/* FastAPI Backend */}
                    <rect x="310" y="75" width="130" height="70" rx="8" fill="#15233b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="375" y="98" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">FastAPI Core</text>
                    <text x="375" y="114" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="middle">RRF Hybrid Router</text>
                    <text x="375" y="128" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">Pydantic AI Agent</text>

                    {/* Backend branching to search engines */}
                    <line x1="440" y1="90" x2="490" y2="45" stroke="#f59e0b" strokeWidth="1.2" />
                    <line x1="440" y1="110" x2="490" y2="110" stroke="#f59e0b" strokeWidth="1.2" />
                    <line x1="440" y1="130" x2="490" y2="175" stroke="#f59e0b" strokeWidth="1.2" />

                    {/* Elasticsearch */}
                    <rect x="490" y="25" width="170" height="40" rx="6" fill="#111c2e" stroke="rgba(16, 185, 129, 0.5)" />
                    <text x="575" y="44" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Elasticsearch 8.14</text>
                    <text x="575" y="57" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">BM25 Lexical · Faceted Stats</text>

                    {/* Qdrant Vectors */}
                    <rect x="490" y="90" width="170" height="40" rx="6" fill="#111c2e" stroke="rgba(168, 85, 247, 0.5)" />
                    <text x="575" y="109" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Qdrant Vector DB 1.15</text>
                    <text x="575" y="122" fill="#a855f7" fontSize="8" fontFamily="monospace" textAnchor="middle">Cosine Sim · mpnet Embeddings</text>

                    {/* MongoDB Source of Truth */}
                    <rect x="490" y="155" width="170" height="40" rx="6" fill="#111c2e" stroke="rgba(56, 189, 248, 0.5)" />
                    <text x="575" y="174" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">MongoDB (Catalog)</text>
                    <text x="575" y="187" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Authoritative Truth & Sync</text>
                  </svg>
                )}

                {activeRepo === 'sphere' && (
                  <svg className="dse-arch-svg" viewBox="0 0 680 220" fill="none">
                    <rect x="0" y="0" width="680" height="220" rx="10" fill="#0b1220" stroke="rgba(16, 185, 129, 0.18)" />

                    {/* Participant Provider */}
                    <rect x="20" y="45" width="125" height="50" rx="8" fill="#15233b" stroke="#10b981" strokeWidth="1.5" />
                    <text x="82" y="66" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Data Provider</text>
                    <text x="82" y="82" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Offers & Datasets</text>

                    {/* Participant Consumer */}
                    <rect x="20" y="125" width="125" height="50" rx="8" fill="#15233b" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="82" y="146" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">Data Consumer</text>
                    <text x="82" y="162" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Catalog & Requests</text>

                    {/* Connecting arrows into Gateway */}
                    <line x1="145" y1="70" x2="200" y2="95" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="145" y1="150" x2="200" y2="125" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* ÁGORA Data Sphere Portal */}
                    <rect x="200" y="75" width="160" height="70" rx="8" fill="#15233b" stroke="#10b981" strokeWidth="1.5" />
                    <text x="280" y="98" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">ÁGORA Data Sphere</text>
                    <text x="280" y="114" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">Bilateral Contracts</text>
                    <text x="280" y="128" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">ODRL Policy Engine</text>

                    {/* Gateway into Connector Bridge */}
                    <line x1="360" y1="110" x2="410" y2="110" stroke="#10b981" strokeWidth="1.5" />

                    {/* EDC / ÁGORA Connector Bridge */}
                    <rect x="410" y="85" width="115" height="50" rx="8" fill="#15233b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="467" y="106" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">EDC Connector</text>
                    <text x="467" y="122" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Peer-to-Peer Transfer</text>

                    {/* Connector to Kubernetes Host */}
                    <line x1="525" y1="110" x2="565" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Kubernetes UMA Cluster */}
                    <rect x="565" y="65" width="100" height="90" rx="8" fill="#111c2e" stroke="rgba(16, 185, 129, 0.4)" />
                    <text x="615" y="95" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="600" textAnchor="middle">Kubernetes</text>
                    <text x="615" y="110" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">UMA Cluster</text>
                    <text x="615" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">HA Replicas</text>
                    <text x="615" y="140" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">NGINX Ingress</text>
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
      </div>
    </div>
  );
};
