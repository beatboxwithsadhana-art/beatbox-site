/// <reference types="vite/client" />
import photo1 from "@/assets/placeholders/photo-1.jpg.asset.json";
import photo2 from "@/assets/placeholders/photo-2.jpg.asset.json";
import photo3 from "@/assets/placeholders/photo-3.jpg.asset.json";
import photo4 from "@/assets/placeholders/photo-4.jpg.asset.json";
import photo5 from "@/assets/placeholders/photo-5.jpg.asset.json";
import photo6 from "@/assets/placeholders/photo-6.jpg.asset.json";
import photo7 from "@/assets/placeholders/photo-7.jpg.asset.json";
import photo8 from "@/assets/placeholders/photo-8.jpg.asset.json";
import photo9 from "@/assets/placeholders/photo-9.jpg.asset.json";
import photo10 from "@/assets/placeholders/photo-10.jpg.asset.json";
import photo11 from "@/assets/placeholders/photo-11.jpg.asset.json";
import photo12 from "@/assets/placeholders/photo-12.jpg.asset.json";

// Real photos are Lovable hosted assets: each image attached in the Lovable chat becomes
// src/assets/<file>.asset.json (same method as the Why Bother site). The glob below picks up
// every asset that exists, so a photo shows as soon as its asset file is in the project and
// falls back to a placeholder until then. Nothing breaks if an asset is missing.
const ASSETS = import.meta.glob("/src/assets/*.asset.json", { eager: true }) as Record<string, { default?: { url: string }; url?: string }>;
const asset = (file: string): string | undefined => {
  const mod = ASSETS[`/src/assets/${file}.asset.json`];
  return mod?.default?.url ?? mod?.url;
};
// Hosted asset if uploaded, otherwise the public path (for a file placed under /public/images).
const src = (file: string, dir = "") => asset(file) ?? `/images/${dir}${file}`;

const PLACEHOLDERS = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, photo11, photo12].map(p => p.url);
const fb = (n: number) => PLACEHOLDERS[(n - 1) % PLACEHOLDERS.length] ?? "";

export type Photo = { image: string; fallback: string; alt: string; caption?: string };

// One key per project in the Excel sheet, plus three gallery-only groups (cypher, concert, portfolio).
export type EventKey =
  | "bandlab" | "kaivalyadham" | "malvan" | "wildjam" | "myntra" | "bombay-presidency" | "welupt"
  | "power-pose" | "arangetram" | "aarey" | "tamarind" | "mumbai-machoo" | "saiyyara" | "bombba-bomb"
  | "jevlis" | "spotify-rap91" | "radio" | "midday" | "ibc" | "tom-thum" | "colossal" | "vodcast" | "coaching"
  | "cypher" | "concert" | "portfolio";

export type CategoryKey = "events" | "workshops" | "film-ads" | "hosting" | "media" | "competitions";

export type Category = { key: CategoryKey; title: string; blurb: string };

export type Project = {
  key: EventKey;
  category: CategoryKey;
  // Kept for reference only; the timeline no longer shows dates and follows the sheet's order.
  date?: string;
  title: string;
  text: string;
  // Cover photo for the timeline; projects without one show a typographic tile until a photo is added.
  // Covers reuse the gallery file of the same photo, so a photo is never shown twice on one page.
  cover?: Photo;
  // YouTube video IDs (unlisted), embedded on the project's timeline entry.
  youtube?: string[];
  // YouTube Shorts IDs, embedded upright beside each other.
  shorts?: string[];
  // External links (Instagram posts, articles), shown under the text and opened in a new tab.
  links?: { label: string; url: string }[];
};

export type GalleryItem = Photo & {
  event: EventKey;
  // Video items open their Google Drive file in a new tab. Empty = "Coming soon".
  video?: { drive: string };
  // Instagram post or reel: the tile opens it in a new tab. Reels get the play button like videos.
  instagram?: { url: string; reel?: boolean };
};

// Instagram posts, embedded the same way as the Why Bother site.
export type InstagramPost = { type: "p" | "reel" | "tv"; code: string };

// Re-used when Drive photos come back as project covers.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cover = (file: string, dir: string, n: number, alt: string): Photo => ({ image: src(file, dir), fallback: fb(n), alt });

