// import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';

import { useEffect, useMemo, useState } from 'react';
import { LinkPreview } from './LinkPreview';
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from './AnimatedModal';
import { cn } from '@lib/utils';

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  link: string;
  linkLabel?: string;
  testimonialLink?: string;
  testimonialLabel?: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const rotateFromString = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) | 0;
    }
    return (Math.abs(h) % 21) - 10; // -10..10
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  // const randomRotateY = () => {
  //   return Math.floor(Math.random() * 21) - 10;
  // };
  return (
    // <div className="mx-auto max-w-sm px-4 py-20 antialiased md:max-w-4xl md:px-8 lg:px-12">

    <div className="mx-auto max-w-3xl px-4 py-20 antialiased lg:px-12 xl:max-w-full">
      <div className="relative grid grid-cols-1 gap-20 xl:grid-cols-2">
        <div>
          <div className="relative h-90 w-full lg:h-80 lg:w-138">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const rot = rotateFromString(testimonial.src);
                return (
                  <motion.div
                    key={testimonial.src}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: rot,
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.15,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : rot,
                      zIndex: isActive(index)
                        ? 40
                        : testimonials.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: rot,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
          >
            <h3 className="text-heading text-2xl font-bold">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-gray-500">
              {testimonials[active].designation}
            </p>
            <motion.p className="text-body-dark my-8 text-lg">
              {testimonials[active].quote.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: 'blur(10px)',
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: 'blur(0px)',
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>

            <LinkPreview
              height={175}
              width={250}
              url={testimonials[active].link}
              isExternal
            >
              <span className="group/link inline-flex items-center gap-2 text-lg font-bold text-blue-700">
                <span className="underline">
                  {testimonials[active].linkLabel
                    ? testimonials[active].linkLabel
                    : 'View Website'}
                </span>

                <Icon
                  icon="tabler:external-link"
                  className="font-bold transition-transform duration-400 group-hover/link:translate-x-1.5"
                />
              </span>
            </LinkPreview>

            {testimonials[active].testimonialLink ? (
              <div className="my-6 flex items-center justify-start">
                <Modal>
                  <ModalTrigger className="overflow-visible p-0">
                    {/* className="group/modal-btn flex justify-center bg-black text-white" */}
                    <span
                      className={cn([
                        'cs-button-solid',
                        'inline-flex h-14.5 items-center gap-2 border border-neutral-50',
                        'corner-squircle rounded-2xl supports-[corner-shape:squircle]:rounded-4xl',
                        'before:corner-squircle before:rounded-[inherit]',
                        'bg-linear-to-b from-[#E8E8E8] via-[#C0C0C0] to-[#A0A0A0]',
                        'shadow-[0_2px_8px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-2px_0_rgba(255,255,255,0.3),inset_0_-8px_16px_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.4),inset_0_1px_4px_rgba(0,0,0,0.1)]',
                      ])}
                      style={{ backgroundColor: 'transparent' }}
                    >
                      {testimonials[active].testimonialLabel
                        ? testimonials[active].testimonialLabel
                        : 'View Testimonial'}
                    </span>
                  </ModalTrigger>
                  <ModalBody>
                    <ModalContent className="relative">
                      <iframe
                        src={testimonials[active].testimonialLink}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 size-full"
                      ></iframe>
                    </ModalContent>
                    <ModalFooter className="gap-4">
                      <CloseButton />
                    </ModalFooter>
                  </ModalBody>
                </Modal>
              </div>
            ) : null}
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100"
            >
              <Icon
                icon={'tabler:arrow-left'}
                className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12"
              />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100"
            >
              <Icon
                icon={'tabler:arrow-right'}
                className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
