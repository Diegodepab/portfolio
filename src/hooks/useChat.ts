import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { streamChat } from '../services/chatService';
import type { ChatMessage, ChatState, ChatReference } from '../components/chat/types';

const MAX_MESSAGES = 50;
const MAX_AI_CALLS_PER_SESSION = 8;
let messageCounter = 0;

const createId = () => `msg-${Date.now()}-${++messageCounter}`;

import { experiences } from '../data/experience';
import { education, certificates } from '../data/education';
import { featuredProjects } from '../data/projects';

// ─── Experience calculator ───────────────────────────────────────────
const calculateTotalExperienceMonths = () => {
  let totalMonths = 0;
  const now = new Date();

  const getMonthNum = (m: string) => {
    const ms = m.toLowerCase();
    if (ms.startsWith('jan') || ms.startsWith('ene')) return 1;
    if (ms.startsWith('feb')) return 2;
    if (ms.startsWith('mar')) return 3;
    if (ms.startsWith('apr') || ms.startsWith('abr')) return 4;
    if (ms.startsWith('may')) return 5;
    if (ms.startsWith('jun')) return 6;
    if (ms.startsWith('jul')) return 7;
    if (ms.startsWith('aug') || ms.startsWith('ago')) return 8;
    if (ms.startsWith('sep')) return 9;
    if (ms.startsWith('oct')) return 10;
    if (ms.startsWith('nov')) return 11;
    if (ms.startsWith('dec') || ms.startsWith('dic')) return 12;
    return 1;
  };

  experiences.forEach(exp => {
    const startM = getMonthNum(exp.startDate.month.en);
    const startY = exp.startDate.year;
    let endM = now.getMonth() + 1;
    let endY = now.getFullYear();
    if (exp.endDate) {
      endM = getMonthNum(exp.endDate.month.en);
      endY = exp.endDate.year;
    }
    const months = (endY - startY) * 12 + (endM - startM) + 1;
    totalMonths += months > 0 ? months : 0;
  });
  return totalMonths;
};

// ─── Heuristic keyword matcher ───────────────────────────────────────
// Returns a predefined answer if the user's message matches known patterns,
// saving an API call entirely. All answers are written to sell Diego well.
interface HeuristicMatch {
  answer: string;
  route?: string;
  references?: ChatReference[];
}

