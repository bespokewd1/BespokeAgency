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
    topper: 'Why Choose Us',
    title: 'What Sets Us Apart',
    description: (
      <>
        <p className="cs-text text-body-dark mb-4 text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          I don’t just build websites—I build partnerships. I treat your
          business like it’s my own, bringing the same level of care,
          dedication, and attention to detail as you would.
        </p>

        <p className="cs-text text-body-dark mb-4 text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          I develop every project from scratch—building it strategically around
          your goals, your audience, and your long-term vision, with a focus on
          results that matter.
        </p>

        <p className="cs-text text-body-dark mb-4 text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          We’ll go over every detail, as many times as needed. You’ll have a
          24/7 access to me and my skills—not just on day one, but a week, a
          month, or even a year from now.
        </p>
      </>
    ),
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <ProgressiveApp />
      </div>
    ),
  },
  {
    topper: 'It All Starts With You',
    title: 'A Website Built Around Your Goals And Vision',
    description: (
      <>
        <p className="cs-text text-body-dark mb-4 text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          Every business I work with is different. I start by getting to know
          you and your goals. I want to understand not just what you do, but the
          vision you have for your business and how we can make it more
          successful.
        </p>

        <p className="cs-text text-body-dark text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          Every decision I make—from design to layout—is focused on keeping
          everything clear and intuitive while staying fully aligned with your
          business goals. The aim is to create a website that actually works for
          your business, your customers, and your bottom line.
        </p>

        <p className="cs-text text-body-dark mb-4 text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          From page layout to the messaging, everything is built to guide your
          customer to action. Whether it’s making a purchase, booking a service,
          or reaching out for more information..
        </p>

        <p className="cs-text text-body-dark mb-4 text-left text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          At the end of the day, this isn’t just about a website—it’s about
          creating an indispensable business asset that turns your vision into
          results you can count on.
        </p>
      </>
    ),
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <BuildingAWeb />
      </div>
    ),
  },
];

export function SbsContent() {
  return (
    <div className="relative w-full">
      <StickyScroll content={content} />
    </div>
  );
}
