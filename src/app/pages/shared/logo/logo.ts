import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ltz-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="flex items-center gap-2 select-none">
      <span
        class="flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-sm"
        [class]="size() === 'sm' ? 'h-8 w-8' : 'h-10 w-10'"
      >
        <svg
          [class]="size() === 'sm' ? 'h-4 w-4' : 'h-5 w-5'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </span>
      @if (showText()) {
        <span
          class="font-extrabold leading-tight tracking-tight"
          [class]="size() === 'sm' ? 'text-base' : 'text-lg'"
        >
          <span class="text-violet-600">NarraPic</span>
          <span class="text-slate-800"> Studio</span>
        </span>
      }
    </span>
  `,
})
export class Logo {
  size = input<'sm' | 'md'>('md');
  showText = input<boolean>(true);
}
