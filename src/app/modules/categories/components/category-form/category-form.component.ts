import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ScaffoldFormCrudComponent } from '../../../../shared/components/scaffold/scaffold-form-crud/scaffold-form-crud.component';
import { CustomInputComponent } from '../../../../shared/components/form/custom-input/custom-input.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { UserData } from '../../../users/interfaces/user-data.interface';
import { CategoryData } from '../interfaces/category-data.interface';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ScaffoldFormCrudComponent,
    CustomInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly detectorRef = inject(ChangeDetectorRef);

  private destroy$ = new Subject();

  categoryForm?: FormGroup;
  currenCategory?: CategoryData | null;
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
        this.categoryService.getById(id).subscribe((res) => {
          this.currenCategory = res;
          this.isEdit = true;
          this.isActive = Boolean(this.currenCategory.status);
          this.loadForm();
          this.detectorRef.detectChanges();
        });
      }
    });
  }

  loadForm() {
    this.categoryForm = this.fb.group({
      name: [this.currenCategory?.name ?? '', Validators.required],
      description: this.currenCategory?.description ?? '',
    });
  }

  manageData() {
    this.submitted = true;
    if (this.categoryForm?.invalid) return;

    this.currenCategory = this.isEdit
      ? { ...this.currenCategory, ...this.categoryForm?.value }
      : this.categoryForm?.value;

    if (!this.currenCategory) return;

    if (this.isEdit) {
      this.categoryService
        .update(this.currenCategory, (this.currenCategory._id ?? ''))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => this.succes(res),
        });
      return;
    }

    this.categoryService
      .create(this.currenCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.succes(res),
      });
  }

  succes(res: boolean) {
    const message = this.isEdit
      ? 'La categoría se actualizo correctamente!'
      : 'La categoría se ha agregado correctamente! Desea agregar otra?';
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
    this.categoryForm?.reset();
    this.currenCategory = null;
    this.isEdit = false;
    this.detectorRef.detectChanges();
  }

  cancelData() {
    this.router.navigate(['/categories']);
  }

  deleteData() {
    this.confirmationService.confirm({
      header: 'Eliminar',
      message: 'Estás seguro de eliminar esta categoría?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService
          .delete(this.currenCategory?._id ?? '')
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
    return this.categoryForm!.controls;
  }
}
