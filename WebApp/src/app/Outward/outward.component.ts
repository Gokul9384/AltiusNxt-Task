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
  selector: 'app-outward',
  templateUrl: './outward.component.html',
})

export class OutwardComponent implements OnInit {
  OutwardForm: FormGroup;
  OutwardData: any = [];
  OutwardList: any = [];
  OutwardDialog: boolean = false;
  visible: boolean = false;
  ProductList: any = [];

  constructor(
    public helper: CommonHelper,
    private service: CommonService,
    private formbuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.helper.ShowSpinner();
    await this.GetOutwardList();
    this.helper.HideSpinner();
  }

  OutwardValidationMessage = {
    'quantity': [{ type: 'required', message: 'Name cannot be blank.' },],
    'product_id': [{ type: 'required', message: 'Please select State/Territory/Province.' },],
  };

  async GetOutwardList() {
    const StockEntryType:any = "Outward"
    let res = await this.service.GetById(StockEntryType,"v1/StockEntry/List");
    if (res) {
      this.OutwardList = res;
    }
  }

  async GetProductList() {
    let res = await this.service.GetAll("v1/Product/List");
    if (res) {
      this.ProductList = res;
    }
  }

  async CreateOutward(id: number) {
    this.OutwardForm = this.formbuilder.group({
        quantity: new FormControl('', Validators.compose([Validators.required])),
      product_id: new FormControl('', Validators.compose([Validators.required]))
    });
    if (id) {
      this.helper.ShowSpinner();
      let res = await this.service.GetById(id, "/v1/StockEntry/ById"); 
      this.OutwardData = res;
      this.helper.HideSpinner();
    }
    else {
      this.OutwardData ;
    }
    await this.GetProductList();
    this.OutwardDialog = true;
  }



  


  async Save() {
    debugger
    if (this.OutwardForm.valid == true) {
      this.helper.ShowSpinner();
      let res: any;
      this.OutwardData.type = "Outward";
      if (this.OutwardData.id) {
        res = await this.service.CommonPut(this.OutwardData, `v1/StockEntry/Update/${this.OutwardData.id}`);
      }
      else {
        res = await this.service.CommonPost(this.OutwardData, "v1/StockEntry/Insert");
      }
      if (res.Type == "S") {
        this.helper.SucessToastr(res.Message);
        await this.GetOutwardList();
        this.OutwardDialog = false;
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
      this.helper.validateAllFormFields(this.OutwardForm);
    }
  }

  async Delete(id: number, name: string) {
    // this.confirmationService.confirm({
    //   target: event.target,
    //   message: 'Are you sure, that you want to delete this Outward- ' + name + '?',
    //   icon: 'pi pi-question-circle',
    //   accept: async () => {
    //     this.helper.ShowSpinner();
    //     let res = await this.service.Delete(`v1/StockEntry/Delete/${id}`);
    //     if (res.Type == "S") {
    //       this.helper.SucessToastr(res.Message);
    //       this.GetOutwardList();
    //     }
    //     else {
    //       this.helper.ErrorToastr(res.Message);
    //     }
    //     this.helper.HideSpinner();
    //   }
    // });
  }

  CloseDialouge() {
    this.OutwardDialog = false;
  }

}

const routes: Routes = [
  { path: "", component: OutwardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutwardRoutingModule { }

@NgModule({
  declarations: [OutwardComponent],
  imports: [
    CommonModule,
    OutwardRoutingModule,
    ModuleData,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  exports: [OutwardComponent],
})
export class OutwardModule { }
