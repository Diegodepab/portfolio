import { useState, useEffect } from 'react';

export const useTypewriter = (text: string | undefined, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    if (!text) {
      setIsTyping(false);
      return;
    }
    
    setIsTyping(true);
    let i = 0;
    
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  const forceComplete = () => {
    if (text) {
      setDisplayedText(text);
      setIsTyping(false);
    }
  };

  return { displayedText, isTyping, forceComplete };
};
