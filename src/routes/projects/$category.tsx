import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { categoryOf, galleryFor, portfolioData as data, projectsIn, type CategoryKey } from '@/data/portfolioData';
import { BackLink, Footer, Img, MediaCell, Reveal } from '@/components/portfolio/ui';

export const Route = createFileRoute('/projects/$category')({
  loader: ({ params }) => {
    const category = categoryOf(params.category);
    if (!category) throw notFound();
    return { category };
  },
  // ?only=a,b narrows the timeline to those projects (used by the hero's role links).
  validateSearch: (search: Record<string, unknown>): { only?: string } => {
    const only = search['only'];
    return typeof only === 'string' && only ? { only } : {};
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.category.title ?? 'Featured Projects'} | ${data.name}`;
    return { meta: [{ title }, { property: 'og:title', content: title }, { name: 'description', content: loaderData?.category.blurb ?? data.pageMeta }] };
  },
  component: CategoryPage,
});

// One category's projects on a vertical timeline: newest first, media and text swap sides each row.
function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { only } = Route.useSearch();
  const all = projectsIn(category.key as CategoryKey);
  const picked = only ? all.filter(p => only.split(',').includes(p.key)) : [];
  const items = picked.length ? picked : all;

  return (
    <main className="subpage bg-ink">
      <section className="section page-head">
        <BackLink hash="projects" />
        <Reveal>
          <h1 className="display heading-xl">{category.title}</h1>
          <p className="lead">{category.blurb}</p>
          {picked.length > 0 && (
            <Link to="/projects/$category" params={{ category: category.key }} className="meta-text show-all">Showing {picked.length} of {all.length} · See all →</Link>
          )}
        </Reveal>
      </section>

      <section className="section timeline-wrap">
        <ol className="timeline">
          {items.map((p, idx) => {
            const showsCover = !p.youtube?.length && !p.shorts?.length && !!p.cover;
            const hasVideo = !!(p.youtube?.length || p.shorts?.length);
            const media = galleryFor(p.key).filter(i => !showsCover || i.image !== p.cover?.image);
            // No cover and no video: the first photo/post takes the large slot instead of the date tile.
            const lead = !hasVideo && !showsCover ? media[0] : undefined;
            const extra = lead ? media.slice(1) : media;
            return (
              <li key={p.key} className={`tl-item ${idx % 2 ? 'flip' : ''}`}>
                <span className="tl-dot" aria-hidden="true" />
                <Reveal className="tl-media">
                  {p.youtube?.length || p.shorts?.length ? (
                    <>
                      {p.youtube?.map(id => <YouTube key={id} id={id} title={p.title} />)}
                      {p.shorts?.length ? (
                        <div className="yt-shorts">
                          {p.shorts.map(id => <YouTube key={id} id={id} title={p.title} short />)}
                        </div>
                      ) : null}
                    </>
                  ) : p.cover ? (
                    <div className="tl-cover"><Img photo={p.cover} /></div>
                  ) : lead ? (
                    <MediaCell item={lead} className="cell tl-cover tl-lead" />
                  ) : (
                    <div className={`type-tile tl-cover ${idx % 2 ? 'bg-maroon' : 'bg-obsidian'}`} aria-hidden="true">{p.date}</div>
                  )}
                  {extra.length > 0 && (
                    <div className="tl-thumbs">
                      {extra.map(item => <MediaCell key={item.image} item={item} className="cell thumb-cell" />)}
                    </div>
                  )}
                </Reveal>
                <Reveal className="tl-text">
                  <p className="tl-date">{p.date}</p>
                  <h2 className="display">{p.title}</h2>
                  <p>{p.text}</p>
                  {p.links?.length ? (
                    <p className="tl-links">
                      {p.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>)}
                    </p>
                  ) : null}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>
      <Footer />
    </main>
  );
}

function YouTube({ id, title, short }: { id: string; title: string; short?: boolean }) {
  return (
    <div className={short ? 'yt yt-short' : 'yt'}>
      <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  );
}
