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
    selector: 'app-userlist',
    templateUrl: './userlist.component.html',    
})

export class UserListComponent implements OnInit {
    userlist: any = [];
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetUserList();
        this.helper.HideSpinner();
    }

    async GetUserList() {
        let res = await this.service.GetAll("v1/User/List");   
        this.userlist = res;
    }

    CreateUser(id: string) {
        this.helper.redirectTo("/User/" + id);      
    }



}

const routes: Routes = [
    { path: "", component: UserListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserListRoutingModule { }

@NgModule({
    declarations: [UserListComponent],
    imports: [
        CommonModule,
        UserListRoutingModule,
        ModuleData,
        TableModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        TagModule
    ],
})
export class UserlistModule { }
