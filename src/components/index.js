// ===========================================
// COMPONENT EXPORTS
// ===========================================
// Barrel export file for all components.
// Import from here for cleaner imports:
// import { Component1, Component2 } from './components';

// Page Sections
export { default as StartScreen } from './StartScreen';
export { default as About } from './About';
export { default as Experience } from './Experience';
export { default as Projects } from './Projects';
export { default as Beyond } from './Beyond';
export { default as Contacts } from './Contacts';

// Navigation
export { default as GooeyNav } from './GooeyNav';

// Visual Effects
// FboAnimation and SmokeyCursor are deliberately NOT re-exported here.
// Both are heavy WebGL leaves (FboAnimation pulls in three.js), so App.jsx
// loads them with React.lazy to keep them out of the initial chunk. Adding
// them back to this barrel would drag three.js into the main bundle again.
export { default as GlassSurface } from './GlassSurface';
export { default as TargetCursor } from './TargetCursor';

// UI Components
export { default as AnimatedThemeSwitcher } from './AnimatedThemeSwitcher';
export { default as RotatingText } from './RotatingText';
export { default as Preloader } from './Preloader';
export { default as ResumeModal } from './ResumeModal';
export { default as StarColorPicker } from './StarColorPicker';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as VisitorCounter } from './VisitorCounter';
