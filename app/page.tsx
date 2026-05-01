import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";

export default function Home() {
  return (
    <main style={{ background: "#111", color: "#fff" }}>
      <Navbar />
      <Hero />
      <About />
    </main>
  );
}