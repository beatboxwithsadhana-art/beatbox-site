import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { portfolioData as data, type EventKey } from '@/data/portfolioData';
import { BackLink, Footer, MediaCell, Reveal } from '@/components/portfolio/ui';

export const Route = createFileRoute('/gallery')({
  head: () => {
    const title = `Gallery | ${data.name}`;
    return { meta: [{ title }, { property: 'og:title', content: title }, { name: 'description', content: 'Photos and videos from performances, workshops and shoots.' }] };
  },
  component: GalleryPage,
});

// Every photo and video, filterable by event.
function GalleryPage() {
  const [filter, setFilter] = useState<EventKey | 'all'>('all');
  const items = data.gallery.items.filter(i => filter === 'all' || i.event === filter);

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
          {data.gallery.filters.map(f => (
            <button key={f.key} type="button" className="chip" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>
        <div className="grid">
          {items.map(item => <MediaCell key={item.image} item={item} />)}
        </div>
      </section>
      <Footer />
    </main>
  );
}
