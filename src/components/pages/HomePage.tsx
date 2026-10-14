import React from 'react';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Experience } from '../sections/Experience';
import { Projects } from '../sections/Projects';
import { Contact } from '../sections/Contact';

export const HomePage: React.FC = () => (
  <main>
    <Hero />
    <About />
    <Experience />
    <Projects />
    <Contact />
  </main>
);

export default HomePage;

