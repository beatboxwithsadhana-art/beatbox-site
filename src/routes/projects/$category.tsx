import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { categoryOf, portfolioData as data, projectMedia, projectsIn, type CategoryKey, type GalleryItem, type Photo, type Project } from '@/data/portfolioData';
import { BackLink, Footer, Img } from '@/components/portfolio/ui';

export const Route = createFileRoute('/projects/$category')({
  loader: ({ params }) => {
    const category = categoryOf(params.category);
    if (!category) throw notFound();
    return { category };
  },
  // ?only=a,b narrows the wall to those projects (used by the hero's role links). ?event=key opens that event.
  validateSearch: (search: Record<string, unknown>): { only?: string; event?: string } => {
    const out: { only?: string; event?: string } = {};
    if (typeof search['only'] === 'string' && search['only']) out.only = search['only'];
    if (typeof search['event'] === 'string' && search['event']) out.event = search['event'];
    return out;
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.category.title ?? 'Featured Projects'} | ${data.name}`;
    return { meta: [{ title }, { property: 'og:title', content: title }, { name: 'description', content: loaderData?.category.blurb ?? data.pageMeta }] };
  },
  component: CategoryPage,
});

// Slight tilts and drops, so the photos read as pinned by hand. Fixed values keep server and browser in step.
const TILT = [-3.4, 2.3, -1.5, 3, -2.5, 1.8, -3, 2.7, -1.8, 3.3];
const DROP = [0, 20, -6, 14, -12, 10, -8, 18, -4, 12];

// One section's events as instant photos pinned on a wall, in the sheet's order. A photo opens its event.
function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { only, event } = Route.useSearch();
  const all = projectsIn(category.key as CategoryKey);
  const picked = only ? all.filter(p => only.split(',').includes(p.key)) : [];
  const items = picked.length ? picked : all;
  const open = items.find(p => p.key === event);

  return (
    <main className="subpage wall-page bg-ink">
      <div className="wall-top"><BackLink hash="projects" /></div>
      <h1 className="display wall-title">{category.title}</h1>
      {picked.length > 0 && (
        <p className="wall-all"><Link to="/projects/$category" params={{ category: category.key }} className="meta-text show-all">Showing {picked.length} of {all.length} · See all →</Link></p>
      )}
      <div className={`wall-pins ${items.length <= 3 ? 'few' : ''}`}>
        {items.map((p, i) => (
          <Link
            key={p.key}
            to="/projects/$category"
            params={{ category: category.key }}
            search={{ ...(only ? { only } : {}), event: p.key }}
            resetScroll={false}
            className="pin"
            style={{ '--i': i, '--tilt': `${TILT[i % TILT.length]}deg`, '--drop': `${DROP[i % DROP.length]}px` } as React.CSSProperties}
          >
            <span className="pin-head" aria-hidden="true" />
            <span className="pin-card">
              <span className="pin-photo">{p.hero ? <Img photo={p.hero} /> : <span className="pin-blank" />}</span>
              <span className="pin-cap">{p.title}</span>
            </span>
          </Link>
        ))}
      </div>
      {category.links && category.links.length > 0 && (
        <section className="wall-links" aria-label="Read more">
          <h2 className="display">Read more</h2>
          <ul>
            {category.links.map(l => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  <span className="wl-source">{l.source}</span>
                  <span className="wl-label">{l.label}</span>
                  <span className="wl-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Footer />
      {open && <EventView key={open.key} project={open} list={items} categoryKey={category.key} categoryTitle={category.title} only={only} />}
    </main>
  );
}

type MediaItem =
  | { kind: 'video'; id: string }
  | { kind: 'short'; id: string }
  | { kind: 'photo'; photo: Photo }
  | { kind: 'post'; item: GalleryItem };

// Everything an event can show, in the order it opens. Long videos lead unless the event asks for them last.
function mediaOf(p: Project): MediaItem[] {
  const posts = projectMedia(p.key);
  const videos = (p.youtube ?? []).map(id => ({ kind: 'video' as const, id }));
  // A hero that is a YouTube thumbnail or an Instagram post's picture is already in the queue as that video or post.
  const heroIsCopy = !p.hero || p.hero.image.includes('i.ytimg.com') || posts.some(i => i.image === p.hero?.image);
  const rest: MediaItem[] = [
    ...(heroIsCopy || !p.hero ? [] : [{ kind: 'photo' as const, photo: p.hero }]),
    ...(p.photos ?? []).map(photo => ({ kind: 'photo' as const, photo })),
    ...(p.shorts ?? []).map(id => ({ kind: 'short' as const, id })),
    ...posts.map(item => ({ kind: 'post' as const, item })),
  ];
  return p.videoLast ? [...rest, ...videos] : [...videos, ...rest];
}

// The embed address for an Instagram post or reel link.
function embedOf(url: string | undefined) {
  const m = url?.match(/instagram\.com\/(p|reel|tv)\/([\w-]+)/);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/captioned` : '';
}

// An opened event: its videos and photos on one side, the write-up on the other.
function EventView({ project: p, list, categoryKey, categoryTitle, only }: { project: Project; list: Project[]; categoryKey: string; categoryTitle: string; only?: string | undefined }) {
  const navigate = useNavigate();
  const media = mediaOf(p);
  const [selected, setSelected] = useState(0);
  const main = media[selected];
  const at = list.findIndex(x => x.key === p.key);
  const prev = list[at - 1];
  const next = list[at + 1];
  const base = only ? { only } : {};

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') void navigate({ to: '/projects/$category', params: { category: categoryKey }, search: base, resetScroll: false });
    };
    window.addEventListener('keydown', close);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', close); document.body.style.overflow = overflow; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ev" role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="ev-top">
        <Link to="/projects/$category" params={{ category: categoryKey }} search={base} resetScroll={false} className="back-link ev-back">← Back</Link>
        <Link to="/projects/$category" params={{ category: categoryKey }} search={base} resetScroll={false} className="ev-x" aria-label="Close">×</Link>
      </div>
      <div className="ev-body">
        <div className="ev-media">
          {main && (
            <div className={`ev-main ${main.kind}`}>
              {main.kind === 'photo' && <Img photo={main.photo} />}
              {(main.kind === 'video' || main.kind === 'short') && <iframe src={`https://www.youtube-nocookie.com/embed/${main.id}`} title={p.title} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
              {main.kind === 'post' && <iframe src={embedOf(main.item.instagram?.url)} title={`${p.title} on Instagram`} loading="lazy" allow="encrypted-media; clipboard-write" />}
            </div>
          )}
          {media.length > 1 && (
            <div className="ev-thumbs">
              {media.map((m, i) => (
                <button key={i} type="button" className={`ev-thumb ${m.kind === 'video' || m.kind === 'short' || (m.kind === 'post' && m.item.instagram?.reel) ? 'is-video' : ''} ${m.kind === 'post' ? 'ev-post' : ''}`} aria-pressed={i === selected} aria-label={m.kind === 'photo' ? `Show photo ${i + 1}` : m.kind === 'post' ? 'Show Instagram post' : `Play video ${i + 1}`} onClick={() => setSelected(i)}>
                  {m.kind === 'photo' && <Img photo={m.photo} />}
                  {m.kind === 'post' && <><Img photo={m.item} /><span className="ev-post-tag">Instagram</span></>}
                  {(m.kind === 'video' || m.kind === 'short') && <img src={`https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`} alt="" loading="lazy" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="ev-text">
          <p className="meta-text">{categoryTitle}</p>
          <h2 className="display">{p.title}</h2>
          <p>{p.text}</p>
          {(prev || next) && (
            <div className="ev-nav">
              {prev ? <Link to="/projects/$category" params={{ category: categoryKey }} search={{ ...base, event: prev.key }} resetScroll={false}>← {prev.title}</Link> : <span />}
              {next ? <Link to="/projects/$category" params={{ category: categoryKey }} search={{ ...base, event: next.key }} resetScroll={false}>{next.title} →</Link> : <span />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
