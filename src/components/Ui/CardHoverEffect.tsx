import { cn } from '@lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { Icon, type IconifyIconProps } from '@iconify/react';

import { useState } from 'react';

export type ItemProps = {
  title: string;
  description: string;
  link: string;
  iconName: IconifyIconProps['icon'];
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: ItemProps[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.title}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="bg-primary corner-squircle absolute inset-0 block h-full w-full rounded-3xl supports-[corner-shape:squircle]:rounded-4xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="overflow-visible">
            <div className="flex flex-col items-center justify-start gap-2 [grid-area:1/1]">
              <motion.div
                variants={{
                  hovered: {
                    translateY: '-100%',
                    background: 'var(--color-body-light)',
                    color: 'var(--color-primary)',
                  },
                  default: {
                    translateY: '0',
                    background: 'transparent',
                    color: 'var(--color-blue-700)',
                  },
                }}
                animate={hoveredIndex === idx ? 'hovered' : 'default'}
                initial="default"
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="corner-squircle size-16 rounded-3xl p-2 supports-[corner-shape:squircle]:rounded-4xl"
              >
                <Icon icon={item.iconName} className="size-full" />
              </motion.div>

              <CardTitle className="visible flex-1 text-center text-2xl opacity-100 transition-[opacity,visibility] duration-300 ease-out group-hover:invisible group-hover:opacity-0">
                {item.title}
              </CardTitle>
            </div>
            <CardDescription className="invisible opacity-0 blur-md transition-[opacity,visibility,filter] duration-300 ease-out [grid-area:1/1] group-hover:visible group-hover:opacity-100 group-hover:blur-none">
              {item.description}
            </CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'corner-squircle relative z-20 h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-blue-200 p-4 group-hover:border-slate-700 supports-[corner-shape:squircle]:rounded-3xl',
        className
      )}
    >
      <div className="relative z-50">
        <div className="grid place-content-center p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn('text-header mt-4 font-bold tracking-wide', className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.p
      className={cn(
        'text-body-dark mt-8 leading-relaxed tracking-wide',
        className
      )}
    >
      {children}
    </motion.p>
  );
};
