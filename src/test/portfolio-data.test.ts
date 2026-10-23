import { describe, expect, it } from 'vitest';
import { portfolioData as data, projectsIn, topGallery } from '@/data/portfolioData';

describe('Sadhana portfolio content', () => {
  it('groups all 21 projects from the sheet into six categories', () => {
    expect(data.projects.categories.map(c => c.key)).toEqual(['events', 'workshops', 'film-ads', 'hosting', 'media', 'competitions']);
    expect(data.projects.items).toHaveLength(21);
    expect(new Set(data.projects.items.map(p => p.key)).size).toBe(21);
    expect(data.projects.categories.map(c => projectsIn(c.key).length)).toEqual([11, 2, 3, 2, 2, 1]);
  });

  it('orders each timeline newest first', () => {
    for (const c of data.projects.categories) {
      const sorts = projectsIn(c.key).map(p => p.sort);
      expect(sorts).toEqual([...sorts].sort().reverse());
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
