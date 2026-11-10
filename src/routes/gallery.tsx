import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { portfolioData as data } from '@/data/portfolioData';
import { BackLink, Footer, Lightbox, MediaCell, Reveal } from '@/components/portfolio/ui';

export const Route = createFileRoute('/gallery')({
  head: () => {
    const title = `Gallery | ${data.name}`;
    return { meta: [{ title }, { property: 'og:title', content: title }, { name: 'description', content: 'Photos and videos from performances, workshops and shoots.' }] };
  },
  component: GalleryPage,
});

// Every photo and video, filterable by event.
function GalleryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState<number | null>(null);
  const items = data.gallery.items.filter(i => filter === 'all' || i.event === filter);
  // Only offer chips for events that still have photos here.
  const filters = data.gallery.filters.filter(f => f.key === 'all' || data.gallery.items.some(i => i.event === f.key));

  return (
    <main className="subpage bg-ink">
      <section className="section page-head">
        <BackLink hash="gallery" />
        <Reveal>
          <h1 className="display heading-xl">{data.gallery.title}</h1>
        </Reveal>
      </section>
      <section className="section gallery-page">
        <div className="filters" role="group" aria-label="Filter gallery">
          {filters.map(f => (
            <button key={f.key} type="button" className="chip" aria-pressed={filter === f.key} onClick={() => { setFilter(f.key); setOpen(null); }}>{f.label}</button>
          ))}
        </div>
        <div className="gallery-rows">
          {items.map((item, i) => <MediaCell key={item.image} item={item} onOpen={() => setOpen(i)} />)}
        </div>
      </section>
      {open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      <Footer />
    </main>
  );
}
