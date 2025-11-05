import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface FadeInTextProps {
  text: string;
  className?: string;
}

const FadeInText: React.FC<FadeInTextProps> = ({ text, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const words = text.split(" ");

  useEffect(() => {
    // Animate on mount immediately
    controls.start("visible");
  }, []);

  useEffect(() => {
    // Animate when scrolled into view
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.span
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={containerVariants}
      className={`inline-flex flex-wrap gap-1 ${className}`}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={wordVariants}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default FadeInText;
