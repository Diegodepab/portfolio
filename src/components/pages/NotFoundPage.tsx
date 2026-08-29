import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../context/LanguageContext';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  const { lang } = useLanguage();

  return (
    <main className="not-found-page">
      <Helmet title={lang === 'en' ? 'Page not found | Diego De Pablo' : 'Página no encontrada | Diego De Pablo'}>
        <meta name="robots" content="noindex" />
      </Helmet>
      <p>404</p>
      <h1>{lang === 'en' ? 'This page does not exist' : 'Esta página no existe'}</h1>
      <span>
        {lang === 'en'
          ? 'The link may have changed or the page may have been removed.'
          : 'Es posible que el enlace haya cambiado o que la página se haya eliminado.'}
      </span>
      <Link to="/">← {lang === 'en' ? 'Return home' : 'Volver al inicio'}</Link>
    </main>
  );
};
