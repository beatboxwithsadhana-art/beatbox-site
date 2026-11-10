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
  | "power-pose" | "arangetram" | "aarey" | "tamarind" | "mumbai-machoo" | "saiyaara" | "bombba-bomb"
  | "jevlis" | "spotify-rap91" | "radio" | "midday" | "ibc" | "tom-thum" | "colossal" | "vodcast" | "coaching"
  | "cypher" | "concert" | "portfolio";

export type CategoryKey = "events" | "workshops" | "film-ads" | "hosting" | "media" | "competitions";

export type Category = { key: CategoryKey; title: string; blurb: string; frame?: Photo };

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
  // The instant photo on the section wall, and the other shortlisted photos shown when the event opens.
  hero?: Photo;
  // Show the long YouTube video last rather than first when the event opens.
  videoLast?: boolean;
  photos?: Photo[];
  // YouTube video IDs (unlisted), embedded on the project's timeline entry.
  youtube?: string[];
  // YouTube Shorts IDs, embedded upright beside each other.
  shorts?: string[];
  // External links (Instagram posts, articles), shown under the text and opened in a new tab.
  links?: { label: string; url: string }[];
};

export type GalleryItem = Photo & {
  event: EventKey;
  // Width / height, so the gallery can show the whole photo without cropping.
  ar?: number;
  // Video items open their Google Drive file in a new tab. Empty = shown as a plain photo until a link is added.
  video?: { drive: string };
  // Instagram post or reel: the tile opens it in a new tab. Reels get the play button like videos.
  instagram?: { url: string; reel?: boolean };
};

// Instagram posts, embedded the same way as the Why Bother site.
export type InstagramPost = { type: "p" | "reel" | "tv"; code: string };

// Re-used when Drive photos come back as project covers.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cover = (file: string, dir: string, n: number, alt: string): Photo => ({ image: src(file, dir), fallback: fb(n), alt });

// A shortlisted photo from the Round 5 Drive folder, and a YouTube thumbnail for events with no photo.
const v = (file: string, alt: string): Photo => ({ image: src(file, "round5/"), fallback: fb(1), alt });
const yt = (id: string, alt: string): Photo => ({ image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, fallback: fb(2), alt });

