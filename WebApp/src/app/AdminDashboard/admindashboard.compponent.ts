import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../Service/Common.service';
import { CommonHelper } from '../../Helper/CommonHelper';
import { ModuleData } from 'src/Helper/Modules';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    public helper: CommonHelper,
  ) { }

  async ngOnInit() {
   
  }

 
  
}

const routes: Routes = [
  { path: "", component: AdminDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    ModuleData,
  ]
})
export class AdminDashboardModule { }
