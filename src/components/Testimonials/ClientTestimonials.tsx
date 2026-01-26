import {
  AnimatedTestimonials,
  type Testimonial,
} from '@components/Ui/AnimatedTestimonials';

import mockmpc from '@assets/images/mockups/mockup-mpc.webp';
import mockkms from '@assets/images/mockups/mockup-kms.webp';
import mockimassage from '@assets/images/mockups/mockup-iMassage.webp';
import mockstone from '@assets/images/mockups/mockup-stone.webp';
import mocksquadv from '@assets/images/mockups/mockup-squadv.webp';
import { cn } from '@lib/utils';
import { transform } from 'motion';

const testimonials: Testimonial[] = [
  {
    quote:
      'KMS Plumbing & Gasfitting Ltd. – Providing efficient, reliable plumbing, heating, and gas services with 15+ years of experience. Trusted solutions for homes and businesses in Edmonton.',
    name: 'KMS Plumbing & Gasfitting Ltd.',
    designation: '',
    src: mockkms.src,
    link: 'https://kmsplumbingyeg.com/',
    linkLabel: 'View KMS Site',
    testimonialLink:
      'https://www.youtube.com/embed/7SotFXcRhwo?si=nipKkpMUXWtFiewU',
    testimonialLabel: 'View KMS Testimonial',
  },
  {
    quote: 'Trusted and Proven Plumbing & Renovation for Edmonton.',
    name: 'Montano Plumbing & Contracting LTD.',
    designation: '',
    src: mockmpc.src,
    link: 'https://montanoplumbing.ca/',
    linkLabel: 'View MPC Site',
    testimonialLink:
      'https://www.youtube.com/embed/7SotFXcRhwo?si=nipKkpMUXWtFiewU',
    testimonialLabel: 'View MPC Testimonial',
  },
  {
    quote:
      'Professional plumbing, gasfitting, renovations, water heater installation, and new construction services. 7+ years trusted by Edmonton homeowners, builders and property managers. Fast, honest and flexible service. Call now: (780) 667-7169.',
    name: 'Squadv Plumbing Inc.',
    designation: '',
    src: mocksquadv.src,
    link: 'https://www.squadvplumbing.ca/',
    linkLabel: 'View SquadV Site',
    testimonialLink:
      'https://www.youtube.com/embed/7SotFXcRhwo?si=nipKkpMUXWtFiewU',
    testimonialLabel: 'View SquadV Testimonial',
  },
  {
    quote:
      'Relax. Rejuvenate. Revive.Professional massage therapy for relaxation, pain relief, and overall wellness in Edmonton.',
    name: 'Stone Massage - Edmonton',
    designation: '',
    src: mockstone.src,
    link: 'https://stonemassage.ca/',
    linkLabel: 'View Stone Massage Site',
    testimonialLink:
      'https://www.youtube.com/embed/7SotFXcRhwo?si=nipKkpMUXWtFiewU',
    testimonialLabel: 'View Testimonial',
  },
  {
    quote:
      'Your Path to Relaxation Starts Here.Experience soothing, professional massage therapy designed to relieve stress, restore balance, and renew your body and mind.',
    name: 'iMassage Therapeutic Clinique',
    designation: '',
    src: mockimassage.src,
    link: 'https://imassage-therapeutic.ca/',
    linkLabel: 'View iMassage Site',
    testimonialLink:
      'https://www.youtube.com/embed/7SotFXcRhwo?si=nipKkpMUXWtFiewU',
    testimonialLabel: 'View iMassage Testimonial',
  },
];

export function ClientTestimonials() {
  return (
    <section className="font-roboto relative bg-blue-100 p-(--sectionPadding) pt-4">
      <div className="mx-auto max-w-5xl">
        <span className="cs-topper text-center text-2xl text-blue-700">
          Our Portfolio
        </span>
        <h2 className="cs-title text-body-dark text-title text-center">
          Delivering Results for Our Clients
        </h2>
      </div>
      <div className="mx-auto max-w-7xl">
        <AnimatedTestimonials testimonials={testimonials} />
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

        <a
          href={'/'}
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
          Our Portfolio
        </a>
      </div>
    </section>
  );
}
