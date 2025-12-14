import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import AboutParallax from '@/components/AboutParallax';
import Skills3D from '@/components/Skills3D';
import ProjectsParallax from '@/components/ProjectsParallax';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Contact3D from '@/components/Contact3D';
import SEO from '@/components/SEO';
import Preloader from '@/components/Preloader';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <SEO />
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Noise overlay */}
        <div className="fixed inset-0 noise-overlay pointer-events-none z-50" />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main content */}
        <main>
          <Hero3D />
          <AboutParallax />
          <Skills3D />
          <ProjectsParallax />
          <ExperienceTimeline />
          <Contact3D />
        </main>
      </div>
    </>
  );
};

export default Index;
