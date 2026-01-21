import { forwardRef } from 'react';
import type { SVGProps } from 'react';

type WaveSvgProps = SVGProps<SVGSVGElement> & {
  fill?: string;
};

export const WaveSvg = forwardRef<SVGSVGElement, WaveSvgProps>(
  ({ className, fill = '#0066FF', ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        className={className}
        {...rest}
        viewBox="0 0 900 600"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
      >
        <path
          d="M0 66L18.8 63.2C37.7 60.3 75.3 54.7 112.8 55C150.3 55.3 187.7 61.7 225.2 61C262.7 60.3 300.3 52.7 337.8 47.5C375.3 42.3 412.7 39.7 450.2 46.2C487.7 52.7 525.3 68.3 562.8 67.8C600.3 67.3 637.7 50.7 675.2 47.3C712.7 44 750.3 54 787.8 60.8C825.3 67.7 862.7 71.3 881.3 73.2L900 75L900 0L881.3 0C862.7 0 825.3 0 787.8 0C750.3 0 712.7 0 675.2 0C637.7 0 600.3 0 562.8 0C525.3 0 487.7 0 450.2 0C412.7 0 375.3 0 337.8 0C300.3 0 262.7 0 225.2 0C187.7 0 150.3 0 112.8 0C75.3 0 37.7 0 18.8 0L0 0Z"
          fill={fill}
          stroke-linecap="round"
          stroke-linejoin="miter"
        ></path>
      </svg>
    );
  }
);

WaveSvg.displayName = 'WaveSvg';
