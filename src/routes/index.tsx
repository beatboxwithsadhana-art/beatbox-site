import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { portfolioData as data, projectsIn, shelfItems, topGallery } from '@/data/portfolioData';
import { Footer, Img, MediaCell, Reveal } from '@/components/portfolio/ui';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: data.pageMeta },
    { name: 'description', content: data.pageMeta },
    { property: 'og:title', content: data.pageMeta },
    { property: 'og:description', content: data.pageMeta },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const sliderRef = useRef<HTMLDivElement>(null);

  async function copyEmail() {
    try { await navigator.clipboard.writeText(data.contact.email); setCopyState('copied'); }
    catch { setCopyState('error'); }
  }

  // Slider arrows move one card at a time.
  function slide(dir: 1 | -1) {
    const el = sliderRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (el && card) el.scrollBy({ left: dir * card.offsetWidth, behavior: 'smooth' });
  }

  return (
    <main>
      {/* 1. Cover */}
      <section id="top" className="section cover bg-ink">
        <div className="bg overlay-obsidian"><Img photo={data.cover.background} /></div>
        <p className="cover-label">Artist Portfolio</p>
        <Reveal>
          <div className="name-block">
            <h1 className="display"><span>Sadhana</span><span>Tawde</span></h1>
            <p className="sub">
              {data.subtitle.map((s, i) => (
                <span key={s.label}>
                  {i > 0 && <span className="bar" aria-hidden="true">|</span>}
                  <Link to="/projects/$category" params={{ category: s.category }} search={s.only ? { only: s.only.join(',') } : {}}>{s.label}</Link>
                </span>
              ))}
            </p>
          </div>
        </Reveal>
        <Reveal className="frame"><Img photo={data.cover.hero} /></Reveal>
      </section>

      {/* 2. Why Beatbox */}
      <section id="about" className="section about bg-maroon">
        <div className="bg overlay-maroon"><Img photo={data.about.background} /></div>
        <Reveal className="content">
          <h2 className="display">{data.about.title}</h2>
          {data.about.paragraphs.map(p => <p key={p}>{p}</p>)}
        </Reveal>
      </section>

      {/* 3. Featured projects: one wide shelf per category with a strip of its photos; each opens its timeline page */}
      <section id="projects" className="section bg-ink">
        <Reveal className="head-row">
          <h2 className="display heading-xl">Featured<br />Projects</h2>
        </Reveal>
        <div className="shelves">
          {data.projects.categories.map((c, idx) => {
            const items = projectsIn(c.key);
            return (
              <Reveal key={c.key}>
                <Link to="/projects/$category" params={{ category: c.key }} className="shelf" aria-label={`${c.title}: ${items.length} projects`}>
                  <div className="shelf-info">
                    <div className="cat">{items.length} {items.length === 1 ? 'project' : 'projects'}</div>
                    <div className="title"><span>{c.title}</span></div>
                    <p>{c.blurb}</p>
                    <span className="view">View timeline →</span>
                  </div>
                  <div className="shelf-strip">
                    {shelfItems(c.key).map((it, i) => it.photo
                      ? <div key={it.key} className={`shelf-thumb ${(idx + i) % 2 ? 'tint-maroon' : 'tint-green'}`}><Img photo={it.photo} /></div>
                      : <div key={it.key} className={`shelf-thumb type-tile ${(idx + i) % 2 ? 'bg-maroon' : 'bg-obsidian'}`} aria-hidden="true">{it.title}</div>)}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 4. Social: Instagram posts (embedded, same method as Why Bother) + YouTube channel */}
      <section id="social" className="section bg-maroon">
        <Reveal className="head-row">
          <h2 className="display heading-xl">Social</h2>
          <div className="social-links">
            <a className="meta-text" href={data.instagram.profileUrl} target="_blank" rel="noopener noreferrer">Instagram @{data.instagram.handle} ↗</a>
            {data.youtube.channelUrl && <a className="meta-text" href={data.youtube.channelUrl} target="_blank" rel="noopener noreferrer">YouTube ↗</a>}
          </div>
        </Reveal>
        <h3 className="meta-text feed-label">Instagram</h3>
        <div className="feed">
          {data.instagram.posts.map(p => (
            <div key={`${p.type}-${p.code}`}>
              <iframe
                src={`https://www.instagram.com/${p.type}/${p.code}/embed/captioned`}
                title={`Instagram ${p.type} ${p.code}`}
                loading="lazy"
                allow="encrypted-media; clipboard-write"
              />
            </div>
          ))}
        </div>
        {data.youtube.videos.length > 0 && (
          <>
            <h3 className="meta-text feed-label">YouTube</h3>
            <div className="feed yt-feed">
              {data.youtube.videos.map(v => <YouTubeCard key={v.id} id={v.id} title={v.title} />)}
            </div>
          </>
        )}
        {data.youtube.channelUrl && (
          <div className="social-cta">
            <a className="btn-outline" href={data.youtube.channelUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
          </div>
        )}
      </section>

      {/* 5. Gallery: top five in a slider, then "See More" opens the full gallery page */}
      <section id="gallery" className="section bg-ink">
        <Reveal className="head-row">
          <h2 className="display heading-xl">{data.gallery.title}</h2>
          <div className="slider-arrows">
            <button type="button" className="arrow" onClick={() => slide(-1)} aria-label="Previous">←</button>
            <button type="button" className="arrow" onClick={() => slide(1)} aria-label="Next">→</button>
          </div>
        </Reveal>
        <div className="slider" ref={sliderRef}>
          {topGallery().map(item => <MediaCell key={item.image} item={item} className="cell slide" />)}
          <Link to="/gallery" className="cell slide see-more">
            <span className="display">See<br />More</span>
            <span className="meta-text">All photos &amp; videos →</span>
          </Link>
        </div>
      </section>

      {/* 6. Contact */}
      <section id="contact" className="section contact bg-maroon">
        <div className="bg overlay-fade"><Img photo={data.contact.background} /></div>
        <Reveal>
          <h2 className="display contact-title" aria-label={data.contact.title}>
            {data.contact.titleLines.map(line => <span key={line}>{line}</span>)}
          </h2>
          <div className="actions">
            <button type="button" className="btn-outline" onClick={copyEmail}>
              {copyState === 'copied' ? data.contact.copiedLabel : copyState === 'error' ? data.contact.copyError : data.contact.email}
            </button>
            <a className="btn-outline" href={data.instagram.profileUrl} target="_blank" rel="noopener noreferrer">Instagram @{data.instagram.handle}</a>
          </div>
          <p className="meta-text" style={{ marginTop: '1.4rem' }}>{data.contact.copyLabel}</p>
        </Reveal>
        <Footer />
      </section>
    </main>
  );
}

// A YouTube thumbnail that swaps in the player on click, so the page doesn't load fifteen players up front.
function YouTubeCard({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="yt-card">
      {playing ? (
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="yt-play" aria-hidden="true">▶</span>
          <span className="yt-title">{title}</span>
        </button>
      )}
    </div>
  );
}
