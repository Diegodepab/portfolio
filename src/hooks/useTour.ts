import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driver, type DriveStep, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useLanguage } from '../context/LanguageContext';
import { experiences } from '../data/experience';

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Sept: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const calculateExperienceMonths = () => experiences.reduce((total, experience) => {
  const startMonth = MONTHS[experience.startDate.month.en] ?? 0;
  const end = experience.current || !experience.endDate
    ? new Date()
    : new Date(experience.endDate.year, MONTHS[experience.endDate.month.en] ?? 0);
  const difference = (end.getFullYear() - experience.startDate.year) * 12 + end.getMonth() - startMonth + 1;
  return total + Math.max(0, difference);
}, 0);

export const useTour = () => {
  const { lang } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<DriveStep | null>(null);
  const [isLastStep, setIsLastStep] = useState(false);
  const [popoverWrapper, setPopoverWrapper] = useState<HTMLElement | null>(null);
  const driverObj = useRef<Driver | null>(null);
  const navigate = useNavigate();
  const experienceYears = useMemo(() => Math.max(1, Math.round(calculateExperienceMonths() / 12)), []);

  const steps = useMemo<DriveStep[]>(() => [
    {
      element: 'body',
      popover: {
        title: lang === 'en' ? 'Hello!' : '¡Hola!',
        description: lang === 'en'
          ? "I'll briefly guide you through my portfolio, highlighting my most relevant experience and projects."
          : 'Te guiaré brevemente por mi portafolio, destacando mi experiencia y proyectos más relevantes.',
      },
    },
    {
      element: '#about .about-image',
      popover: {
        title: lang === 'en' ? 'About Diego' : 'Sobre Diego',
        description: lang === 'en'
          ? "Here I talk a bit about myself, but basically I'm an engineer with a strong desire to learn and grow."
          : 'Aquí hablo un poco sobre mí, pero básicamente soy un ingeniero con muchas ganas de aprender y crecer.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '.edu-card',
      onHighlightStarted: () => {
        const trigger = document.querySelector<HTMLButtonElement>('.edu-card__trigger');
        if (trigger?.getAttribute('aria-expanded') === 'false') trigger.click();
        
        // Refresh highlight box and scroll after the accordion animation completes (350ms)
        setTimeout(() => {
          driverObj.current?.refresh();
          // Force scroll so the expanded content is actually visible
          document.querySelector('.edu-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
      },
      onDeselected: () => {
        const trigger = document.querySelector<HTMLButtonElement>('.edu-card__trigger');
        if (trigger?.getAttribute('aria-expanded') === 'true') trigger.click();
      },
      popover: {
        title: lang === 'en' ? 'Education & certifications' : 'Formación y certificaciones',
        description: lang === 'en'
          ? 'Here you can find my degrees, honours, and technical certifications.'
          : 'Aquí puedes ver mis titulaciones, reconocimientos y certificaciones técnicas.',
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '.experience-shell',
      onHighlightStarted: () => {
        const firstTab = document.getElementById('job-tab-0');
        if (firstTab?.getAttribute('aria-selected') === 'false') firstTab.click();
        
        // Force scroll to #jobs so the header "02. Dónde he trabajado" is visible at the top
        setTimeout(() => {
          document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      },
      popover: {
        title: lang === 'en' ? 'Professional experience' : 'Experiencia profesional',
        description: lang === 'en'
          ? `I have about ${experienceYears} years of experience building infrastructure and high-impact software products.`
          : `Tengo alrededor de ${experienceYears} años de experiencia desarrollando infraestructura y productos de software de impacto.`,
        side: 'top',
        align: 'end',
      },
    },
    {
      element: '#project-dock-item-metadataxtract',
      onHighlightStarted: () => {
        const trigger = document.querySelector<HTMLButtonElement>('#project-dock-item-metadataxtract button');
        if (trigger?.getAttribute('aria-expanded') === 'false') trigger.click();
        window.requestAnimationFrame(() => driverObj.current?.refresh());
      },
      onDeselected: () => {
        const trigger = document.querySelector<HTMLButtonElement>('#project-dock-item-metadataxtract button');
        if (trigger?.getAttribute('aria-expanded') === 'true') trigger.click();
      },
      popover: {
        title: 'MetaDataXtract',
        description: lang === 'en'
          ? 'Among my professional projects, I built this secure metadata extraction and enrichment pipeline.'
          : 'Entre mis proyectos profesionales, destaco este pipeline seguro de extracción y enriquecimiento de metadatos.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#projects .projects-heading-row',
      popover: {
        title: lang === 'en' ? 'Featured projects' : 'Proyectos destacados',
        description: lang === 'en'
          ? 'Here is a compilation of my most outstanding projects.'
          : 'Aquí te presento un recopilatorio de mis proyectos más destacados.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#featured-project-tfg-patient-monitoring',
      popover: {
        title: lang === 'en' ? 'Patient monitoring thesis' : 'TFG de monitorización de pacientes',
        description: lang === 'en'
          ? "For example, my Bachelor's Thesis on IoT and telemedicine gathers everything learned during my degree and was graded 10/10 with Honours."
          : 'Por ejemplo, mi TFG sobre IoT y telemedicina reúne todo lo aprendido en la carrera y fue calificado con un 10 y Matrícula de Honor.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '.projects-view-all-btn',
      popover: {
        title: lang === 'en' ? 'Project Explorer' : 'Explorador de proyectos',
        description: lang === 'en'
          ? 'You can access all my projects and case studies through this button.'
          : 'Puedes acceder a todos mis proyectos y casos de estudio a través de este botón.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '.projects-page-hero',
      popover: {
        title: lang === 'en' ? 'Project Archive' : 'Archivo de proyectos',
        description: lang === 'en'
          ? 'Here you can filter and search through all my professional and academic work.'
          : 'Aquí puedes filtrar y buscar entre todos mis trabajos profesionales y académicos.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#contact',
      onHighlightStarted: () => {
        // Small delay to let the page settle before scrolling to contact
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      },
      popover: {
        title: lang === 'en' ? 'Contact' : 'Contacto',
        description: lang === 'en'
          ? 'Contact me through the form or my professional profiles. You can also ask me a question.'
          : 'Contacta conmigo mediante el formulario o mis perfiles profesionales. También puedes preguntarme algo.',
        side: 'top',
        align: 'center',
      },
    },
  ], [experienceYears, lang]);

  useEffect(() => {
    const instance = driver({
      steps,
      showProgress: false,
      animate: true,
      smoothScroll: true,
      overlayColor: 'transparent',
      allowClose: true,
      allowKeyboardControl: true,
      skipMissingElement: true,
      waitForElement: 3_000,
      showButtons: ['next', 'previous', 'close'],
      popoverClass: 'custom-driver-popover',
      onPopoverRender: (popover, { state }) => {
        setPopoverWrapper(popover.wrapper);
        const activeIndex = state.activeIndex;
        if (activeIndex !== undefined) {
          setCurrentStep(steps[activeIndex] ?? null);
          setIsLastStep(activeIndex === steps.length - 1);
        }
      },
      onDestroyed: () => {
        setIsActive(false);
        setCurrentStep(null);
        setPopoverWrapper(null);
      },
    });

    driverObj.current = instance;
    return () => {
      instance.destroy();
      if (driverObj.current === instance) driverObj.current = null;
    };
  }, [steps]);

  const startTour = () => {
    setIsActive(true);
    driverObj.current?.drive();
  };

  const nextStep = () => {
    const activeIndex = driverObj.current?.getState().activeIndex;
    if (activeIndex === 7) navigate('/projects');
    if (activeIndex === 8) navigate('/');
    
    if (driverObj.current?.hasNextStep()) driverObj.current.moveNext();
    else driverObj.current?.destroy();
  };

  const prevStep = () => {
    const activeIndex = driverObj.current?.getState().activeIndex;
    if (activeIndex === 9) navigate('/projects');
    if (activeIndex === 8) navigate('/');
    
    if (driverObj.current?.hasPreviousStep()) driverObj.current.movePrevious();
  };

  const endTour = () => {
    driverObj.current?.destroy();
  };

  return { startTour, isActive, currentStep, nextStep, prevStep, endTour, isLastStep, popoverWrapper };
};
