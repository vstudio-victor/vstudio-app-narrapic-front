import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon } from '../../../../icon/icon';

interface StyleOption {
  value: string;
  label: string;
  isPremium?: boolean;
}

@Component({
  selector: 'ltz-style-selector',
  templateUrl: './style-selector.html',
  styles: [
    `
      /* Custom scrollbar for dropdown */
      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar {
        width: 8px;
      }

      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar-track {
        background: #1e2732;
      }

      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar-thumb {
        background: #3a4651;
        border-radius: 4px;
      }

      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #4a5661;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StyleSelector),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
})
export class StyleSelector {
  value: string | undefined;
  onChange = (value: any) => {};
  onTouched = () => {};
  isDropdownOpen = false;
  isGenerating = false;
  prompt = '';
  isPremiumUser = false; // Set this based on user subscription status
  showPremiumModal = false;
  selectedPremiumStyle: StyleOption | null = null;

  styleOptions: StyleOption[] = [
    { value: 'inspiring', label: 'Inspiring & Engaging', isPremium: false },
    { value: 'professional', label: 'Professional', isPremium: false },
    { value: 'casual', label: 'Casual & Friendly', isPremium: false },
    { value: 'humorous', label: 'Humorous', isPremium: true },
    { value: 'storytelling', label: 'Storytelling', isPremium: true },
    { value: 'minimalist', label: 'Minimalist', isPremium: true },
    { value: 'promotional', label: 'Promotional', isPremium: true },
    { value: 'educational', label: 'Educational', isPremium: true },
  ];

  selectedStyle = signal<string | null>(null);
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectStyle(option: StyleOption): void {
    // Check if premium style and user doesn't have subscription
    if (option.isPremium && !this.isPremiumUser) {
      this.selectedPremiumStyle = option;
      this.showPremiumModal = true;
      this.isDropdownOpen = false;
      return;
    }

    this.selectedStyle.set(option.label);

    this.value = this.selectedStyle()!;
    this.onChange(this.selectedStyle()!);
    this.isDropdownOpen = false;
  }

  closePremiumModal(): void {
    this.showPremiumModal = false;
    this.selectedPremiumStyle = null;
  }

  subscribe(): void {
    console.log('Redirecting to subscription page...');
    // Handle subscription logic here
    this.closePremiumModal();
  }

  writeValue(value: any): void {
    this.selectedStyle.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValueChange(value: string | undefined): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
