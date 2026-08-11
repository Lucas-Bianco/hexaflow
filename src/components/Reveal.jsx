import { useScrollReveal } from '../lib/useScrollReveal.js'

// Wraps children with a .reveal element that animates in on scroll.
// `as` controls the tag, `delay` adds a stagger class (1-6).
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useScrollReveal()
  const delayClass = delay ? ` reveal-${Math.min(Math.max(delay, 1), 6)}` : ''
  return (
    <Tag ref={ref} className={`reveal${delayClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}