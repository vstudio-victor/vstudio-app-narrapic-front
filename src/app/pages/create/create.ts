import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../shared/logo/logo';
import { UploadImage } from '../dashboard/components/upload-image/upload-image';

interface ProductType {
  label: string;
  description: string;
  icon: string;
}

interface GenerateOption {
  key: string;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
}

interface GenStep {
  label: string;
}

@Component({
  selector: 'ltz-create',
  imports: [RouterLink, Logo, UploadImage],
  templateUrl: './create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent implements OnDestroy {
  step = signal(1);
  totalSteps = 5;

  projectName = signal<string | undefined>(undefined);
  selectedProduct = signal<string | undefined>('Postcard');
  uploadedImage = signal<string | null>(null);
  uploadTips = [
    'Use high quality images',
    'Good lighting',
    'Front view works best',
    'Avoid blurry photos',
  ];

  detectedColors = ['#5b6470', '#2b3445', '#9aa3ad', '#1f2937', '#c8924f', '#e7d3b5'];

  productTypes: ProductType[] = [
    { label: 'Postcard', description: 'Travel, greeting or souvenir postcards', icon: 'postcard' },
    { label: 'Wall Art', description: 'Posters, prints and framed art', icon: 'frame' },
    { label: 'Photography Print', description: 'Fine art or photography', icon: 'camera' },
    { label: 'Printable Download', description: 'Digital files for download', icon: 'download' },
    { label: 'Watercolor Art', description: 'Paintings and illustrations', icon: 'brush' },
    { label: 'Other', description: 'Other products', icon: 'dots' },
  ];

  generateOptions = signal<GenerateOption[]>([
    {
      key: 'etsy',
      label: 'Etsy Listing',
      description: 'Title, description, tags & SEO keywords',
      icon: 'tag',
      selected: true,
    },
    {
      key: 'pinterest',
      label: 'Pinterest Pins',
      description: '5 beautiful pins with titles',
      icon: 'pin',
      selected: true,
    },
    {
      key: 'instagram',
      label: 'Instagram Post',
      description: 'Caption and hashtags',
      icon: 'instagram',
      selected: true,
    },
    {
      key: 'alt',
      label: 'Alt Text',
      description: 'SEO optimized alt text',
      icon: 'text',
      selected: true,
    },
    {
      key: 'mockups',
      label: 'Mockups',
      description: 'Beautiful mockups for your listing',
      icon: 'image',
      selected: true,
    },
  ]);

  genSteps: GenStep[] = [
    { label: 'Analyzing image' },
    { label: 'Researching keywords' },
    { label: 'Writing Etsy listing' },
    { label: 'Creating Pinterest pins' },
    { label: 'Generating mockups' },
  ];
  genProgress = signal(0);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private router: Router) {}

  next(): void {
    if (this.step() < this.totalSteps) {
      this.step.update((s) => s + 1);
    }
  }

  back(): void {
    if (this.step() > 1) {
      this.step.update((s) => s - 1);
    }
  }

  selectProduct(label: string): void {
    this.selectedProduct.set(label);
  }

  toggleOption(key: string): void {
    this.generateOptions.update((opts) =>
      opts.map((o) => (o.key === key ? { ...o, selected: !o.selected } : o)),
    );
  }

  startGenerating(): void {
    this.step.set(5);
    this.genProgress.set(0);
    this.timer = setInterval(() => {
      const current = this.genProgress() + 1;
      this.genProgress.set(current);
      if (current >= this.genSteps.length) {
        this.clearTimer();
        setTimeout(() => this.router.navigate(['/results']), 800);
      }
    }, 850);
  }

  onProjectNameInput(event: Event): void {
    this.projectName.set((event.target as HTMLInputElement).value);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  onImageUploaded(image: string) {
    this.uploadedImage.set(image);
  }
}
