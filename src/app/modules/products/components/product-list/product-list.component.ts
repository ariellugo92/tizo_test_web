import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ScaffoldListCrudComponent, TableData } from '../../../../shared/components/scaffold/scaffold-list-crud/scaffold-list-crud.component';
import { Router } from '@angular/router';
import { ProductService } from '../../services/category.service';
import { ProductData } from '../../interfaces/product-data.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ScaffoldListCrudComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly detectorRef = inject(ChangeDetectorRef);

  private destroy$ = new Subject();

  columns: TableData[] = [
    {header: 'Código', field: 'code'},
    {header: 'Nombre', field: 'name'},
    {header: 'Categoría', field: 'categoryName'},
    {header: 'Unidad de medida', field: 'unitMeasurement'},
    {header: 'Cantidad minima', field: 'minQuantity'},
    {header: 'Cantidad actual', field: 'quantity'},
    {header: 'Precio', field: 'price'},
    {header: 'Estadp', field: 'status'},
  ];

  products: Partial<ProductData>[] = [];

  ngOnInit(): void {
      this.loadProducts();
  }

  loadProducts() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.products = res.map(product => (
            {
              ...product,
              status: product.status ? 'Activo' : 'Inactivo',
              categoryName: product.category?.name,
            }
          ));
          this.detectorRef.detectChanges();
        },
      });
  }

  addItem() {
    this.router.navigate(['/products/new']);
  }

  editItem(data: ProductData) {
    this.router.navigate(['/products/edit', data._id]);
  }

  ngOnDestroy(): void {
      this.destroy$.complete();
      this.destroy$.unsubscribe();
  }

}
