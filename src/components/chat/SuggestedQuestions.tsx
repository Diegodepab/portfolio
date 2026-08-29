import React, { useState } from 'react';
import { MetalFx } from '../ui/metal-fx';

interface SuggestedQuestionsProps {
  lang: 'en' | 'es';
  onSelect: (question: string) => void;
}

interface Suggestion {
  id: string;
  en: string;
  es: string;
}

const VISIBLE_SUGGESTIONS = 3;

const suggestions: Suggestion[] = [
  { id: 'projects', en: 'Which projects best show your skills?', es: '¿Qué proyectos muestran mejor tus capacidades?' },
  { id: 'stack', en: 'What is your main tech stack?', es: '¿Cuál es tu stack tecnológico principal?' },
  { id: 'ai', en: 'What have you built with AI?', es: '¿Qué has desarrollado con IA?' },
  { id: 'experience', en: 'Tell me about your work experience', es: 'Cuéntame sobre tu experiencia profesional' },
  { id: 'education', en: 'What is your education and training?', es: '¿Cuál es tu formación y qué certificaciones tienes?' },
  { id: 'data-spaces', en: 'What do you do at Khaos with data spaces?', es: '¿Qué haces en Khaos con espacios de datos?' },
  { id: 'thesis', en: 'Why does your final thesis stand out?', es: '¿Por qué destaca tu TFG?' },
  { id: 'msurgery', en: 'What did you do at mSurgery?', es: '¿Qué hiciste en mSurgery?' },
  { id: 'contact', en: 'How can I contact you?', es: '¿Cómo puedo contactar contigo?' },
];

const pickRandomSuggestions = (): Suggestion[] => {
  const pool = [...suggestions];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }
  return pool.slice(0, VISIBLE_SUGGESTIONS);
};

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ lang, onSelect }) => {
  const [visibleSuggestions] = useState(pickRandomSuggestions);

  return (
    <div className="chat-suggestions" role="group" aria-label={lang === 'en' ? 'Suggested questions' : 'Preguntas sugeridas'}>
      {visibleSuggestions.map((suggestion) => (
        <MetalFx
          key={suggestion.id}
          variant="button"
          preset="silver"
          strength={0.5}
          disableGlow
          className="poke-metal-tint chat-suggestion-metal"
        >
          <button
            className="chat-suggestion-chip"
            onClick={() => onSelect(suggestion[lang])}
            type="button"
          >
            {suggestion[lang]}
          </button>
        </MetalFx>
      ))}
    </div>
  );
};
