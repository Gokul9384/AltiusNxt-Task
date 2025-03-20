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
  selector: 'app-inward',
  templateUrl: './inward.component.html',
})

export class InwardComponent implements OnInit {
  InwardForm: FormGroup;
  InwardData: any = [];
  InwardList: any = [];
  InwardDialog: boolean = false;
  visible: boolean = false;
  ProductList: any = [];

  constructor(
    public helper: CommonHelper,
    private service: CommonService,
    private formbuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.helper.ShowSpinner();
    await this.GetInwardList();
    this.helper.HideSpinner();
  }

  InwardValidationMessage = {
    'quantity': [{ type: 'required', message: 'Name cannot be blank.' },],
    'product_id': [{ type: 'required', message: 'Please select State/Territory/Province.' },],
  };

  async GetInwardList() {
    const StockEntryType:any = "Inward"
    let res = await this.service.GetById(StockEntryType,"v1/StockEntry/List");
    if (res) {
      this.InwardList = res;
    }
  }

  async GetProductList() {
    let res = await this.service.GetAll("v1/Product/List");
    if (res) {
      this.ProductList = res;
    }
  }

  async CreateInward(id: number) {
    this.InwardForm = this.formbuilder.group({
        quantity: new FormControl('', Validators.compose([Validators.required])),
      product_id: new FormControl('', Validators.compose([Validators.required]))
    });
    if (id) {
      this.helper.ShowSpinner();
      let res = await this.service.GetById(id, "/v1/StockEntry/ById"); 
      this.InwardData = res;
      this.helper.HideSpinner();
    }
    else {
      this.InwardData ;
    }
    await this.GetProductList();
    this.InwardDialog = true;
  }



  


  async Save() {
    debugger
    if (this.InwardForm.valid == true) {
      this.helper.ShowSpinner();
      let res: any;
      this.InwardData.type = "Inward";
      if (this.InwardData.id) {
        res = await this.service.CommonPut(this.InwardData, `v1/StockEntry/Update/${this.InwardData.id}`);
      }
      else {
        res = await this.service.CommonPost(this.InwardData, "v1/StockEntry/Insert");
      }
      if (res.Type == "S") {
        this.helper.SucessToastr(res.Message);
        await this.GetInwardList();
        this.InwardDialog = false;
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
      this.helper.validateAllFormFields(this.InwardForm);
    }
  }

  async Delete(id: number, name: string) {
    // this.confirmationService.confirm({
    //   target: event.target,
    //   message: 'Are you sure, that you want to delete this Inward- ' + name + '?',
    //   icon: 'pi pi-question-circle',
    //   accept: async () => {
    //     this.helper.ShowSpinner();
    //     let res = await this.service.Delete(`v1/StockEntry/Delete/${id}`);
    //     if (res.Type == "S") {
    //       this.helper.SucessToastr(res.Message);
    //       this.GetInwardList();
    //     }
    //     else {
    //       this.helper.ErrorToastr(res.Message);
    //     }
    //     this.helper.HideSpinner();
    //   }
    // });
  }

  CloseDialouge() {
    this.InwardDialog = false;
  }

}

const routes: Routes = [
  { path: "", component: InwardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardRoutingModule { }

@NgModule({
  declarations: [InwardComponent],
  imports: [
    CommonModule,
    InwardRoutingModule,
    ModuleData,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  exports: [InwardComponent],
})
export class InwardModule { }
