import { imageAssets } from '../../data/imageAssets';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTour } from '../../hooks/useTour';
import { useLanguage } from '../../context/LanguageContext';
import { useTypewriter } from '../../hooks/useTypewriter';
import { MetalFx } from './metal-fx';
import './AvatarGuide.css';

interface AvatarGuideProps {
  /** Called when the user presses "Chat" on the first tour step */
  onOpenChat?: () => void;
}

export const AvatarGuide: React.FC<AvatarGuideProps> = ({ onOpenChat }) => {
  const { startTour, isStarting, startError, isActive, currentStep, nextStep, prevStep, endTour, isLastStep, popoverWrapper } = useTour();
  const { lang } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const secondaryActionRef = useRef<HTMLButtonElement>(null);
  const reflectionTargets = useMemo(() => [secondaryActionRef], []);
  
  // Track scroll position to hide trigger
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShowTrigger = !isActive && location.pathname === '/' && !isScrolled;

  const isFirstStep = currentStep?.element === 'body' || currentStep?.element === '#hero';

  // Manage typewriter effect for current step description
  const { displayedText, isTyping, forceComplete } = useTypewriter(
    currentStep?.popover?.description, 
    8
  );

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTyping) {
      forceComplete();
    } else {
      nextStep();
    }
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTyping) {
      forceComplete();
    } else {
      prevStep();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    endTour();
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    endTour();
    onOpenChat?.();
  };

  const secondaryAction = isFirstStep
    ? { label: 'Chat', onClick: handleChatClick }
    : { label: lang === 'en' ? 'Back' : 'Atrás', onClick: handlePrevClick };

  const primaryAction = isFirstStep
    ? { label: lang === 'en' ? 'Follow tutorial' : 'Seguir tutorial', onClick: handleNextClick }
    : isLastStep
      ? { label: lang === 'en' ? 'Finish' : 'Finalizar', onClick: handleNextClick }
      : {
          label: isTyping
            ? (lang === 'en' ? 'Skip' : 'Saltar')
            : (lang === 'en' ? 'Next' : 'Siguiente'),
          onClick: handleNextClick,
        };

  return (
    <>
      {startError && <p role="status">{lang === 'en' ? 'The tour could not start. Please try again.' : 'No se pudo iniciar el recorrido. Inténtalo de nuevo.'}</p>}
      <AnimatePresence>
        {shouldShowTrigger && (
          <motion.button
            type="button"
            key="start-btn"
            className="avatar-guide-trigger"
            onClick={startTour}
            disabled={isStarting}
            aria-busy={isStarting}
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 300, damping: 24, delay: 0.75 },
            }}
            exit={{
              scale: 0,
              opacity: 0,
              y: 50,
              transition: { duration: 0.15 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={lang === 'en' ? 'Start guided tour' : 'Iniciar tour guiado'}
          >
            <img 
              src={imageAssets['/images/avatar-pixel.webp'].src}
              srcSet={imageAssets['/images/avatar-pixel.webp'].srcSet} sizes="70px" 
              alt="" 
              className="avatar-guide-trigger-img"
              width={52}
              height={52}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgY3Vyb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTRtLTRoNGE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+';
              }}
            />
            <div className="avatar-guide-trigger-text">
              {lang === 'en' ? 'Can I guide you?' : '¿Te puedo guiar?'}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {popoverWrapper && createPortal(
        <AnimatePresence>
          {isActive && currentStep && (
            <motion.div 
              key="dialog-box"
              className="avatar-dialog-wrapper"
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
	              <div
                  className="avatar-dialog-container"
                  role="dialog"
                  aria-modal="false"
                  aria-labelledby="avatar-dialog-title"
                >
                <div className="avatar-dialog-portrait-wrapper">
                  <img 
                    src={imageAssets['/images/avatar-pixel.webp'].src}
              srcSet={imageAssets['/images/avatar-pixel.webp'].srcSet} sizes="70px" 
                    alt="Avatar Guide" 
                    className={`avatar-dialog-portrait ${isTyping ? 'is-talking' : ''}`}
                    width={64}
                    height={64}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgY3Vyb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTRtLTRoNGE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+';
                      (e.target as HTMLImageElement).style.padding = '12px';
                      (e.target as HTMLImageElement).style.backgroundColor = 'var(--color-bg-primary)';
                    }}
                  />
                </div>
                <div className="avatar-dialog-content">
                  <div className="avatar-dialog-header">
	                    <h3 id="avatar-dialog-title">{currentStep.popover?.title}</h3>
	                    <button type="button" onClick={handleCloseClick} className="avatar-dialog-close" aria-label={lang === 'en' ? 'Close tour' : 'Cerrar recorrido'}>
                      &times;
                    </button>
                  </div>
	                  <div className="avatar-dialog-body">
                    <p>{displayedText}</p>
                    <span className={`avatar-dialog-cursor ${isTyping ? 'is-hidden' : ''}`}>▼</span>
                  </div>
                  <div className="avatar-dialog-actions">
                    <button
                      ref={secondaryActionRef}
                      type="button"
                      onClick={secondaryAction.onClick}
                      className="avatar-dialog-next-btn avatar-dialog-next-btn--secondary"
                    >
                      <span>{secondaryAction.label}</span>
                    </button>
                    <MetalFx
                      theme="dark"
                      variant="button"
                      preset="silver"
                      strength={0.42}
                      normalizeHostStyles={false}
                      reflectionTargets={reflectionTargets}
                      disableGlow
                      className="avatar-dialog-metal-action"
                    >
                      <button
                        type="button"
                        onClick={primaryAction.onClick}
                        className="avatar-dialog-next-btn avatar-dialog-next-btn--primary"
                      >
                        {primaryAction.label}
                      </button>
                    </MetalFx>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        popoverWrapper as Element
      )}
    </>
  );
};
