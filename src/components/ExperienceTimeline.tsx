import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

const timeline: TimelineItem[] = [
  {
    year: "2022",
    title: "Started Web Development",
    description: "Began my journey into tech by learning HTML and CSS, building my first websites.",
    icon: "🚀"
  },
  {
    year: "2023",
    title: "Python & DSA",
    description: "Dove deep into Python programming and Data Structures & Algorithms.",
    icon: "🐍"
  },
  {
    year: "2023",
    title: "Built Real Projects",
    description: "Created Food Donation System and Women Safety System to solve real-world problems.",
    icon: "💡"
  },
  {
    year: "2024",
    title: "Full-Stack & AI",
    description: "Exploring full-stack development and AI/ML technologies to build smarter solutions.",
    icon: "🤖"
  }
];

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.15 }}
      className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content card */}
      <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass p-6 rounded-2xl inline-block max-w-md glow-border"
        >
          <span className="text-primary font-display text-sm tracking-widest">
            {item.year}
          </span>
          <h3 className="font-display text-xl font-bold mt-2 mb-3">
            {item.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>
        </motion.div>
      </div>

      {/* Center icon */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-2xl border-2 border-primary/50 glow-primary"
        >
          {item.icon}
        </motion.div>
      </div>

      {/* Empty space for alignment */}
      <div className="flex-1" />
    </motion.div>
  );
}

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section 
      ref={containerRef}
      id="experience" 
      className="relative section-padding overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary font-display tracking-widest uppercase text-sm">
            Journey
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            My <span className="text-gradient">Experience</span>
          </h2>
        </motion.div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-primary to-secondary"
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-16">
            {timeline.map((item, index) => (
              <TimelineCard key={index} item={item} index={index} />
            ))}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-8"
          >
            <div className="w-8 h-8 rounded-full bg-primary animate-pulse-glow flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary-foreground" />
            </div>
          </motion.div>
        </div>

        {/* Future teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <p className="text-muted-foreground">
            The journey continues...
          </p>
          <h3 className="font-display text-2xl font-bold text-gradient mt-2">
            Always Learning, Always Building
          </h3>
        </motion.div>
      </div>
    </section>
  );
}