export const portfolioData = {
  name: "Sadhana Tawde",
  // Each role links to a section page, or (hash) to a spot further down the home page.
  subtitle: [
    { label: "Beatboxer", hash: "filmstrip" },
    { label: "Live performer", category: "events" },
    { label: "Mentor", category: "workshops" },
  ] as { label: string; category?: CategoryKey; hash?: string }[],
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
      { key: "film-ads", title: "On-Screen & Commercial Credits", blurb: "On screen in film and in national commercial campaigns.", frame: { image: src("r5-saiyaara-05.jpg", "round5/"), fallback: fb(1), alt: "" } },
      { key: "competitions", title: "Awards & Championship Titles", blurb: "Battles and championship titles.", frame: { image: src("r5-colossal-hero.jpg", "round5/"), fallback: fb(2), alt: "" } },
      { key: "events", title: "Live Performances & Collabs", blurb: "Live sets, showcases and collaborations.", frame: { image: src("r5-bombba-bomb-hero.jpg", "round5/"), fallback: fb(3), alt: "" } },
      { key: "hosting", title: "Hosting & Anchoring", blurb: "Hosting stages, shows and community events.", frame: { image: src("r5-vodcast-hero.jpg", "round5/"), fallback: fb(4), alt: "" } },
      { key: "media", title: "Press & Media Coverage", blurb: "Newspaper features and radio interviews.", frame: { image: src("r5-radio-hero.jpg", "round5/"), fallback: fb(5), alt: "" } },
      { key: "workshops", title: "Workshop & Mentorship", blurb: "Workshops, coaching, judging and community building.", frame: { image: src("r5-malvan-01.jpg", "round5/"), fallback: fb(6), alt: "" } },
    ] satisfies Category[],
    // Order, write-ups and videos follow the "Flow of Featured Events page" tab of the sheet (project-data\Details of Beatbox Performances.xlsx).
    // Hero and photos come from the shortlist Drive folder; Instagram tiles come from gallery items with `instagram`.
    items: [
      { key: "saiyaara", category: "film-ads", title: "Saiyaara (Film)", date: "Jul 2025", text: "Featured on screen in the song 'Humsafar' from Mohit Suri's Saiyaara alongside Ahan Pandey, with original beatbox integrated directly into the track's music.", youtube: ["D9DiMnlpFK8"], hero: v("r5-saiyaara-hero.jpg", "Saiyaara (Film)"), photos: [v("r5-saiyaara-01.jpg", "Saiyaara (Film)"), v("r5-saiyaara-02.jpg", "Saiyaara (Film)"), v("r5-saiyaara-03.jpg", "Saiyaara (Film)"), v("r5-saiyaara-04.jpg", "Saiyaara (Film)"), v("r5-saiyaara-05.jpg", "Saiyaara (Film)")] },
      { key: "myntra", category: "film-ads", title: "Myntra Ad", date: "Feb 2026", text: "Featured in a national commercial campaign for Myntra alongside Nora Fatehi.", youtube: ["faESXyOVxYA"], shorts: ["BNnys2LEw4Y"], hero: v("r5-myntra-hero.jpg", "Myntra Ad"), photos: [v("r5-myntra-01.jpg", "Myntra Ad"), v("r5-myntra-02.jpg", "Myntra Ad")] },
      { key: "colossal", category: "competitions", title: "Colossal 2019", date: "Dec 2019", text: "Female Colossal Vice Champion (2019) — Secured Vice Champion at Colossal 2019, one of India's premier national beatboxing championships.", youtube: ["eR_yzFBKHxg", "bHcz0AhhOGU"], hero: v("r5-colossal-hero.jpg", "Colossal 2019"), photos: [v("r5-colossal-01.jpg", "Colossal 2019"), v("r5-colossal-02.jpg", "Colossal 2019"), v("r5-colossal-03.jpg", "Colossal 2019")] },
      { key: "tom-thum", category: "events", title: "Jammed with Tom Thum", date: "Feb 2020", text: "Jammed with global beatboxing icon Tom Thum, famous for his pioneering vocal techniques and multi-instrumental sound effects.", hero: v("r5-tom-thum-hero.jpg", "Jammed with Tom Thum"), photos: [v("r5-tom-thum-01.jpg", "Jammed with Tom Thum"), v("r5-tom-thum-02.jpg", "Jammed with Tom Thum"), v("r5-tom-thum-03.jpg", "Jammed with Tom Thum")] },
      { key: "spotify-rap91", videoLast: true, category: "events", title: "Spotify Rap 91", date: "Nov 2024", text: "Performed at Spotify's RAP 91 LIVE (2024) as part of an all-women crew—featuring four rappers, a DJ, and a beatboxer—highlighted by an energetic live jugalbandi between beatbox and DJing.", youtube: ["7FWgnEjy4eU"], shorts: ["h8WbXbTNAkM"], hero: v("r5-spotify-rap91-hero.jpg", "Spotify Rap 91"), photos: [v("r5-spotify-rap91-01.jpg", "Spotify Rap 91"), v("r5-spotify-rap91-02.jpg", "Spotify Rap 91"), v("r5-spotify-rap91-03.jpg", "Spotify Rap 91"), v("r5-spotify-rap91-04.jpg", "Spotify Rap 91")] },
      { key: "arangetram", category: "events", title: "Arangetram", date: "Dec 2025", text: "Performed a live jugalbandi combining beatbox with a traditional Vadya Vrinda ensemble (mridangam, flute, and violin) for a Bharatanatyam Arangetram.", youtube: ["NczgpjRy1IY"], hero: yt("NczgpjRy1IY", "Arangetram") },
      { key: "power-pose", category: "events", title: "Power Pose", date: "Dec 2025", text: "Performed a live set at the Power Pose event, hosted by Women in Music India to highlight women artists in the music industry.", youtube: ["XwPxJRBWGYA"], hero: { image: src("ig-DSXU983jPuW.jpg", "instagram/"), fallback: fb(1), alt: "Power Pose" } },
      { key: "bandlab", category: "events", title: "BandLab 'Pass the Aux'", date: "Oct 2026", text: "Performed a live beatbox set at BandLab's Pass the Aux showcase (October 2026).", shorts: ["5F54fzwUJMM"], hero: v("r5-bandlab-hero.jpg", "BandLab 'Pass the Aux'") },
      { key: "jevlis", category: "events", title: "Jevlis Ka Diwas", date: "Apr 2025", text: "Performed a live beatbox set at World of Vibes' Jevlis Ka Diwas event, sharing the lineup with Kratex and FeniFina.", hero: v("r5-jevlis-hero.jpg", "Jevlis Ka Diwas"), photos: [v("r5-jevlis-01.jpg", "Jevlis Ka Diwas"), v("r5-jevlis-02.jpg", "Jevlis Ka Diwas"), v("r5-jevlis-03.jpg", "Jevlis Ka Diwas")] },
      { key: "kaivalyadham", category: "events", title: "G.S. College of Yoga (Kaivalyadhama)", text: "G.S. College of Yoga (Kaivalyadhama): Performed live for the Platinum Jubilee (75th Anniversary) celebrations of G.S. College of Yoga, Kaivalyadhama (Lonavala), delivering a vocal percussion performance for the institution’s milestone event.", shorts: ["0eywH-7095A"], hero: v("r5-kaivalyadham-hero.jpg", "G.S. College of Yoga (Kaivalyadhama)"), photos: [v("r5-kaivalyadham-01.jpg", "G.S. College of Yoga (Kaivalyadhama)"), v("r5-kaivalyadham-02.jpg", "G.S. College of Yoga (Kaivalyadhama)")] },
      { key: "wildjam", category: "events", title: "Wildjam", date: "Mar 2026", text: "Performed a live beatbox set at Wildjam, an event hosted by India’s premier all-female hip-hop collective, WildWildWomen.", hero: v("r5-wildjam-hero.jpg", "Wildjam"), photos: [v("r5-wildjam-01.jpg", "Wildjam"), v("r5-wildjam-02.jpg", "Wildjam"), v("r5-wildjam-03.jpg", "Wildjam"), v("r5-wildjam-04.jpg", "Wildjam")] },
      { key: "welupt", category: "events", title: "Welupt Collective", date: "Mar 2025", text: "Featured live performer at Welupt Collective's pre-Women’s Day event in March 2025, celebrating women creators through live vocal percussion.", youtube: ["SznC7xxvqeo"], hero: v("r5-welupt-hero.jpg", "Welupt Collective"), photos: [v("r5-welupt-01.jpg", "Welupt Collective"), v("r5-welupt-02.jpg", "Welupt Collective"), v("r5-welupt-03.jpg", "Welupt Collective")] },
      { key: "bombba-bomb", category: "events", title: "Bombba Bomb", date: "May 2025", text: "Featured artist performer at the Bombba Bomb showcase, delivering a live beatbox set at the underground platform dedicated to spotlighting raw independent music talent.", hero: v("r5-bombba-bomb-hero.jpg", "Bombba Bomb") },
      { key: "aarey", category: "hosting", title: "Aarey Music Festival", date: "Dec 2025", text: "Co-organized and hosted/emceed the Aarey Music Festival—Mumbai’s first forest music festival celebrating ecology, indigenous arts, and live performance.", hero: v("r5-aarey-hero.jpg", "Aarey Music Festival"), photos: [v("r5-aarey-01.jpg", "Aarey Music Festival"), v("r5-aarey-02.jpg", "Aarey Music Festival"), v("r5-aarey-03.jpg", "Aarey Music Festival"), v("r5-aarey-04.jpg", "Aarey Music Festival")] },
      { key: "vodcast", category: "hosting", title: "Street Hip-Hop Vodcast", text: "Host & Presenter (Street Hip-Hop Vodcast): Host for the Street Hip-Hop Vodcast, conducting video interviews and discussions focused on underground hip-hop culture, independent artists, and vocal percussion.", youtube: ["kIxfs4JCKq0"], shorts: ["UI7DLRhn0x4"], hero: v("r5-vodcast-hero.jpg", "Street Hip-Hop Vodcast"), photos: [v("r5-vodcast-01.jpg", "Street Hip-Hop Vodcast"), v("r5-vodcast-02.jpg", "Street Hip-Hop Vodcast"), v("r5-vodcast-03.jpg", "Street Hip-Hop Vodcast"), v("r5-vodcast-04.jpg", "Street Hip-Hop Vodcast")] },
      { key: "mumbai-machoo", category: "hosting", title: "Mumbai Machoo", date: "Jun 2025", text: "Hosted and delivered a live beatbox performance at Mumbai Machoo, driving the stage execution for the independent community showcase.", hero: { image: src("ig-DKwvh7MKkgd.jpg", "instagram/"), fallback: fb(1), alt: "Mumbai Machoo" } },
      { key: "midday", category: "media", title: "Mid-day", date: "Sep & Nov 2024", text: "Featured twice in Mid-Day newspaper highlighting live beatboxing in an experimental Didgeridoo fusion set and a community hip-hop cypher.", hero: { image: src("ig-C_bjrLnKlBm.jpg", "instagram/"), fallback: fb(1), alt: "Mid-day" } },
      { key: "radio", category: "media", title: "Radio Features", date: "2024 & 2025", text: "Featured across multiple radio stations in live interview segments, discussing beatboxing technique, vocal percussion, and independent music creation.", shorts: ["zmmDp6vlCec"], hero: v("r5-radio-hero.jpg", "Radio Features"), photos: [v("r5-radio-01.jpg", "Radio Features")] },
      { key: "malvan", category: "workshops", title: "Malvan Beatboxing Workshop", date: "Apr 2026", text: "Conducted the first-ever beatboxing workshop in Malvan (Sindhudurg), introducing vocal percussion to a Tier-3 regional community with 45+ participants aged 4 to 75; featured across multiple district news publications.", youtube: ["f-u8DhmLcFI"], hero: v("r5-malvan-hero.jpg", "Malvan Beatboxing Workshop"), photos: [v("r5-malvan-01.jpg", "Malvan Beatboxing Workshop"), v("r5-malvan-02.jpg", "Malvan Beatboxing Workshop"), v("r5-malvan-03.jpg", "Malvan Beatboxing Workshop"), v("r5-malvan-04.jpg", "Malvan Beatboxing Workshop"), v("r5-malvan-05.jpg", "Malvan Beatboxing Workshop"), v("r5-malvan-06.jpg", "Malvan Beatboxing Workshop"), v("r5-malvan-07.jpg", "Malvan Beatboxing Workshop")] },
      { key: "coaching", category: "workshops", title: "1-on-1 Beatbox Coaching", text: "1-on-1 Beatbox Coaching: Offers customized private lessons for students across all age groups (including young learners starting from age 6), focusing on rhythm development, vocal techniques, and performance confidence.", youtube: ["BeX1XfrSAxw"], shorts: ["JfBqcDuf6Lc"], hero: yt("BeX1XfrSAxw", "1-on-1 Beatbox Coaching") },
      { key: "tamarind", category: "workshops", title: "Tamarind Tree Workshop", date: "Nov 2025", text: "Led an interactive beatboxing workshop for indigenous children at Tamarind Tree School in Palghar, introducing vocal percussion and creative rhythm building to young learners.", hero: { image: src("ig-DRlxu0-DCd6.jpg", "instagram/"), fallback: fb(1), alt: "Tamarind Tree Workshop" } },
      { key: "bombay-presidency", category: "workshops", title: "Bombay Presidency International School", date: "Jan 2026", text: "Invited as an official judge for Bombay Presidency International School's (ICSE) \"Music from Scratch\" event, judging student musical showcases.", hero: v("r5-bombay-presidency-hero.jpg", "Bombay Presidency International School"), photos: [v("r5-bombay-presidency-01.jpg", "Bombay Presidency International School"), v("r5-bombay-presidency-02.jpg", "Bombay Presidency International School")] },
      { key: "ibc", category: "workshops", title: "Indian Beatbox Championship 2021", date: "Dec 2022", text: "Indian Beatbox Championship (2021): Core organizing team member and Community Manager, driving nationwide artist outreach, community engagement, and event logistics.", hero: { image: src("ig-CmbwTEJIHxP.jpg", "instagram/"), fallback: fb(1), alt: "Indian Beatbox Championship 2021" } },
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
  // Instagram posts from the sheet, previewed inside each event.
  posts: [
      { event: "mumbai-machoo", image: src("ig-DKwvh7MKkgd.jpg", "instagram/"), fallback: fb(1), alt: "Mumbai Machoo reel", caption: "Mumbai Machoo", instagram: { url: "https://www.instagram.com/reel/DKwvh7MKkgd/", reel: true } },
      { event: "spotify-rap91", image: src("ig-DCoMCG-IlHC.jpg", "instagram/"), fallback: fb(2), alt: "Rolling Stone India cover with Spotify", caption: "Rolling Stone India", instagram: { url: "https://www.instagram.com/p/DCoMCG-IlHC/" } },
      { event: "tamarind", image: src("ig-DRlxu0-DCd6.jpg", "instagram/"), fallback: fb(4), alt: "Tamarind Tree workshop reel", caption: "Tamarind Tree", instagram: { url: "https://www.instagram.com/reel/DRlxu0-DCd6/", reel: true } },
      { event: "myntra", image: src("p-myntra-02.jpg", "instagram/"), fallback: fb(5), alt: "Myntra ad shoot", caption: "Myntra Ad", instagram: { url: "https://www.instagram.com/p/DVGbkR3DKaG/" } },
      { event: "saiyaara", image: src("ig-DMkiNdMMUfj.jpg", "instagram/"), fallback: fb(6), alt: "Saiyaara, Humsafar", caption: "Saiyaara", instagram: { url: "https://www.instagram.com/p/DMkiNdMMUfj/" } },
      { event: "ibc", image: src("ig-CmbwTEJIHxP.jpg", "instagram/"), fallback: fb(7), alt: "Indian Beatbox Championship team", caption: "Indian Beatbox Championship", instagram: { url: "https://www.instagram.com/p/CmbwTEJIHxP/" } },
      { event: "midday", image: src("ig-C_bjrLnKlBm.jpg", "instagram/"), fallback: fb(8), alt: "Mid-day feature on the cypher", caption: "Mid-day: Cypher", instagram: { url: "https://www.instagram.com/p/C_bjrLnKlBm/" } },
      { event: "midday", image: src("ig-DAjBzjQI5t8.jpg", "instagram/"), fallback: fb(10), alt: "Didgeridoo fusion set reel", caption: "Mid-day: Didgeridoo fusion", instagram: { url: "https://www.instagram.com/reel/DAjBzjQI5t8/", reel: true } },
      { event: "tom-thum", image: src("ig-B80kVCLAPKB.jpg", "instagram/"), fallback: fb(11), alt: "Jamming with Tom Thum", caption: "Tom Thum", instagram: { url: "https://www.instagram.com/reel/B80kVCLAPKB/", reel: true } },
      { event: "power-pose", image: src("ig-DSXU983jPuW.jpg", "instagram/"), fallback: fb(12), alt: "Power Pose, Women in Music India", caption: "Power Pose", instagram: { url: "https://www.instagram.com/p/DSXU983jPuW/" } },
      { event: "jevlis", image: src("ig-DIbfdTSMT_K.jpg", "instagram/"), fallback: fb(1), alt: "Jevlis Ka Diwas performance", caption: "Jevlis Ka Diwas", instagram: { url: "https://www.instagram.com/p/DIbfdTSMT_K/" } },
      { event: "wildjam", image: src("ig-DXHUR1CjJMl.jpg", "instagram/"), fallback: fb(2), alt: "Wildjam reel", caption: "Wildjam", instagram: { url: "https://www.instagram.com/reel/DXHUR1CjJMl/", reel: true } },
  ] as GalleryItem[],
  gallery: {
    title: "Gallery",
    // The home-page slider shows these five first, then "See More" leads to /gallery.
    top: ["r5-spotify-rap91-hero.jpg", "r5-colossal-hero.jpg", "r5-malvan-hero.jpg", "r5-welupt-hero.jpg", "r5-saiyaara-hero.jpg"],
    // Only the shortlisted project photos (no Instagram tiles, so nothing leaves the site). `ar` keeps each photo uncropped.
    filters: [
      { key: "all", label: "All" },
      { key: "saiyaara", label: "Saiyaara" },
      { key: "myntra", label: "Myntra Ad" },
      { key: "colossal", label: "Colossal 2019" },
      { key: "tom-thum", label: "Tom Thum" },
      { key: "spotify-rap91", label: "Spotify Rap 91" },
      { key: "power-pose", label: "Power Pose" },
      { key: "bandlab", label: "BandLab 'Pass the Aux'" },
      { key: "jevlis", label: "Jevlis Ka Diwas" },
      { key: "kaivalyadham", label: "G.S. College of Yoga" },
      { key: "wildjam", label: "Wildjam" },
      { key: "welupt", label: "Welupt Collective" },
      { key: "bombba-bomb", label: "Bombba Bomb" },
      { key: "aarey", label: "Aarey Music Festival" },
      { key: "vodcast", label: "Street Hip-Hop Vodcast" },
      { key: "mumbai-machoo", label: "Mumbai Machoo" },
      { key: "midday", label: "Mid-day" },
      { key: "radio", label: "Radio Features" },
      { key: "malvan", label: "Malvan Beatboxing Workshop" },
      { key: "tamarind", label: "Tamarind Tree Workshop" },
      { key: "bombay-presidency", label: "Bombay Presidency ICSE" },
    ],
    items: [
      { event: "saiyaara", image: src("r5-saiyaara-hero.jpg", "round5/"), fallback: fb(1), alt: "Saiyaara (Film)", ar: 0.75 },
      { event: "myntra", image: src("r5-myntra-hero.jpg", "round5/"), fallback: fb(1), alt: "Myntra Ad", ar: 0.75 },
      { event: "colossal", image: src("r5-colossal-hero.jpg", "round5/"), fallback: fb(1), alt: "Colossal 2019", ar: 0.667 },
      { event: "tom-thum", image: src("r5-tom-thum-hero.jpg", "round5/"), fallback: fb(1), alt: "Jammed with Tom Thum", ar: 2.196 },
      { event: "spotify-rap91", image: src("r5-spotify-rap91-hero.jpg", "round5/"), fallback: fb(1), alt: "Spotify Rap 91", ar: 1.25 },
      { event: "bandlab", image: src("r5-bandlab-hero.jpg", "round5/"), fallback: fb(1), alt: "BandLab 'Pass the Aux'", ar: 0.563 },
      { event: "jevlis", image: src("r5-jevlis-hero.jpg", "round5/"), fallback: fb(1), alt: "Jevlis Ka Diwas", ar: 0.667 },
      { event: "kaivalyadham", image: src("r5-kaivalyadham-hero.jpg", "round5/"), fallback: fb(1), alt: "G.S. College of Yoga (Kaivalyadhama)", ar: 1.778 },
      { event: "wildjam", image: src("r5-wildjam-hero.jpg", "round5/"), fallback: fb(1), alt: "Wildjam", ar: 1.501 },
      { event: "welupt", image: src("r5-welupt-hero.jpg", "round5/"), fallback: fb(1), alt: "Welupt Collective", ar: 1.332 },
      { event: "bombba-bomb", image: src("r5-bombba-bomb-hero.jpg", "round5/"), fallback: fb(1), alt: "Bombba Bomb", ar: 1.501 },
      { event: "aarey", image: src("r5-aarey-hero.jpg", "round5/"), fallback: fb(1), alt: "Aarey Music Festival", ar: 1.333 },
      { event: "vodcast", image: src("r5-vodcast-hero.jpg", "round5/"), fallback: fb(1), alt: "Street Hip-Hop Vodcast", ar: 1.852 },
      { event: "radio", image: src("r5-radio-hero.jpg", "round5/"), fallback: fb(1), alt: "Radio Features", ar: 1.07 },
      { event: "malvan", image: src("r5-malvan-hero.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 1.776 },
      { event: "bombay-presidency", image: src("r5-bombay-presidency-hero.jpg", "round5/"), fallback: fb(1), alt: "Bombay Presidency International School", ar: 1.333 },
      { event: "saiyaara", image: src("r5-saiyaara-01.jpg", "round5/"), fallback: fb(1), alt: "Saiyaara (Film)", ar: 1.0 },
      { event: "saiyaara", image: src("r5-saiyaara-02.jpg", "round5/"), fallback: fb(1), alt: "Saiyaara (Film)", ar: 0.75 },
      { event: "saiyaara", image: src("r5-saiyaara-03.jpg", "round5/"), fallback: fb(1), alt: "Saiyaara (Film)", ar: 0.563 },
      { event: "saiyaara", image: src("r5-saiyaara-04.jpg", "round5/"), fallback: fb(1), alt: "Saiyaara (Film)", ar: 0.562 },
      { event: "saiyaara", image: src("r5-saiyaara-05.jpg", "round5/"), fallback: fb(1), alt: "Saiyaara (Film)", ar: 0.75 },
      { event: "myntra", image: src("r5-myntra-01.jpg", "round5/"), fallback: fb(1), alt: "Myntra Ad", ar: 0.75 },
      { event: "myntra", image: src("r5-myntra-02.jpg", "round5/"), fallback: fb(1), alt: "Myntra Ad", ar: 0.75 },
      { event: "colossal", image: src("r5-colossal-01.jpg", "round5/"), fallback: fb(1), alt: "Colossal 2019", ar: 1.501 },
      { event: "colossal", image: src("r5-colossal-02.jpg", "round5/"), fallback: fb(1), alt: "Colossal 2019", ar: 1.501 },
      { event: "colossal", image: src("r5-colossal-03.jpg", "round5/"), fallback: fb(1), alt: "Colossal 2019", ar: 0.667 },
      { event: "tom-thum", image: src("r5-tom-thum-01.jpg", "round5/"), fallback: fb(1), alt: "Jammed with Tom Thum", ar: 2.058 },
      { event: "tom-thum", image: src("r5-tom-thum-02.jpg", "round5/"), fallback: fb(1), alt: "Jammed with Tom Thum", ar: 2.196 },
      { event: "tom-thum", image: src("r5-tom-thum-03.jpg", "round5/"), fallback: fb(1), alt: "Jammed with Tom Thum", ar: 2.196 },
      { event: "spotify-rap91", image: src("r5-spotify-rap91-01.jpg", "round5/"), fallback: fb(1), alt: "Spotify Rap 91", ar: 0.8 },
      { event: "spotify-rap91", image: src("r5-spotify-rap91-02.jpg", "round5/"), fallback: fb(1), alt: "Spotify Rap 91", ar: 1.776 },
      { event: "spotify-rap91", image: src("r5-spotify-rap91-03.jpg", "round5/"), fallback: fb(1), alt: "Spotify Rap 91", ar: 1.778 },
      { event: "spotify-rap91", image: src("r5-spotify-rap91-04.jpg", "round5/"), fallback: fb(1), alt: "Spotify Rap 91", ar: 0.8 },
      { event: "jevlis", image: src("r5-jevlis-01.jpg", "round5/"), fallback: fb(1), alt: "Jevlis Ka Diwas", ar: 0.749 },
      { event: "jevlis", image: src("r5-jevlis-02.jpg", "round5/"), fallback: fb(1), alt: "Jevlis Ka Diwas", ar: 0.667 },
      { event: "jevlis", image: src("r5-jevlis-03.jpg", "round5/"), fallback: fb(1), alt: "Jevlis Ka Diwas", ar: 1.501 },
      { event: "kaivalyadham", image: src("r5-kaivalyadham-01.jpg", "round5/"), fallback: fb(1), alt: "G.S. College of Yoga (Kaivalyadhama)", ar: 0.563 },
      { event: "kaivalyadham", image: src("r5-kaivalyadham-02.jpg", "round5/"), fallback: fb(1), alt: "G.S. College of Yoga (Kaivalyadhama)", ar: 0.563 },
      { event: "wildjam", image: src("r5-wildjam-01.jpg", "round5/"), fallback: fb(1), alt: "Wildjam", ar: 0.563 },
      { event: "wildjam", image: src("r5-wildjam-02.jpg", "round5/"), fallback: fb(1), alt: "Wildjam", ar: 0.563 },
      { event: "wildjam", image: src("r5-wildjam-03.jpg", "round5/"), fallback: fb(1), alt: "Wildjam", ar: 1.778 },
      { event: "wildjam", image: src("r5-wildjam-04.jpg", "round5/"), fallback: fb(1), alt: "Wildjam", ar: 0.563 },
      { event: "welupt", image: src("r5-welupt-01.jpg", "round5/"), fallback: fb(1), alt: "Welupt Collective", ar: 1.333 },
      { event: "welupt", image: src("r5-welupt-02.jpg", "round5/"), fallback: fb(1), alt: "Welupt Collective", ar: 1.333 },
      { event: "welupt", image: src("r5-welupt-03.jpg", "round5/"), fallback: fb(1), alt: "Welupt Collective", ar: 1.333 },
      { event: "aarey", image: src("r5-aarey-01.jpg", "round5/"), fallback: fb(1), alt: "Aarey Music Festival", ar: 1.333 },
      { event: "aarey", image: src("r5-aarey-02.jpg", "round5/"), fallback: fb(1), alt: "Aarey Music Festival", ar: 0.75 },
      { event: "aarey", image: src("r5-aarey-03.jpg", "round5/"), fallback: fb(1), alt: "Aarey Music Festival", ar: 1.333 },
      { event: "aarey", image: src("r5-aarey-04.jpg", "round5/"), fallback: fb(1), alt: "Aarey Music Festival", ar: 1.333 },
      { event: "vodcast", image: src("r5-vodcast-01.jpg", "round5/"), fallback: fb(1), alt: "Street Hip-Hop Vodcast", ar: 2.025 },
      { event: "vodcast", image: src("r5-vodcast-02.jpg", "round5/"), fallback: fb(1), alt: "Street Hip-Hop Vodcast", ar: 1.86 },
      { event: "vodcast", image: src("r5-vodcast-03.jpg", "round5/"), fallback: fb(1), alt: "Street Hip-Hop Vodcast", ar: 1.852 },
      { event: "vodcast", image: src("r5-vodcast-04.jpg", "round5/"), fallback: fb(1), alt: "Street Hip-Hop Vodcast", ar: 2.046 },
      { event: "radio", image: src("r5-radio-01.jpg", "round5/"), fallback: fb(1), alt: "Radio Features", ar: 0.901 },
      { event: "malvan", image: src("r5-malvan-01.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 1.778 },
      { event: "malvan", image: src("r5-malvan-02.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 0.75 },
      { event: "malvan", image: src("r5-malvan-03.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 1.776 },
      { event: "malvan", image: src("r5-malvan-04.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 0.558 },
      { event: "malvan", image: src("r5-malvan-05.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 1.485 },
      { event: "malvan", image: src("r5-malvan-06.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 1.778 },
      { event: "malvan", image: src("r5-malvan-07.jpg", "round5/"), fallback: fb(1), alt: "Malvan Beatboxing Workshop", ar: 1.778 },
      { event: "bombay-presidency", image: src("r5-bombay-presidency-01.jpg", "round5/"), fallback: fb(1), alt: "Bombay Presidency International School", ar: 1.333 },
      { event: "bombay-presidency", image: src("r5-bombay-presidency-02.jpg", "round5/"), fallback: fb(1), alt: "Bombay Presidency International School", ar: 0.75 },
    ] as GalleryItem[],
  },
  contact: {
    title: "Let’s craft a moment that moves people.",
    // The same line broken into an inverted triangle, widest line first.
    titleLines: ["Let’s craft a moment", "that moves", "people."],
    background: { image: src("contact-bg.jpg"), fallback: fb(10), alt: "Performance on a red stage" } satisfies Photo,
    email: "beatboxwithsadhana@gmail.com",
    aboutTitle: "About me",
    bio: "Active since 2017 as Mumbai’s first female beatboxer, Sadhana Tawde is a decorated vocal percussionist, host, and educator. From appearing in Mohit Suri's Saiyaara and national Myntra ads to jamming with Tom Thum and winning Female Colossal Vice Champion (2019), her work spans mainstream cinema, classical jugalbandis, and high-energy live showcases. Beyond the stage, Sadhana anchored the Street Hip-Hop Vodcast, co-organized Mumbai's first forest music festival (Aarey Music Festival), and has been mentoring learners of all ages through 1-on-1 coaching and regional community workshops.",
    copyBioLabel: "Copy bio",
    pressKitLabel: "Download press kit",
    pressKitUrl: "https://drive.google.com/drive/folders/1Uw4qBzo3RUQ--EYwNFj7fFaqK7PrGcah?usp=drive_link",
    aboutBackground: { image: src("about-bg.jpg", "round5/"), fallback: fb(4), alt: "Sadhana Tawde" } satisfies Photo,
    copiedLabel: "Copied!",
    copyError: "Couldn't copy. Please try again.",
    signOff: "© Sadhana Tawde · All rights reserved",
  },
};

// Lookups shared by the pages.
export const categoryOf = (key: string) => portfolioData.projects.categories.find(c => c.key === key);
// Projects in the order the sheet lists them.
export const projectsIn = (key: CategoryKey) => portfolioData.projects.items.filter(p => p.category === key);
export const galleryFor = (key: EventKey) => portfolioData.gallery.items.filter(i => i.event === key);
// What the project pages and home shelves show: Instagram posts and reels only. Drive photos and Drive video
// cards stay on the gallery page until the Drive folders are sorted.
// The sheet's Instagram posts for one event.
export const projectMedia = (key: EventKey) => portfolioData.posts.filter(i => i.event === key);
// Top-five slider items, in the order listed in gallery.top.
export const topGallery = () =>
  portfolioData.gallery.top
    .map(file => portfolioData.gallery.items.find(i => i.image === src(file, "round5/")))
    .filter((i): i is GalleryItem => !!i);
// One preview per project for its category's shelf on the home page: the cover, else its first Instagram tile.
// Projects without one show as a title tile.
export const shelfItems = (key: CategoryKey) =>
  projectsIn(key).map(p => ({ key: p.key, title: p.title, photo: p.cover ?? projectMedia(p.key)[0] }));
