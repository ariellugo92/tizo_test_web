import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ScaffoldFormCrudComponent } from '../../../../shared/components/scaffold/scaffold-form-crud/scaffold-form-crud.component';
import { CustomInputComponent } from '../../../../shared/components/form/custom-input/custom-input.component';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/category.service';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductData } from '../../interfaces/product-data.interface';
import { CategoryService } from '../../../categories/components/services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ScaffoldFormCrudComponent,
    CustomInputComponent,
    DropdownModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly detectorRef = inject(ChangeDetectorRef);

  private destroy$ = new Subject();

  categories: any[] = [];
  unitMeasurements: any[] = ['Lbs', 'Kg', 'Grg'];
  productForm?: FormGroup;
  currentProduct?: ProductData | null;
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
        this.productService.getById(id).subscribe((res) => {
          this.currentProduct = res;
          this.isEdit = true;
          this.isActive = Boolean(this.currentProduct.status);
          this.loadForm();
          this.detectorRef.detectChanges();
        });
      }
    });
  }

  loadForm() {
    this.productForm = this.fb.group({
      code: [this.currentProduct?.code ?? '', Validators.required],
      name: [this.currentProduct?.name ?? '', Validators.required],
      description: this.currentProduct?.description ?? '',
      category: [this.currentProduct?.category ?? '', Validators.required],
      unitMeasurement: [this.currentProduct?.unitMeasurement ?? '', Validators.required],
      minQuantity: this.currentProduct?.minQuantity ?? 0,
      quantity: this.currentProduct?.quantity ?? 0,
      price: this.currentProduct?.price ?? 0,
    });

    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.filter(el => Boolean(el.status));
        this.detectorRef.detectChanges();
      }
    })
  }

  manageData() {
    this.submitted = true;
    if (this.productForm?.invalid) return;

    this.currentProduct = this.isEdit
      ? { ...this.currentProduct, ...this.productForm?.value }
      : this.productForm?.value;

    if (!this.currentProduct) return;
    this.currentProduct.category = {
      _id: this.currentProduct?.category?._id,
      name: this.currentProduct?.category?.name,
    }

    if (this.isEdit) {
      this.productService
        .update(this.currentProduct, (this.currentProduct._id ?? ''))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => this.succes(res),
        });
      return;
    }

    this.productService
      .create(this.currentProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.succes(res),
      });
  }

  succes(res: boolean) {
    const message = this.isEdit
      ? 'El producto se actualizo correctamente!'
      : 'El producto se ha agregado correctamente! Desea agregar otro?';
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
    this.productForm?.reset();
    this.currentProduct = null;
    this.isEdit = false;
    this.detectorRef.detectChanges();
  }

  cancelData() {
    this.router.navigate(['/products']);
  }

  deleteData() {
    this.confirmationService.confirm({
      header: 'Eliminar',
      message: 'Estás seguro de eliminar este producto?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService
          .delete(this.currentProduct?._id ?? '')
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
    return this.productForm!.controls;
  }

}
