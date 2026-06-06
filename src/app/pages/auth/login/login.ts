import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LoginForm } from './login.form';
import { LoginCredentials } from '../../../core/data-services/narra-pic-api/model/loginCredentials';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'ltz-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Logo],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  showPassword: boolean = false;
  form: LoginForm = new LoginForm();
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor() {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signInWithGoogle(): void {
    console.log('Sign in with Google');
    // Add your Google sign-in logic here
  }

  onSubmit(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: LoginCredentials = {
      email: this.form.innerForm.value.email!,
      password: this.form.innerForm.value.password!,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('Invalid email or password');
        } else {
          this.errorMessage.set('An error occurred. Please try again.');
        }
      },
    });
  }
}
