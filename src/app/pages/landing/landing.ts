import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../shared/logo/logo';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'ltz-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  navLinks = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'Login', route: '/login' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  features = ['Etsy SEO', 'Mockups', 'Social Media', 'Alt Text'];

  onGenerateListing(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  get visibleNavLinks() {
    return this.isAuthenticated
      ? this.navLinks.filter((link) => link.label !== 'Login')
      : this.navLinks;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
