import { describe, expect, it } from 'vitest';
import { portfolioData as data, projectMedia, projectsIn, topGallery } from '@/data/portfolioData';

describe('Sadhana portfolio content', () => {
  it('follows the six sections of the "Flow of Featured Events page" tab, in order', () => {
    expect(data.projects.categories.map(c => c.title)).toEqual([
      'On-Screen & Commercial Credits', 'Awards & Championship Titles', 'Major Live Performances & Collaborations',
      'Hosting & Anchoring', 'Press & Media Coverage', 'Workshop & Mentorship',
    ]);
    expect(data.projects.items).toHaveLength(23);
    expect(new Set(data.projects.items.map(p => p.key)).size).toBe(23);
    expect(data.projects.categories.map(c => projectsIn(c.key).length)).toEqual([2, 1, 10, 3, 2, 5]);
    expect(projectsIn('events').map(p => p.key)).toEqual([
      'tom-thum', 'spotify-rap91', 'arangetram', 'power-pose', 'bandlab', 'jevlis', 'kaivalyadham', 'wildjam', 'welupt', 'bombba-bomb',
    ]);
  });

  it('shows no Drive photos on the project pages for now', () => {
    for (const p of data.projects.items) {
      expect(p.cover).toBeUndefined();
      expect(projectMedia(p.key).every(i => i.instagram)).toBe(true);
    }
  });

  it('embeds the 15 Instagram posts that were supplied', () => {
    expect(data.instagram.posts).toHaveLength(15);
    expect(new Set(data.instagram.posts.map(p => p.code)).size).toBe(15);
  });

  it('gives every photo a hosted asset or public path, plus a placeholder fallback', () => {
    const photos = [
      data.cover.background, data.cover.hero, data.about.background, data.contact.background,
      ...data.projects.items.flatMap(p => (p.cover ? [p.cover] : [])), ...data.gallery.items,
    ];
    for (const photo of photos) {
      // hosted Lovable asset (/__l5e/assets-v1/...) once uploaded, /images/... until then
      expect(/^(\/__l5e\/|\/images\/)/.test(photo.image)).toBe(true);
      expect(photo.fallback.length).toBeGreaterThan(0);
    }
  });

  it('shows five gallery items in the home slider', () => {
    expect(topGallery()).toHaveLength(5);
  });

  it('links the eight supplied Drive videos and leaves the three unlinked ones empty', () => {
    const videos = data.gallery.items.filter(i => i.video);
    expect(videos).toHaveLength(11);
    expect(videos.filter(i => i.video?.drive.startsWith('https://drive.google.com/file/d/'))).toHaveLength(8);
    expect(videos.filter(i => i.video?.drive === '')).toHaveLength(3);
  });

  it('keeps only email and Instagram as contact routes', () => {
    expect(data.contact.email).toBe('beatboxwithsadhana@gmail.com');
    expect(data.contact).not.toHaveProperty('phone');
    expect(data.contact).not.toHaveProperty('bookingLink');
  });

  it('only filters by event keys that exist on the gallery', () => {
    const keys = new Set(data.gallery.filters.map(f => f.key));
    for (const item of data.gallery.items) expect(keys.has(item.event)).toBe(true);
  });
});
