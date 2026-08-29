/**
 * Structured knowledge base for the dIAgo chat assistant.
 * 
 * Each chunk is a self-contained piece of information about Diego's portfolio,
 * tagged with keywords for lightweight retrieval. The serverless function selects
 * the most relevant chunks based on the user's question before sending them
 * as context to the LLM.
 * 
 * This file is used ONLY by the Vercel serverless function (api/chat.ts).
 * It intentionally duplicates data from src/data/ because the serverless
 * function cannot import Vite-processed TypeScript modules.
 */

export interface KnowledgeChunk {
  category: 'profile' | 'education' | 'experience' | 'projects' | 'skills' | 'contact';
  keywords: string[];
  content: string;
  references: Array<{
    type: 'project' | 'experience' | 'education' | 'contact' | 'section';
    id: string;
    label: { en: string; es: string };
    route: string;
  }>;
}

export const knowledgeBase: KnowledgeChunk[] = [
  // ─── PROFILE ──────────────────────────────────────────────────────
  {
    category: 'profile',
    keywords: ['who', 'diego', 'about', 'quién', 'sobre', 'introduction', 'bio', 'perfil', 'profile', 'background', 'presentación'],
    content: `Diego De Pablo is a Software Engineer (Bioinformatics Engineer with a Master's in Computer Engineering) based in Málaga, Spain. He is a full-stack engineer specialized in use-case deployment and infrastructure. He is very curious and a technology lover. He works at Khaos Research (University of Málaga) building end-to-end applications for data spaces. His email is diegodepablo.programa@gmail.com.`,
    references: [
      { type: 'section', id: 'about', label: { en: 'About Me', es: 'Sobre mí' }, route: '/#about' },
    ],
  },

  // ─── EDUCATION ────────────────────────────────────────────────────
  {
    category: 'education',
    keywords: ['education', 'degree', 'university', 'formación', 'grado', 'master', 'universidad', 'study', 'estudios', 'carrera', 'bioinformatics', 'bioinformática', 'health engineering', 'ingeniería salud', 'computer engineering', 'informática', 'honours', 'matrícula', 'honor', 'top', 'promotion', 'promoción'],
    content: `Education:
- Master's Degree in Computer Engineering (Plan 2026), University of Málaga. Specialization: Data Science & Engineering. Starting August 2026.
- Bachelor's Degree in Health Engineering, specialization in Bioinformatics Engineering, University of Málaga (Sep 2021 – Jul 2025). Grade: 7.94/10. Honours (Matrícula de Honor) in several subjects: Fundamentals of Programming, Intelligent Systems, Bioinformatics Projects, and the Final Degree Thesis. Top 5 of the 2021–2025 cohort. Active participant in extracurricular events like Hackers Week, datathons, and seminars.`,
    references: [
      { type: 'education', id: 'education', label: { en: 'Education & Certifications', es: 'Formación y Certificaciones' }, route: '/#about' },
    ],
  },
  {
    category: 'education',
    keywords: ['certificate', 'certification', 'cisco', 'cybersecurity', 'ciberseguridad', 'hacking', 'operating systems', 'sistemas operativos', 'certificación', 'certificado', 'infrastructure'],
    content: `Certifications:
- Operating Systems Basics (Cisco Networking Academy, Aug 2026): Windows & Linux server administration, shell usage, networking, and security protocols.
- Introduction to Cybersecurity (Cisco Networking Academy, Feb 2026): Attack vectors, information protection, corporate defense, security devices.
- Introduction to Cybersecurity & Technical Hacking (BigSchool, Apr 2026): Web auditing with containers (dockerlabs.es), threat analysis (ransomware, phishing), malware containment.`,
    references: [
      { type: 'education', id: 'certificates', label: { en: 'Certifications', es: 'Certificaciones' }, route: '/#about' },
    ],
  },

  // ─── EXPERIENCE ───────────────────────────────────────────────────
  {
    category: 'experience',
    keywords: ['experience', 'work', 'job', 'experiencia', 'trabajo', 'donde', 'where', 'worked', 'career', 'empresa', 'company'],
    content: `Work Experience:
1. Khaos Research (University of Málaga) — Software Engineer, Sep 2025 – Present (full-time, hybrid, Málaga). Focused on end-to-end development of full-stack applications for multi-domain data spaces, advanced search engine with LLM for natural language queries, and tools for automatic metadata extraction (+30 formats) and LLM-driven analysis workflow automation.
2. mSurgery — FullStack Developer, Mar 2025 – Jul 2025 (internship, hybrid, Málaga). Structural migration of repositories from Svelte 4 to Svelte 5, developed features for SMOTTS and digital twins projects, managed international stakeholders and presented technically at Polo Digital.
3. T&B Company Group — Junior Software Engineer, Jun 2021 – Dec 2021 (internship). Created API documentation, improved UX, resolved bugs, migrated legacy code for Java and Angular.`,
    references: [
      { type: 'section', id: 'jobs', label: { en: 'Work Experience', es: 'Experiencia Laboral' }, route: '/#jobs' },
    ],
  },

  // ─── PROJECTS: Khaos ──────────────────────────────────────────────
  {
    category: 'projects',
    keywords: ['metadataxtract', 'metadata', 'extraction', 'extracción', 'pipeline', 'json-ld', 'dcat', 'security', 'validation', 'virus', 'sha', 'khaos', 'sedia', 'data space', 'espacio de datos'],
    content: `MetaDataXtract: Security-first pipeline that validates, extracts and enriches file metadata into interoperable JSON-LD for federated data spaces. Technologies: Next.js, FastAPI, Python, JSON-LD, DCAT-AP, Docker. Professional project at Khaos Research. Features: SHA-256 validation, magic bytes, 70+ AV engines, parsers for 30+ formats, LLM-generated descriptions, controlled vocabularies (AGROVOC, EuroVoc). Diego had full ownership of this SEDIA deliverable.`,
    references: [
      { type: 'project', id: 'metadataxtract', label: { en: 'MetaDataXtract', es: 'MetaDataXtract' }, route: '/projects/metadataxtract' },
    ],
  },
  {
    category: 'projects',
    keywords: ['metadatasearch', 'search', 'buscador', 'semantic', 'semántico', 'elasticsearch', 'qdrant', 'vector', 'embeddings', 'llm', 'conversational', 'ai', 'ia', 'khaos'],
    content: `MetaDataSearch: Multimodal metadata broker enabling conversational AI search, semantic filtering and knowledge graph exploration for federated data spaces. Technologies: Next.js, FastAPI, Elasticsearch, Qdrant, MongoDB, LLMs. Professional project at Khaos Research. Features: intelligent orchestration engine routing queries to Lexical (Elasticsearch 8) or Semantic (Qdrant) engines, interactive Pydantic AI agent for conversational context. Diego had total ownership of the project architecture.`,
    references: [
      { type: 'project', id: 'metadatasearch', label: { en: 'MetaDataSearch', es: 'MetaDataSearch' }, route: '/projects/metadatasearch' },
    ],
  },
  {
    category: 'projects',
    keywords: ['titan', 'workflow', 'agent', 'agente', 'llm', 'big data', 'spark', 'kafka', 'pipeline', 'scientific', 'semantic', 'khaos'],
    content: `TITAN Workflow Agent: Autonomous LLM agent integrated into TITAN, a semantic Big Data software platform. Manages the lifecycle of scientific workflows, translating natural language requests into complex orchestrated pipelines. Technologies: LLMs, Python, Agentic Workflows, Apache Spark, Kafka. Professional project at Khaos Research. Diego evolved the LLM inclusion, improving its analytical reasoning and transforming it into an active agent.`,
    references: [
      { type: 'project', id: 'titan-workflow', label: { en: 'TITAN Workflow Agent', es: 'Agente de Flujos TITAN' }, route: '/projects/titan-workflow' },
    ],
  },
  {
    category: 'projects',
    keywords: ['alignx', 'ontology', 'ontología', 'alignment', 'alineación', 'mapper', 'oaei', 'logmap', 'bertmap', 'semantic web', 'khaos'],
    content: `AlignX Ontology Mapper: Multi-strategy ontology alignment engine with 10+ internal mappers (lexical, semantic, structural, Gromov-Wasserstein, cross-lingual) and external OAEI-compatible matchers (LogMap, AML, BERTMap). Technologies: Python, FastAPI, Next.js, RDFLib, Docker, S-BERT. Professional project at Khaos Research. Diego implemented the consensus/fusion engine and built the complete web platform.`,
    references: [
      { type: 'project', id: 'alignx', label: { en: 'AlignX', es: 'AlignX' }, route: '/projects/alignx' },
    ],
  },
  {
    category: 'projects',
    keywords: ['edaan', 'agri', 'agroalimentario', 'data space', 'espacio de datos', 'andalusia', 'andalucía', 'kubernetes', 'khaos'],
    content: `EDAAN Data Space: Agri-food Data Space of Andalusia. Diego contributed as a junior developer focusing on frontend implementations and connecting features. This project provided essential hands-on learning in advanced data infrastructure, particularly Kubernetes and data connectors. Technologies: Kubernetes, Data Connectors, React, Infrastructure. Professional project at Khaos Research.`,
    references: [
      { type: 'project', id: 'edaan-data-space', label: { en: 'EDAAN Data Space', es: 'Espacio de Datos EDAAN' }, route: '/projects/edaan-data-space' },
    ],
  },

  // ─── PROJECTS: mSurgery ───────────────────────────────────────────
  {
    category: 'projects',
    keywords: ['msurgery', 'surgery', 'cirugía', 'telepresence', 'telepresencia', 'surgical', 'quirúrgico', 'webrtc', '3d', 'streaming', 'medical', 'médico'],
    content: `mSurgery Platform: Advanced telepresence platform for real-time surgical collaboration. Streams operations in HD and 3D, integrating mixed and virtual reality. Technologies: Svelte, TypeScript, WebRTC, 3D Streaming. Diego developed platform features and represented the company in English-language presentations to international investors at Polo Digital.`,
    references: [
      { type: 'project', id: 'msurgery-platform', label: { en: 'mSurgery Platform', es: 'Plataforma mSurgery' }, route: '/projects/msurgery-platform' },
    ],
  },
  {
    category: 'projects',
    keywords: ['smotts', 'sleep', 'sueño', 'rem', 'diagnostics', 'diagnóstico', 'biomedical', 'biomédico', 'wearable', 'msurgery'],
    content: `SMOTTS Sleep Diagnostics: Medical device project for portable, intelligent diagnosis of REM Sleep Behavior Disorder. Captures biometric signals and processes them to detect anomalous patterns. Technologies: Svelte, TypeScript, D3.js, Data Processing. Diego built improved data visualizers for biomedical signal analysis.`,
    references: [
      { type: 'project', id: 'smotts', label: { en: 'SMOTTS', es: 'SMOTTS' }, route: '/projects/smotts' },
    ],
  },
  {
    category: 'projects',
    keywords: ['digital twins', 'gemelos digitales', '3d', 'organ', 'órgano', 'svelte', 'migration', 'migración', 'msurgery'],
    content: `3D Digital Twins: Medical platform housing a database of 3D-scanned organs for research and surgical planning. Technologies: Svelte 5, TypeScript, 3D Rendering. Diego led the structural migration from Svelte 4 to Svelte 5 (runes, snippets, new reactivity model).`,
    references: [
      { type: 'project', id: 'digital-twins', label: { en: '3D Digital Twins', es: 'Gemelos Digitales 3D' }, route: '/projects/digital-twins' },
    ],
  },

  // ─── PROJECTS: Personal ───────────────────────────────────────────
  {
    category: 'projects',
    keywords: ['tfg', 'bracelet', 'pulsera', 'patient', 'paciente', 'monitoring', 'monitorización', 'iot', 'esp32', 'mqtt', 'wearable', 'health', 'salud', 'best', 'mejor', 'thesis', 'tesis'],
    content: `Patient Monitoring Bracelet (TFG / Final Degree Project): End-to-end remote monitoring system combining an IoT wristband prototype with a telemedicine web platform. Technologies: IoT, ESP32, FastAPI, SvelteKit, PostgreSQL, MQTT. Personal project. Features: SpO₂ and heart rate monitoring (MAX30102), fall detection (MPU-6050), real-time MQTT events. The project received a grade of 10.0 with Honours and was rated as the best TFG of all presented in the cohort.`,
    references: [
      { type: 'project', id: 'tfg-patient-monitoring', label: { en: 'Patient Monitoring Bracelet', es: 'Pulsera de Seguimiento' }, route: '/projects/tfg-patient-monitoring' },
    ],
  },
  {
    category: 'projects',
    keywords: ['kubernetes', 'k8s', 'gitops', 'argocd', 'argo', 'helm', 'docker', 'infrastructure', 'infraestructura', 'devops', 'envoy', 'longhorn', 'sealed secrets'],
    content: `Kubernetes Operations & GitOps: Hands-on environment for cloud-native application architecture and operations. Illustrates the complete migration path from local Docker Compose to a robust Kubernetes ecosystem through 7 progressive phases. Technologies: Kubernetes, Docker, Helm, Argo CD, Sealed Secrets, Envoy, Longhorn, Prometheus, Grafana. Featured personal project.`,
    references: [
      { type: 'project', id: 'kubernetes-platform', label: { en: 'Kubernetes & GitOps', es: 'Kubernetes & GitOps' }, route: '/projects/kubernetes-platform' },
    ],
  },
  {
    category: 'projects',
    keywords: ['instagram', 'graph', 'grafo', 'social', 'network', 'red', 'circlescope', 'followers', 'seguidores'],
    content: `CircleScope: Instagram Graph — Turns an official Instagram data export into an understandable relationship map. Calculates followers, followed accounts, mutual relationships, and analyzes unfollowers. Technologies: FastAPI, React, Vite, Force Graph, Data Analysis. Personal project. Privacy-first: never asks for passwords, no scraping, no external API calls.`,
    references: [
      { type: 'project', id: 'instagram-epic-tool', label: { en: 'CircleScope', es: 'CircleScope' }, route: '/projects/instagram-epic-tool' },
    ],
  },

  // ─── SKILLS ───────────────────────────────────────────────────────
  {
    category: 'skills',
    keywords: ['skills', 'technologies', 'tech', 'stack', 'habilidades', 'tecnologías', 'python', 'linux', 'docker', 'java', 'react', 'nextjs', 'fastapi', 'svelte', 'machine learning', 'deep learning', 'llm', 'ai', 'ia', 'programming', 'programación', 'language', 'lenguaje'],
    content: `Technical Skills:
- Core Stack: Python, Linux, R, Docker, Java
- Frontend: React, Next.js, SvelteKit, Svelte 5, TypeScript, Vite
- Backend: FastAPI, Python, SQLAlchemy, PostgreSQL, MongoDB, Redis
- Infrastructure: Kubernetes, Docker, Helm, Argo CD, Envoy, Prometheus, Grafana
- AI/ML: LLMs, Deep Learning, Machine Learning, Computer Vision, NLP, Embeddings, Qdrant, Elasticsearch
- Data: Data Analysis, Data Visualization, Bioinformatics, JSON-LD, DCAT-AP, RDFLib
- Other: Git, MQTT, IoT, WebRTC, D3.js
- Languages: Spanish (C2), English (B2), Italian (A2)`,
    references: [
      { type: 'section', id: 'about', label: { en: 'Tech Stack', es: 'Stack Tecnológico' }, route: '/#about' },
    ],
  },

  // ─── CONTACT ──────────────────────────────────────────────────────
  {
    category: 'contact',
    keywords: ['contact', 'contacto', 'email', 'correo', 'reach', 'hire', 'contratar', 'linkedin', 'github', 'social', 'redes'],
    content: `Contact:
- Email: diegodepablo.programa@gmail.com
- GitHub: https://github.com/Diegodepab
- LinkedIn: https://www.linkedin.com/in/diego-de-pablo/
- Instagram: https://www.instagram.com/diegodepab/
- Location: Málaga, Spain`,
    references: [
      { type: 'contact', id: 'contact', label: { en: 'Contact', es: 'Contacto' }, route: '/#contact' },
    ],
  },
];

/**
 * Simple keyword-based retriever.
 * Scores each chunk by how many of its keywords appear in the query,
 * then returns the top N chunks.
 */
export function retrieveRelevantChunks(query: string, maxChunks = 4): KnowledgeChunk[] {
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const scored = knowledgeBase.map(chunk => {
    let score = 0;
    for (const keyword of chunk.keywords) {
      const normalizedKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalizedQuery.includes(normalizedKeyword)) {
        score += normalizedKeyword.length; // Longer matches are weighted higher
      }
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Always include profile if nothing else matched well
  const topChunks = scored.filter(s => s.score > 0).slice(0, maxChunks);
  if (topChunks.length === 0) {
    const profileChunk = knowledgeBase.find(c => c.category === 'profile');
    if (profileChunk) topChunks.push({ chunk: profileChunk, score: 1 });
  }

  return topChunks.map(s => s.chunk);
}
