'use client';

import { useSmoothScroll } from './lib/hooks/useSmoothScroll';
import { useAnimations } from './lib/hooks/useAnimations';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Hero from './components/Hero';
import About from './components/About';
import Stack from './components/Stack';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Spotify from './components/Spotify';
import Contact from './components/Contact';


export default function Home() {
  useSmoothScroll();
  useAnimations();



  return (
    <main style={{ background: '#111', color: '#fff' }}>
      <Navbar />
      <BottomNav />
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Projects />
      <Spotify />
      <Contact />
    </main>
  );
}
