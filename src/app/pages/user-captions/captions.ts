import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { GeneratedCaptionsService } from '../../services/generated-captions.service';
import { Captions } from '../../core/data-services/narra-pic-api';

interface Caption {
  id: string;
  imageUrl: string;
  story: string;
  shortCaption: string;
  longCaption: string;
  altText: string;
  hashtags: string[];
  style: string;
  platform: string;
  createdAt: Date;
}

@Component({
  selector: 'ltz-captions',
  templateUrl: './captions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptionsComponent {
  buttons = [
    { id: 'ltz-all', label: 'All' },
    { id: 'ltz-insta', label: 'Instagram' },
    { id: 'ltz-tiktok', label: 'TikTok' },
  ];

  private auth = inject(AuthService);
  private captionsService = inject(GeneratedCaptionsService);
  captions = signal<Captions[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedFilter = signal<string>('All');
  selectedCaption = signal<Captions | null>(null);
  copiedId = signal<string | null>(null);
  private router = inject(Router);
  filteredCaptions = computed(() => {
    let result = this.captions();

    /* if (this.selectedFilter() !== 'All') {
      result = result.filter((c) => c.platform === this.selectedFilter());
    } */

    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (c) =>
          c.shortCaption?.toLowerCase().includes(query) ||
          c.hashtags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return result;
  });

  ngOnInit() {
    this.loadCaptions();
  }

  filter(btn: string) {
    this.selectedFilter.set(btn);
  }

  generate() {
    return this.router.navigate(['/dashboard']);
  }

  loadCaptions() {
    // TODO: Replace with actual API call

    this.auth
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.captionsService
          .generatedCaptionsByUser(user.id!)
          .pipe(take(1))
          .subscribe((res) => {
            console.log(res);
            this.captions.set(res);
            this.isLoading.set(false);
          });
      });
  }

  viewCaption(caption: Captions) {
    this.selectedCaption.set(caption);
  }

  closeModal() {
    this.selectedCaption.set(null);
  }

  async copyToClipboard(text: string, id?: string) {
    try {
      await navigator.clipboard.writeText(text);
      //this.copiedId.set(id);
      setTimeout(() => this.copiedId.set(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  deleteCaption(id?: string) {
    if (confirm('Are you sure you want to delete this caption?')) {
      this.captions.update((captions) => captions.filter((c) => c.id !== id));
      if (this.selectedCaption()?.id === id) {
        this.closeModal();
      }
    }
  }

  formatDate(date: string): string {
    const time = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return time.toLocaleDateString();
  }
}
