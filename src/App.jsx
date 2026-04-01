import { useState } from "react";
import {
  GooeyNav,
  TargetCursor,
  SmokeyCursor,
  StartScreen,
  About,
  Experience,
  Projects,
  Beyond,
  Contacts,
  FboAnimation,
  Preloader,
  StarColorPicker,
  VisitorCounter
} from "./components";

function App() {
  const [loading, setLoading] = useState(true);
  const [starColor, setStarColor] = useState(null);

  return (
    <div
      className={`relative min-h-screen bg-background text-foreground transition-colors duration-300 ${loading ? 'cursor-none' : ''}`}
      style={{ backgroundColor: 'var(--color-background, #ffffff)' }}
    >
      {/* 1. Hidden SVG Filter for Gooey Effects */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 2. Loading Screen */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* 3. Custom Snapping Cursor - Hidden if loading */}
      {!loading && <TargetCursor />}

      {/* 3b. Smoke Effect following cursor */}
      {!loading && (
        <SmokeyCursor
          simulationResolution={128}
          dyeResolution={1024}
          densityDissipation={4}
          velocityDissipation={2.5}
          curl={2}
          splatRadius={0.15}
          splatForce={3000}
          colorUpdateSpeed={5}
        />
      )}

      {/* 4. Background Layer */}
      <div
        className="fixed inset-0 z-0 bg-background transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-background, #ffffff)' }}
      >
        <FboAnimation customColor={starColor} />
      </div>

      {/* 5. Star Color Picker */}
      {!loading && <StarColorPicker onColorChange={setStarColor} />}

      {/* Visitor count (bottom left) */}
      <VisitorCounter />

      {/* 6. UI Layer */}
      <div className={`relative z-10 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 pointer-events-none">
          <div className="pointer-events-auto">
            <GooeyNav
              items={[
                { label: 'home', href: '#start-screen' },
                { label: 'about', href: '#about' },
                { label: 'experience', href: '#experience' },
                { label: 'projects', href: '#projects' },
                { label: 'beyond', href: '#beyond' },
                { label: 'contact', href: '#contacts' }
              ]}
            />
          </div>
        </div>

        <main className="w-full pt-20 md:pt-24">
          <StartScreen />

          <div className="space-y-16 md:space-y-32">
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