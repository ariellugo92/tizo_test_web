import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomInputComponent } from '../../../shared/components/form/custom-input/custom-input.component';
import { AuthData } from '../interfaces/auth.interface';
import { TokenResponse } from '../interfaces/token-response.interface';
import { ConfirmationService } from 'primeng/api';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { UserInfoService } from '../../../shared/services/user-info.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private userInfoService = inject(UserInfoService);
  private localStorageService = inject(LocalStorageService);

  loginForm?: FormGroup;
  public submitted = false;

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    this.submitted = true;
    if (this.loginForm?.invalid) return;

    const username = this.loginForm?.get('username')?.value;
    const password = this.loginForm?.get('password')?.value;

    const data: AuthData = {username, password};
    this.authService.login(data).subscribe({
      next: (res: TokenResponse) => {
        if (res.success) {
          this.localStorageService.setItem('token', res.token);
          this.userInfoService.setUserLogged({
            username: res?.username,
            role: res?.role
          });
          this.router.navigate(['/']);
          return;
        }

        this.confirmationService.confirm({
          message: 'Usuario o contraseña erronea',
          header: 'Lo sentimos!',
          icon: 'pi pi-exclamation-triangle',
          rejectVisible: false,
        });
      }
    });
  }

  get f() {return this.loginForm!.controls; }

}
