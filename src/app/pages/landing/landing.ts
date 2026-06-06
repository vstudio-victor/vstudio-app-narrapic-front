import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../shared/logo/logo';

@Component({
  selector: 'ltz-landing',
  imports: [RouterLink, Logo],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  navLinks = ['Features', 'Pricing', 'Blog', 'Login'];

  features = [
    'Etsy SEO',
    'Mockups',
    'Social Media',
    'Alt Text',
  ];
}
