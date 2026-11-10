import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { portfolioData as data, type GalleryItem, type Photo } from '@/data/portfolioData';

// Shows the real image, and switches to the placeholder automatically if the file is missing.
// Section backgrounds pass eager: Safari never lazy-loads an image that is offset outside its clipped section
// while it still has zero height (that is what hid the Contact photo on iPhones).
export function Img({ photo, className, eager }: { photo: Photo; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? photo.fallback : photo.image} alt={photo.alt} className={className} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />;
}

// Fades a block up once it scrolls into view (Why Bother's reveal).
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } });
    }, { rootMargin: '0px 0px -80px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

// The only navigation on sub-pages: a small link back to the home page section they came from.
export function BackLink({ hash }: { hash?: string }) {
  return <Link to="/" {...(hash ? { hash } : {})} className="back-link">← Back</Link>;
}

// A gallery photo, an Instagram post/reel tile, or a video card that opens in a new tab. No visible labels; each keeps its own shape.
export function MediaCell({ item, className = 'cell', onOpen }: { item: GalleryItem; className?: string; onOpen?: () => void }) {
  const label = item.caption ?? data.gallery.filters.find(f => f.key === item.event)?.label ?? '';
  const style = item.ar ? ({ '--ar': item.ar } as CSSProperties) : undefined;
  if (item.instagram) {
    return (
      <a className={`${className} ig${item.instagram.reel ? ' video' : ''}`} style={style} href={item.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`${label} on Instagram`}>
        <Img photo={item} />
      </a>
    );
  }
  if (item.video?.drive) return <a className={`${className} video`} style={style} href={item.video.drive} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${label}`}><Img photo={item} /></a>;
  if (onOpen) return <button type="button" className={`${className} zoomable`} style={style} onClick={onOpen} aria-label={`View ${item.alt}`}><Img photo={item} /></button>;
  return <div className={className} style={style}><Img photo={item} /></div>;
}

// Full-screen photo viewer: arrows, swipe, arrow keys, Esc / tap outside / close button.
export function Lightbox({ items, index, onIndex, onClose }: { items: GalleryItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const n = items.length;
  const go = (d: number) => onIndex((index + d + n) % n);
  const touchX = useRef<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndex((index + 1) % n);
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, n, onIndex, onClose]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const item = items[index];
  if (!item || typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="lightbox" role="dialog" aria-modal="true" aria-label={item.alt}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={e => { touchX.current = e.touches[0]?.clientX ?? null; }}
      onTouchEnd={e => {
        const x0 = touchX.current; touchX.current = null;
        const x1 = e.changedTouches[0]?.clientX;
        if (x0 != null && x1 != null && Math.abs(x1 - x0) > 50) go(x1 < x0 ? 1 : -1);
      }}
    >
      <img key={item.image} src={item.image} alt={item.alt} onClick={e => e.stopPropagation()} />
      <button type="button" className="lb-close" onClick={onClose} aria-label="Close">✕</button>
      {n > 1 && <>
        <button type="button" className="lb-arrow lb-prev" onClick={() => go(-1)} aria-label="Previous photo">←</button>
        <button type="button" className="lb-arrow lb-next" onClick={() => go(1)} aria-label="Next photo">→</button>
      </>}
      <p className="lb-count meta-text">{index + 1} / {n}</p>
    </div>,
    document.body,
  );
}

// A horizontal scroller with arrow buttons on its left and right edges. Each click moves by a screenful of cards.
export function Carousel({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const update = () => {
    const el = ref.current; if (!el) return;
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 4);
  };
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const move = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const step = Math.max(1, Math.floor(el.clientWidth / card.offsetWidth)) * card.offsetWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  return (
    <div className="carousel">
      <div className={className} ref={ref} onScroll={update}>{children}</div>
      <button type="button" className="arrow car-arrow car-prev" onClick={() => move(-1)} disabled={atStart} aria-label="Scroll left">←</button>
      <button type="button" className="arrow car-arrow car-next" onClick={() => move(1)} disabled={atEnd} aria-label="Scroll right">→</button>
    </div>
  );
}

export function Footer() {
  return <p className="copy-line">{data.contact.signOff}</p>;
}
