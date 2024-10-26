import React from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TypingAnimationProps {
  text: string;
  speed?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 0.05 }) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      transition: { delay: i * speed }
    }));
  }, [controls, speed]);

  return (
    <div className="inline-block">
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          custom={index}
          animate={controls}
          initial={{ opacity: 0 }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default TypingAnimation;