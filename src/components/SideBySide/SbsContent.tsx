import { StickyScroll } from '@components/Ui/StickyScrollReveal';
import about from '@assets/images/about.png';
import about2 from '@assets/images/about2.jpg';
import { ProgressiveApp } from '@components/Meta/progressive-app.tsx';
import { motion } from 'motion/react';
import { BuildingAWeb } from '@components/Meta/building-a-web.tsx';

const content = [
  {
    topper: 'about us',
    title: 'Firstly, Allow Me To Introduce Myself',
    description: (
      <>
        <p className="cs-text text-body-dark mb-4 text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          I’m Charles, founder and lead designer at Bespoke Web Design Edmonton.
          As a stay-at-home dad, I taught myself how to create custom websites
          that help small businesses in Edmonton grow. I’ve seen many businesses
          settle for cheap websites that might seem like a quick fix but end up
          being ineffective.
        </p>

        <p className="cs-text text-body-dark text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          Instead of paying thousands for a Professionally made website, I offer
          affordable, custom-built websites with $0 down and $149/month—helping
          you focus your budget on other areas of your business. This way, you
          get a professional website that drives growth, and I become your
          long-term tech and marketing partner.
        </p>
      </>
    ),
    content: (
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        className="relative flex size-160 items-center justify-center text-white"
      >
        <img
          src={about2.src}
          width={about2.width}
          height={about2.height}
          decoding="async"
          loading="lazy"
          alt="code block"
          className="h-md corner-squircle absolute top-0 left-0 block aspect-square w-lg rounded-2xl object-cover supports-[corner-shape:squircle]:rounded-4xl"
        />

        <img
          src={about.src}
          width={about.width}
          height={about.height}
          decoding="async"
          loading="lazy"
          alt="bespoke web design logo"
          className="corner-squircle absolute right-0 bottom-0 block aspect-square w-md rounded-2xl bg-linear-to-b from-neutral-200 to-neutral-300 object-cover p-4 supports-[corner-shape:squircle]:rounded-4xl"
        />
      </motion.div>
    ),
  },
  {
    topper: 'about us',
    title: 'Real time changes',
    description:
      'See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.',
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <ProgressiveApp />
      </div>
    ),
  },
  {
    topper: 'about us',
    title: 'Version control',
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <BuildingAWeb />
      </div>
    ),
  },
  {
    topper: 'about us',
    title: 'Running out of content',
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Running out of content
      </div>
    ),
  },
];

export function SbsContent() {
  return (
    <div className="w-full">
      <StickyScroll content={content} />
    </div>
  );
}
