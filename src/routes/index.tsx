import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { portfolioData as data, topGallery } from '@/data/portfolioData';
import { Carousel, Footer, Img, Lightbox, MediaCell, Reveal } from '@/components/portfolio/ui';

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
  const filmRef = useRef<HTMLDivElement>(null);

  // Touch screens: the strip keeps the same smooth CSS animation as desktop (GPU transform, no per-frame
  // scrollLeft stepping). A horizontal swipe takes over: the strip follows the finger, glides, then the
  // animation picks up again from wherever it was left. Vertical swipes still scroll the page.
  useEffect(() => {
    const strip = filmRef.current;
    const track = strip?.firstElementChild as HTMLElement | null;
    if (!strip || !track || !window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    strip.classList.add('is-touch');
    let half = 0, x = 0, baseX = 0, startX = 0, startY = 0, lastX = 0, lastT = 0, vel = 0;
    let decided = false, horizontal = false, moved = false, raf = 0, timer = 0;
    const measure = () => { half = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0; };
    const wrap = (v: number) => { if (!half) return v; v %= half; return v > 0 ? v - half : v; };
    const dur = () => parseFloat(getComputedStyle(track).animationDuration) || 48;
    let duration = dur();
    const place = () => { track.style.transform = `translate3d(${x}px, 0, 0)`; };
    const hold = () => {
      cancelAnimationFrame(raf); window.clearTimeout(timer);
      x = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
      track.style.animation = 'none'; place();
    };
    const resume = () => {
      if (!half) measure();
      x = wrap(x);
      track.style.transform = '';
      track.style.animation = '';
      track.style.animationDelay = half ? `${(x / half) * duration}s` : '';
    };
    const glide = () => {
      let t0 = performance.now();
      const step = (now: number) => {
        const dt = Math.min(now - t0, 40); t0 = now;
        x = wrap(x + vel * dt); place();
        vel *= Math.pow(0.94, dt / 16);
        if (Math.abs(vel) > 0.02) raf = requestAnimationFrame(step);
        else timer = window.setTimeout(resume, 700);
      };
      raf = requestAnimationFrame(step);
    };
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      if (track.style.animation !== 'none') { duration = dur(); }
      measure(); hold();
      baseX = x; startX = lastX = t.clientX; startY = t.clientY; lastT = performance.now();
      vel = 0; decided = false; horizontal = false; moved = false;
    };
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (!decided && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) { decided = true; horizontal = Math.abs(dx) > Math.abs(dy); }
      if (!horizontal) return;
      moved = true;
      const now = performance.now(), dt = Math.max(now - lastT, 1);
      vel = 0.75 * vel + 0.25 * ((t.clientX - lastX) / dt);
      lastX = t.clientX; lastT = now;
      x = wrap(baseX + dx); place();
    };
    const onEnd = () => {
      if (moved && Math.abs(vel) > 0.08) glide();
      else timer = window.setTimeout(resume, moved ? 700 : 0);
    };
    // A swipe must not count as a tap on the frame's link.
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    strip.addEventListener('touchstart', onStart, { passive: true });
    strip.addEventListener('touchmove', onMove, { passive: true });
    strip.addEventListener('touchend', onEnd, { passive: true });
    strip.addEventListener('touchcancel', onEnd, { passive: true });
    strip.addEventListener('click', onClick, true);
    return () => {
      cancelAnimationFrame(raf); window.clearTimeout(timer);
      strip.removeEventListener('touchstart', onStart);
      strip.removeEventListener('touchmove', onMove);
      strip.removeEventListener('touchend', onEnd);
      strip.removeEventListener('touchcancel', onEnd);
      strip.removeEventListener('click', onClick, true);
      strip.classList.remove('is-touch');
      track.style.animation = ''; track.style.transform = ''; track.style.animationDelay = '';
    };
  }, []);
  const [bioCopied, setBioCopied] = useState(false);
  const top = topGallery();
  const [lightbox, setLightbox] = useState<number | null>(null);

  async function copyBio() {
    try { await navigator.clipboard.writeText(data.contact.bio); setBioCopied(true); } catch { setBioCopied(false); }
  }

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
        <div className="bg overlay-obsidian"><Img photo={data.cover.background} eager /></div>
        <p className="cover-label">Artist Portfolio</p>
        <Reveal>
          <div className="name-block">
            <h1 className="display"><span>Sadhana</span><span>Tawde</span></h1>
            <p className="sub">
              {data.subtitle.map((s, i) => (
                <span key={s.label}>
                  {i > 0 && <span className="bar" aria-hidden="true">|</span>}
                  {s.category
                    ? <Link to="/projects/$category" params={{ category: s.category }}>{s.label}</Link>
                    : <a href={`#${s.hash}`} onClick={e => { const el = document.getElementById(s.hash ?? ''); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }}>{s.label}</a>}
                </span>
              ))}
            </p>
          </div>
        </Reveal>
        <Reveal className="frame"><Img photo={data.cover.hero} /></Reveal>
      </section>

      {/* 2. Why Beatbox */}
      <section id="about" className="section about bg-maroon">
        <div className="bg overlay-maroon"><Img photo={data.about.background} eager /></div>
        <Reveal className="content">
          <h2 className="display">{data.about.title}</h2>
          {data.about.paragraphs.map(p => <p key={p}>{p}</p>)}
        </Reveal>
      </section>

      {/* 3. Featured projects: heading, section links in two lines, then the film strip rolling left to right */}
      <section id="projects" className="section featured bg-ink">
        <Reveal className="featured-head">
          <h2 className="display heading-xl">Featured Projects</h2>
          <div className="featured-links">
            {[data.projects.categories.slice(0, 3), data.projects.categories.slice(3)].map((row, r) => (
              <ul key={r}>
                {row.map(c => <li key={c.key}><Link to="/projects/$category" params={{ category: c.key }}>{c.title}</Link></li>)}
              </ul>
            ))}
          </div>
        </Reveal>
        <div className="filmstrip" id="filmstrip">
          <div className="filmstrip-scroll" ref={filmRef}>
          <div className="filmstrip-track">
            {[0, 1].map(set => (
              <div className="filmstrip-set" key={set} aria-hidden={set === 1 || undefined}>
                {data.projects.categories.map((c, i) => (
                  <Link key={c.key} to="/projects/$category" params={{ category: c.key }} tabIndex={set === 1 ? -1 : undefined} className={`film-frame ${i % 2 ? 'tint-m' : 'tint-g'}`}>
                    {c.frame && <Img photo={c.frame} />}
                    <span className="film-title">{c.title}</span>
                    <span className="film-more">See more →</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* 4. Social: Instagram posts (embedded, same method as Why Bother) + YouTube channel */}
      <section id="social" className="section bg-maroon">
        <Reveal className="head-row">
          <h2 className="display heading-xl">Social</h2>
          <div className="social-links">
            <a href={data.instagram.profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram @${data.instagram.handle}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.4" /><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" /></svg>
            </a>
            {data.youtube.channelUrl && (
              <a href={data.youtube.channelUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M22.5 7.2a3 3 0 0 0-2.1-2.1C18.5 4.5 12 4.5 12 4.5s-6.5 0-8.4.6A3 3 0 0 0 1.5 7.2C1 9.100 1 12 1 12s0 2.900.5 4.800a3 3 0 0 0 2.100 2.100c1.900.6 8.400.6 8.400.6s6.500 0 8.400-.6a3 3 0 0 0 2.100-2.100c.5-1.900.5-4.800.5-4.800s0-2.900-.5-4.800ZM9.800 15.300V8.700l5.700 3.300-5.700 3.300Z" clipRule="evenodd" /></svg>
              </a>
            )}
          </div>
        </Reveal>
        <h3 className="meta-text feed-label">Instagram</h3>
        <Carousel className="feed">
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
        </Carousel>
        {data.youtube.videos.length > 0 && (
          <>
            <h3 className="meta-text feed-label">YouTube</h3>
            <Carousel className="feed yt-feed">
              {data.youtube.videos.map(v => <YouTubeCard key={v.id} id={v.id} title={v.title} />)}
            </Carousel>
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
          {top.map((item, i) => <MediaCell key={item.image} item={item} className="cell slide" onOpen={() => setLightbox(i)} />)}
          <Link to="/gallery" className="cell slide see-more">
            <span className="display">See<br />More</span>
            <span className="meta-text">All photos &amp; videos →</span>
          </Link>
        </div>
        <div className="gallery-cta">
          <Link to="/gallery" className="btn-outline">View all →</Link>
        </div>
        {lightbox !== null && <Lightbox items={top} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />}
      </section>

      {/* 6. About me */}
      <section id="about-me" className="section about-me bg-obsidian">
        <div className="bg"><Img photo={data.contact.aboutBackground} eager /></div>
        <Reveal className="about-me-copy">
          <h2 className="display heading-xl">{data.contact.aboutTitle}</h2>
          <div>
            <p>{data.contact.bio}</p>
            <div className="about-me-btns">
              <button type="button" className="btn-outline" onClick={copyBio}>{bioCopied ? data.contact.copiedLabel : data.contact.copyBioLabel}</button>
              <a className="btn-outline" href={data.contact.pressKitUrl} target="_blank" rel="noopener noreferrer">{data.contact.pressKitLabel}</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7. Contact */}
      <section id="contact" className="section contact bg-maroon">
        <div className="bg overlay-fade"><Img photo={data.contact.background} eager /></div>
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
