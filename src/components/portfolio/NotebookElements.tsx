import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Play } from 'lucide-react';
import type { Photo } from '@/data/portfolioData';

export function InkFilters() {
  return <svg className="ink-filters" aria-hidden="true"><defs><filter id="ink-effect"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="2" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" /></filter></defs></svg>;
}
export function PushPin({ color = 'red' }: { color?: 'red' | 'blue' | 'clear' }) {
  return <span aria-hidden="true" className={`push-pin pin-${color}`} />;
}
export function Doodle({ kind = 'star', className = '' }: { kind?: 'star' | 'arrow' | 'spark' | 'headphones' | 'heart'; className?: string }) {
  const paths = {
    star: 'M30 4 36 23 56 21 41 34 48 55 30 43 12 55 19 34 4 21 24 23Z',
    arrow: 'M9 5C1 27 10 45 47 42M35 31l13 11-13 11',
    spark: 'M30 5v13M30 42v13M5 30h13M42 30h13M12 12l9 9M39 39l9 9M12 48l9-9M39 21l9-9',
    headphones: 'M12 35V26C12 3 48 3 48 26v9M12 29H6v20h10V29ZM48 29h6v20H44V29ZM23 28v15m7-21v26m7-21v16',
    heart: 'M30 51C-8 27 9 1 30 18 51 1 68 27 30 51Z',
  };
  return <svg aria-hidden="true" viewBox="0 0 60 60" className={`doodle ${className}`}><path d={paths[kind]} /></svg>;
}
export function AnimatedInkHeader({ children, color = 'pink', className = '' }: { children: ReactNode; color?: 'pink' | 'blue' | 'gold'; className?: string }) {
  const reduce = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  const visible = useInView(heading, { once: true, amount: .3 });
  return <h2 ref={heading} className={`ink-header ${color} ${className}`}>
    <motion.span className="ink-heading-text" initial={false} animate={{ clipPath: reduce || visible ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }} transition={{ duration: reduce ? 0 : .75 }}>{children}</motion.span>
    <motion.svg viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true"><motion.path d="M4 10Q112 1 204 11T396 8M19 16Q190 9 354 15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" filter="url(#ink-effect)" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : .65, delay: reduce ? 0 : .4 }} /></motion.svg>
  </h2>;
}
export function PolaroidCard({ photo, rotation = -4, color = 'red', className = '', link, gallery = false, eager = false }: { photo: Photo; rotation?: number; color?: 'red' | 'blue' | 'clear'; className?: string; link?: string; gallery?: boolean; eager?: boolean }) {
  const reduce = useReducedMotion();
  const [failedLocal, setFailedLocal] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth === 0) setFailedLocal(true);
  }, [photo.image]);
  const contents = <><div className="photo-window"><img ref={image} src={failedLocal ? photo.fallback : photo.image} alt={photo.alt} onError={() => { if (!failedLocal) setFailedLocal(true); }} loading={eager ? 'eager' : 'lazy'} /></div>{gallery && <motion.div className="gallery-metadata" initial={{ opacity: 0 }} variants={{ picked: { opacity: 1 }, resting: { opacity: 0 } }} transition={{ duration: reduce ? 0 : .2 }}>{link ? <Play aria-label={photo.caption} /> : photo.caption}</motion.div>}</>;
  return <motion.figure className={`polaroid ${className}`} initial={reduce ? { rotate: rotation } : { opacity: 0, y: 22, rotate: rotation - 3 }} whileInView={{ opacity: 1, y: 0, rotate: rotation }} viewport={{ once: true, amount: .15 }} whileHover={reduce ? {} : { scale: 1.05, rotate: 0, zIndex: 10 }} transition={{ type: 'spring', stiffness: 180, damping: 19 }}>
    <PushPin color={color} />
    <motion.div className="gallery-link" initial="resting" whileHover="picked" whileFocus="picked">{link ? <a href={link} target="_blank" rel="noopener noreferrer" aria-label={photo.caption}>{contents}</a> : contents}</motion.div>
    <figcaption>{photo.caption}</figcaption>
  </motion.figure>;
}
export function DrawnBox() {
  return <svg className="drawn-box" aria-hidden="true" viewBox="0 0 500 120" preserveAspectRatio="none"><path d="M5 9Q230 2 494 7L497 114Q270 118 7 113Z" fill="none" stroke="currentColor" strokeWidth="1.6" filter="url(#ink-effect)" /></svg>;
}
