import React, { useRef } from 'react';
import { useEffectVisibility } from '../../performance/useVisualEffects';
import { FiShield, FiTool, FiCpu, FiCheckCircle, FiSearch, FiDatabase, FiLayers } from 'react-icons/fi';
import { Icon } from '../icons/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { ThinkingOrb } from '../ui/thinking-orbs/ThinkingOrb';

export type ProjectVisualKind = 'kubernetes' | 'health' | 'ai' | 'extract' | 'titan' | 'alignx' | 'surgery' | 'smotts' | 'twins' | 'edaan' | 'circlescope' | 'generic';

interface ProjectVisualProps {
  kind?: ProjectVisualKind;
  label: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ kind = 'generic', label }) => {
  const { lang } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const { active } = useEffectVisibility(rootRef);

  return (
  <div ref={rootRef} data-animation-active={active} className={`project-visual project-visual--${kind}`} aria-label={label} role="img">
    <div className="project-visual-grid" />
    <div className="project-visual-window">
      <div className="project-visual-toolbar">
        <span /><span /><span />
        <small>
          {kind === 'kubernetes' ? 'cluster.prod'
            : kind === 'health' ? 'patient.live'
            : kind === 'ai' ? 'ai.graph'
            : kind === 'extract' ? 'extract.pipeline'
            : kind === 'titan' ? 'titan.agent'
            : kind === 'alignx' ? 'alignx.match'
            : kind === 'surgery' ? 'stream.live'
            : kind === 'smotts' ? 'sleep.monitor'
            : kind === 'twins' ? 'organ.scan'
            : kind === 'edaan' ? 'data.space'
            : kind === 'circlescope' ? 'force.graph'
            : 'project.preview'}
        </small>
      </div>
      {kind === 'kubernetes' ? (
        <div className="project-visual-cluster">
          <div className="cluster-node cluster-node--primary">
            <span className="cluster-pulse-ring" />
            <FiCheckCircle size={20} />
            <b>GitOps</b>
            <small>Argo CD</small>
            <span className="cluster-badge">Synced</span>
          </div>
          <div className="cluster-line cluster-line--one">
            <span className="cluster-packet p1" />
            <span className="cluster-packet p2" />
          </div>
          <div className="cluster-node cluster-node--secondary">
            <span className="cluster-pulse-ring" />
            <FiLayers size={20} />
            <b>Helm</b>
            <small>Release</small>
            <span className="cluster-badge">Deploy</span>
          </div>
          <div className="cluster-line cluster-line--two">
            <span className="cluster-packet p1" />
            <span className="cluster-packet p2" />
          </div>
          <div className="cluster-node cluster-node--tertiary">
            <span className="cluster-pulse-ring" />
            <FiShield size={20} />
            <b>Envoy</b>
            <small>Gateway</small>
            <span className="cluster-badge">Routing</span>
          </div>
          <div className="cluster-status">
            <span className="cluster-status-indicator"><i /> <span>Cluster Synced</span></span>
            <small>0 drift · 100% health</small>
          </div>
        </div>
      ) : kind === 'health' ? (
        <div className="project-visual-health">
          <div className="health-metric"><small>Heart rate</small><strong>72</strong><span>bpm</span></div>
          <svg viewBox="0 0 420 100" aria-hidden="true">
            <path className="health-line-shadow" d="M0 57 L52 57 L68 42 L83 74 L105 22 L126 57 L184 57 L204 45 L221 69 L245 29 L265 57 L420 57" />
            <path className="health-line" d="M0 57 L52 57 L68 42 L83 74 L105 22 L126 57 L184 57 L204 45 L221 69 L245 29 L265 57 L420 57" />
          </svg>
          <div className="health-status"><i /> Monitoring active <span>Updated now</span></div>
        </div>
      ) : kind === 'ai' ? (
        <div className="project-visual-ai">
          <div className="ai-search-interface">
            <div className="ai-search-bar">
              <FiSearch className="ai-search-icon" size={16} />
              <div className="ai-search-typing">
                <span className="ai-search-text">Find semantically related datasets</span>
                <span className="ai-cursor" />
              </div>
            </div>
            <div className="ai-search-results">
              <div className="ai-result-card ai-result-card--1">
                <div className="ai-result-match ai-result-match--1">98%</div>
                <div className="ai-result-lines">
                  <div className="ai-result-line" />
                  <div className="ai-result-line ai-result-line--short" />
                </div>
              </div>
              <div className="ai-result-card ai-result-card--2">
                <div className="ai-result-match ai-result-match--2">94%</div>
                <div className="ai-result-lines">
                  <div className="ai-result-line" />
                  <div className="ai-result-line ai-result-line--short" />
                </div>
              </div>
              <div className="ai-result-card ai-result-card--3">
                <div className="ai-result-match ai-result-match--3">89%</div>
                <div className="ai-result-lines">
                  <div className="ai-result-line" />
                  <div className="ai-result-line ai-result-line--short" />
                </div>
              </div>
            </div>
          </div>
          <div className="extract-status">
            <span className="extract-progress"><i /></span>
            <span>Multimodal LLM Ready</span>
          </div>
        </div>
      ) : kind === 'extract' ? (
        <div className="project-visual-extract">
          <div className="extract-pipeline">
            <div className="extract-stage extract-stage--1">
              <FiShield size={16} />
              <b>Security</b>
              <small>SHA-256 · AV</small>
            </div>
            <div className="extract-arrow" />
            <div className="extract-stage extract-stage--2">
              <FiTool size={16} />
              <b>Extract</b>
              <small>+30 formats</small>
            </div>
            <div className="extract-arrow" />
            <div className="extract-stage extract-stage--3">
              <FiCpu size={16} />
              <b>LLM</b>
              <small>Enrichment</small>
            </div>
            <div className="extract-arrow" />
            <div className="extract-stage extract-stage--4">
              <FiCheckCircle size={16} />
              <b>Validate</b>
              <small>DCAT-AP</small>
            </div>
          </div>
          <div className="extract-status">
            <span className="extract-progress"><i /></span>
            <span>Pipeline ready</span>
          </div>
        </div>
      ) : kind === 'titan' ? (
        <div className="project-visual-titan">
          <div className="titan-chat-container">
            <div className="titan-chat-msg titan-chat-msg--user">
              {lang === 'en' ? 'Build a workflow to classify the Iris dataset in CSV' : 'Crea un flujo para clasificar el dataset Iris en CSV'}
            </div>
            <div className="titan-chat-msg titan-chat-msg--agent">
              <div className="titan-agent-thinking">
                <ThinkingOrb state="working" size={20} />
              </div>
              <div className="titan-agent-text">
                {lang === 'en' ? 'Pipeline generated successfully.' : 'Flujo generado con éxito.'}
              </div>
            </div>
          </div>
          <div className="titan-canvas">
            <svg className="titan-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="20" y1="50" x2="50" y2="50" className="titan-edge titan-edge--1" />
              <line x1="50" y1="50" x2="80" y2="50" className="titan-edge titan-edge--2" />
            </svg>
            <div className="titan-node titan-node--start">
              <FiDatabase /><span>CSV Input</span>
            </div>
            <div className="titan-node titan-node--process">
              <FiLayers /><span>Preprocess</span>
            </div>
            <div className="titan-node titan-node--end">
              <FiCpu /><span>Classifier</span>
            </div>
          </div>
        </div>
      ) : kind === 'alignx' ? (
        <div className="project-visual-alignx">
          <div className="alignx-pipeline">
            {/* Signal rows — each fades in sequentially */}
            <div className="alignx-signal alignx-signal--1">
              <span className="alignx-signal-label">lexical</span>
              <div className="alignx-pair">
                <span className="alignx-entity alignx-entity--src">heart_apex</span>
                <span className="alignx-arrow">→</span>
                <span className="alignx-entity alignx-entity--tgt">heart apex</span>
              </div>
              <span className="alignx-score">0.96</span>
            </div>
            <div className="alignx-signal alignx-signal--2">
              <span className="alignx-signal-label">semantic</span>
              <div className="alignx-pair">
                <span className="alignx-entity alignx-entity--src">hepatic duct</span>
                <span className="alignx-arrow">→</span>
                <span className="alignx-entity alignx-entity--tgt">bile duct</span>
              </div>
              <span className="alignx-score">0.89</span>
            </div>
            <div className="alignx-signal alignx-signal--3">
              <span className="alignx-signal-label">structural</span>
              <div className="alignx-pair">
                <span className="alignx-entity alignx-entity--src">Class:A42</span>
                <span className="alignx-arrow">→</span>
                <span className="alignx-entity alignx-entity--tgt">Class:B17</span>
              </div>
              <span className="alignx-score">0.74</span>
            </div>
            {/* Consensus bar with Orb */}
            <div className="alignx-consensus" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
                <ThinkingOrb state="solving" size={64} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', marginBottom: '4px' }}>consensus · borda</span>
                <div className="alignx-consensus-bar"><div className="alignx-consensus-fill" /></div>
                <span className="alignx-consensus-count">1087 mappings</span>
              </div>
            </div>
          </div>
        </div>
      ) : kind === 'surgery' ? (
        <div className="project-visual-surgery">
          {/* Medical Monitor Fluoroscopic Grid */}
          <div className="surgery-ecg-grid" />
          <div className="surgery-beam-sweep" />

          {/* HUD Brackets */}
          <div className="surgery-hud-corner tl" />
          <div className="surgery-hud-corner tr" />
          <div className="surgery-hud-corner bl" />
          <div className="surgery-hud-corner br" />

          {/* Top Status & Telemetry Bar */}
          <div className="surgery-top-bar">
            <div className="surgery-live-badge">
              <span className="surgery-live-dot" />
              <span className="surgery-live-title">OR-1 · STERILE FIELD</span>
            </div>
            <div className="surgery-vitals">
              <div className="surgery-vital vital-hr">
                <span className="vital-label">ECG · HR</span>
                <span className="vital-num">
                  <span className="vital-heart">♥</span> 75 <small>BPM</small>
                </span>
              </div>
              <div className="surgery-vital vital-spo2">
                <span className="vital-label">SpO₂</span>
                <span className="vital-num">99<small>%</small></span>
              </div>
              <div className="surgery-vital vital-art">
                <span className="vital-label">ART</span>
                <span className="vital-num">120/80</span>
              </div>
            </div>
          </div>

          {/* Dual ECG & Plethysmograph Waveform Display */}
          <div className="surgery-wave-display">
            {/* ECG Lead II Trace */}
            <div className="surgery-wave-channel">
              <div className="surgery-channel-tag">
                <span className="lead-name">LEAD II</span>
                <span className="lead-meta">1.0 mV · FILTER · 25 mm/s</span>
              </div>
              <div className="surgery-ecg-viewport">
                <div className="surgery-ecg-scroller">
                  {[0, 1].map((copy) => (
                    <svg
                      key={copy}
                      className="surgery-ecg-svg"
                      viewBox="0 0 400 90"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        className="surgery-ecg-glow"
                        d="M 0 50 L 24 50 C 28 50 32 40 37 40 C 42 40 46 50 50 50 L 65 50 L 71 56 L 80 10 L 89 74 L 96 50 L 110 50 C 116 50 122 28 130 28 C 138 28 144 50 150 50 L 200 50 L 224 50 C 228 50 232 40 237 40 C 242 40 246 50 250 50 L 265 50 L 271 56 L 280 10 L 289 74 L 296 50 L 310 50 C 316 50 322 28 330 28 C 338 28 344 50 350 50 L 400 50"
                      />
                      <path
                        className="surgery-ecg-core"
                        d="M 0 50 L 24 50 C 28 50 32 40 37 40 C 42 40 46 50 50 50 L 65 50 L 71 56 L 80 10 L 89 74 L 96 50 L 110 50 C 116 50 122 28 130 28 C 138 28 144 50 150 50 L 200 50 L 224 50 C 228 50 232 40 237 40 C 242 40 246 50 250 50 L 265 50 L 271 56 L 280 10 L 289 74 L 296 50 L 310 50 C 316 50 322 28 330 28 C 338 28 344 50 350 50 L 400 50"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Plethysmograph (SpO2 pulse oximetry) Trace */}
            <div className="surgery-wave-channel surgery-wave-channel--pleth">
              <div className="surgery-channel-tag">
                <span className="lead-name lead-name--pleth">PLETH</span>
                <span className="lead-meta">PULSE SYNC</span>
              </div>
              <div className="surgery-pleth-viewport">
                <div className="surgery-pleth-scroller">
                  {[0, 1].map((copy) => (
                    <svg
                      key={copy}
                      className="surgery-pleth-svg"
                      viewBox="0 0 400 50"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        className="surgery-pleth-glow"
                        d="M 0 36 L 25 36 C 34 36 44 8 54 8 C 62 8 68 24 74 24 C 78 24 81 19 85 19 C 90 19 94 28 98 30 C 108 34 120 36 135 36 L 200 36 L 225 36 C 234 36 244 8 254 8 C 262 8 268 24 274 24 C 278 24 281 19 285 19 C 290 19 294 28 298 30 C 308 34 320 36 335 36 L 400 36"
                      />
                      <path
                        className="surgery-pleth-core"
                        d="M 0 36 L 25 36 C 34 36 44 8 54 8 C 62 8 68 24 74 24 C 78 24 81 19 85 19 C 90 19 94 28 98 30 C 108 34 120 36 135 36 L 200 36 L 225 36 C 234 36 244 8 254 8 C 262 8 268 24 274 24 C 278 24 281 19 285 19 C 290 19 294 28 298 30 C 308 34 320 36 335 36 L 400 36"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Central Holographic Brand Badge */}
          <div className="surgery-brand">
            <div className="surgery-brand-logo-wrap">
              <span className="surgery-brand-ring" />
              <img src="/images/msurgery/favicon.png" alt="mSurgery Icon" className="surgery-logo-img" />
            </div>
            <div className="surgery-logo-text">
              <span className="surgery-logo-m">m</span><span className="surgery-logo-rest">Surgery</span>
            </div>
            <div className="surgery-subtitle">Surgical Telepresence · 4K Live</div>
          </div>

          {/* Bottom Telemetry & Connected Specialists */}
          <div className="surgery-bottom-bar">
            <div className="surgery-stream-meta">
              <span className="surgery-protocol">WebRTC</span>
              <span className="surgery-latency">18ms · 0% loss</span>
            </div>
            <div className="surgery-viewers">
              <div className="surgery-viewer-dots">
                <div className="surgery-viewer" />
                <div className="surgery-viewer" />
                <div className="surgery-viewer" />
              </div>
              <small>142 IN OR</small>
            </div>
          </div>
        </div>
      ) : kind === 'smotts' ? (
        <div className="project-visual-smotts">
          <div className="smotts-header"><span>EEG Signal</span><span className="smotts-rem-badge">REM</span></div>
          <svg className="smotts-wave" viewBox="0 0 200 60" preserveAspectRatio="none">
            <polyline className="smotts-line smotts-line--1" points="0,30 10,30 15,28 20,30 30,30 35,10 38,50 41,15 44,45 47,30 55,30 60,28 65,30 75,30 80,12 83,48 86,18 89,42 92,30 100,30 110,30 115,28 120,30 130,30 135,10 138,50 141,15 144,45 147,30 155,30 160,28 165,30 175,30 180,12 183,48 186,18 189,42 192,30 200,30" />
            <polyline className="smotts-line smotts-line--2" points="0,35 10,35 20,33 30,35 40,35 50,37 60,33 70,35 80,35 90,37 100,33 110,35 120,35 130,33 140,35 150,37 160,33 170,35 180,35 190,37 200,35" />
          </svg>
          <div className="smotts-readings">
            <span><small>HR</small>62 bpm</span>
            <span><small>SpO₂</small>97%</span>
            <span><small>Stage</small>REM</span>
          </div>
        </div>
      ) : kind === 'twins' ? (
        <div className="project-visual-twins">
          <div className="twins-scanner">
            <div className="twins-scan-line" />
            <svg className="twins-organ" viewBox="0 0 100 100">
              <g className="twins-mesh">
                {/* Back slice */}
                <ellipse cx="50" cy="50" rx="30" ry="8" className="twins-slice twins-slice--3" style={{ transform: 'translateZ(-15px)' }} />
                
                {/* Anatomical Brain Hologram */}
                <svg viewBox="0 0 24 24" x="15" y="15" width="70" height="70" overflow="visible">
                  {/* Outer shell (slightly back) */}
                  <g style={{ transform: 'translateZ(-5px)' }}>
                     <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5A2.5 2.5 0 0 1 14.5 2A5 5 0 0 1 19.5 7A2 2 0 0 1 21.5 9A2 2 0 0 1 19.5 11A2.5 2.5 0 0 1 22 13.5A4.5 4.5 0 0 1 17.5 18A2.5 2.5 0 0 1 15 20.5A3 3 0 0 1 12 17.5A3 3 0 0 1 9 20.5A2.5 2.5 0 0 1 6.5 18A4.5 4.5 0 0 1 2 13.5A2.5 2.5 0 0 1 4.5 11A2 2 0 0 1 2.5 9A2 2 0 0 1 4.5 7A5 5 0 0 1 9.5 2Z" className="twins-wire" style={{ strokeWidth: 0.3 }} />
                  </g>
                  {/* Inner structures (center) */}
                  <g style={{ transform: 'translateZ(0px)' }}>
                     <path d="M12 4.5V17.5" className="twins-wire twins-wire--inner" style={{ strokeWidth: 0.3 }} />
                     <path d="M12 9a2 2 0 0 0-2 2 2 2 0 0 0 2 2" className="twins-wire twins-wire--core" style={{ strokeWidth: 0.3 }} />
                     <path d="M12 13a2 2 0 0 0-2 2" className="twins-wire twins-wire--core" style={{ strokeWidth: 0.3 }} />
                     <path d="M12 9a2 2 0 0 1 2 2 2 2 0 0 1-2 2" className="twins-wire twins-wire--core" style={{ strokeWidth: 0.3 }} />
                     <path d="M12 13a2 2 0 0 1 2 2" className="twins-wire twins-wire--core" style={{ strokeWidth: 0.3 }} />
                     <circle cx="12" cy="11" r="0.6" className="twins-node twins-node--delay" />
                  </g>
                  {/* Neural nodes (front) */}
                  <g style={{ transform: 'translateZ(10px)' }}>
                     <circle cx="9.5" cy="4.5" r="0.5" className="twins-node" />
                     <circle cx="14.5" cy="4.5" r="0.5" className="twins-node twins-node--delay" />
                     <circle cx="6.5" cy="18" r="0.5" className="twins-node" />
                     <circle cx="17.5" cy="18" r="0.5" className="twins-node" />
                     <line x1="9.5" y1="4.5" x2="12" y2="11" className="twins-connection" style={{ strokeWidth: 0.2 }} />
                     <line x1="14.5" y1="4.5" x2="12" y2="11" className="twins-connection" style={{ strokeWidth: 0.2 }} />
                     <line x1="6.5" y1="18" x2="12" y2="11" className="twins-connection" style={{ strokeWidth: 0.2 }} />
                     <line x1="17.5" y1="18" x2="12" y2="11" className="twins-connection" style={{ strokeWidth: 0.2 }} />
                  </g>
                </svg>

                {/* Front slices */}
                <ellipse cx="50" cy="35" rx="26" ry="7" className="twins-slice twins-slice--2" style={{ transform: 'translateZ(15px)' }} />
                <ellipse cx="50" cy="65" rx="22" ry="6" className="twins-slice twins-slice--1" style={{ transform: 'translateZ(25px)' }} />
              </g>
            </svg>
          </div>
          <div className="twins-meta">
            <span className="twins-badge">3D Mesh Ready</span>
            <small>Svelte 4 → 5</small>
          </div>
        </div>
      ) : kind === 'edaan' ? (
        <div className="project-visual-edaan">
          <svg className="edaan-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 15 50 C 30 50, 35 50, 50 50" className="edaan-line edaan-line--1" />
            <path d="M 85 25 C 65 25, 65 50, 50 50" className="edaan-line edaan-line--2" />
            <path d="M 85 75 C 65 75, 65 50, 50 50" className="edaan-line edaan-line--3" />
          </svg>
          
          <div className="edaan-sys edaan-sys--prov" style={{ top: '50%', left: '15%' }}>
            <Icon name="database" size={12} />
            <span>AgriData</span>
            <div className="edaan-plug">IDS</div>
          </div>

          <div className="edaan-sys edaan-sys--cons1" style={{ top: '25%', left: '85%' }}>
            <div className="edaan-plug">IDS</div>
            <span>Analytics</span>
            <Icon name="activity" size={12} />
          </div>

          <div className="edaan-sys edaan-sys--cons2" style={{ top: '75%', left: '85%' }}>
            <div className="edaan-plug">IDS</div>
            <span>GovApp</span>
            <Icon name="layout" size={12} />
          </div>

          <div className="edaan-broker-node" style={{ top: '50%', left: '50%' }}>
            <Icon name="globe" size={16} />
            <div className="edaan-broker-rings" />
            <span>MDS Broker</span>
          </div>

          <div className="edaan-status">
            <div className="edaan-status-bar">
               <span className="edaan-status-indicator" />
               <small>Federated Network Active</small>
            </div>
          </div>
        </div>
      ) : kind === 'circlescope' ? (
        <div className="project-visual-circlescope">
          <svg className="circlescope-graph" viewBox="0 0 100 100">
            <line x1="50" y1="50" x2="20" y2="30" className="circlescope-edge" />
            <line x1="50" y1="50" x2="80" y2="30" className="circlescope-edge circlescope-edge--mutual" />
            <line x1="50" y1="50" x2="30" y2="80" className="circlescope-edge circlescope-edge--mutual" />
            <line x1="50" y1="50" x2="70" y2="80" className="circlescope-edge" />
            <line x1="20" y1="30" x2="30" y2="80" className="circlescope-edge" />
            
            <circle cx="20" cy="30" r="5" className="circlescope-node circlescope-node--follower" />
            <circle cx="80" cy="30" r="6" className="circlescope-node circlescope-node--mutual" />
            <circle cx="30" cy="80" r="7" className="circlescope-node circlescope-node--mutual" />
            <circle cx="70" cy="80" r="4" className="circlescope-node circlescope-node--following" />
            
            <circle cx="50" cy="50" r="10" className="circlescope-node circlescope-node--center" />
          </svg>
          <div className="circlescope-metrics">
            <span><strong data-tone="1">24</strong>Mutuals</span>
            <span><strong data-tone="2">12</strong>Fans</span>
            <span><strong data-tone="3">8</strong>Traitors</span>
          </div>
        </div>
      ) : (
        <div className="project-visual-generic"><Icon name="folder" size={46} /><span>{label}</span></div>
      )}
    </div>
  </div>
  );
};
