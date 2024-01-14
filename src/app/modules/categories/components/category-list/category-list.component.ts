import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ScaffoldListCrudComponent, TableData } from '../../../../shared/components/scaffold/scaffold-list-crud/scaffold-list-crud.component';
import { Router } from '@angular/router';
import { CategoryData } from '../interfaces/category-data.interface';
import { CategoryService } from '../services/category.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    ScaffoldListCrudComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent implements OnInit, OnDestroy {

  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly detectorRef = inject(ChangeDetectorRef);

  private destroy$ = new Subject();

  columns: TableData[] = [
    {header: 'Nombre', field: 'name'},
    {header: 'Descripción', field: 'description'},
    {header: 'Estado', field: 'status'},
  ];

  categories: Partial<CategoryData>[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (res) => {
        this.categories = res.map(category => ({...category, status: category.status ? 'Activo' : 'Inactivo'}));
        this.detectorRef.detectChanges();
      },
    });
  }

  addItem() {
    this.router.navigate(['/categories/new']);
  }

  editItem(data: CategoryData) {
    this.router.navigate(['/categories/edit', data._id]);
  }

  ngOnDestroy(): void {
      this.destroy$.complete();
      this.destroy$.unsubscribe();
  }

}
