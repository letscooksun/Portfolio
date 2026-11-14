import { m } from 'framer-motion';
import { fadeUp, inViewOnce } from '../utils/motion';

/* Fades content up once as it enters the viewport. */
export default function Reveal({ as = 'div', delay = 0, variants = fadeUp, children, ...rest }) {
  const Component = m[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={variants}
      custom={delay}
      {...rest}
    >
      {children}
    </Component>
  );
}
