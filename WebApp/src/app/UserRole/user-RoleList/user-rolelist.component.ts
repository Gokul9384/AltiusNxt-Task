import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-userrole',
    templateUrl: './user-rolelist.component.html',
})

export class UserRoleListComponent implements OnInit {
    UserRoleList: any = [];

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetUserRoleList();
        this.helper.HideSpinner();
    }

    async GetUserRoleList() {
        this.UserRoleList = await this.service.GetAll("v1/UserRole/List");
    }

    async EditUser(id: string) {
        this.helper.redirectTo("/UserRole/" + id);
    }

    async DeleteUserRole(id: number, event, name: string) {

                this.helper.ShowSpinner();
                let res = await this.service.Delete(`v1/UserRole/Delete/${id}`);
                if (res.Type == "S") {
                    this.helper.SucessToastr(res.Message);
                    this.GetUserRoleList();
                }
                else {
                    this.helper.ErrorToastr(res.Message);
                }
                this.helper.HideSpinner();
    }

}

const routes: Routes = [
    { path: "", component: UserRoleListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoleListRoutingModule { }

@NgModule({
    declarations: [UserRoleListComponent],
    imports: [
        CommonModule,
        UserRoleListRoutingModule,
        ModuleData,
        TableModule,
        InputTextModule,
        ButtonModule
    ],
})
export class UserRoleListModule { }