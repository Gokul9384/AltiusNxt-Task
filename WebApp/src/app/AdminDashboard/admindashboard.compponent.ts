import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonHelper } from '../../Helper/CommonHelper';
import { ModuleData } from 'src/Helper/Modules';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { WebSocketService } from 'src/Service/WebSocketService.service';




@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  ProductCategorydropdown: any = [];
  DashboardList: any = [];
  LowStockList: any = [];
  ProductId: number = 0;
  ProductData: any = {};
  DashboardForm: FormGroup;
  formbuilder: any;
  



  constructor(
    public helper: CommonHelper,
    private service: CommonService,
    private webSocketService: WebSocketService

  ) { }

  async ngOnInit() {
    //  this.DashboardForm = this.formbuilder.group({
    //       product_category_id: new FormControl('', Validators.compose([Validators.nullValidator])),
    //     })

    await this.ProductCategorydropdownList();
    await this.CategoryWiseStock();
    await this.LowProductStock();   
    console.log('Subscribing to stock updates...'); // Log subscription
    this.webSocketService.onStockUpdate((data: any) => {
      console.log('Received stock update from server:', data); // Log received data
      this.DashboardList = data;
    });
  }

  async CategoryWiseStock() {
    let res = await this.service.GetAll("v1/Dashboard/category-wise-stock");
    if (res.length > 0) {
      this.DashboardList = res;
    }}


    

  async LowProductStock(){
    debugger
    let res = await this.service.GetAll("v1/Dashboard/low-stock-products");
    if (res.length > 0) {
      this.LowStockList = res;
    }
  }

  async ProductCategorydropdownList() {
    debugger
    let res = await this.service.GetAll("v1/ProductCategory/List");
    this.ProductCategorydropdown = res;
    if (this.ProductId == 0) {
        this.ProductData.product_id = this.ProductCategorydropdown[0]?.id;
    }
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
    DropdownModule,
    TableModule
  ]
})
export class AdminDashboardModule { }

