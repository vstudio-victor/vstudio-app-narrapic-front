import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SettingsSection {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'ltz-settings',
  imports: [RouterLink],
  templateUrl: './settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  activeSection = signal('account');

  sections: SettingsSection[] = [
    { key: 'account', label: 'Account', icon: 'user' },
    { key: 'notifications', label: 'Notifications', icon: 'bell' },
    { key: 'security', label: 'Security', icon: 'lock' },
  ];

  name = signal('Victor V.');
  email = signal('vvictor.fotograf@gmail.com');

  emailNotifications = signal(true);
  productUpdates = signal(false);

  selectSection(key: string): void {
    this.activeSection.set(key);
  }

  toggle(target: 'emailNotifications' | 'productUpdates'): void {
    this[target].update((v) => !v);
  }
}
