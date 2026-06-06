import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../shared/logo/logo';
import { Profile } from "../shared/profile/profile";

interface NavItem {
  label: string;
  icon: string;
  link: string;
  active?: boolean;
}

interface Project {
  title: string;
  date: string;
  seed: string;
}

interface Tool {
  label: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'ltz-dashboard',
  imports: [RouterLink, Profile],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  creditsUsed = 46;
  creditsTotal = 100;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'home', link: '/dashboard', active: true },
    { label: 'Projects', icon: 'folder', link: '/projects' },
    { label: 'Templates', icon: 'template', link: '/dashboard' },
    { label: 'Mockups', icon: 'image', link: '/dashboard' },
    { label: 'Brand Kit', icon: 'palette', link: '/dashboard' },
    { label: 'AI Writer', icon: 'pen', link: '/dashboard' },
    { label: 'Social Media', icon: 'share', link: '/dashboard' },
    { label: 'Settings', icon: 'settings', link: '/settings' },
  ];

  projects: Project[] = [
    { title: 'Luxembourg Postcard', date: 'May 24, 2024', seed: 'luxembourg-1' },
    { title: 'Paris Vintage Print', date: 'May 13, 2024', seed: 'paris-2' },
    { title: 'Amalfi Coast Print', date: 'May 22, 2024', seed: 'amalfi-3' },
  ];

  tools: Tool[] = [
    { label: 'AI Writer', description: 'Generate text for any purpose', icon: 'pen', color: 'violet' },
    { label: 'Mockup Generator', description: 'Beautiful mockups in seconds', icon: 'image', color: 'sky' },
    { label: 'Social Media', description: 'Pins, posts & captions', icon: 'share', color: 'emerald' },
    { label: 'Brand Kit', description: 'Logos, colors & fonts', icon: 'palette', color: 'amber' },
  ];

  get creditsPercent(): number {
    return Math.round((this.creditsUsed / this.creditsTotal) * 100);
  }
}
