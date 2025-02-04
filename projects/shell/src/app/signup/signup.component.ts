import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/angular-themes/material.module';
import { coreModule } from '../../../../shared/libs/core.module';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MaterialModule, coreModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private loginService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required, Validators.minLength(3), Validators.maxLength(20)],  // Reactive Form Field
      password: ['', Validators.required, Validators.minLength(7)],   // Reactive Form Field
      confirmPassword: ['', Validators.required],   // Reactive Form Field
    })
    this.signUpForm.get('confirmPassword')?.setValidators(confirmPasswordValidator(this.signUpForm.get('password') as AbstractControl));
  }

  get isFormValid(): boolean {
    return this.signUpForm.valid;
  }
  onSignUp() {
    if (this.signUpForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { username, password, confirmPassword } = this.signUpForm.value;

    this.loginService.signUp(username, password).subscribe((isValid:any) => {
      this.isLoading = false;
      if (isValid) {
        localStorage.setItem('user', username);
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = 'Invalid username or password!';
      }
    });
  }
}

export function confirmPasswordValidator(passwordControl: AbstractControl): ValidatorFn {
  return (confirmPasswordControl: AbstractControl) => {
    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      return { mismatch: true };
    }

    return null;
  };
}