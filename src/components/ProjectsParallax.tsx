import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Food Donation System",
    description: "A platform connecting food donors with NGOs and volunteers to reduce food waste and help those in need.",
    features: [
      "Live location tracking",
      "NGO matching algorithm",
      "Admin dashboard",
      "Real-time updates"
    ],
    techStack: ["Python", "HTML/CSS", "Database", "Maps API"],
    color: "#00e676"
  },
  {
    id: 2,
    title: "Women Safety System",
    description: "A comprehensive safety platform with SOS alerts, live location tracking, and emergency contacts for immediate assistance.",
    features: [
      "One-tap SOS button",
      "Live GPS tracking",
      "AI assistance",
      "Emergency contacts"
    ],
    techStack: ["Python", "UI/UX", "GPS API", "Notifications"],
    color: "#00ffff"
  }
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="min-w-[400px] md:min-w-[500px]"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className="glass-strong rounded-3xl p-8 h-full transition-all duration-200 ease-out"
      >
        {/* Project header */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ 
              backgroundColor: `${project.color}15`,
              boxShadow: isHovered ? `0 0 40px ${project.color}40` : 'none'
            }}
          >
            <div 
              className="w-8 h-8 rounded-lg"
              style={{ backgroundColor: project.color }}
            />
          </div>
          <div className="flex gap-3">
            <button className="p-2 glass rounded-lg hover:bg-primary/10 transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <button className="p-2 glass rounded-lg hover:bg-primary/10 transition-colors">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Project title */}
        <h3 
          className="font-display text-2xl font-bold mb-3"
          style={{ color: isHovered ? project.color : 'inherit' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-display font-semibold text-primary mb-3">Key Features</h4>
          <ul className="grid grid-cols-2 gap-2">
            {project.features.map((feature) => (
              <li 
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{ 
                backgroundColor: `${project.color}15`,
                color: project.color
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section 
      ref={containerRef}
      id="projects" 
      className="relative section-padding overflow-hidden snap-section"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-display tracking-widest uppercase text-sm">
            Portfolio
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Real-world solutions I've built to solve meaningful problems
          </p>
        </motion.div>

        {/* Horizontal scroll container */}
        <motion.div 
          style={{ x }}
          className="flex gap-8 pb-8"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Navigation hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8"
        >
          <div className="glass px-6 py-3 rounded-full flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <div className="flex gap-2">
              {projects.map((_, index) => (
                <div 
                  key={index}
                  className="w-2 h-2 rounded-full bg-primary/50"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
