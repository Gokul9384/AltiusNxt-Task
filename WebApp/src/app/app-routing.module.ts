import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './Shared/layout/layout.component';
import { AuthGuard } from '../Helper/AuthGuard';
const routes: Routes = [
  {
    path: "",
    redirectTo: "/Login",
    pathMatch: "full"
  },
  {
    path: "Login",
    loadChildren: () => import('./Login/login.component').then(o => o.LoginModule)
  },
  
  {
    canActivate: [AuthGuard],
    path: "AdminDashboard", component: LayoutComponent,
    loadChildren: () => import('./AdminDashboard/admindashboard.compponent').then(o => o.AdminDashboardModule),
    data: { MenuName: "Admin Dashboard", Module: "Admin" }
  },
 
  {
    canActivate: [AuthGuard],
    path: "UserList",
    component: LayoutComponent, loadChildren: () => import('./User/User-List/userlist.component').then(o => o.UserlistModule),
    data: { MenuName: "User", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "User/:id", component: LayoutComponent,
    loadChildren: () => import('./User/User/user.component').then(o => o.UserModule),
    data: { MenuName: "User", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "UserRoleList", component: LayoutComponent,
    loadChildren: () => import('./UserRole/user-RoleList/user-rolelist.component').then(o => o.UserRoleListModule),
    data: { MenuName: "User Role", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "UserRole/:id", component: LayoutComponent,
    loadChildren: () => import('./UserRole/User_Role/userrole.component').then(o => o.UserRoleModule),
    data: { MenuName: "User Role", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "ProductList", component: LayoutComponent,
    loadChildren: () => import('./Product/ProductList/productlist.component').then(o => o.ProductListModule),
    data: { MenuName: "Product List", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Product/:id", component: LayoutComponent,
    loadChildren: () => import('./Product/Product/product.component').then(o => o.ProductModule),
    data: { MenuName: "Product", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "ProductCategoryList", component: LayoutComponent,
    loadChildren: () => import('./ProductCategory/product-category.component').then(o => o.ProductCategoryModule),
    data: { MenuName: "Product CategoryList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "ProductCategory/:id", component: LayoutComponent,
    loadChildren: () => import('./ProductCategory/product-category.component').then(o => o.ProductCategoryModule),
    data: { MenuName: "Product Category", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Inward", component: LayoutComponent,
    loadChildren: () => import('./Inward/inward.component').then(o => o.InwardModule),
    data: { MenuName: "Inward", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Outward", component: LayoutComponent,
    loadChildren: () => import('./Outward/outward.component').then(o => o.OutwardModule),
    data: { MenuName: "Outward", Module: "Admin" }
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
