import { Component, type ReactNode } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { siteConfig } from '../../data/config';
import './ErrorBoundary.css';

function Recovery() {
  const { lang } = useLanguage();
  return <section className="recovery" role="alert">
    <h1>{lang === 'es' ? 'No se ha podido cargar esta página' : 'This page could not load'}</h1>
    <p>{lang === 'es' ? 'Comprueba tu conexión y vuelve a intentarlo.' : 'Check your connection and try again.'}</p>
    <div className="recovery__actions">
      <button type="button" onClick={() => window.location.reload()}>{lang === 'es' ? 'Volver a cargar' : 'Reload page'}</button>
      <a href="/">{lang === 'es' ? 'Ir al inicio' : 'Go home'}</a>
      <a href={`mailto:${siteConfig.email}`}>{lang === 'es' ? 'Contactar con Diego' : 'Contact Diego'}</a>
    </div>
  </section>;
}

/** Failed imports stay recoverable; a reload is always an explicit user action. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Recovery /> : this.props.children; }
}
