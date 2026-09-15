import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { FiAlertCircle, FiArrowUpRight, FiCheckCircle, FiSend } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { siteConfig, socialLinks } from '../../data/config';
import { Icon } from '../icons/Icon';
import { SectionHeading } from '../ui/SectionHeading';
import { AntsCursor } from '../ui/AntsCursor';
import { MetalFx } from '../ui/metal-fx';
import './Contact.css';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormSubmitResponse {
  success?: boolean | 'true' | 'false';
  message?: string;
}

const formEndpoint = import.meta.env.DEV
  ? '/api/contact'
  : `https://formsubmit.co/ajax/${encodeURIComponent(siteConfig.email)}`;

export const Contact = () => {
  const { lang } = useLanguage();
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;

    const form = event.currentTarget;
    const fields = new FormData(form);

    setStatus('submitting');
    const controller = new AbortController();
    pending.current = controller;
    const timeout = window.setTimeout(() => controller.abort('timeout'), 15_000);

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(fields.entries())),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null) as FormSubmitResponse | null;
      const accepted = result?.success === true || result?.success === 'true';

      if (!response.ok || !accepted) {
        throw new Error(result?.message ?? 'Unable to submit the contact form');
      }

      form.reset();
      setStatus('success');
    } catch {
      if (!controller.signal.aborted || controller.signal.reason === 'timeout') setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      pending.current = null;
    }
  };

  const clearFeedback = () => {
    if (status === 'success' || status === 'error') setStatus('idle');
  };

  return (
    <motion.section
      id="contact"
      className="contact-section"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
    >
      <AntsCursor color="var(--color-accent-1)" numberOfAnts={20} speed={1.1} sizeMultiplier={0.5} opacity={0.3} zIndex="-1" />
      <SectionHeading title={lang === 'en' ? "Let's talk" : 'Contacto'} />

      <div className="contact-panel">
        <div className="contact-intro">
          <h3>{lang === 'en' ? 'Let\'s talk.' : 'Hablemos'}</h3>
          <a className="contact-email" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>

          <nav className="contact-socials" aria-label={lang === 'en' ? 'Social profiles' : 'Perfiles sociales'}>
            <p>{lang === 'en' ? 'You can also find me on' : 'También puedes encontrarme en'}</p>
            <ul>
              {socialLinks.map(link => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon name={link.icon} size={20} />
                    <span>{link.name}</span>
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <form
          className="contact-form"
          action={`https://formsubmit.co/${siteConfig.email}`}
          method="POST"
          onSubmit={handleSubmit}
          onChange={clearFeedback}
          aria-busy={status === 'submitting'}
          aria-label={lang === 'en' ? 'Contact form' : 'Formulario de contacto'}
        >
          <input type="hidden" name="_subject" value="Nuevo mensaje desde el portafolio" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input
            type="hidden"
            name="_url"
            value={`${siteConfig.url}/#contact`}
          />
          <label className="contact-honey" aria-hidden="true">
            Website
            <input name="_honey" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="contact-field-row">
            <label className="contact-field">
              <span>{lang === 'en' ? 'Name' : 'Nombre'}</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder={lang === 'en' ? 'Your name' : 'Tu nombre'}
                minLength={2}
                maxLength={80}
                required
              />
            </label>

            <label className="contact-field">
              <span>{lang === 'en' ? 'Email' : 'Correo'}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                maxLength={120}
                required
              />
            </label>
          </div>

          <label className="contact-field">
            <span>{lang === 'en' ? 'Subject' : 'Asunto'}</span>
            <input
              type="text"
              name="subject"
              placeholder={lang === 'en' ? 'What would you like to talk about?' : '¿Sobre qué te gustaría hablar?'}
              minLength={3}
              maxLength={120}
              required
            />
          </label>

          <label className="contact-field">
            <span>{lang === 'en' ? 'Message' : 'Mensaje'}</span>
            <textarea
              name="message"
              rows={6}
              placeholder={lang === 'en' ? 'Tell me a little about your idea…' : 'Cuéntame un poco sobre tu idea…'}
              minLength={10}
              maxLength={3000}
              required
            />
          </label>

          <div className="contact-form-footer">
            <p className={`contact-feedback contact-feedback--${status}`} aria-live="polite" role="status">
              {status === 'success' && <><FiCheckCircle aria-hidden="true" /> {lang === 'en' ? 'Message sent. I will get back to you soon.' : 'Mensaje enviado. Te responderé pronto.'}</>}
              {status === 'error' && <><FiAlertCircle aria-hidden="true" /> {lang === 'en' ? 'It could not be sent. Please try again.' : 'No se pudo enviar. Inténtalo de nuevo.'}</>}
            </p>
            <MetalFx theme="dark" variant="button" preset="silver" strength={0.8} normalizeHostStyles={false}>
              <motion.button
                type="submit"
                className="contact-submit"
                disabled={status === 'submitting'}
                whileHover={status === 'submitting' ? undefined : { y: -2 }}
                whileTap={status === 'submitting' ? undefined : { scale: 0.98 }}
              >
                <span>{status === 'submitting'
                  ? (lang === 'en' ? 'Sending…' : 'Enviando…')
                  : (lang === 'en' ? 'Send message' : 'Enviar mensaje')}</span>
                <FiSend aria-hidden="true" />
              </motion.button>
            </MetalFx>
          </div>
        </form>
      </div>
    </motion.section>
  );
};
