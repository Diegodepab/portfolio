import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  FiActivity,
  FiCpu,
  FiDatabase,
  FiGlobe,
  FiLayers,
  FiRadio,
  FiServer,
  FiShield,
  FiWifi,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import './IoTArchitectureFlow.css';

interface NodeDetail {
  id: string;
  name: { en: string; es: string };
  role: { en: string; es: string };
  tech: string[];
  specs: { en: string; es: string };
  flow: { en: string; es: string };
}

const NODES: Record<string, NodeDetail> = {
  max30102: {
    id: 'max30102',
    name: { en: 'MAX30102 Optical Sensor', es: 'Sensor Óptico MAX30102' },
    role: { en: 'Photoplethysmography (PPG)', es: 'Fotopletismografía Óptica (PPG)' },
    tech: ['I2C Bus', 'Red & IR LEDs', '100 Hz Sampling'],
    specs: {
      en: 'Emits red and infrared wavelengths through capillary tissue to compute heart rate (BPM) and blood oxygen saturation (SpO₂) in real-time.',
      es: 'Emite luz roja e infrarroja a través del tejido capilar para calcular la frecuencia cardíaca (BPM) y la saturación de oxígeno en sangre (SpO₂) en tiempo real.',
    },
    flow: {
      en: 'Acquires raw PPG signal samples at 100Hz and streams them over I2C bus to the ESP32 micro-controller.',
      es: 'Adquiere muestras de la señal PPG a 100Hz y las transmite por el bus I2C hacia el microcontrolador ESP32.',
    },
  },
  mpu6050: {
    id: 'mpu6050',
    name: { en: 'MPU-6050 IMU Sensor', es: 'Sensor Inercial MPU-6050' },
    role: { en: '6-Axis Accelerometer & Gyro', es: 'Acelerómetro y Giroscopio de 6 Ejes' },
    tech: ['I2C Bus', 'Digital Motion Processor', 'SVM Fall Algorithm'],
    specs: {
      en: 'Measures linear acceleration and rotational rate. Incorporates a fall detection algorithm based on impact spikes followed by inactivity.',
      es: 'Mide aceleración lineal y velocidad angular. Implementa un algoritmo de detección de caídas basado en picos de aceleración seguidos de inmovilidad.',
    },
    flow: {
      en: 'Interrupts the ESP32 when acceleration vectors exceed safety thresholds to trigger immediate high-priority alerts.',
      es: 'Interrumpe al ESP32 cuando el vector de aceleración supera el umbral crítico para emitir una alerta inmediata de alta prioridad.',
    },
  },
  esp32: {
    id: 'esp32',
    name: { en: 'ESP32 LilyGO TTGO T-Display', es: 'ESP32 LilyGO TTGO T-Display' },
    role: { en: 'Edge Processing & Circular Buffer', es: 'Procesamiento Edge y Búfer Circular' },
    tech: ['C++', 'FreeRTOS', 'NTP Clock Sync', 'TFT 1.14" Display', 'RAM FIFO'],
    specs: {
      en: 'Dual-core 240MHz SoC. Runs signal filtering, handles TFT screen UI, synchronizes timestamps via NTP, and maintains an in-memory circular buffer for offline resilience.',
      es: 'SoC dual-core a 240MHz. Ejecuta el filtrado de señales, refresca la pantalla TFT, sincroniza reloj con servidores NTP y mantiene un buffer circular en RAM para tolerancia a fallos de red.',
    },
    flow: {
      en: 'Packages metrics into compact JSON payloads. If Wi-Fi is lost, buffers readings locally and flushes automatically upon reconnection.',
      es: 'Empaqueta las métricas en JSON compactos. Si pierde la conexión Wi-Fi, retiene las lecturas en memoria y las reenvía automáticamente al reconectarse.',
    },
  },
  mqtt: {
    id: 'mqtt',
    name: { en: 'Eclipse Mosquitto Broker', es: 'Broker MQTT Mosquitto' },
    role: { en: 'Asynchronous IoT Messaging', es: 'Mensajería IoT Asíncrona' },
    tech: ['MQTT v3.1.1', 'QoS 1 Confirmed', 'JSON Payloads', 'Docker'],
    specs: {
      en: 'Lightweight publish/subscribe broker decoupling the wearable wristband from backend services with minimal transmission overhead.',
      es: 'Broker de publicación/suscripción ligero que desacopla la pulsera del backend con una sobrecarga de red mínima ideal para IoT.',
    },
    flow: {
      en: 'Receives telemetric topics (patient/{id}/vitals, patient/{id}/alerts) and distributes them to ingestion services.',
      es: 'Recibe tópicos de telemetría (patient/{id}/vitals, patient/{id}/alerts) y los distribuye a los consumidores de datos.',
    },
  },
  fastapi: {
    id: 'fastapi',
    name: { en: 'FastAPI Telemedicine Core', es: 'API Backend FastAPI' },
    role: { en: 'RESTful Business & Medical Logic', es: 'Lógica de Negocio y API REST' },
    tech: ['Python 3.11', 'SQLAlchemy', 'Pydantic', 'JWT Security'],
    specs: {
      en: 'High-concurrency async Python framework. Handles clinical user authentication, patient-to-doctor relationships, and pathology monitoring.',
      es: 'Framework asíncrono en Python de alto rendimiento. Gestiona autenticación clínica, asignación de pacientes a doctores y supervisión de patologías.',
    },
    flow: {
      en: 'Validates medical schemas, records daily studies into PostgreSQL, and serves query endpoints to the web client.',
      es: 'Valida esquemas biomédicos con Pydantic, persiste estudios diarios en PostgreSQL y expone endpoints hacia el frontend.',
    },
  },
  db: {
    id: 'db',
    name: { en: 'PostgreSQL + Redis Storage', es: 'Persistencia PostgreSQL + Redis' },
    role: { en: 'Relational Records & Cache', es: 'Registros Relacionales y Caché' },
    tech: ['PostgreSQL', 'Redis', 'Alembic Migrations'],
    specs: {
      en: 'PostgreSQL holds structured schemas for patients, studies, alarms, and chat histories. Redis buffers real-time presence and session states.',
      es: 'PostgreSQL almacena pacientes, estudios, constantes históricas, alarmas y mensajes. Redis gestiona estados temporales y sesiones en memoria.',
    },
    flow: {
      en: 'Persists time-series vital sign summaries and allows indexed queries for multi-day clinical progression charts.',
      es: 'Persiste los historiales de constantes para generar gráficos comparativos de evolución clínica a lo largo del tiempo.',
    },
  },
  svelte: {
    id: 'svelte',
    name: { en: 'SvelteKit Medical Portal', es: 'Plataforma Web SvelteKit' },
    role: { en: 'Clinical Telemedicine Dashboard', es: 'Dashboard Clínico de Telemedicina' },
    tech: ['SvelteKit', 'Chart.js', 'Nginx Proxy', 'Role-Based Access'],
    specs: {
      en: 'Reactive medical web application with 3 tailored views: Doctors (patient cohorts & alert triage), Patients (daily evolution & chat), and Admins.',
      es: 'Aplicación web reactiva con 3 vistas adaptadas: Médicos (triaje de pacientes y alarmas), Pacientes (evolución y chat) y Administradores.',
    },
    flow: {
      en: 'Renders dynamic vital-sign graphs, highlights critical abnormal readings with color badges, and enables real-time messaging.',
      es: 'Dibuja gráficas interactivas con Chart.js, resalta valores anómalos con semáforos de riesgo y permite chat médico directo.',
    },
  },
};

