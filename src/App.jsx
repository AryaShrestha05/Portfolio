import { useState, lazy, Suspense } from "react";
import useSmoothScroll from "./hooks/useSmoothScroll";
import useMediaQuery from "./hooks/useMediaQuery";
import {
  GooeyNav,
  TargetCursor,
  StartScreen,
  About,
  Experience,
  Projects,
  Beyond,
  Contacts,
  Preloader,
  StarColorPicker,
  VisitorCounter
} from "./components";

// Split out of the initial bundle. FboAnimation pulls in three.js, which is
// by far the largest dependency here, and both are background decoration:
// the page is fully readable before either arrives. Loading them eagerly
// meant blocking first paint on ~600 kB of WebGL nobody has scrolled to yet.
const FboAnimation = lazy(() => import("./components/FboAnimation"));
const SmokeyCursor = lazy(() => import("./components/ui/smokey-cursor"));

function App() {
  const [loading, setLoading] = useState(true);
  const [starColor, setStarColor] = useState(null);

  // Held back until the preloader clears. Starting Lenis while the page is
  // still masked would let it measure a layout the user never sees.
  useSmoothScroll(!loading);

  // A real mouse or trackpad, on a screen wide enough to be a laptop.
  const hasFinePointer = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)');

  return (
    <div
      className={`relative min-h-[100dvh] bg-background text-foreground transition-colors duration-300 ${loading ? 'cursor-none' : ''}`}
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

      {/* 3. Custom Snapping Cursor - Hidden if loading.
          Pointless without a pointer: on touch it renders a ring that can
          never move, and its rAF loop runs for nothing. */}
      {!loading && hasFinePointer && <TargetCursor />}

      {/* 3b. Smoke Effect following cursor.
          Desktop and fine-pointer only. This is a second WebGL context on top
          of the star field, and it is driven by cursor movement, so on touch
          devices it burns battery to render an effect nobody can trigger. */}
      {!loading && hasFinePointer && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}

      {/* 4. Background Layer */}
      <div
        className="fixed inset-0 z-0 bg-background transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-background, #ffffff)' }}
      >
        {/* Null fallback: the solid background above is the intended
            pre-load state, so there is nothing to swap in. */}
        <Suspense fallback={null}>
          <FboAnimation customColor={starColor} />
        </Suspense>
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