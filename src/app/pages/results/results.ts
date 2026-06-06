import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../shared/logo/logo';
import { buildTextFiles, imageUrl, Mockup, Pin, RESULTS_CONTENT } from './results-content';
import {
  copyToClipboard,
  createZip,
  downloadBlob,
  downloadText,
  downloadUrl,
  fetchBytes,
  ZipEntry,
} from '../../utils/file-utils';

interface Tab {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'ltz-results',
  imports: [RouterLink, Logo],
  templateUrl: './results.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
  private readonly content = RESULTS_CONTENT;

  projectTitle = this.content.projectTitle;
  generatedAt = this.content.generatedAt;
  seoScore = this.content.seoScore;

  activeTab = signal('etsy');

  /** Key of the item that was most recently copied, for transient feedback. */
  copiedKey = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  /** True while a ZIP is being assembled. */
  isDownloading = signal(false);

  tabs: Tab[] = [
    { key: 'etsy', label: 'Etsy Listing', icon: 'tag' },
    { key: 'pinterest', label: 'Pinterest Pins', icon: 'pin' },
    { key: 'instagram', label: 'Instagram', icon: 'instagram' },
    { key: 'mockups', label: 'Mockups', icon: 'image' },
    { key: 'files', label: 'Files', icon: 'file' },
  ];

  summaryChecks = [
    'High quality title',
    'Detailed description',
    '13 relevant tags',
    'Engaging keywords',
  ];

  etsyTitle = this.content.etsyTitle;
  etsyDescription = this.content.etsyDescription;
  tags = this.content.tags;
  instagramCaption = this.content.instagramCaption;
  instagramHashtags = this.content.instagramHashtags;

  pins: Pin[] = this.content.pins;
  activePin = signal(1);

  mockupFilters = ['All', 'Flat Lay', 'Frame', 'Desk', 'Hand'];
  activeFilter = signal('All');
  mockups: Mockup[] = this.content.mockups;

  /** Mockups shown for the currently selected category filter. */
  filteredMockups = computed(() => {
    const filter = this.activeFilter();
    return filter === 'All' ? this.mockups : this.mockups.filter((m) => m.category === filter);
  });

  /** Number of mockups in each filter, for the count badges. */
  mockupCount(filter: string): number {
    return filter === 'All'
      ? this.mockups.length
      : this.mockups.filter((m) => m.category === filter).length;
  }

  files = [
    { name: 'Etsy Listing', detail: 'TXT', icon: 'tag' },
    { name: 'Pinterest Pins', detail: '5 images', icon: 'pin' },
    { name: 'Instagram Post', detail: 'TXT', icon: 'instagram' },
    { name: 'Mockups', detail: '9 images', icon: 'image' },
  ];

  setTab(key: string): void {
    this.activeTab.set(key);
  }

  setPin(id: number): void {
    this.activePin.set(id);
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  get currentPin(): Pin {
    return this.pins.find((p) => p.id === this.activePin()) ?? this.pins[0];
  }

  get tagsText(): string {
    return this.tags.join(', ');
  }

  /** Switch to the Etsy tab and scroll the content into view. */
  viewEtsyListing(): void {
    this.setTab('etsy');
    setTimeout(() => {
      document
        .getElementById('tab-content')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  /** Copy text to the clipboard and flash a "Copied!" label on the matching button. */
  async copy(text: string, key: string): Promise<void> {
    try {
      await copyToClipboard(text);
      this.copiedKey.set(key);
      if (this.copyTimer) {
        clearTimeout(this.copyTimer);
      }
      this.copyTimer = setTimeout(() => this.copiedKey.set(null), 1800);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing else to do.
    }
  }

  downloadEtsyListing(): void {
    const [etsy] = buildTextFiles(this.content);
    downloadText(etsy.name, etsy.text);
  }

  downloadInstagram(): void {
    const file = buildTextFiles(this.content)[1];
    downloadText(file.name, file.text);
  }

  /** Download a single entry from the Files tab. */
  downloadFile(name: string): void {
    switch (name) {
      case 'Etsy Listing':
        this.downloadEtsyListing();
        break;
      case 'Pinterest Pins':
        this.downloadPins();
        break;
      case 'Instagram Post':
        this.downloadInstagram();
        break;
      case 'Mockups':
        this.downloadMockups();
        break;
    }
  }

  /** Download a single image by seed. */
  async downloadImage(seed: string, filename: string): Promise<void> {
    try {
      await downloadUrl(imageUrl(seed, 800, 1000), filename);
    } catch {
      // Network/CORS failure — ignore so the UI doesn't break.
    }
  }

  /** Zip and download a set of images by seed. Text files optional. */
  private async downloadImagesZip(
    images: { seed: string; name: string; w: number; h: number }[],
    zipName: string,
    textFiles: { name: string; text: string }[] = [],
  ): Promise<void> {
    if (this.isDownloading()) {
      return;
    }
    this.isDownloading.set(true);
    try {
      const entries: ZipEntry[] = textFiles.map((f) => ({ name: f.name, data: f.text }));
      const fetched = await Promise.all(
        images.map(async (img) => {
          try {
            return { name: img.name, data: await fetchBytes(imageUrl(img.seed, img.w, img.h)) };
          } catch {
            return null;
          }
        }),
      );
      for (const file of fetched) {
        if (file) {
          entries.push(file);
        }
      }
      downloadBlob(createZip(entries), zipName);
    } finally {
      this.isDownloading.set(false);
    }
  }

  downloadPins(): void {
    const pinsText = buildTextFiles(this.content)[2];
    this.downloadImagesZip(
      this.content.pins.map((pin) => ({
        seed: pin.seed,
        name: `pin-${pin.id}.jpg`,
        w: 600,
        h: 900,
      })),
      'pinterest-pins.zip',
      [pinsText],
    );
  }

  downloadMockups(): void {
    this.downloadImagesZip(
      this.content.mockups.map((mock, i) => ({
        seed: mock.seed,
        name: `mockup-${i + 1}-${mock.category.toLowerCase().replace(' ', '-')}.jpg`,
        w: 800,
        h: 640,
      })),
      'mockups.zip',
    );
  }

  /** Build and download a ZIP containing every generated asset. */
  async downloadAll(): Promise<void> {
    if (this.isDownloading()) {
      return;
    }
    this.isDownloading.set(true);
    try {
      const entries: ZipEntry[] = buildTextFiles(this.content).map((f) => ({
        name: f.name,
        data: f.text,
      }));

      // Best-effort image fetches — text files are always included even if these fail.
      const images: { seed: string; name: string; w: number; h: number }[] = [
        ...this.content.pins.map((pin) => ({
          seed: pin.seed,
          name: `pins/pin-${pin.id}.jpg`,
          w: 600,
          h: 900,
        })),
        ...this.content.mockups.map((mock, i) => ({
          seed: mock.seed,
          name: `mockups/mockup-${i + 1}.jpg`,
          w: 800,
          h: 640,
        })),
      ];

      const fetched = await Promise.all(
        images.map(async (img) => {
          try {
            return { name: img.name, data: await fetchBytes(imageUrl(img.seed, img.w, img.h)) };
          } catch {
            return null;
          }
        }),
      );

      for (const file of fetched) {
        if (file) {
          entries.push(file);
        }
      }

      const blob = createZip(entries);
      downloadBlob(blob, 'luxembourg-city-postcard.zip');
    } finally {
      this.isDownloading.set(false);
    }
  }
}