export const portfolioData = {
  name: "Sadhana Tawde",
  // Each role links to a category timeline; "only" narrows the timeline to those projects.
  subtitle: [
    { label: "Beatboxer", category: "film-ads" },
    { label: "Live performer", category: "events", only: ["spotify-rap91", "arangetram"] },
    { label: "Mentor", category: "workshops" },
  ] as { label: string; category: CategoryKey; only?: EventKey[] }[],
  pageMeta: "Sadhana Tawde | Beatboxer, Live Performer, Mentor",
  cover: {
    background: { image: src("cover-banner.jpg"), fallback: fb(1), alt: "Live stage and crowd" } satisfies Photo,
    // Final studio portrait (2026-11-04); the earlier graded one until the new file is uploaded.
    hero: { image: asset("hero-final.jpg") ?? asset("hero-graded.jpg") ?? src("hero-clean.jpg"), fallback: fb(2), alt: "Sadhana Tawde, portrait" } satisfies Photo,
  },
  about: {
    title: "Why Beatbox",
    paragraphs: [
      "Beatboxing, for me, is a form of expression, and I believe everyone has it in them. If you can hum, you are already beatboxing. I like to merge beatboxing with anything; even the slightest tempo will do. That's the magic of beatboxing—it can convert anything into music. You don't need any instruments; you are enough.",
      "This curiosity led me to discover new sounds in beatboxing and become the first female beatboxer in Mumbai. I enjoy performing live, engaging my audience, and making them move to my beats. Apart from this, I have performed at Spotify Rap 91 and the Epic Fam Jam by Rolling Stone.",
    ],
    background: { image: src("why-bg.jpg"), fallback: fb(3), alt: "Live performance on stage" } satisfies Photo,
  },
  // Featured projects: the six sections of the sheet's "Flow of Featured Events page" tab, in its order.
  // Keys are kept from earlier rounds so existing /projects/<key> links still work.
  projects: {
    title: "Featured Projects",
    categories: [
      { key: "film-ads", title: "On-Screen & Commercial Credits", blurb: "On screen in film and in national commercial campaigns." },
      { key: "competitions", title: "Awards & Championship Titles", blurb: "Battles and championship titles." },
      { key: "events", title: "Major Live Performances & Collaborations", blurb: "Live sets, showcases and collaborations." },
      { key: "hosting", title: "Hosting & Anchoring", blurb: "Hosting stages, shows and community events." },
      { key: "media", title: "Press & Media Coverage", blurb: "Newspaper features and radio interviews." },
      { key: "workshops", title: "Workshop & Mentorship", blurb: "Workshops, coaching, judging and community building." },
    ] satisfies Category[],
    // Order, write-ups and videos follow the "Flow of Featured Events page" tab of the sheet (project-data\Details of Beatbox Performances.xlsx).
    // No Drive photos for now (the Drive folders are being sorted); Instagram tiles come from gallery items with `instagram`.
    items: [
      { key: "saiyyara", category: "film-ads", title: "Saiyyara (Film)", date: "Jul 2025", text: "Featured on screen in the song 'Humsafar' from Mohit Suri's Saiyaara alongside Ahan Pandey, with original beatbox integrated directly into the track's music.", youtube: ["D9DiMnlpFK8"] },
      { key: "myntra", category: "film-ads", title: "Myntra Ad", date: "Feb 2026", text: "Featured in a national commercial campaign for Myntra alongside Nora Fatehi.", youtube: ["faESXyOVxYA"], shorts: ["BNnys2LEw4Y"] },
      { key: "colossal", category: "competitions", title: "Colossal 2019", date: "Dec 2019", text: "Female Colossal Vice Champion (2019) — Secured Vice Champion at Colossal 2019, one of India's premier national beatboxing championships.", youtube: ["eR_yzFBKHxg", "bHcz0AhhOGU"] },
      { key: "tom-thum", category: "events", title: "Jammed with Tom Thum", date: "Feb 2020", text: "Jammed with global beatboxing icon Tom Thum, famous for his pioneering vocal techniques and multi-instrumental sound effects." },
      { key: "spotify-rap91", category: "events", title: "Spotify Rap 91", date: "Nov 2024", text: "Performed at Spotify's RAP 91 LIVE (2024) as part of an all-women crew—featuring four rappers, a DJ, and a beatboxer—highlighted by an energetic live jugalbandi between beatbox and DJing.", youtube: ["7FWgnEjy4eU"], shorts: ["h8WbXbTNAkM"] },
      { key: "arangetram", category: "events", title: "Arangetram", date: "Dec 2025", text: "Performed a live jugalbandi combining beatbox with a traditional Vadya Vrinda ensemble (mridangam, flute, and violin) for a Bharatanatyam Arangetram.", youtube: ["NczgpjRy1IY"] },
      { key: "power-pose", category: "events", title: "Power Pose", date: "Dec 2025", text: "Performed a live set at the Power Pose event, hosted by Women in Music India to highlight women artists in the music industry.", youtube: ["XwPxJRBWGYA"] },
      { key: "bandlab", category: "events", title: "BandLab 'Pass the Aux'", date: "Oct 2026", text: "Performed a live beatbox set at BandLab's Pass the Aux showcase (October 2026).", shorts: ["5F54fzwUJMM"] },
      { key: "jevlis", category: "events", title: "Jevlis Ka Diwas", date: "Apr 2025", text: "Performed a live beatbox set at World of Vibes' Jevlis Ka Diwas event, sharing the lineup with Kratex and FeniFina." },
      { key: "kaivalyadham", category: "events", title: "Kaivalyadham Jubilee", text: "G.S. College of Yoga (Kaivalyadhama): Performed live for the Platinum Jubilee (75th Anniversary) celebrations of G.S. College of Yoga, Kaivalyadhama (Lonavala), delivering a vocal percussion performance for the institution’s milestone event." },
      { key: "wildjam", category: "events", title: "Wildjam", date: "Mar 2026", text: "Performed a live beatbox set at Wildjam, an event hosted by India’s premier all-female hip-hop collective, WildWildWomen." },
      { key: "welupt", category: "events", title: "Welupt Collective", date: "Mar 2025", text: "Featured live performer at Welupt Collective's pre-Women’s Day event in March 2025, celebrating women creators through live vocal percussion.", youtube: ["SznC7xxvqeo"] },
      { key: "bombba-bomb", category: "events", title: "Bombba Bomb", date: "May 2025", text: "Featured artist performer at the Bombba Bomb showcase, delivering a live beatbox set at the underground platform dedicated to spotlighting raw independent music talent." },
      { key: "aarey", category: "hosting", title: "Aarey Music Festival", date: "Dec 2025", text: "Co-organized and hosted/emceed the Aarey Music Festival—Mumbai’s first forest music festival celebrating ecology, indigenous arts, and live performance." },
      { key: "vodcast", category: "hosting", title: "Street Hip-Hop Vodcast", text: "Host & Presenter (Street Hip-Hop Vodcast): Host for the Street Hip-Hop Vodcast, conducting video interviews and discussions focused on underground hip-hop culture, independent artists, and vocal percussion.", youtube: ["kIxfs4JCKq0"], shorts: ["UI7DLRhn0x4"] },
      { key: "mumbai-machoo", category: "hosting", title: "Mumbai Machoo", date: "Jun 2025", text: "Hosted and delivered a live beatbox performance at Mumbai Machoo, driving the stage execution for the independent community showcase." },
      { key: "midday", category: "media", title: "Mid-day", date: "Sep & Nov 2024", text: "Featured twice in Mid-Day newspaper highlighting live beatboxing in an experimental Didgeridoo fusion set and a community hip-hop cypher." },
      { key: "radio", category: "media", title: "Radio Features", date: "2024 & 2025", text: "Featured across multiple radio stations in live interview segments, discussing beatboxing technique, vocal percussion, and independent music creation." },
      { key: "malvan", category: "workshops", title: "Malvan Beatboxing Workshop", date: "Apr 2026", text: "Conducted the first-ever beatboxing workshop in Malvan (Sindhudurg), introducing vocal percussion to a Tier-3 regional community with 45+ participants aged 4 to 75; featured across multiple district news publications.", youtube: ["f-u8DhmLcFI"] },
      { key: "coaching", category: "workshops", title: "1-on-1 Beatbox Coaching", text: "1-on-1 Beatbox Coaching: Offers customized private lessons for students across all age groups (including young learners starting from age 6), focusing on rhythm development, vocal techniques, and performance confidence." },
      { key: "tamarind", category: "workshops", title: "Tamarind Tree Workshop", date: "Nov 2025", text: "Led an interactive beatboxing workshop for indigenous children at Tamarind Tree School in Palghar, introducing vocal percussion and creative rhythm building to young learners." },
      { key: "bombay-presidency", category: "workshops", title: "Bombay Presidency International School", date: "Jan 2026", text: "Invited as an official judge for Bombay Presidency International School's (ICSE) \"Music from Scratch\" event, judging student musical showcases.", shorts: ["mJhVFu7ftNE", "oNd8OwgsdjQ"] },
      { key: "ibc", category: "workshops", title: "Indian Beatbox Championship 2021", date: "Dec 2022", text: "Indian Beatbox Championship (2021): Core organizing team member and Community Manager, driving nationwide artist outreach, community engagement, and event logistics." },
    ] as Project[],
  },
  youtube: {
    // Channel link for the Social section; the button shows once this is filled in.
    channelUrl: "https://www.youtube.com/@sadhanatawde99",
    // Public uploads on the channel, newest first (from the channel's RSS feed, 2026-10-22). Unlisted videos never appear here.
    videos: [
      { id: "5F54fzwUJMM", title: "Audience Reactions" },
      { id: "22CALl9Qq-Q", title: "Unexpected" },
      { id: "lOpbN4kBmng", title: "Bollywood meets boom bap" },
      { id: "Ddfo1LBmWzM", title: "Practising flow beside the flow" },
      { id: "gIKP47CparU", title: "Sunday Jam, Aarey Forest" },
      { id: "7FWgnEjy4eU", title: "Repping 59 Assembly at Spotify Rap 91" },
      { id: "aXXRv1iVv6E", title: "Farak Padega?" },
      { id: "ZpK3JdRymfU", title: "When Indian classical meets beatbox" },
      { id: "JHARZi32klY", title: "Friends mimic my beatboxing" },
      { id: "MxVgNb6STQE", title: "Ingredient: Beatboxer friend" },
      { id: "4taqsfTaveI", title: "Beats and Bars" },
      { id: "CXZrSWT7J6E", title: "Live freestyle with words from strangers" },
      { id: "h8WbXbTNAkM", title: "Spotify Rap 91 performance snippet" },
      { id: "8toQl2eqQvE", title: "What object should he rap about next?" },
      { id: "nAFzxtU8bVc", title: "Beatbox crasher" },
    ] as { id: string; title: string }[],
  },
  // The 15 links from the Instagram profile, in the order supplied. type + code come from each URL.
  instagram: {
    handle: "sadhanatawde",
    profileUrl: "https://www.instagram.com/sadhanatawde",
    posts: [
      { type: "p", code: "DMkiNdMMUfj" },
      { type: "reel", code: "DGqYXfSPAk0" },
      { type: "tv", code: "B80kVCLAPKB" },
      { type: "reel", code: "DXHUR1CjJMl" },
      { type: "p", code: "DVGbkR3DKaG" },
      { type: "reel", code: "DQYcL3iCFPY" },
      { type: "reel", code: "DKZidiYSyCS" },
      { type: "reel", code: "DR8_ZAnDNkc" },
      { type: "reel", code: "DCHFmqMIJWR" },
      { type: "reel", code: "DAjBzjQI5t8" },
      { type: "reel", code: "DNsVt9EQj-6" },
      { type: "reel", code: "DYUpwFCsfDa" },
      { type: "reel", code: "DVd7cWpIzqO" },
      { type: "reel", code: "DV04UrEDBSx" },
      { type: "reel", code: "DRlxu0-DCd6" },
    ] satisfies InstagramPost[],
  },
  gallery: {
    title: "Gallery",
    // The home-page slider shows these five first, then "See More" leads to /gallery.
    top: ["g-welupt-01.jpg", "g-malvan-01.jpg", "g-myntra-01.jpg", "g-kaivalyadham-02.jpg", "g-portfolio-01.jpg"],
    filters: [
      { key: "all", label: "All" },
      { key: "welupt", label: "Welupt Collective" },
      { key: "malvan", label: "Malvan Beatboxing Workshop" },
      { key: "wildjam", label: "Wildjam" },
      { key: "myntra", label: "Myntra Ad" },
      { key: "bombay-presidency", label: "Bombay Presidency ICSE" },
      { key: "kaivalyadham", label: "Kaivalyadham Jubilee" },
      { key: "bandlab", label: "BandLab 'Pass the Aux'" },
      { key: "cypher", label: "One by Two Echo Cypher" },
      { key: "concert", label: "Concert" },
      { key: "power-pose", label: "Power Pose" },
      { key: "spotify-rap91", label: "Spotify Rap 91" },
      { key: "aarey", label: "Aarey Music Festival" },
      { key: "jevlis", label: "Jevlis Ka Diwas" },
      { key: "bombba-bomb", label: "Bombba Bomb" },
      { key: "colossal", label: "Colossal 2019" },
      { key: "mumbai-machoo", label: "Mumbai Machoo" },
      { key: "tamarind", label: "Tamarind Tree Workshop" },
      { key: "saiyyara", label: "Saiyyara" },
      { key: "ibc", label: "Indian Beatbox Championship" },
      { key: "midday", label: "Mid-day" },
      { key: "tom-thum", label: "Tom Thum" },
      { key: "portfolio", label: "Performance Portfolio" },
    ] as { key: EventKey | "all"; label: string }[],
    items: [
      // photos
      // Instagram posts and reels from the sheet, shown as photo/video tiles that open the post.
      { event: "mumbai-machoo", image: src("ig-DKwvh7MKkgd.jpg", "instagram/"), fallback: fb(1), alt: "Mumbai Machoo reel", caption: "Mumbai Machoo", instagram: { url: "https://www.instagram.com/reel/DKwvh7MKkgd/", reel: true } },
      { event: "spotify-rap91", image: src("ig-DCoMCG-IlHC.jpg", "instagram/"), fallback: fb(2), alt: "Rolling Stone India cover with Spotify", caption: "Rolling Stone India", instagram: { url: "https://www.instagram.com/p/DCoMCG-IlHC/" } },
      { event: "spotify-rap91", image: src("ig-DC1cS-WozV-.jpg", "instagram/"), fallback: fb(3), alt: "All-girls crew at Spotify Rap 91", caption: "Spotify Rap 91", instagram: { url: "https://www.instagram.com/p/DC1cS-WozV-/" } },
      { event: "tamarind", image: src("ig-DRlxu0-DCd6.jpg", "instagram/"), fallback: fb(4), alt: "Tamarind Tree workshop reel", caption: "Tamarind Tree", instagram: { url: "https://www.instagram.com/reel/DRlxu0-DCd6/", reel: true } },
      { event: "myntra", image: src("p-myntra-02.jpg", "instagram/"), fallback: fb(5), alt: "Myntra ad shoot", caption: "Myntra Ad", instagram: { url: "https://www.instagram.com/p/DVGbkR3DKaG/" } },
      { event: "saiyyara", image: src("ig-DMkiNdMMUfj.jpg", "instagram/"), fallback: fb(6), alt: "Saiyyara, Humsafar", caption: "Saiyyara", instagram: { url: "https://www.instagram.com/p/DMkiNdMMUfj/" } },
      { event: "ibc", image: src("ig-CmbwTEJIHxP.jpg", "instagram/"), fallback: fb(7), alt: "Indian Beatbox Championship team", caption: "Indian Beatbox Championship", instagram: { url: "https://www.instagram.com/p/CmbwTEJIHxP/" } },
      { event: "midday", image: src("ig-C_bjrLnKlBm.jpg", "instagram/"), fallback: fb(8), alt: "Mid-day feature on the cypher", caption: "Mid-day: Cypher", instagram: { url: "https://www.instagram.com/p/C_bjrLnKlBm/" } },
      { event: "midday", image: src("ig-DB3jkrgI3jV.jpg", "instagram/"), fallback: fb(9), alt: "Mid-day feature on Spotify Rap 91", caption: "Mid-day: Rapper Girls Rock", instagram: { url: "https://www.instagram.com/p/DB3jkrgI3jV/" } },
      // Added 2026-11-04 from the "Flow of Featured Events page" tab.
      { event: "midday", image: src("ig-DAjBzjQI5t8.jpg", "instagram/"), fallback: fb(10), alt: "Didgeridoo fusion set reel", caption: "Mid-day: Didgeridoo fusion", instagram: { url: "https://www.instagram.com/reel/DAjBzjQI5t8/", reel: true } },
      { event: "tom-thum", image: src("ig-B80kVCLAPKB.jpg", "instagram/"), fallback: fb(11), alt: "Jamming with Tom Thum", caption: "Tom Thum", instagram: { url: "https://www.instagram.com/reel/B80kVCLAPKB/", reel: true } },
      { event: "power-pose", image: src("ig-DSXU983jPuW.jpg", "instagram/"), fallback: fb(12), alt: "Power Pose, Women in Music India", caption: "Power Pose", instagram: { url: "https://www.instagram.com/p/DSXU983jPuW/" } },
      { event: "jevlis", image: src("ig-DIbfdTSMT_K.jpg", "instagram/"), fallback: fb(1), alt: "Jevlis Ka Diwas performance", caption: "Jevlis Ka Diwas", instagram: { url: "https://www.instagram.com/p/DIbfdTSMT_K/" } },
      { event: "wildjam", image: src("ig-DXHUR1CjJMl.jpg", "instagram/"), fallback: fb(2), alt: "Wildjam reel", caption: "Wildjam", instagram: { url: "https://www.instagram.com/reel/DXHUR1CjJMl/", reel: true } },
      // Numbered picks from the Drive folders in "Details of Beatbox Performances.xlsx" (first two photos per event; all for Spotify Rap 91 and Myntra).
      // BandLab 01, Welupt 01/02 and Malvan 01 are left out: they are the same photos as g-bandlab-01, g-welupt-03, journey-welupt and g-malvan-02.
      { event: "wildjam", image: src("p-wildjam-02.jpg", "numbered/"), fallback: fb(2), alt: "Wildjam with friends" },
      { event: "wildjam", image: src("p-wildjam-03.jpg", "numbered/"), fallback: fb(3), alt: "Wildjam with friends" },
      { event: "bombay-presidency", image: src("p-bombay-presidency-01.jpg", "numbered/"), fallback: fb(4), alt: "Bombay Presidency students" },
      { event: "bombay-presidency", image: src("p-bombay-presidency-02.jpg", "numbered/"), fallback: fb(5), alt: "Bombay Presidency students" },
      { event: "power-pose", image: src("p-power-pose-03.jpg", "numbered/"), fallback: fb(6), alt: "Power Pose portrait" },
      { event: "bombba-bomb", image: src("p-bombba-bomb-01.jpg", "numbered/"), fallback: fb(7), alt: "Bombba Bomb showcase" },
      { event: "jevlis", image: src("p-jevlis-00.jpg", "numbered/"), fallback: fb(8), alt: "Jevlis Ka Diwas performance" },
      { event: "jevlis", image: src("p-jevlis-01.jpg", "numbered/"), fallback: fb(9), alt: "Jevlis Ka Diwas performance" },
      { event: "spotify-rap91", image: src("p-spotify-rap91-01.jpg", "numbered/"), fallback: fb(12), alt: "Spotify Rap 91 crew" },
      { event: "spotify-rap91", image: src("p-spotify-rap91-03.jpg", "numbered/"), fallback: fb(1), alt: "Mid-day feature" },
      { event: "spotify-rap91", image: src("p-spotify-rap91-04.jpg", "numbered/"), fallback: fb(2), alt: "Mid-day feature" },
      { event: "spotify-rap91", image: src("p-spotify-rap91-05.jpg", "numbered/"), fallback: fb(3), alt: "Spotify Rap 91" },
      { event: "aarey", image: src("p-aarey-01.jpg", "numbered/"), fallback: fb(4), alt: "Aarey Music Festival team" },
      { event: "aarey", image: src("p-aarey-02.jpg", "numbered/"), fallback: fb(5), alt: "Aarey Music Festival" },
      { event: "malvan", image: src("p-malvan-02.jpg", "numbered/"), fallback: fb(7), alt: "Malvan workshop group" },
      { event: "colossal", image: src("p-colossal-01.jpg", "numbered/"), fallback: fb(9), alt: "Colossal 2019" },
      { event: "colossal", image: src("p-colossal-02.jpg", "numbered/"), fallback: fb(10), alt: "Colossal 2019 Vice Champion" },
      { event: "welupt", image: src("g-welupt-01.jpg", "gallery/"), fallback: fb(11), alt: "Welupt Collective performance" },
      { event: "welupt", image: src("g-welupt-02.jpg", "gallery/"), fallback: fb(12), alt: "Welupt Collective performance" },
      { event: "welupt", image: src("g-welupt-04.jpg", "gallery/"), fallback: fb(2), alt: "Welupt Collective crowd" },
      { event: "malvan", image: src("g-malvan-01.jpg", "gallery/"), fallback: fb(3), alt: "Malvan workshop group" },
      { event: "malvan", image: src("g-malvan-02.jpg", "gallery/"), fallback: fb(4), alt: "Malvan workshop poster" },
      { event: "wildjam", image: src("g-wildjam-01.jpg", "gallery/"), fallback: fb(5), alt: "Wildjam with friends" },
      { event: "wildjam", image: src("g-wildjam-02.jpg", "gallery/"), fallback: fb(6), alt: "Wildjam performance" },
      { event: "myntra", image: src("g-myntra-01.jpg", "gallery/"), fallback: fb(7), alt: "Myntra ad shoot" },
      { event: "myntra", image: src("g-myntra-02.jpg", "gallery/"), fallback: fb(8), alt: "Myntra ad" },
      { event: "bombay-presidency", image: src("g-bombay-01.jpg", "gallery/"), fallback: fb(9), alt: "Bombay Presidency ICSE visit" },
      { event: "kaivalyadham", image: src("g-kaivalyadham-01.jpg", "gallery/"), fallback: fb(10), alt: "Kaivalyadham Jubilee" },
      { event: "kaivalyadham", image: src("g-kaivalyadham-02.jpg", "gallery/"), fallback: fb(11), alt: "Kaivalyadham Jubilee" },
      { event: "bandlab", image: src("g-bandlab-01.jpg", "gallery/"), fallback: fb(12), alt: "BandLab 'Pass the Aux'" },
      { event: "portfolio", image: src("g-portfolio-01.jpg", "gallery/"), fallback: fb(1), alt: "Performance portrait" },
      { event: "portfolio", image: src("g-portfolio-02.jpg", "gallery/"), fallback: fb(2), alt: "Performance portrait" },
      { event: "portfolio", image: src("g-portfolio-03.jpg", "gallery/"), fallback: fb(3), alt: "Performance portrait" },
      { event: "portfolio", image: src("g-portfolio-04.jpg", "gallery/"), fallback: fb(4), alt: "Performance portrait" },
      // videos: thumbnail = first frame of the Drive file; the card opens the Drive link in a new tab
      { event: "welupt", image: src("welupt-start.jpg", "videos/"), fallback: fb(5), alt: "Welupt Collective full set", caption: "Full Set", video: { drive: "https://drive.google.com/file/d/1Lfk5mHuQE4zTtsxsnlU3pUQXV_PquSpa/view?usp=drive_link" } },
      { event: "bandlab", image: src("bandlab-start.jpg", "videos/"), fallback: fb(6), alt: "BandLab 'Pass the Aux' performance", caption: "BandLab 'Pass the Aux'", video: { drive: "https://drive.google.com/file/d/1oMT8-nbPOQdrk_X4nWBxOKEngTqGF8vl/view?usp=drive_link" } },
      { event: "bombay-presidency", image: src("bombay-start.jpg", "videos/"), fallback: fb(7), alt: "Bombay Presidency International School", caption: "Music from Scratch", video: { drive: "https://drive.google.com/file/d/1m9-uw688utCmjZP3rpee4Y-S2Cjr8n-P/view?usp=drive_link" } },
      { event: "malvan", image: src("malvan-01-start.jpg", "videos/"), fallback: fb(8), alt: "Malvan beatboxing workshop", caption: "Malvan Workshop", video: { drive: "https://drive.google.com/file/d/1a9fA8HOYSRsBEGQkBoBDhDJOV7gX5rOg/view?usp=sharing" } },
      { event: "malvan", image: src("malvan-02-start.jpg", "videos/"), fallback: fb(9), alt: "Malvan beatboxing workshop", caption: "Malvan Workshop", video: { drive: "https://drive.google.com/file/d/1waq4EbC-m6qsfDuhLVPReQP-xOglLm_p/view?usp=drive_link" } },
      { event: "myntra", image: src("myntra-start.jpg", "videos/"), fallback: fb(10), alt: "Myntra ad", caption: "Myntra Ad", video: { drive: "https://drive.google.com/file/d/1ILzCVN9SppA_dA4uZRtHGIhOzoQt3snL/view?usp=sharing" } },
      { event: "wildjam", image: src("wildjam-start.jpg", "videos/"), fallback: fb(11), alt: "Wildjam performance", caption: "Wildjam", video: { drive: "https://drive.google.com/file/d/1S_IgwJMFSLgqFg8xA8Svc2EUCm0VpqT/view?usp=sharing" } },
      { event: "power-pose", image: src("power-pose-start.jpg", "videos/"), fallback: fb(12), alt: "Power Pose event", caption: "Power Pose", video: { drive: "https://drive.google.com/file/d/1WxvxF00Ep1baB_fBx2bz5v5574cZgEpi/view?usp=sharing" } },
      { event: "cypher", image: src("beat-cypher-01-poster.jpg", "videos/"), fallback: fb(1), alt: "One by Two Echo Cypher", caption: "One by Two Echo Cypher", video: { drive: "" } },
      { event: "cypher", image: src("beat-cypher-02-poster.jpg", "videos/"), fallback: fb(2), alt: "One by Two Echo Cypher", caption: "One by Two Echo Cypher", video: { drive: "" } },
      { event: "concert", image: src("beat-concert-01-poster.jpg", "videos/"), fallback: fb(3), alt: "Concert performance", caption: "Live concert", video: { drive: "" } },
    ] as GalleryItem[],
  },
  contact: {
    title: "Let’s craft a moment that moves people.",
    // The same line broken into an inverted triangle, widest line first.
    titleLines: ["Let’s craft a moment", "that moves", "people."],
    background: { image: src("contact-bg.jpg"), fallback: fb(10), alt: "Performance on a red stage" } satisfies Photo,
    email: "beatboxwithsadhana@gmail.com",
    copyLabel: "Click the email to copy it",
    copiedLabel: "Copied!",
    copyError: "Couldn't copy. Please try again.",
    signOff: "© 2026 Sadhana Tawde · All rights reserved",
  },
};

// Lookups shared by the pages.
export const categoryOf = (key: string) => portfolioData.projects.categories.find(c => c.key === key);
// Projects in the order the sheet lists them.
export const projectsIn = (key: CategoryKey) => portfolioData.projects.items.filter(p => p.category === key);
export const galleryFor = (key: EventKey) => portfolioData.gallery.items.filter(i => i.event === key);
// What the project pages and home shelves show: Instagram posts and reels only. Drive photos and Drive video
// cards stay on the gallery page until the Drive folders are sorted.
export const projectMedia = (key: EventKey) => galleryFor(key).filter(i => i.instagram);
// Top-five slider items, in the order listed in gallery.top.
export const topGallery = () =>
  portfolioData.gallery.top
    .map(file => portfolioData.gallery.items.find(i => i.image === src(file, "gallery/")))
    .filter((i): i is GalleryItem => !!i);
// One preview per project for its category's shelf on the home page: the cover, else its first Instagram tile.
// Projects without one show as a title tile.
export const shelfItems = (key: CategoryKey) =>
  projectsIn(key).map(p => ({ key: p.key, title: p.title, photo: p.cover ?? projectMedia(p.key)[0] }));
