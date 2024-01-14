import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomInputComponent } from '../../../shared/components/form/custom-input/custom-input.component';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { AuthData } from '../interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CustomInputComponent,
    NgClass,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);

  private destroy$ = new Subject();

  registerForm?: FormGroup | undefined;
  public submitted = false;

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  onRegister() {
    this.submitted = true;
    if (this.registerForm?.invalid) return;

    const username = this.registerForm?.get('username')?.value;
    const password = this.registerForm?.get('password')?.value;

    const data: AuthData = { username, password };
    this.authService
      .register(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.confirmationService.confirm({
              message: 'Ahora inicia sesión con tus credenciales',
              header: 'Tes has registrado!',
              icon: 'pi pi-exclamation-triangle',
              rejectVisible: false,
            });
            this.reset();
          }
        },
      });
  }

  reset() {
    this.submitted = false;
    this.registerForm?.reset();
  }

  get f() {
    return this.registerForm!.controls;
  }
}
