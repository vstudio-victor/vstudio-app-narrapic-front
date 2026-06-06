import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export type Platform = 'ltz_insta' | 'ltz_tiktok';
export type Style = 'ltz_insp_eng' | 'ltz_pro' | 'ltz_casual' | 'ltz_promo';

interface PlatformOption {
  id: Platform;
  name: string;
  icon: string;
  colors: {
    selected: string;
    hover: string;
    ring: string;
  };
  isPremium: boolean;
}

@Component({
  selector: 'ltz-platform-selector',
  imports: [],
  templateUrl: './platform-selector.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlatformSelector),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformSelector {
  value: string | undefined;
  onChange = (value: any) => {};
  onTouched = () => {};
  // Input to control subscription status
  isPremiumUser = input<boolean>(false);

  selectedPlatform = signal<Platform | null>(null);
  showPremiumModal = signal(false);
  clickedPlatform = signal<PlatformOption | undefined>(undefined);

  platforms: PlatformOption[] = [
    {
      id: 'ltz_insta',
      name: 'Instagram',
      icon: 'instagram',
      colors: {
        selected: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
        hover: 'hover:border-pink-500',
        ring: 'ring-pink-500',
      },
      isPremium: false,
    },
    {
      id: 'ltz_tiktok',
      name: 'TikTok',
      icon: 'tiktok',
      colors: {
        selected: 'bg-black',
        hover: 'hover:border-cyan-400',
        ring: 'ring-cyan-400',
      },
      isPremium: true,
    },
  ];

  hasSubscription(): boolean {
    return this.isPremiumUser();
  }

  handlePlatformClick(platform: PlatformOption): void {
    if (platform.isPremium && !this.hasSubscription()) {
      this.showPremiumModal.set(true);
      return;
    }

    this.value = platform.name;
    this.onChange(platform.name);
    this.clickedPlatform.set(platform);
    this.selectedPlatform.set(platform.id);
  }

  closePremiumModal(): void {
    this.showPremiumModal.set(false);
    this.clickedPlatform.set(undefined);
  }

  subscribe(): void {
    console.log('Redirecting to subscription page...');
    // Handle subscription logic here
    // this.router.navigate(['/subscribe']);
    // or window.location.href = 'https://yoursite.com/subscribe';
    this.closePremiumModal();
  }

  getButtonClasses(platform: PlatformOption): string {
    const isSelected = this.selectedPlatform() === platform.id;
    const isLocked = platform.isPremium && !this.hasSubscription();

    let classes = 'border-[#3a4651] ';

    if (isLocked) {
      classes += 'bg-[#1a1f28] opacity-60 cursor-not-allowed ';
    } else if (isSelected) {
      classes += `${platform.colors.selected} ring-2 ${platform.colors.ring} `;
    } else {
      classes += `bg-[#1e2732] ${platform.colors.hover} `;
    }

    if (!isLocked) {
      classes += `focus:ring-2 ${platform.colors.ring} `;
    }

    return classes;
  }

  getIconClasses(platform: PlatformOption): string {
    const isSelected = this.selectedPlatform() === platform.id;
    const isLocked = platform.isPremium && !this.hasSubscription();

    if (isLocked) {
      return 'text-gray-600';
    }

    if (isSelected) {
      return platform.id === 'ltz_insta' ? 'text-white' : 'text-cyan-400';
    }

    const hoverColor =
      platform.id === 'ltz_insta' ? 'group-hover:text-pink-400' : 'group-hover:text-cyan-400';
    return `text-gray-400 ${hoverColor}`;
  }

  getTextClasses(platform: PlatformOption): string {
    const isSelected = this.selectedPlatform() === platform.id;
    const isLocked = platform.isPremium && !this.hasSubscription();

    if (isLocked) {
      return 'text-gray-600';
    }

    if (isSelected) {
      return 'text-white';
    }

    const hoverColor =
      platform.id === 'ltz_insta' ? 'group-hover:text-pink-400' : 'group-hover:text-cyan-400';
    return `text-gray-400 ${hoverColor}`;
  }

  writeValue(value: Platform | null): void {
    this.selectedPlatform.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValueChange(value: string | undefined): void {}
}