const MERMAID_CODE = `flowchart LR
    subgraph Dispositivo IoT [Wearable Hardware]
        MAX[MAX30102\\nBPM & SpO2]
        MPU[MPU-6050\\nCaídas & Movimiento]
        ESP[ESP32 TTGO\\nFirmware C++]
        BUF[(Buffer RAM\\nOffline)]
        MAX -->|I2C| ESP
        MPU -->|I2C| ESP
        ESP -. Sin Wi-Fi .-> BUF
        BUF -. Reconexión .-> ESP
    end

    subgraph Transporte [Capa de Red]
        MQTT[Mosquitto Broker\\nMQTT QoS 1]
        ESP -->|Wi-Fi JSON| MQTT
    end

    subgraph Servidor [Backend & Datos]
        API[FastAPI Core\\nPython REST]
        DB[(PostgreSQL & Redis)]
        MQTT --> API
        API <--> DB
    end

    subgraph Cliente [Portal Clínico]
        WEB[SvelteKit\\nNginx Proxy]
        API --> WEB
    end`;

export const IoTArchitectureFlow: React.FC = () => {
  const { lang } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<string>('esp32');
  const [activeTab, setActiveTab] = useState<'flow' | 'firmware' | 'mermaid'>('flow');
  const [copied, setCopied] = useState<boolean>(false);

  const active = NODES[selectedNode] ?? NODES.esp32;

  const copyMermaid = () => {
    navigator.clipboard.writeText(MERMAID_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="iot-arch-console">
      {/* HEADER */}
      <div className="iot-arch-console__header">
        <div className="iot-arch-console__title-wrap">
          <span className="iot-arch-console__badge">
            <FiLayers /> {lang === 'en' ? 'System Topology & Pipeline' : 'Topología de Arquitectura'}
          </span>
          <h3 className="iot-arch-console__title">
            {lang === 'en' ? 'End-to-End IoT & Telemedicine Architecture' : 'Arquitectura Integral IoT y Telemedicina'}
          </h3>
        </div>

        <div className="iot-arch-console__tabs">
          <button
            type="button"
            className={`console-tab-btn ${activeTab === 'flow' ? 'active' : ''}`}
            onClick={() => setActiveTab('flow')}
          >
            {lang === 'en' ? 'Interactive Flow' : 'Flujo Interactivo'}
          </button>
          <button
            type="button"
            className={`console-tab-btn ${activeTab === 'firmware' ? 'active' : ''}`}
            onClick={() => setActiveTab('firmware')}
          >
            {lang === 'en' ? 'Firmware Cycle' : 'Ciclo de Firmware'}
          </button>
          <button
            type="button"
            className={`console-tab-btn ${activeTab === 'mermaid' ? 'active' : ''}`}
            onClick={() => setActiveTab('mermaid')}
          >
            {lang === 'en' ? 'Mermaid Diagram' : 'Diagrama Mermaid'}
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE PIPELINE */}
      {activeTab === 'flow' && (
        <div className="iot-pipeline-view">
          {/* HORIZONTAL BALANCED FLOW */}
          <div className="iot-pipeline-canvas">
            {/* STAGE 1: SENSORS */}
            <div className="pipeline-stage stage-sensors">
              <span className="stage-tag">{lang === 'en' ? '01 · Sensors' : '01 · Sensores'}</span>
              <div className="stage-sensors-stack">
                <button
                  type="button"
                  className={`pipeline-node sensor-node ${selectedNode === 'max30102' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('max30102')}
                >
                  <div className="node-icon heart"><FiActivity /></div>
                  <div className="node-text">
                    <strong>MAX30102</strong>
                    <span>BPM & SpO₂</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`pipeline-node sensor-node ${selectedNode === 'mpu6050' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('mpu6050')}
                >
                  <div className="node-icon motion"><FiShield /></div>
                  <div className="node-text">
                    <strong>MPU-6050</strong>
                    <span>{lang === 'en' ? 'Fall Detection' : 'Caídas & Inercia'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* CONNECTOR 1 -> 2 */}
            <div className="pipeline-wire">
              <div className="wire-line"><span className="wire-pulse" /></div>
              <span className="wire-label">I2C (100Hz)</span>
            </div>

            {/* STAGE 2: ESP32 EDGE CORE */}
            <div className="pipeline-stage stage-edge">
              <span className="stage-tag">{lang === 'en' ? '02 · Edge Core' : '02 · Microcontrolador'}</span>
              <button
                type="button"
                className={`pipeline-node core-node ${selectedNode === 'esp32' ? 'selected' : ''}`}
                onClick={() => setSelectedNode('esp32')}
              >
                <div className="node-icon esp"><FiCpu /></div>
                <div className="node-text">
                  <strong>ESP32 LilyGO</strong>
                  <span>Firmware C++ & Buffer</span>
                  <em className="core-pill">TFT 1.14" · NTP</em>
                </div>
              </button>
            </div>

            {/* CONNECTOR 2 -> 3 */}
            <div className="pipeline-wire">
              <div className="wire-line"><span className="wire-pulse fast" /></div>
              <span className="wire-label"><FiWifi /> Wi-Fi · MQTT</span>
            </div>

            {/* STAGE 3: MQTT BROKER */}
            <div className="pipeline-stage stage-broker">
              <span className="stage-tag">{lang === 'en' ? '03 · Broker' : '03 · Mensajería'}</span>
              <button
                type="button"
                className={`pipeline-node broker-node ${selectedNode === 'mqtt' ? 'selected' : ''}`}
                onClick={() => setSelectedNode('mqtt')}
              >
                <div className="node-icon mqtt"><FiRadio /></div>
                <div className="node-text">
                  <strong>Mosquitto</strong>
                  <span>MQTT QoS 1</span>
                  <em className="core-pill">JSON Payloads</em>
                </div>
              </button>
            </div>

            {/* CONNECTOR 3 -> 4 */}
            <div className="pipeline-wire">
              <div className="wire-line"><span className="wire-pulse" /></div>
              <span className="wire-label">Ingest REST</span>
            </div>

            {/* STAGE 4: BACKEND & DB */}
            <div className="pipeline-stage stage-backend">
              <span className="stage-tag">{lang === 'en' ? '04 · Cloud Server' : '04 · Backend & BD'}</span>
              <div className="stage-backend-stack">
                <button
                  type="button"
                  className={`pipeline-node backend-node ${selectedNode === 'fastapi' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('fastapi')}
                >
                  <div className="node-icon api"><FiServer /></div>
                  <div className="node-text">
                    <strong>FastAPI</strong>
                    <span>Python Async</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`pipeline-node backend-node ${selectedNode === 'db' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode('db')}
                >
                  <div className="node-icon db"><FiDatabase /></div>
                  <div className="node-text">
                    <strong>PostgreSQL</strong>
                    <span>Series & Redis</span>
                  </div>
                </button>
              </div>
            </div>

            {/* CONNECTOR 4 -> 5 */}
            <div className="pipeline-wire">
              <div className="wire-line"><span className="wire-pulse fast" /></div>
              <span className="wire-label">HTTPS / Nginx</span>
            </div>

            {/* STAGE 5: PRESENTATION */}
            <div className="pipeline-stage stage-frontend">
              <span className="stage-tag">{lang === 'en' ? '05 · Telemedicine UI' : '05 · Portal Sanitario'}</span>
              <button
                type="button"
                className={`pipeline-node web-node ${selectedNode === 'svelte' ? 'selected' : ''}`}
                onClick={() => setSelectedNode('svelte')}
              >
                <div className="node-icon web"><FiGlobe /></div>
                <div className="node-text">
                  <strong>SvelteKit</strong>
                  <span>Portal Clínico</span>
                  <em className="core-pill">Chart.js · Roles</em>
                </div>
              </button>
            </div>
          </div>

          {/* BALANCED INSPECTOR */}
          <div className="pipeline-inspector">
            <div className="inspector-head">
              <div className="inspector-title-group">
                <span className="inspector-eyebrow">
                  {lang === 'en' ? 'Selected Architecture Node' : 'Componente de Arquitectura Seleccionado'}
                </span>
                <h4>{active.name[lang]}</h4>
                <p className="inspector-subtitle">{active.role[lang]}</p>
              </div>

              <div className="inspector-tech-tags">
                {active.tech.map(t => (
                  <span key={t} className="inspector-tech-pill">{t}</span>
                ))}
              </div>
            </div>

            <div className="inspector-body-grid">
              <div className="inspector-col">
                <h5>{lang === 'en' ? 'Engineering Function' : 'Función de Ingeniería'}</h5>
                <p>{active.specs[lang]}</p>
              </div>
              <div className="inspector-col">
                <h5>{lang === 'en' ? 'Data Pipeline Role' : 'Papel en el Flujo de Datos'}</h5>
                <p>{active.flow[lang]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIRMWARE CYCLE */}
      {activeTab === 'firmware' && (
        <div className="iot-firmware-view">
          <div className="firmware-timeline">
            <div className="firmware-step">
              <div className="step-badge">01</div>
              <div className="step-info">
                <strong>{lang === 'en' ? 'Hardware Setup & Calibration' : 'Arranque y Calibración I2C'}</strong>
                <p>
                  {lang === 'en'
                    ? 'Initializes I2C bus at 100 kHz, starts optical MAX30102 sensor and MPU-6050 accelerometer, and runs baseline calibration.'
                    : 'Inicializa el bus I2C, arranca el sensor óptico MAX30102 y el acelerómetro MPU-6050, calibrando los valores base.'}
                </p>
              </div>
            </div>

            <div className="firmware-connector">↓</div>

            <div className="firmware-step">
              <div className="step-badge">02</div>
              <div className="step-info">
                <strong>{lang === 'en' ? 'Wi-Fi & NTP Clock Synchronization' : 'Conectividad Wi-Fi y Reloj NTP'}</strong>
                <p>
                  {lang === 'en'
                    ? 'Connects to wireless network, requests precise epoch time from pool.ntp.org for analytical timestamp coherence, and connects to Mosquitto.'
                    : 'Establece conexión Wi-Fi, sincroniza la marca de tiempo exacta mediante servidores NTP y abre conexión con el broker Mosquitto.'}
                </p>
              </div>
            </div>

            <div className="firmware-connector">↓</div>

            <div className="firmware-step">
              <div className="step-badge">03</div>
              <div className="step-info">
                <strong>{lang === 'en' ? 'Signal Sampling & Fall Detection Algorithm' : 'Muestreo Biomédico y Algoritmo de Caídas'}</strong>
                <p>
                  {lang === 'en'
                    ? 'Extracts PPG optical pulses (BPM & SpO₂) at 100 Hz and evaluates triaxial acceleration vector magnitude (SVM) for fall threshold impact.'
                    : 'Adquiere pulso óptico y SpO₂ a 100 Hz, calculando la magnitud vectorial de aceleración para detectar picos de impacto inercial.'}
                </p>
              </div>
            </div>

            <div className="firmware-connector">↓</div>

            <div className="firmware-step highlight">
              <div className="step-badge">04</div>
              <div className="step-info">
                <strong>{lang === 'en' ? 'Resilient Delivery & In-Memory Circular Buffer' : 'Envío Resiliente y Búfer Circular en RAM'}</strong>
                <p>
                  {lang === 'en'
                    ? 'If online: publishes compact JSON payloads over MQTT. If Wi-Fi is lost: writes events into RAM ring buffer and flushes automatically on reconnection.'
                    : 'Si hay red: publica JSON por MQTT. Si se pierde el Wi-Fi: retiene las lecturas en un buffer circular en RAM y las descarga automáticamente al reconectarse.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VISUAL MERMAID DIAGRAM (RENDERED VECTOR GRAPH + CODE) */}
      {activeTab === 'mermaid' && (
        <div className="iot-mermaid-view">
          <div className="mermaid-render-card">
            <div className="mermaid-render-head">
              <span>{lang === 'en' ? 'Rendered System Architecture Graph' : 'Diagrama Renderizado de Arquitectura'}</span>
              <button type="button" className="copy-code-btn" onClick={copyMermaid}>
                {copied ? <><FiCheck /> {lang === 'en' ? 'Copied' : 'Copiado'}</> : <><FiCopy /> {lang === 'en' ? 'Copy Mermaid Code' : 'Copiar Código'}</>}
              </button>
            </div>

            {/* RENDERED VECTOR GRAPH (SVG) */}
            <div className="mermaid-svg-wrapper">
              <svg viewBox="0 0 920 300" className="mermaid-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SUBGRAPH BOXES */}
                <rect x="20" y="20" width="220" height="260" rx="10" fill="#0d1526" stroke="#1e293b" strokeDasharray="4 4" />
                <text x="35" y="42" fill="#38bdf8" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">Dispositivo IoT (Wearable)</text>

                <rect x="280" y="70" width="160" height="160" rx="10" fill="#0d1526" stroke="#1e293b" strokeDasharray="4 4" />
                <text x="295" y="92" fill="#a855f7" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">Transporte IoT</text>

                <rect x="480" y="20" width="210" height="260" rx="10" fill="#0d1526" stroke="#1e293b" strokeDasharray="4 4" />
                <text x="495" y="42" fill="#3b82f6" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">Backend & Datos</text>

                <rect x="730" y="70" width="170" height="160" rx="10" fill="#0d1526" stroke="#1e293b" strokeDasharray="4 4" />
                <text x="745" y="92" fill="#10b981" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">Portal Sanitario</text>

                {/* NODES */}
                {/* Node: MAX30102 */}
                <rect x="40" y="60" width="180" height="42" rx="6" fill="#17223b" stroke="#f43f5e" />
                <text x="130" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">MAX30102</text>
                <text x="130" y="94" textAnchor="middle" fill="#94a3b8" fontSize="10">BPM &amp; SpO2 (PPG)</text>

                {/* Node: MPU-6050 */}
                <rect x="40" y="115" width="180" height="42" rx="6" fill="#17223b" stroke="#06b6d4" />
                <text x="130" y="135" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">MPU-6050</text>
                <text x="130" y="149" textAnchor="middle" fill="#94a3b8" fontSize="10">Caídas y Movimiento</text>

                {/* Node: ESP32 */}
                <rect x="40" y="175" width="180" height="48" rx="6" fill="#17223b" stroke="#10b981" strokeWidth="2" />
                <text x="130" y="196" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">ESP32 TTGO T-Display</text>
                <text x="130" y="212" textAnchor="middle" fill="#10b981" fontSize="10">Firmware C++ / Búfer RAM</text>

                {/* Node: Mosquitto */}
                <rect x="295" y="120" width="130" height="52" rx="6" fill="#17223b" stroke="#8b5cf6" />
                <text x="360" y="143" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Mosquitto</text>
                <text x="360" y="159" textAnchor="middle" fill="#c084fc" fontSize="10">Broker MQTT (QoS 1)</text>

                {/* Node: FastAPI */}
                <rect x="500" y="65" width="170" height="50" rx="6" fill="#17223b" stroke="#3b82f6" />
                <text x="585" y="88" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">FastAPI Core</text>
                <text x="585" y="104" textAnchor="middle" fill="#93c5fd" fontSize="10">Python Async REST API</text>

                {/* Node: DB */}
                <rect x="500" y="150" width="170" height="50" rx="6" fill="#17223b" stroke="#f59e0b" />
                <text x="585" y="173" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">PostgreSQL &amp; Redis</text>
                <text x="585" y="189" textAnchor="middle" fill="#fcd34d" fontSize="10">Historiales &amp; Caché</text>

                {/* Node: SvelteKit */}
                <rect x="745" y="120" width="140" height="52" rx="6" fill="#17223b" stroke="#10b981" />
                <text x="815" y="143" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">SvelteKit</text>
                <text x="815" y="159" textAnchor="middle" fill="#6ee7b7" fontSize="10">Nginx / Chart.js / Roles</text>

                {/* CONNECTION LINES & ARROWS */}
                {/* Sensors to ESP32 */}
                <path d="M130 102 L130 115" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow)" />
                <path d="M130 157 L130 175" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* ESP32 to Mosquitto */}
                <path d="M220 199 L255 199 L255 146 L295 146" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrow)" />
                <text x="258" y="136" fill="#38bdf8" fontSize="9" fontFamily="var(--font-mono)">Wi-Fi/JSON</text>

                {/* Mosquitto to FastAPI */}
                <path d="M425 146 L465 146 L465 90 L500 90" stroke="#c084fc" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="445" y="82" fill="#c084fc" fontSize="9" fontFamily="var(--font-mono)">Ingest</text>

                {/* FastAPI <-> DB */}
                <path d="M585 115 L585 150" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow-rev)" />

                {/* FastAPI to SvelteKit */}
                <path d="M670 90 L710 90 L710 146 L745 146" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="690" y="138" fill="#10b981" fontSize="9" fontFamily="var(--font-mono)">HTTPS</text>

                {/* ARROW MARKER DEFINITIONS */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                  </marker>
                  <marker id="arrow-rev" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                  </marker>
                </defs>
              </svg>
            </div>

            {/* EXPANDABLE RAW CODE BOX */}
            <div className="mermaid-code-drawer">
              <span className="code-drawer-title">{lang === 'en' ? 'Mermaid Definition Syntax' : 'Sintaxis Mermaid de la Memoria'}</span>
              <pre><code>{MERMAID_CODE}</code></pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
