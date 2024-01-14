import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
export const userRoutes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: UserListComponent},
  {path: 'new', component: UserFormComponent},
  {path: 'edit/:id', component: UserFormComponent},
]
