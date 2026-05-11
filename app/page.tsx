import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Stack from "./components/Stack";
import Experience from "./components/Experience";
import BottomNav from "./components/BottomNav";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Travel from "./components/Travel";
import Spotify from "./components/Spotify";


export default function Home() {
  return (
    <main style={{ background: "#111", color: "#fff" }}>
      <Navbar />
      <BottomNav />
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Projects />
      <Spotify/>
      <Travel/>
      <Contact />
    </main>
  );
}