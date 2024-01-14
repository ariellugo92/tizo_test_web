import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

export const productRoutes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: ProductListComponent},
  {path: 'new', component: ProductFormComponent},
  {path: 'edit/:id', component: ProductFormComponent},
]
