import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react';
import { motion } from 'motion/react';
import { cn } from '@lib/utils';

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    topper: string;
    title: string;
    description: React.ReactNode;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Use target instead of container to track based on viewport scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 25%', 'end 25%'],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  // 'var(--color-primary-light)',
  // 'var(--color-blue-500)',
  // 'var(--color-blue-600)',
  // 'var(--color-primary-light)',
  const backgroundColors = [
    'linear-gradient(to bottom, var(--color-primary-light) 20%, var(--color-primary))',
    'linear-gradient(to bottom, var(--color-primary-light), var(--color-blue-700))',
    'linear-gradient(to bottom, var(--color-blue-700), var(--color-primary-light))',
  ];

  // 'linear-gradient(to bottom right, #06b6d4, #10b981)',
  // 'linear-gradient(to bottom right, #ec4899, #6366f1)',
  const linearGradients = [
    'transparent',
    'transparent',
    'transparent',
    'linear-gradient(to bottom right, #f97316, #eab308)',
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      ref={ref}
      animate={{
        background: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex justify-center space-x-10 rounded-md p-10"
    >
      {/* Left side - scrollable content */}
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20 min-h-[40vh]">
              <span className="cs-topper text-left text-2xl text-blue-700">
                {item.topper}
              </span>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="cs-title text-body-dark text-left text-5xl"
              >
                {item.title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              >
                {item.description}
              </motion.div>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>

      {/* Right side - sticky content */}
      {/*
      <AnimatePresence>
        <motion.div
          style={{ background: backgroundGradient }}
          className={cn(
            'sticky top-[calc(25vh-7.5rem)] hidden size-160 self-start overflow-hidden rounded-md bg-transparent lg:block',
            contentClassName
          )}
        >
          {content[activeCard].content ?? null}
        </motion.div>
      </AnimatePresence>
      */}

      <div
        className={cn(
          'sticky top-[calc(25vh-7.5rem)] hidden size-160 self-start overflow-hidden rounded-md lg:block',
          contentClassName
        )}
        style={{ background: backgroundGradient }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard} // This is crucial - triggers animation on change
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0)' }}
            exit={{ opacity: 0, filter: 'blur(3px)' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex h-full w-full items-center justify-center"
          >
            {content[activeCard].content ?? null}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
