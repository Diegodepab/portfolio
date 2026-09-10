import { useVisualEffects } from '../performance/useVisualEffects';
import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (text: string | undefined, speed: number = 30) => {
  const { reducedMotion, pageVisible } = useVisualEffects();
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    if (!text) {
      setIsTyping(false);
      return;
    }
    
    if (reducedMotion || !pageVisible) { setDisplayedText(text); setIsTyping(false); return; }
    setIsTyping(true);
    let i = 0;
    
    const intervalId = timer.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, reducedMotion, pageVisible]);

  const forceComplete = () => {
    clearInterval(timer.current);
    if (text) {
      setDisplayedText(text);
      setIsTyping(false);
    }
  };

  return { displayedText, isTyping, forceComplete };
};
