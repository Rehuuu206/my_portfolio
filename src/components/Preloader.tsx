import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="relative">
            {/* Animated rings */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-32 h-32 rounded-full border-2 border-primary/30"
              />
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 rounded-full border-2 border-secondary/50"
              />
            </motion.div>

            {/* Glowing orb */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl" />
            </motion.div>

            {/* RM Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }}
              className="relative z-10 flex items-center justify-center w-32 h-32"
            >
              <span className="font-display text-4xl font-bold text-gradient">RM</span>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32"
            >
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-xs text-muted-foreground mt-3 tracking-widest uppercase"
              >
                Loading
              </motion.p>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6 }}
            className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
