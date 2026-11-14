/*
 * Shared motion language. One easing curve, short distances, short durations.
 * MotionConfig reducedMotion="user" (App.jsx) strips transforms for people who
 * prefer reduced motion, leaving only gentle opacity fades.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  }),
};

/* Masked line reveal for display type: the line slides up from behind its own baseline. */
export const lineReveal = {
  hidden: { y: '105%' },
  visible: (delay = 0) => ({
    y: '0%',
    transition: { duration: 0.85, ease: EASE_OUT, delay },
  }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const inViewOnce = { once: true, margin: '0px 0px -12% 0px' };
