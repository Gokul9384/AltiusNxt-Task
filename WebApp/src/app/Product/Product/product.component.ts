import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ValidationModule } from "../../Shared/Validation/validation.component";
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})

export class ProductComponent implements OnInit {
  ProductData: any = {};
  ProductForm: FormGroup;
  ProductId: number = 0;
  ProductCategorydropdown: any;

  constructor(
    private service: CommonService,
    public helper: CommonHelper,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder
  ) { }

  async ngOnInit() {
    this.ProductForm = this.formbuilder.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      product_category_id: new FormControl('', Validators.compose([Validators.required])),
      stock_quantity: new FormControl('', Validators.compose([Validators.required])),
      min_qty: new FormControl('', Validators.compose([Validators.required])),
    })

    this.helper.ShowSpinner();
    this.ProductId = this.route.snapshot.params["id"];
    await this.GetProductData();
    this.helper.HideSpinner();
    await this.ProductCategorydropdownList();
  }

  ProductValidationMessages = {
    'name': [{ type: 'required', message: 'Name cannot be blank.' },],
    'product_category_id': [{ type: 'required', message: 'Product Category be blank.' },],
    'stock_quantity': [{ type: 'required', message: 'Stock Quantity cannot be blank.' },],
    'min_qty': [{ type: 'required', message: 'Minimum Quantity cannot be blank.' },]
  };

  async ProductCategorydropdownList() {
    debugger
    let res = await this.service.GetAll("v1/ProductCategory/List");
    this.ProductCategorydropdown = res;
    if (this.ProductId == 0) {
        this.ProductData.product_id = this.ProductCategorydropdown[0]?.id;
    }
}

  async GetProductData() {
    if (this.ProductId != 0) {
      this.ProductData = await this.service.GetById(this.ProductId, "v1/Product/ById");
    }
    else{
      this.ProductData = {};
    }
  }

  async Save() {
    debugger
    if (this.ProductForm.valid == true) {
      this.helper.ShowSpinner();
      let res: any;
      if (this.ProductId != 0) {
        this.ProductData.updated_by_id = this.helper.GetUserInfo().id;
        res = await this.service.CommonPut(this.ProductData, `v1/Product/Update/${this.ProductData.id}`);
      }
      else {
        this.ProductData.created_by_id = this.helper.GetUserInfo().id;
        res = await this.service.CommonPost(this.ProductData, "v1/Product/Insert");
      }
      if (res.Type == "S") {
        this.helper.SucessToastr(res.Message);
        this.helper.redirectTo("ProductList");
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
      this.helper.validateAllFormFields(this.ProductForm);
    }
  }

}

const routes: Routes = [
  { path: "", component: ProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    DropdownModule,
    TableModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule,
    CardModule,
    DividerModule
],
})
export class ProductModule { }