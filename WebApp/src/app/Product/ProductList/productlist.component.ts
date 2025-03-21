import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-productlist',
    templateUrl: './productlist.component.html',    
})

export class ProductListComponent implements OnInit {
    ProductList: any = [];
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetProductList();
        this.helper.HideSpinner();
    }

    async GetProductList() {
        let res = await this.service.GetAll("v1/Product/List");
        this.ProductList = res;
    }

    CreateUser(id: string) {
        this.helper.redirectTo("/Product/" + id);      
    }

    async Delete(id: string) {
        debugger
        this.helper.ShowSpinner();
        let res = await this.service.Delete(`v1/Product/Delete/${id}`);
        if (res.Type == "S") {
            this.helper.SucessToastr(res.Message);
            this.GetProductList();
        }
        else {
            this.helper.ErrorToastr(res.Message);
        }
        this.helper.HideSpinner();
}

}

const routes: Routes = [
    { path: "", component: ProductListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductListRoutingModule { }

@NgModule({
    declarations: [ProductListComponent],
    imports: [
        CommonModule,
        ProductListRoutingModule,
        ModuleData,
        TableModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        TagModule
    ],
})
export class ProductListModule { }
