import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { Profile } from '../profile/profile';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ltz-header',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Profile],
})
export class Header {
  private router = inject(Router);
  private auth = inject(AuthService);
  activeTab = signal<string | null>(null);
  isProfileMenuOpen = signal(false);
  isNotificationMenuOpen = signal(false);

  isLoggedIn = computed(() => this.auth.isAuthenticated())
  currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).url),
    ),
    { initialValue: this.router.url },
  );

  menus = [
    { path: '/dashboard', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/blog', label: 'Blog' },
    { path: '/login', label: 'Login' },
    { path: '/get-started', label: 'Get Started' }
  ];

  constructor() {
}

  isActive(path: string) {
    return computed(() => this.currentUrl()?.startsWith(path) ?? false);
  }

  navigate(tab: string): void {
    this.router.navigate([tab]);
    this.activeTab.set(tab);
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen.update((val) => !val);
    this.isNotificationMenuOpen.set(false);
  }

  toggleNotificationMenu(event: Event): void {
    event.stopPropagation();
    this.isNotificationMenuOpen.update((val) => !val);
    this.isProfileMenuOpen.set(false);
  }
}
