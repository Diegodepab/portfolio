import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './VideoPreview.css';

export function VideoPreview({ src, title }: { src: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const { lang } = useLanguage();
  let id = '';
  try {
    const url = new URL(src);
    id = url.searchParams.get('v') ?? url.pathname.split('/').filter(Boolean).pop() ?? '';
  } catch { /* Invalid video URLs never become iframe sources. */ }
  if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;
  return <div className="video-preview">
    {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> :
      <button type="button" onClick={() => setPlaying(true)}>
        <span className="video-preview__play" aria-hidden="true">▶</span>
        <strong>{title}</strong>
        <span>{lang === 'es' ? 'Reproducir vídeo de YouTube' : 'Play YouTube video'}</span>
      </button>}
  </div>;
}
