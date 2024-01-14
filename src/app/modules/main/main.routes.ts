import { Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { authGuard } from "../../shared/guards/auth.guard";
import { DashboardComponent } from "../dashboard/dashboard.component";

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'users', loadChildren: () => import('../users/user.routes').then(r => r.userRoutes)},
      {path: 'categories', loadChildren: () => import('../categories/category.routes').then(r => r.categoryRoutes)},
      {path: 'products', loadChildren: () => import('../products/product.routes').then(r => r.productRoutes)},
    ],
    canActivate: [authGuard()],
  }
]
