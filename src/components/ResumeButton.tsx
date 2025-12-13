import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { generateResumePDF } from '@/lib/generateResume';
import { useToast } from '@/hooks/use-toast';

interface ResumeButtonProps {
  variant?: 'primary' | 'ghost';
  className?: string;
}

export default function ResumeButton({ variant = 'primary', className = '' }: ResumeButtonProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      generateResumePDF();
      toast({
        title: "Resume downloaded!",
        description: "Your resume PDF has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error generating the resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (variant === 'ghost') {
    return (
      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group flex items-center gap-2 px-6 py-3 glass rounded-full font-display font-medium text-sm border border-border/50 hover:border-primary/50 transition-all ${className}`}
      >
        <Download className="w-4 h-4 group-hover:animate-bounce" />
        Download CV
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleDownload}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative px-8 py-4 glass gradient-border rounded-full font-display font-semibold text-lg transition-all duration-300 hover:scale-105 glow-border overflow-hidden ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        <Download className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
        Download Resume
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