const matchHeuristic = (text: string, lang: 'en' | 'es'): HeuristicMatch | null => {
  const q = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const totalMonths = calculateTotalExperienceMonths();
  const years = Math.floor(totalMonths / 12);
  const companies = experiences.map(e => `**${e.company}**`).join(', ');
  const shuffledProjects = [...featuredProjects].sort(() => 0.5 - Math.random()).slice(0, 2);
  const projNames = shuffledProjects.map(p => `**${p.name[lang]}**`).join(lang === 'en' ? ' and ' : ' y ');
  const degrees = education.map(e => `**${e.degree[lang]}** — ${e.field[lang]}`).join(lang === 'en' ? ' and ' : ' y ');
  const certs = certificates.map(c => `*${c.name[lang]}*`).join(', ');

  // Pattern matchers: [keywords[], response]
  type PatternDef = { keywords: string[]; en: string[]; es: string[]; route?: string };
  const patterns: PatternDef[] = [
    {
      keywords: ['proyecto', 'proyectos', 'projects', 'que ha hecho', 'what have you built', 'portfolio', 'portafolio', 'trabajos'],
      en: [
        `I've worked on infrastructure, AI systems, health platforms, and more. Highlights include ${projNames}. Check out my full project explorer!`,
        `My portfolio ranges from low-level systems to LLM agents. I'd highlight ${projNames}. You can see them all in the projects section!`,
      ],
      es: [
        `He trabajado en infraestructura, sistemas de IA, plataformas de salud y más. Destacaría ${projNames}. ¡Echa un vistazo a mi explorador de proyectos!`,
        `Mi portafolio abarca desde sistemas de bajo nivel hasta agentes con LLMs. Destacaría ${projNames}. ¡Puedes verlos todos en la sección de proyectos!`,
      ],
      route: '/projects',
    },
    {
      keywords: ['tecnologia', 'tecnologias', 'technology', 'stack', 'herramienta', 'tools', 'lenguaje', 'language', 'python', 'react', 'docker', 'kubernetes'],
      en: [
        "My core stack is **Python, React, TypeScript, Docker, and Kubernetes**. I also work with FastAPI, Next.js, SvelteKit, PostgreSQL, and various AI/ML tools including LLMs and vector databases.",
        "I primarily build with **Python, TypeScript, React, and Kubernetes**. I'm very comfortable with Docker, FastAPI, and integrating AI models into production apps.",
      ],
      es: [
        "Mi stack principal es **Python, React, TypeScript, Docker y Kubernetes**. También trabajo con FastAPI, Next.js, SvelteKit, PostgreSQL, y herramientas de IA/ML incluyendo LLMs y bases de datos vectoriales.",
        "Desarrollo principalmente con **Python, TypeScript, React y Kubernetes**. Me manejo muy bien con Docker, FastAPI y en la integración de modelos de IA en aplicaciones de producción.",
      ],
      route: '/#about',
    },
    {
      keywords: ['experiencia', 'experience', 'trabajo', 'work', 'empresa', 'company', 'donde', 'where', 'career', 'carrera'],
      en: [
        `I have **${years > 0 ? years + '+ years' : totalMonths + ' months'}** of professional experience at ${companies}. I specialize in full-stack development, infrastructure, and AI-powered products.`,
        `I've been working professionally for **${years > 0 ? years + ' years' : totalMonths + ' months'}**, notably at ${companies}. My focus is on scalable architectures and AI integrations.`,
      ],
      es: [
        `Tengo **${years > 0 ? years + '+ años' : totalMonths + ' meses'}** de experiencia profesional en ${companies}. Me especializo en desarrollo full-stack, infraestructura y productos con IA.`,
        `Llevo **${years > 0 ? years + ' años' : totalMonths + ' meses'}** trabajando en el sector, destacando mi paso por ${companies}. Me centro en arquitecturas escalables e integración de IA.`,
      ],
      route: '/#jobs',
    },
    {
      keywords: ['formacion', 'education', 'estudio', 'estudios', 'estudiaste', 'universidad', 'university', 'degree', 'grado', 'master', 'carrera academica'],
      en: [
        `I hold ${degrees}. I also have certifications: ${certs}. My TFG (final thesis) on IoT + Telemedicine was graded **10/10 with Honours** — best of the cohort!`,
        `My academic background includes ${degrees}. My final thesis (TFG) was awarded a **10/10 with Honours**. I also hold several certifications: ${certs}.`,
      ],
      es: [
        `Tengo ${degrees}. Además cuento con certificaciones: ${certs}. Mi TFG sobre IoT + Telemedicina obtuvo un **10 con Matrícula de Honor** — ¡mejor TFG de la promoción!`,
        `Mi formación académica incluye ${degrees}. Mi TFG fue premiado con un **10 y Matrícula de Honor**. Además, tengo certificaciones como: ${certs}.`,
      ],
      route: '/#about',
    },
    {
      keywords: ['ia', 'ai', 'inteligencia artificial', 'artificial intelligence', 'llm', 'machine learning', 'deep learning', 'agente', 'agent', 'rag'],
      en: [
        "I've built **RAG systems, autonomous LLM agents, and semantic search engines**. My projects MetaDataSearch and TITAN are great examples of production-level AI. Even this chat assistant is one of my creations!",
        "AI integration is one of my strong suits. I've developed RAG pipelines and autonomous agents (like TITAN and MetaDataSearch), and even built this very chat assistant from scratch!",
      ],
      es: [
        "He construido **sistemas RAG, agentes autónomos con LLMs y motores de búsqueda semántica**. Mis proyectos MetaDataSearch y TITAN son excelentes ejemplos de IA en producción. ¡Incluso este chat es una de mis creaciones!",
        "La integración de IA es uno de mis puntos fuertes. He desarrollado pipelines RAG y agentes autónomos (como TITAN y MetaDataSearch), ¡y yo mismo programé a este asistente conversacional!",
      ],
      route: '/projects',
    },
    {
      keywords: ['contacto', 'contact', 'email', 'correo', 'contratar', 'hire', 'linkedin', 'hablar', 'talk', 'reach'],
      en: [
        "You can reach Diego directly on **[LinkedIn](https://www.linkedin.com/in/diego-de-pablo/)** or email him at **diegodepablo.programa@gmail.com**. He'd love to hear from you!",
        "The best way to get in touch is via **[LinkedIn](https://www.linkedin.com/in/diego-de-pablo/)** or by dropping an email to **diegodepablo.programa@gmail.com**.",
      ],
      es: [
        "Puedes contactar con Diego directamente en **[LinkedIn](https://www.linkedin.com/in/diego-de-pablo/)** o por email en **diegodepablo.programa@gmail.com**. ¡Estará encantado de hablar contigo!",
        "La mejor forma de hablar con Diego es a través de su **[LinkedIn](https://www.linkedin.com/in/diego-de-pablo/)** o escribiendo a **diegodepablo.programa@gmail.com**.",
      ],
      route: '/#contact',
    },
    {
      keywords: ['hola', 'hello', 'hi', 'hey', 'buenas', 'saludos', 'greetings'],
      en: [
        "Hello! 👋 I'm Diego's portfolio assistant. Ask me anything about his projects, experience, skills, or how to reach him!",
        "Hi there! 👋 I can help you navigate Diego's portfolio. What would you like to know about his professional background?",
      ],
      es: [
        "¡Hola! 👋 Soy el asistente del portafolio de Diego. ¡Pregúntame lo que quieras sobre sus proyectos, experiencia, habilidades o cómo contactarlo!",
        "¡Buenas! 👋 Estoy aquí para ayudarte a explorar el perfil de Diego. ¿Qué te gustaría saber sobre su carrera o tecnologías?",
      ],
    },
    {
      keywords: ['tfg', 'tesis', 'thesis', 'pulsera', 'bracelet', 'paciente', 'patient', 'iot', 'telemedicina', 'telemedicine'],
      en: [
        "Diego's final thesis was a **remote patient monitoring system** combining an IoT wristband (ESP32, SpO₂, fall detection) with a telemedicine web platform. It was graded **10/10 with Honours** and rated best thesis of his entire cohort.",
      ],
      es: [
        "El TFG de Diego fue un **sistema de monitorización remota de pacientes** que combina una pulsera IoT (ESP32, SpO₂, detección de caídas) con una plataforma web de telemedicina. Fue calificado con un **10 y Matrícula de Honor** y reconocido como mejor TFG de toda su promoción.",
      ],
      route: '/projects/tfg-patient-monitoring',
    },
    {
      keywords: ['khaos', 'metadata', 'metadataxtract', 'metadatasearch', 'data space', 'espacio de datos'],
      en: [
        "At **Khaos Research** (University of Málaga), Diego builds full-stack applications for federated data spaces. His key projects include **MetaDataXtract** (metadata extraction pipeline) and **MetaDataSearch** (AI-powered semantic search engine).",
      ],
      es: [
        "En **Khaos Research** (Universidad de Málaga), Diego desarrolla aplicaciones full-stack para espacios de datos federados. Sus proyectos clave incluyen **MetaDataXtract** (pipeline de extracción de metadatos) y **MetaDataSearch** (motor de búsqueda semántica con IA).",
      ],
      route: '/#jobs',
    },
    {
      keywords: ['msurgery', 'cirugia', 'surgery', 'smotts', 'digital twin', 'gemelo'],
      en: [
        "Diego interned at **mSurgery**, a surgical telepresence startup. He migrated repos from Svelte 4 to 5, built features for **SMOTTS** (sleep diagnostics) and **3D Digital Twins** (organ scanning), and presented to international investors in English.",
      ],
      es: [
        "Diego hizo prácticas en **mSurgery**, a una startup de telepresencia quirúrgica. Migró repositorios de Svelte 4 a 5, desarrolló funciones para **SMOTTS** (diagnóstico del sueño) y **Gemelos Digitales 3D** (escaneo de órganos), y presentó a inversores internacionales en inglés.",
      ],
      route: '/#jobs',
    },
    {
      keywords: ['quien eres', 'who are you', 'que eres', 'what are you', 'como te llamas', 'your name', 'diago'],
      en: [
        "I'm **dIAgo**, Diego's AI-powered portfolio assistant. I know all about his projects, skills, experience, and education. Think of me as a shortcut to learning everything about Diego! 🤖",
      ],
      es: [
        "Soy **dIAgo**, el asistente IA del portafolio de Diego. Conozco todos sus proyectos, habilidades, experiencia y formación. ¡Piensa en mí como un atajo para conocer todo sobre Diego! 🤖",
      ],
    },
  ];

  for (const pattern of patterns) {
    if (pattern.keywords.some(kw => new RegExp(`\\b${kw}\\b`).test(q))) {
      const answers = lang === 'en' ? pattern.en : pattern.es;
      const answer = answers[Math.floor(Math.random() * answers.length)];
      const result: HeuristicMatch = { answer };
      if (pattern.route) result.route = pattern.route;
      return result;
    }
  }

  return null;
};

