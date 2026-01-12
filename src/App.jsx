import { useState } from "react";
import {
  GooeyNav,
  TargetCursor,
  StartScreen,
  About,
  Experience,
  Projects,
  Beyond,
  Contacts,
  FboParticles,
  Preloader
} from "./components";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Loading Screen */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Custom Snapping Cursor */}
      <TargetCursor />

      {/* Background Layer - Galaxy shader that changes with theme */}
      <div className="fixed inset-0 z-0 bg-background transition-colors duration-300">
        <FboParticles />
      </div>

      {/* UI Layer */}
      <div className="relative z-10">
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 pointer-events-none">
          <div className="pointer-events-auto">
            <GooeyNav
              items={[
                { label: 'Home', href: '#start-screen' },
                { label: 'About', href: '#about' },
                { label: 'Experience', href: '#experience' },
                { label: 'Projects', href: '#projects' },
                { label: 'Contact', href: '#contacts' }
              ]}
            />
          </div>
        </div>
        <main className="w-full pt-24">
          {/* Full-width sections */}
          <StartScreen />

          {/* Contained sections */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <About />
            <Experience />
            <Projects />
            <Beyond />
            <Contacts />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
