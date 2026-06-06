export interface Pin {
  id: number;
  seed: string;
  title: string;
  description: string;
  keywords: string;
}

export type MockupCategory = 'Flat Lay' | 'Frame' | 'Desk' | 'Hand';

export interface Mockup {
  seed: string;
  category: MockupCategory;
}

export interface ResultsContent {
  projectTitle: string;
  generatedAt: string;
  seoScore: number;
  etsyTitle: string;
  etsyDescription: string;
  tags: string[];
  instagramCaption: string;
  instagramHashtags: string;
  pins: Pin[];
  mockups: Mockup[];
}

export const RESULTS_CONTENT: ResultsContent = {
  projectTitle: 'Luxembourg City Postcard',
  generatedAt: 'Generated on May 24, 2024 at 10:45 AM',
  seoScore: 94,
  etsyTitle:
    'Vintage Luxembourg City Postcard | Travel Wall Art Print | European Cityscape Art | Luxembourg Souvenir',
  etsyDescription: `Bring the charm of Luxembourg City into your home with this beautiful vintage postcard. Featuring the iconic old town, historic architecture and scenic river views, this print is perfect for travel lovers and European decor enthusiasts.

This high quality print is ideal for framing and makes a thoughtful gift for anyone who adores Luxembourg.`,
  tags: [
    'luxembourg postcard',
    'travel postcard',
    'luxembourg city art',
    'european wall art',
    'vintage postcard',
    'cityscape art',
    'travel wall art',
    'luxembourg souvenir',
    'europe travel decor',
    'old town art',
    'river view print',
    'european city art',
    'gift for travelers',
  ],
  instagramCaption:
    '✨ Bring a piece of Luxembourg home ✨ This vintage-inspired cityscape captures the timeless charm of the old town and its scenic river views. Perfect for travel lovers and European decor enthusiasts. 🇱🇺🎨',
  instagramHashtags:
    '#luxembourg #travelart #wallart #europeantravel #cityscape #vintageprint #homedecor #etsyfinds',
  pins: [
    {
      id: 1,
      seed: 'luxembourg-1',
      title: 'Luxembourg City Postcard | European Travel Wall Art',
      description:
        'Beautiful vintage postcard of Luxembourg City. Perfect for travel lovers and European home decor.',
      keywords: 'luxembourg, travel postcard, europe, cityscape art, vintage postcard',
    },
    {
      id: 2,
      seed: 'luxembourg-2',
      title: 'Vintage Luxembourg Print',
      description: 'Charming old town views.',
      keywords: 'luxembourg, vintage, print',
    },
    {
      id: 3,
      seed: 'luxembourg-3',
      title: 'European Cityscape Art',
      description: 'Scenic river views of Luxembourg.',
      keywords: 'europe, cityscape, wall art',
    },
    {
      id: 4,
      seed: 'luxembourg-4',
      title: 'Travel Wall Art Print',
      description: 'A thoughtful gift for travelers.',
      keywords: 'travel, wall art, gift',
    },
    {
      id: 5,
      seed: 'luxembourg-5',
      title: 'Luxembourg Souvenir',
      description: 'Bring Luxembourg home.',
      keywords: 'souvenir, luxembourg, decor',
    },
  ],
  mockups: [
    // Seeds are namespaced per project + category so each filter shows a
    // distinct, stable set of "this project's" mockups.
    { seed: 'lux-flatlay-1', category: 'Flat Lay' },
    { seed: 'lux-flatlay-2', category: 'Flat Lay' },
    { seed: 'lux-frame-1', category: 'Frame' },
    { seed: 'lux-frame-2', category: 'Frame' },
    { seed: 'lux-frame-3', category: 'Frame' },
    { seed: 'lux-desk-1', category: 'Desk' },
    { seed: 'lux-desk-2', category: 'Desk' },
    { seed: 'lux-hand-1', category: 'Hand' },
    { seed: 'lux-hand-2', category: 'Hand' },
  ],
};

/** A picsum URL for a given seed. */
export function imageUrl(seed: string, w = 800, h = 600): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/** Build the set of text files that make up the listing export. */
export function buildTextFiles(content: ResultsContent): { name: string; text: string }[] {
  const tagsList = content.tags.join('\n');
  const etsy = `${content.projectTitle}

=== TITLE ===
${content.etsyTitle}

=== DESCRIPTION ===
${content.etsyDescription}

=== TAGS (${content.tags.length}) ===
${tagsList}`;

  const instagram = `INSTAGRAM CAPTION
${content.instagramCaption}

HASHTAGS
${content.instagramHashtags}`;

  const pins = content.pins
    .map(
      (pin) =>
        `Pin ${pin.id}\nTitle: ${pin.title}\nDescription: ${pin.description}\nKeywords: ${pin.keywords}`,
    )
    .join('\n\n');

  return [
    { name: 'etsy-listing.txt', text: etsy },
    { name: 'instagram-post.txt', text: instagram },
    { name: 'pinterest-pins.txt', text: pins },
  ];
}
