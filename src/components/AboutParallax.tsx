import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const skills = [
    "Creative Development",
    "Problem Solving",
    "UI/UX Design",
    "Full-Stack Vision"
  ];

  return (
    <section 
      ref={containerRef}
      id="about"
      className="relative section-padding overflow-hidden"
    >
      {/* Background elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image/Visual */}
          <motion.div
            style={{ opacity, y: y2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-rotate-slow" />
              <div className="absolute inset-8 border border-primary/30 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
              <div className="absolute inset-16 border border-primary/40 rounded-full animate-rotate-slow" style={{ animationDuration: '25s' }} />
              
              {/* Center content */}
              <div className="absolute inset-24 glass rounded-full flex items-center justify-center glow-primary">
                <span className="font-display text-6xl font-bold text-gradient">RM</span>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-0 glass px-4 py-2 rounded-full text-sm font-display"
              >
                🎨 Creative
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute bottom-20 left-0 glass px-4 py-2 rounded-full text-sm font-display"
              >
                💻 Developer
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-10 right-10 glass px-4 py-2 rounded-full text-sm font-display"
              >
                🚀 Innovator
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            style={{ opacity }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-primary font-display tracking-widest uppercase text-sm"
              >
                About Me
              </motion.span>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-5xl font-bold"
              >
                Crafting Digital
                <br />
                <span className="text-gradient">Experiences</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              I'm Rehan Mulla, a 19-year-old developer passionate about building 
              meaningful tech solutions that solve real-world problems. From designing 
              intuitive user interfaces to implementing robust backend systems, I thrive 
              at the intersection of creativity and technology.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground leading-relaxed"
            >
              My journey in tech started with curiosity and has evolved into a deep 
              passion for creating impactful digital experiences. I believe in the power 
              of technology to transform lives and am committed to continuous learning 
              and innovation.
            </motion.p>

            {/* Skill highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass px-4 py-2 rounded-full text-sm font-medium border border-primary/30 hover:border-primary/60 transition-colors cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
