import { Routes } from "@angular/router";
import { CategoryListComponent } from "./components/category-list/category-list.component";
import { CategoryFormComponent } from "./components/category-form/category-form.component";

export const categoryRoutes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: CategoryListComponent},
  {path: 'new', component: CategoryFormComponent},
  {path: 'edit/:id', component: CategoryFormComponent},
]
