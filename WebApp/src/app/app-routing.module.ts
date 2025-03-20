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
 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
