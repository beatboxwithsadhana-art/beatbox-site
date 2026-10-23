import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { portfolioData as data, type GalleryItem, type Photo } from '@/data/portfolioData';

// Shows the real image, and switches to the placeholder automatically if the file is missing.
export function Img({ photo, className }: { photo: Photo; className?: string }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? photo.fallback : photo.image} alt={photo.alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
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

// A gallery photo, an Instagram post/reel tile, or a video card that opens its Drive file in a new tab.
export function MediaCell({ item, className = 'cell' }: { item: GalleryItem; className?: string }) {
  const label = item.caption ?? data.gallery.filters.find(f => f.key === item.event)?.label ?? '';
  const body = <><Img photo={item} /><span className="tag">{label}</span></>;
  if (item.instagram) {
    return (
      <a className={`${className} ig${item.instagram.reel ? ' video' : ''}`} href={item.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`${label} on Instagram`}>
        <Img photo={item} /><span className="tag">{label} ↗</span>
      </a>
    );
  }
  if (!item.video) return <div className={className}>{body}</div>;
  if (item.video.drive) return <a className={`${className} video`} href={item.video.drive} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${label}`}>{body}</a>;
  return <div className={`${className} video soon`} aria-label={`${label}: link coming soon`}>{body}</div>;
}

export function Footer() {
  return <p className="copy-line">{data.contact.signOff}</p>;
}
