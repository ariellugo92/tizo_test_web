import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ScaffoldFormCrudComponent } from '../../../../shared/components/scaffold/scaffold-form-crud/scaffold-form-crud.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CustomInputComponent } from '../../../../shared/components/form/custom-input/custom-input.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ConfirmationService } from 'primeng/api';
import { UserData } from '../../interfaces/user-data.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ScaffoldFormCrudComponent,
    DropdownModule,
    CustomInputComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private detectorRef = inject(ChangeDetectorRef);

  private destroy$ = new Subject();

  roles: any[] = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Usuario', value: 'user' },
  ];
  userForm?: FormGroup;
  currentUser?: UserData | null;
  submitted = false;
  isEdit = false;
  isActive = true;

  ngOnInit(): void {
    if (this.router.url.indexOf('new') > 0) {
      this.loadForm();
    }

    this.activatedRoute.params.subscribe((param) => {
      const id = param['id'];
      if (id) {
        this.userService.getById(id).subscribe((res) => {
          this.currentUser = res;
          this.isEdit = true;
          this.isActive = Boolean(this.currentUser.status);
          this.loadForm();
          this.detectorRef.detectChanges();
        });
      }
    });
  }

  loadForm() {
    this.userForm = this.fb.group(
      {
        username: [this.currentUser?.username ?? '', Validators.required],
        role: [this.currentUser?.role ?? '', Validators.required],
        password: ['', this.isEdit ? null : Validators.required],
        confirmPassword: ['', this.isEdit ? null : Validators.required],
      },
      {
        validators: this.isEdit
          ? null
          : passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  manageData() {
    this.submitted = true;
    if (this.userForm?.invalid) return;

    this.currentUser = this.isEdit
      ? { ...this.currentUser, ...this.userForm?.value }
      : this.userForm?.value;

    if (!this.currentUser) return;

    if (this.isEdit) {
      this.userService
        .update(this.currentUser, this.currentUser._id ?? '')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => this.succes(res),
        });
      return;
    }

    this.userService
      .create(this.currentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.succes(res),
      });
  }

  succes(res: boolean) {
    const message = this.isEdit
      ? 'El usuario se actualizo correctamente!'
      : 'El usuario se ha agregado correctamente! Desea agregar otro?';
    if (res) {
      this.confirmationService.confirm({
        message,
        header: this.isEdit ? 'Actualizado!' : 'Agregado!',
        icon: 'pi pi-check-circle',
        rejectVisible: !this.isEdit,
        reject: () => this.cancelData(),
        accept: () => {
          this.isEdit ? this.cancelData() : this.reset();
        },
      });

      if (!this.isEdit) this.reset();
    }
  }

  reset() {
    this.submitted = false;
    this.userForm?.reset();
    this.currentUser = null;
    this.isEdit = false;
    this.detectorRef.detectChanges();
  }

  cancelData() {
    this.router.navigate(['/users']);
  }

  deleteData() {
    this.confirmationService.confirm({
      header: 'Eliminar',
      message: 'Estás seguro de eliminar este usuario?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService
          .delete(this.currentUser?._id ?? '')
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => this.cancelData(),
          });
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  get f() {
    return this.userForm!.controls;
  }
}
