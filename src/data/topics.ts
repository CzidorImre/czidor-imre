// Guide pages under /tudnivalok/<slug>/. Each page is its own .astro file in
// src/pages/tudnivalok/; this list feeds the link rows (FAQ, other guides).

export interface Topic {
  slug: string;
  /** Short label for link pills. */
  label: string;
}

export const topics: Topic[] = [
  { slug: 'mikor-kotelezo-a-muszaki-ellenor', label: 'Mikor kötelező a műszaki ellenőr?' },
  { slug: 'muszaki-ellenor-feladatai', label: 'A műszaki ellenőr feladatai' },
  { slug: 'muszaki-ellenor-csaladi-haz', label: 'Műszaki ellenőr családi házhoz' },
  { slug: 'felelos-muszaki-vezeto', label: 'Felelős műszaki vezető (FMV)' },
  { slug: 'muszaki-ellenor-dija', label: 'Mennyibe kerül a műszaki ellenőr?' },
];

export const topicUrl = (slug: string) => `/tudnivalok/${slug}/`;

/** JSON-LD author for the guide pages; matches the visible byline in GuideHero. */
export const guideAuthor = {
  '@type': 'Person',
  name: 'Czidor Imre',
  url: 'https://muszakiellenorborsod.hu/#bemutatkozas',
  jobTitle: 'Építési műszaki ellenőr, felelős műszaki vezető',
};
