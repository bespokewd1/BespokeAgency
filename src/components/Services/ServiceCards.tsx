import { WaveSvg } from '@components/SectionDivider/wave-haikei-top';
import {
  HoverEffect,
  type ItemProps,
} from '@components/Ui/CardHoverEffect.tsx';
import { cn } from '@lib/utils';

export const ServiceCards = () => {
  const serviceItems: ItemProps[] = [
    {
      title: 'All-In-One Web Solution',
      description:
        'From hand-coded websites and SEO optimization to Google Business Profile setup, we handle it all. With custom design and custom code, we build high-performing websites tailored to your business needs.',
      link: '',
      iconName: 'tabler:brand-graphql',
    },
    {
      title: 'Hand Coded Websites',
      description:
        'No page builders or WordPress here — every website we create is hand-coded and designed from scratch. We work closely with you to design a site that perfectly captures what makes your business unique.',
      link: '',
      iconName: 'tabler:brand-vscode',
    },
    {
      title: 'Fully Responsive Web Design',
      description:
        'Your website will fit all mobile screens sizes, tablets, and desktop sizes so visitors can access your site from anywhere and see a beautiful and functional website no matter the screen size.',
      link: '',
      iconName: 'tabler:device-desktop-code',
    },
    {
      title: 'SEO: Search Engine Optimization',
      description:
        'Boost your website’s visibility with our SEO strategies. We optimize your site’s structure, content, and performance to improve rankings and attract more potential customers.',
      link: '',
      iconName: 'tabler:device-desktop-search',
    },
    {
      title: 'Smart Content Architecture',
      description:
        'We structure your website’s content for clarity and engagement. A well-organized site helps visitors find what they need quickly, improving user experience and conversion rates.',
      link: '',
      iconName: 'tabler:list-details',
    },
    {
      title: 'Graphics, Logos, and Animations',
      description:
        'We design eye-catching graphics, logos, and animations to enhance your brand’s identity. Whether you need a sleek logo or engaging visual elements, we ensure your business stands out.',
      link: '',
      iconName: 'tabler:photo-edit',
    },
    {
      title: 'Google Business Profile Setup',
      description:
        'Get discovered on Google with a professionally set up and optimized Google Business Profile. We handle everything, from verification to optimization, so your business appears in local searches.',
      link: '',
      iconName: 'tabler:brand-google',
    },

    {
      title: 'Forms, Bookings, Newsletters',
      description:
        'Need contact forms, appointment bookings, or email newsletters? We integrate custom solutions that help you stay connected with clients and streamline your business processes.',
      link: '',
      iconName: 'tabler:mail-opened',
    },
  ];

  return (
    <section className="relative bg-blue-100 p-(--sectionPadding) pt-4">
      <div className="mx-auto max-w-5xl">
        <span className="cs-topper text-center text-2xl text-blue-700">
          No Headaches, No Hassles, No BS.
        </span>
        <h2 className="cs-title text-body-dark text-center text-6xl">
          Never Worry About Your Website Again
        </h2>

        <p className="cs-text text-body-dark text-center text-[clamp(1rem,.5vw+1rem,1.125rem)]">
          We handle everything—design, development, hosting, updates, and
          ongoing maintenance—so you don’t have to. No confusing tech, no
          frustrating DIY builders, and no hidden costs. Just a handcrafted,
          professionally designed website, built from scratch that's tailored to
          your business's unique needs and goals.
        </p>
      </div>
      <div className="mx-auto max-w-7xl">
        <HoverEffect items={serviceItems} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a
          href={'/'}
          className={cn([
            'cs-button-solid',
            'inline-flex h-14.5 items-center gap-2 border border-neutral-50',
            'corner-squircle rounded-2xl supports-[corner-shape:squircle]:rounded-4xl',
            'before:corner-squircle before:rounded-[inherit]',
            'bg-linear-to-b from-blue-400 via-blue-500 to-blue-700',
            'shadow-[0_2px_8px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-2px_0_rgba(255,255,255,0.3),inset_0_-8px_16px_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.4),inset_0_1px_4px_rgba(0,0,0,0.1)]',
          ])}
          style={{ backgroundColor: 'transparent' }}
        >
          Let's Talk
        </a>
      </div>
    </section>
  );
};
