import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  FiLayers,
  FiShield,
  FiFileText,
  FiSearch,
  FiCpu,
  FiShare2,
  FiServer,
  FiGlobe,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import './DataSpaceArchitectureFlow.css';

interface NodeDetail {
  id: string;
  name: { en: string; es: string };
  role: { en: string; es: string };
  tech: string[];
  specs: { en: string; es: string };
  flow: { en: string; es: string };
}

const NODES: Record<string, NodeDetail> = {
  input_files: {
    id: 'input_files',
    name: { en: 'Multi-Format Ingestion', es: 'Ingesta Multi-Formato' },
    role: { en: 'Deterministic File Inspection', es: 'Inspección de Archivos Agnóstica' },
    tech: ['GeoTIFF', 'NetCDF', 'Parquet', 'HDF5', 'CSV/Excel', 'DuckDB', 'TTL/RDF'],
    specs: {
      en: 'Parses structure across 30+ scientific and tabular formats without mandatory LLM dependency. Fast header extraction and schema deduction.',
      es: 'Extrae estructura en más de 30 formatos científicos y tabulares sin depender obligatoriamente de LLMs. Deducción rápida de cabeceras y esquemas.',
    },
    flow: {
      en: 'Receives local or remote files from the data publisher, applies memory bounds, and routes to registered format handlers.',
      es: 'Recibe archivos locales o remotos del proveedor de datos, limita consumo de memoria y enruta al handler especializado.',
    },
  },
  security_pipeline: {
    id: 'security_pipeline',
    name: { en: 'Security & Anti-Malware Pipeline', es: 'Pipeline de Seguridad e Integridad' },
    role: { en: 'Threat Inspection & Hashing', es: 'Verificación Antivirus y Hashes' },
    tech: ['SHA-256', 'Magic Bytes', '70+ AV Engines', 'Path Traversal Guard'],
    specs: {
      en: 'Multi-layer file sanitation inspired by VirusTotal: detects malicious payloads, archive zip-bombs, path traversal exploits, and computes immutable SHA-256 fingerprints.',
      es: 'Sanitización multinivel inspirada en VirusTotal: detecta payloads maliciosos, zip-bombs, ataques de path traversal y emite huellas digitales SHA-256.',
    },
    flow: {
      en: 'Acts as the gatekeeper before any extraction begins, ensuring datasets are safe to catalog within the data space.',
      es: 'Actúa como barrera previa a la extracción, garantizando que ningún dataset corrupto o malicioso ingrese al catálogo.',
    },
  },
  semantic_enrichment: {
    id: 'semantic_enrichment',
    name: { en: 'Semantic Enrichment & JSON-LD', es: 'Enriquecimiento Semántico & JSON-LD' },
    role: { en: 'Ontological Alignment & LLM', es: 'Alineación Ontológica y Salida Estricta' },
    tech: ['DCAT-AP v2.0', 'UNE 0087:2025', 'AGROVOC', 'EuroVoc', 'Apache Tika', 'LLM Suggestions'],
    specs: {
      en: 'Maps domain concepts against SPARQL authority endpoints (EU Publications Office, FAO AGROVOC). Uses LLMs for narrative summaries while guaranteeing strict schema v2.0 validation.',
      es: 'Vincula conceptos del dataset con endpoints ontológicos oficiales (Oficina de Publicaciones UE, AGROVOC de FAO). Genera resúmenes asistidos por LLM bajo validación estricta v2.0.',
    },
    flow: {
      en: 'Transforms raw technical fields into interoperable JSON-LD ready for federated exchange without disclosing sensitive data.',
      es: 'Convierte los metadatos técnicos en JSON-LD interoperable listo para federación sin exponer el dato privado subyacente.',
    },
  },
  hybrid_search: {
    id: 'hybrid_search',
    name: { en: 'Hybrid Discovery Engine', es: 'Motor de Búsqueda Híbrida RRF' },
    role: { en: 'BM25 Lexical + Vector Retrieval', es: 'Búsqueda Léxica + Vectorial Semántica' },
    tech: ['Elasticsearch 8.14', 'Qdrant 1.15', 'Sentence Transformers', 'Reciprocal Rank Fusion'],
    specs: {
      en: 'Combines full-text lexical precision in Elasticsearch with cosine similarity over multilingual embeddings (mpnet-base-v2) in Qdrant, unified via RRF ranking.',
      es: 'Combina la precisión léxica de Elasticsearch con similitud coseno sobre embeddings multilingües (mpnet-base-v2) en Qdrant, fusionados mediante algoritmo RRF.',
    },
    flow: {
      en: 'Dynamically routes user search queries based on query intent, returning relevant assets even when exact keywords differ.',
      es: 'Enruta dinámicamente consultas según la intención del usuario, localizando recursos incluso con disparidad terminológica.',
    },
  },
  pydantic_agent: {
    id: 'pydantic_agent',
    name: { en: 'Conversational Catalog Agent', es: 'Agente Conversacional del Catálogo' },
    role: { en: 'Pydantic AI Autonomous Assistant', es: 'Asistencia y Razonamiento Autónomo' },
    tech: ['Pydantic AI', 'Function Calling', 'Context Injection', 'Catalog Tooling'],
    specs: {
      en: 'Maintains contextual conversations, executes live catalog search tools, explains dataset schemas, and guides consumers toward suitable datasets and data applications.',
      es: 'Mantiene sesiones contextuales, ejecuta herramientas en vivo sobre el catálogo, explica esquemas y guía a los consumidores hacia los datos y apps adecuadas.',
    },
    flow: {
      en: 'Interprets natural language inquiries, invokes search endpoints autonomously, and synthesizes structured recommendations with citations.',
      es: 'Interpreta dudas en lenguaje natural, consulta los endpoints del broker y sintetiza recomendaciones citando los datasets exactos.',
    },
  },
  knowledge_graph: {
    id: 'knowledge_graph',
    name: { en: 'Knowledge Graph Visualization', es: 'Visualización de Grafo de Conocimiento' },
    role: { en: '2D/3D Data Lineage & Relations', es: 'Linaje y Conexiones Multidimensionales' },
    tech: ['2D/3D Force Graph', 'MongoDB Graph Projections', 'Data Asset & App Linking'],
    specs: {
      en: 'Derives relationships from shared ontological tags, publishers, and consuming data applications, rendered in interactive 2D and 3D web views.',
      es: 'Deriva enlaces topológicos entre datasets, entidades proveedoras y aplicaciones de datos (Data Apps), representados en vistas 2D y 3D interactivas.',
    },
    flow: {
      en: 'Allows researchers and data consumers to visually explore asset clusters and understand data provenance before contracting.',
      es: 'Permite a investigadores explorar clústeres temáticos y verificar el linaje de datos antes de iniciar la negociación contractual.',
    },
  },
  agora_datasphere: {
    id: 'agora_datasphere',
    name: { en: 'ÁGORA Data Sphere (EDAAN)', es: 'ÁGORA Data Sphere (EDAAN)' },
    role: { en: 'Sovereign Consumer & Provider Portal', es: 'Portal Soberano de Provisión y Consumo' },
    tech: ['Next.js 16', 'React 19', 'ODRL Policies', 'Data Contracts', 'Bilingual UI'],
    specs: {
      en: 'Official web portal for the Agri-food Data Space of Andalusia. Manages dataset offerings, access policies, bilateral contracts, and data transfers.',
      es: 'Portal web oficial para el Espacio de Datos Agroalimentario de Andalucía. Administra ofertas de datasets, políticas de acceso, contratos y transferencias.',
    },
    flow: {
      en: 'Enables data providers to monetize or federate datasets under strict usage constraints, keeping the physical files secure behind sovereign connectors.',
      es: 'Permite a los participantes federar datos bajo condiciones contractuales estrictas, conservando los archivos físicos bajo control soberano.',
    },
  },
  k8s_infra: {
    id: 'k8s_infra',
    name: { en: 'Resilient Cloud-Native Cluster', es: 'Infraestructura Cloud-Native K8s' },
    role: { en: 'High Availability & Containerization', es: 'Alta Disponibilidad y Despliegue K8s' },
    tech: ['Kubernetes', 'Docker', 'MongoDB ReplicaSet', 'Redis', 'NGINX Ingress'],
    specs: {
      en: 'Microservice mesh orchestrating frontend proxies, FastAPI cores, indexing services, and distributed databases with automatic failover and zero downtime.',
      es: 'Malla de microservicios que orquesta proxies frontend, backends FastAPI, sincronizadores de índices y persistencia con tolerancia a fallos.',
    },
    flow: {
      en: 'Hosts the entire ecosystem within institutional infrastructure at Khaos Research / UMA, guaranteeing elastic scalability and compliance.',
      es: 'Aloja todo el ecosistema en servidores institucionales de Khaos Research / UMA, asegurando escalabilidad y soberanía operativa.',
    },
  },
};

