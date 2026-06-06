import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs';
import { RouterLink } from '@angular/router';


interface UserMenuItem {
  label: string;
  icon: string;
  link: string;
}


@Component({
  selector: 'ltz-profile',
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})


export class Profile {
  isProfileMenuOpen = signal(false);
  userName = signal('');
  userEmail = signal('');
  private authService = inject(AuthService);

  isUserMenuOpen = signal(false);

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen.update((val) => !val);
    this.getCurrentUser();
  }
  userMenuItems: UserMenuItem[] = [
    { label: 'My Profile', icon: 'user', link: '/settings' },
    { label: 'Settings', icon: 'settings', link: '/settings' },
    { label: 'Subscription', icon: 'card', link: '/subscription' },
    { label: 'Help & Support', icon: 'help', link: '/dashboard' },
  ];

    toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen.update((open) => !open);
  }


  getCurrentUser() {
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.userName.set(user.name!);
        this.userEmail.set(user.email!);
      });
  }

  signOut() {
    this.authService.logout();
  }
}
