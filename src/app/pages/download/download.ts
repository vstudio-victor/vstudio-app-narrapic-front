import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../shared/logo/logo';
import { buildTextFiles, imageUrl, RESULTS_CONTENT } from '../results/results-content';
import { createZip, downloadBlob, fetchBytes, ZipEntry } from '../../utils/file-utils';

@Component({
  selector: 'ltz-download',
  imports: [RouterLink, Logo],
  templateUrl: './download.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent {
  private readonly content = RESULTS_CONTENT;

  isDownloading = signal(false);

  included = [
    'Etsy Listing (TXT)',
    'Pinterest Pins (5 images)',
    'Instagram Post (TXT)',
    'Mockups (6 images)',
  ];

  async downloadEverything(): Promise<void> {
    if (this.isDownloading()) {
      return;
    }
    this.isDownloading.set(true);
    try {
      const entries: ZipEntry[] = buildTextFiles(this.content).map((f) => ({
        name: f.name,
        data: f.text,
      }));

      const images = [
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

      downloadBlob(createZip(entries), 'luxembourg-city-postcard.zip');
    } finally {
      this.isDownloading.set(false);
    }
  }
}
