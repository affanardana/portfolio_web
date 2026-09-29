import { motion, useReducedMotion } from 'motion/react';

export const EASE_SOFT = [0.22, 1, 0.36, 1];

/**
 * Fades + lifts its children the first time they scroll into view.
 *
 * Every wrapper here degrades to a plain element when the visitor has asked
 * for reduced motion, so nothing on the page depends on animation to be read.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
  amount = 0.25,
  once = true,
  style,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -60px 0px' }}
      transition={{ duration, delay, ease: EASE_SOFT }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that walks its <StaggerItem> children in one after another. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  amount = 0.15,
  once = true,
  style,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: '0px 0px -60px 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 22, style, ...rest }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_SOFT } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