// ─── Easter egg error messages ───────────────────────────────────────
const getErrorEasterEgg = (errorCount: number, lang: 'en' | 'es'): string => {
  const eggs = lang === 'es'
    ? [
        '¡Vaya! Y decían que los robots no descansaban... pues este sí 😴. Escríbele a Diego por [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) o cualquier medio, ¡estará feliz de contestarte!',
        'Es hora de mi descanso... zzz 💤',
        'No sigas intentándolo, estoy en mi pausa para café ☕',
        'Error 418: Soy una tetera... digo, un bot cansado 🫖',
        'Mi cerebro artificial necesita recargarse. Mientras tanto, Diego está disponible en [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) 🔋',
        '¿Sigues ahí? Impresionante persistencia. Diego necesita gente así en su equipo → [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) 😄',
      ]
    : [
        "Oops! They said robots don't rest... well, this one does 😴. Reach out to Diego on [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) — he'll be happy to chat!",
        "It's my break time... zzz 💤",
        "Don't keep trying, I'm on my coffee break ☕",
        "Error 418: I'm a teapot... I mean, a tired bot 🫖",
        "My artificial brain needs recharging. Meanwhile, Diego is available on [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) 🔋",
        "Still here? Impressive persistence. Diego needs people like you → [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) 😄",
      ];

  return eggs[Math.min(errorCount, eggs.length - 1)];
};

