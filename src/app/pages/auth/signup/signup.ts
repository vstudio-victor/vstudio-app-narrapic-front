import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Channel } from '../../../core/data-services/narra-pic-api/model/models';
import { SignUpForm } from './signup.form';
import { Logo } from "../../shared/logo/logo";

@Component({
  selector: 'ltz-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Logo],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  showPassword = false;
  form: SignUpForm = new SignUpForm();
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor() {

  }
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

      const credentials = this.form.innerForm.value;

      this.authService.signUp(credentials).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error.status === 400) {
            this.errorMessage.set('Invalid information or email already exists');
          } else {
            this.errorMessage.set('An error occurred. Please try again.');
          }
        },
      });

  }

}