export const DataSpaceArchitectureFlow: React.FC = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'flow' | 'evolution' | 'mermaid'>('flow');
  const [selectedNode, setSelectedNode] = useState<string>('semantic_enrichment');
  const [copied, setCopied] = useState(false);

  const activeNode = NODES[selectedNode] || NODES.semantic_enrichment;

  const mermaidCode = `flowchart TD
    subgraph STAGE1 ["Fase 1: Ingesta & Extracción (MetaDataXtract)"]
        F1[Archivos Heterogéneos\\n30+ Formatos] --> SEC[Pipeline de Seguridad\\nSHA-256 + 70 AVs]
        SEC --> EXT[Extractor Determinista + Tika]
        EXT --> VOC[Alineación Semántica\\nAGROVOC + EuroVoc]
        VOC --> JSONLD[JSON-LD Validado\\nDCAT-AP v2 / UNE 0087:2025]
    end

    subgraph STAGE2 ["Fase 2: Búsqueda Multimodal & IA (MetaDataSearch)"]
        JSONLD --> MONGO[(MongoDB Catalogo)]
        MONGO --> ES[(Elasticsearch 8\\nLéxico BM25)]
        MONGO --> QDR[(Qdrant Vectorial\\nEmbeddings mpnet)]
        ES & QDR --> RRF[Orquestador Híbrido RRF]
        RRF --> AGENT[Agente Autónomo\\nPydantic AI]
        MONGO --> GRAPH[Grafo Relaciones 2D/3D]
    end

    subgraph STAGE3 ["Fase 3: Espacio de Datos Soberano (EDAAN)"]
        AGENT & RRF --> SPHERE[ÁGORA Data Sphere Web]
        SPHERE --> POL[Políticas de Uso & Contratos]
        POL --> K8S[Clúster Kubernetes UMA]
    end`;

  const copyMermaid = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dataspace-arch-console">
      {/* HEADER */}
      <div className="dataspace-arch-console__header">
        <div className="dataspace-arch-console__title-wrap">
          <span className="dataspace-arch-console__badge">
            <FiLayers /> {lang === 'en' ? 'Data Space Architecture & Ecosystem' : 'Ecosistema de Arquitectura de Datos'}
          </span>
          <h3 className="dataspace-arch-console__title">
            {lang === 'en'
              ? 'Federated Data Space: Extraction, Search & Sovereign Exchange'
              : 'Espacio de Datos Federado: Extracción, Búsqueda y Soberanía'}
          </h3>
        </div>

        <div className="dataspace-arch-console__tabs">
          <button
            type="button"
            className={`dataspace-tab-btn ${activeTab === 'flow' ? 'active' : ''}`}
            onClick={() => setActiveTab('flow')}
          >
            {lang === 'en' ? 'Interactive Pipeline' : 'Flujo Interactivo'}
          </button>
          <button
            type="button"
            className={`dataspace-tab-btn ${activeTab === 'evolution' ? 'active' : ''}`}
            onClick={() => setActiveTab('evolution')}
          >
            {lang === 'en' ? 'Evolution Timeline' : 'Evolución del Proyecto'}
          </button>
          <button
            type="button"
            className={`dataspace-tab-btn ${activeTab === 'mermaid' ? 'active' : ''}`}
            onClick={() => setActiveTab('mermaid')}
          >
            {lang === 'en' ? 'Mermaid Diagram' : 'Diagrama Mermaid'}
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE PIPELINE */}
      {activeTab === 'flow' && (
        <div className="dataspace-pipeline-view">
          <div className="dataspace-pipeline-canvas">
            {/* STAGE 1: METADATAXTRACT */}
            <div className="dataspace-stage">
              <span className="dataspace-stage-tag">
                {lang === 'en' ? '01 · Ingestion & Extraction' : '01 · Ingesta y Extracción'}
              </span>
              <div className="dataspace-node-stack">
                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'input_files' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('input_files')}
                >
                  <div className="dataspace-node-icon extract"><FiFileText /></div>
                  <div className="dataspace-node-text">
                    <strong>+30 Formatos</strong>
                    <span>{lang === 'en' ? 'Deterministic parsers' : 'Parsers deterministas'}</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'security_pipeline' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('security_pipeline')}
                >
                  <div className="dataspace-node-icon security"><FiShield /></div>
                  <div className="dataspace-node-text">
                    <strong>Seguridad & AV</strong>
                    <span>SHA-256 · 70+ AVs</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'semantic_enrichment' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('semantic_enrichment')}
                >
                  <div className="dataspace-node-icon vocab"><FiLayers /></div>
                  <div className="dataspace-node-text">
                    <strong>DCAT-AP v2</strong>
                    <span>AGROVOC · JSON-LD</span>
                  </div>
                </button>
              </div>
            </div>

            {/* CONNECTOR 1 -> 2 */}
            <div className="dataspace-pipeline-wire">
              <div className="dataspace-wire-line"><span className="dataspace-wire-pulse" /></div>
              <span className="dataspace-wire-label">JSON-LD Metadata</span>
            </div>

            {/* STAGE 2: METADATASEARCH */}
            <div className="dataspace-stage">
              <span className="dataspace-stage-tag">
                {lang === 'en' ? '02 · Discovery & AI Broker' : '02 · Descubrimiento e IA'}
              </span>
              <div className="dataspace-node-stack">
                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'hybrid_search' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('hybrid_search')}
                >
                  <div className="dataspace-node-icon search"><FiSearch /></div>
                  <div className="dataspace-node-text">
                    <strong>Búsqueda Híbrida</strong>
                    <span>Qdrant + Elastic 8</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'pydantic_agent' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('pydantic_agent')}
                >
                  <div className="dataspace-node-icon agent"><FiCpu /></div>
                  <div className="dataspace-node-text">
                    <strong>Agente Autónomo</strong>
                    <span>Pydantic AI Tools</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'knowledge_graph' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('knowledge_graph')}
                >
                  <div className="dataspace-node-icon graph"><FiShare2 /></div>
                  <div className="dataspace-node-text">
                    <strong>Grafo 2D / 3D</strong>
                    <span>Linaje y Relaciones</span>
                  </div>
                </button>
              </div>
            </div>

            {/* CONNECTOR 2 -> 3 */}
            <div className="dataspace-pipeline-wire">
              <div className="dataspace-wire-line"><span className="dataspace-wire-pulse fast" /></div>
              <span className="dataspace-wire-label">Catalog Navigation</span>
            </div>

            {/* STAGE 3: DATA SPHERE & K8S */}
            <div className="dataspace-stage">
              <span className="dataspace-stage-tag">
                {lang === 'en' ? '03 · Federated Space (EDAAN)' : '03 · Espacio Soberano'}
              </span>
              <div className="dataspace-node-stack">
                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'agora_datasphere' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('agora_datasphere')}
                >
                  <div className="dataspace-node-icon space"><FiGlobe /></div>
                  <div className="dataspace-node-text">
                    <strong>ÁGORA Sphere</strong>
                    <span>{lang === 'en' ? 'Contracts & Offers' : 'Contratos y Ofertas'}</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`dataspace-node ${selectedNode === 'k8s_infra' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('k8s_infra')}
                >
                  <div className="dataspace-node-icon k8s"><FiServer /></div>
                  <div className="dataspace-node-text">
                    <strong>Kubernetes Cluster</strong>
                    <span>HA Cloud-Native</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* INSPECTOR PANEL */}
          <div className="dataspace-inspector">
            <div className="dataspace-inspector__head">
              <div className="dataspace-inspector__title-group">
                <h4>{activeNode.name[lang]}</h4>
                <span className="dataspace-inspector__role">{activeNode.role[lang]}</span>
              </div>
              <div className="dataspace-inspector__tech-tags">
                {activeNode.tech.map(t => (
                  <span className="dataspace-tech-pill" key={t}>{t}</span>
                ))}
              </div>
            </div>

            <div className="dataspace-inspector__body">
              <div className="dataspace-inspector__col">
                <strong>{lang === 'en' ? 'Technical Specifications' : 'Especificaciones Técnicas'}</strong>
                <p>{activeNode.specs[lang]}</p>
              </div>
              <div className="dataspace-inspector__col">
                <strong>{lang === 'en' ? 'Data Space Interaction Flow' : 'Flujo en el Espacio de Datos'}</strong>
                <p>{activeNode.flow[lang]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVOLUTION TIMELINE */}
      {activeTab === 'evolution' && (
        <div className="dataspace-evolution-timeline">
          <div className="dataspace-timeline-item">
            <div className="dataspace-timeline-marker">
              <div className="dataspace-timeline-dot">01</div>
              <div className="dataspace-timeline-line" />
            </div>
            <div className="dataspace-timeline-content">
              <h4>
                {lang === 'en'
                  ? 'The Data Space Bottleneck: Describing Without Disclosing'
                  : 'El Cuello de Botella: Describir el Dato sin Entregarlo'}
              </h4>
              <p>
                {lang === 'en'
                  ? 'In open repositories like Zenodo or Kaggle, poorly documented datasets cause confusion. In federated data spaces, the problem is critical: data providers must document schemas, temporal coverage, and licenses upfront to negotiate contracts without exposing raw data before authorization.'
                  : 'En portales abiertos como Zenodo o Kaggle, muchos datasets carecen de descripciones técnicas útiles. En un espacio de datos el reto es crítico: los proveedores deben documentar con precisión esquemas, licencias y coberturas para negociar acuerdos sin exponer los datos confidenciales antes de tiempo.'}
              </p>
              <span className="dataspace-timeline-badge">
                {lang === 'en' ? 'Challenge Identified · EDAAN Pilot' : 'Reto Identificado · Piloto EDAAN'}
              </span>
            </div>
          </div>

          <div className="dataspace-timeline-item">
            <div className="dataspace-timeline-marker">
              <div className="dataspace-timeline-dot">02</div>
              <div className="dataspace-timeline-line" />
            </div>
            <div className="dataspace-timeline-content">
              <h4>
                {lang === 'en'
                  ? 'MetaDataXtract: Deterministic Extraction & Paper in Preparation'
                  : 'MetaDataXtract: Extracción Determinista y Paper en Preparación'}
              </h4>
              <p>
                {lang === 'en'
                  ? 'What started as an assisted form for EDAAN evolved into an independent institutional platform supporting 30+ formats, 70+ antivirus engines, and strict DCAT-AP v2.0 JSON-LD export enriched with AGROVOC. Its advanced capabilities evolved into an active scientific research line with a manuscript in preparation.'
                  : 'Lo que comenzó como un formulario asistido para EDAAN evolucionó hacia una herramienta institucional autónoma (+30 formatos, 70+ motores antivirus y exportación DCAT-AP v2.0 con AGROVOC). Su madurez arquitectónica impulsó una línea de investigación científica con un paper actualmente en preparación.'}
              </p>
              <span className="dataspace-timeline-badge">
                {lang === 'en' ? 'Production Release · Research Line' : 'Despliegue Institucional · Línea de Investigación'}
              </span>
            </div>
          </div>

          <div className="dataspace-timeline-item">
            <div className="dataspace-timeline-marker">
              <div className="dataspace-timeline-dot">03</div>
              <div className="dataspace-timeline-line" />
            </div>
            <div className="dataspace-timeline-content">
              <h4>
                {lang === 'en'
                  ? 'MetaDataSearch: Hybrid Discovery & Pydantic AI Agents'
                  : 'MetaDataSearch: Motor Híbrido y Agente Autónomo Pydantic AI'}
              </h4>
              <p>
                {lang === 'en'
                  ? 'To overcome vocabulary mismatch across distributed participants, MetaDataSearch introduces hybrid retrieval combining Elasticsearch 8 (lexical BM25) and Qdrant (dense vectors) via RRF ranking, alongside a conversational AI agent using Pydantic AI and 2D/3D knowledge graph exploration.'
                  : 'Para resolver la búsqueda ante disparidades terminológicas entre participantes, se diseñó MetaDataSearch combinando Elasticsearch 8 (léxico BM25) y Qdrant (vectores densos) mediante ranking RRF, sumando un agente conversacional en Pydantic AI y grafos 2D/3D de relaciones.'}
              </p>
              <span className="dataspace-timeline-badge">
                {lang === 'en' ? 'Multimodal Discovery Layer' : 'Capa de Descubrimiento Multimodal'}
              </span>
            </div>
          </div>

          <div className="dataspace-timeline-item">
            <div className="dataspace-timeline-marker">
              <div className="dataspace-timeline-dot">04</div>
            </div>
            <div className="dataspace-timeline-content">
              <h4>
                {lang === 'en'
                  ? 'ÁGORA Data Sphere & High-Availability Kubernetes Deployment'
                  : 'ÁGORA Data Sphere y Despliegue de Alta Disponibilidad en K8s'}
              </h4>
              <p>
                {lang === 'en'
                  ? 'Full integration into the official web portal for the Agri-food Data Space of Andalusia (EDAAN). Orchestrated containerized deployments, ingestion synchronization, and transactional workflows for sovereign bilateral data contracts.'
                  : 'Integración completa en el portal oficial del Espacio de Datos Agroalimentario de Andalucía (EDAAN). Despliegue orquestado sobre clúster de Kubernetes, garantizando sincronización continua de índices y acuerdos soberanos de intercambio.'}
              </p>
              <span className="dataspace-timeline-badge">
                {lang === 'en' ? 'Full Ecosystem Integration' : 'Integración de Ecosistema Completo'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MERMAID VIEW */}
      {activeTab === 'mermaid' && (
        <div className="dataspace-mermaid-view">
          <div className="dataspace-mermaid-header">
            <span>{lang === 'en' ? 'Full Data Space System Topology' : 'Topología Completa del Espacio de Datos'}</span>
            <button type="button" className="dataspace-copy-btn" onClick={copyMermaid}>
              {copied ? <FiCheck /> : <FiCopy />}
              <span>{copied ? (lang === 'en' ? 'Copied!' : '¡Copiado!') : (lang === 'en' ? 'Copy Mermaid' : 'Copiar Mermaid')}</span>
            </button>
          </div>
          <pre className="dataspace-mermaid-code">
            <code>{mermaidCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
