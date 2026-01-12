import {
  Navbar,
  StartScreen,
  About,
  Experience,
  Projects,
  Beyond,
  Contacts,
  DarkVeil
} from "./components";

function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background Layer - Theme-aware shader */}
      <div className="fixed inset-0 z-0 bg-background transition-colors duration-300">
        <DarkVeil speed={0.3} warpAmount={0.2} resolutionScale={0.6} />
      </div>

      {/* UI Layer */}
      <div className="relative z-10">
        <Navbar />
        <main className="w-full">
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
