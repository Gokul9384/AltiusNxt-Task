import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
})

export class ProductCategoryComponent implements OnInit {
  ProductCategoryForm: FormGroup;
  ProductCategoryData: any = [];
  ProductCategoryList: any = [];
  ProductCategoryDialog: boolean = false;
  visible: boolean = false;
  ProductList: any = [];

  constructor(
    public helper: CommonHelper,
    private service: CommonService,
    private formbuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.helper.ShowSpinner();
    await this.GetProductCategoryList();
    this.helper.HideSpinner();
  }

  ProductCategoryValidationMessage = {
    'name': [{ type: 'required', message: 'Name cannot be blank.' },],
  };

  async GetProductCategoryList() {
    let res = await this.service.GetAll("v1/ProductCategory/List");
    if (res) {
      this.ProductCategoryList = res;
    }
  }

  async GetProductList() {
    let res = await this.service.GetAll("v1/Product/List");
    if (res) {
      this.ProductList = res;
    }
  }

  async CreateProductCategory(id: number) {
    this.ProductCategoryForm = this.formbuilder.group({
        name: new FormControl('', Validators.compose([Validators.required])),
    });
    if (id) {
      this.helper.ShowSpinner();
      let res = await this.service.GetById(id, "/v1/ProductCategory/ById"); 
      this.ProductCategoryData = res;
      this.helper.HideSpinner();
    }
    else {
      this.ProductCategoryData ;
    }
    await this.GetProductList();
    this.ProductCategoryDialog = true;
  }



  


  async Save() {
    debugger
    if (this.ProductCategoryForm.valid == true) {
      this.helper.ShowSpinner();
      let res: any;
      if (this.ProductCategoryData.id) {
        res = await this.service.CommonPut(this.ProductCategoryData, `v1/ProductCategory/Update/${this.ProductCategoryData.id}`);
      }
      else {
        res = await this.service.CommonPost(this.ProductCategoryData, "v1/ProductCategory/Insert");
      }
      if (res.Type == "S") {
        this.helper.SucessToastr(res.Message);
        await this.GetProductCategoryList();
        this.ProductCategoryDialog = false;
      }
      else if (res.Type == "W") {
        this.helper.WarningToastr(res.Message);
      }
      else {
        this.helper.ErrorToastr(res.Message);
      }
      this.helper.HideSpinner();
    }
    else {
      this.helper.validateAllFormFields(this.ProductCategoryForm);
    }
  }

  async Delete(id: number, name: string) {
    // this.confirmationService.confirm({
    //   target: event.target,
    //   message: 'Are you sure, that you want to delete this ProductCategory- ' + name + '?',
    //   icon: 'pi pi-question-circle',
    //   accept: async () => {
    //     this.helper.ShowSpinner();
    //     let res = await this.service.Delete(`v1/ProductCategory/Delete/${id}`);
    //     if (res.Type == "S") {
    //       this.helper.SucessToastr(res.Message);
    //       this.GetProductCategoryList();
    //     }
    //     else {
    //       this.helper.ErrorToastr(res.Message);
    //     }
    //     this.helper.HideSpinner();
    //   }
    // });
  }

  CloseDialouge() {
    this.ProductCategoryDialog = false;
  }

}

const routes: Routes = [
  { path: "", component: ProductCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductCategoryRoutingModule { }

@NgModule({
  declarations: [ProductCategoryComponent],
  imports: [
    CommonModule,
    ProductCategoryRoutingModule,
    ModuleData,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  exports: [ProductCategoryComponent],
})
export class ProductCategoryModule { }