// ─── Conversation limit message ──────────────────────────────────────
const getConversationLimitMessage = (lang: 'en' | 'es'): string =>
  lang === 'es'
    ? '¡Hemos tenido una buena charla! 🎉 Para seguir conversando, escríbele directamente a Diego por [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) o por email a **diegodepablo.programa@gmail.com**. ¡Estará encantado!'
    : "We've had a great chat! 🎉 To keep talking, reach out to Diego directly on [LinkedIn](https://www.linkedin.com/in/diego-de-pablo/) or email **diegodepablo.programa@gmail.com**. He'd love to hear from you!";

// ─── Hook ────────────────────────────────────────────────────────────
export const useChat = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<ChatState>('idle');
  const abortRef = useRef<AbortController | null>(null);
  const aiCallCount = useRef(0);
  const errorCount = useRef(0);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || state === 'sending' || state === 'streaming') return;

    // ── 1. User message ──────────────────────────────────────────────
    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages(prev => {
      const next = [...prev, userMessage];
      return next.length > MAX_MESSAGES ? next.slice(next.length - MAX_MESSAGES) : next;
    });

    // ── 2. Check conversation AI call limit ──────────────────────────
    if (aiCallCount.current >= MAX_AI_CALLS_PER_SESSION) {
      const limitMsg: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: getConversationLimitMessage(lang),
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    // ── 3. Try heuristic match first (zero tokens!) ─────────────────
    const heuristic = matchHeuristic(trimmed, lang);
    if (heuristic) {
      setState('sending');

      // Navigate if the response has a route
      if (heuristic.route) {
        setTimeout(() => {
          navigate(heuristic.route!);
          if (heuristic.route!.includes('#')) {
            setTimeout(() => {
              const hash = heuristic.route!.split('#')[1];
              document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
              if (hash === 'about') {
                window.dispatchEvent(new CustomEvent('openEducation'));
              }
            }, 100);
          }
        }, 300);
      }

      // Simulate natural typing delay
      setTimeout(() => {
        setState('streaming');
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: createId(),
            role: 'assistant',
            content: heuristic.answer,
            references: heuristic.references,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setState('idle');
        }, 600);
      }, 400);

      return;
    }

    // ── 4. Fall through to AI (costs tokens) ────────────────────────
    aiCallCount.current += 1;

    const assistantId = createId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setState('sending');

    // Build context: only last 6 messages to reduce tokens (and filter out empty failed messages)
    const contextMessages = [...messages, userMessage]
      .filter(m => (m.role === 'user' || m.role === 'assistant') && m.content.trim().length > 0)
      .slice(-6)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let hasReceivedChunk = false;

    await streamChat(
      { messages: contextMessages, lang },
      // onChunk
      (token: string) => {
        if (!hasReceivedChunk) {
          hasReceivedChunk = true;
          setState('streaming');
          errorCount.current = 0; // Reset error counter on success
        }
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content + token }
              : m
          )
        );
      },
      // onDone
      (references?: ChatReference[]) => {
        if (references && references.length > 0) {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, references } : m
            )
          );
        }
        setState('idle');
        abortRef.current = null;
      },
      // onError
      (_errorMessage: string) => {
        // Use fun easter egg messages instead of generic errors
        const easterEgg = getErrorEasterEgg(errorCount.current, lang);
        errorCount.current += 1;
        // Don't count failed calls against the AI limit
        aiCallCount.current = Math.max(0, aiCallCount.current - 1);

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: easterEgg }
              : m
          )
        );
        setState('idle');
        abortRef.current = null;
      },
      controller.signal,
    );
  }, [lang, messages, navigate, state]);

  const clearConversation = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setState('idle');
    aiCallCount.current = 0;
    errorCount.current = 0;
  }, []);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState('idle');
  }, []);

  return {
    messages,
    state,
    sendMessage,
    clearConversation,
    cancelStream,
  };
};
