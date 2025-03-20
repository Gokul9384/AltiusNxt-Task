import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { UserModel } from 'src/Model/User.model';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import {DividerModule} from 'primeng/divider';
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
})

export class UserComponent implements OnInit {
    userlist: any = [];
    UserId: number = 0;
    UserData: any = {};
    UserForm: FormGroup;
    UserRoledropdown: any = [];
    UserRoleName: string = 'Admin';
    LoggedinData: any = {};

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.LoggedinData = this.helper.GetUserInfo();
        console.log(this.LoggedinData.user_role_name);
        this.UserId = this.route.snapshot.params["id"];
        if (this.UserId != 0) {
            this.UserForm = this.formbuilder.group({
                user_role_id: new FormControl('', Validators.compose([Validators.required])),
                email: new FormControl('', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"), Validators.pattern("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$")])),
                mobile: new FormControl('', Validators.compose([Validators.nullValidator])),
                first_name: new FormControl('', Validators.compose([Validators.required])),
                last_name: new FormControl('', Validators.compose([Validators.nullValidator])),
            })
        }
        else {
            this.UserForm = this.formbuilder.group({
                user_role_id: new FormControl('', Validators.compose([Validators.required])),
                email: new FormControl('', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"), Validators.pattern("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$")])),
                password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
                mobile: new FormControl('', Validators.compose([Validators.nullValidator])),
                first_name: new FormControl('', Validators.compose([Validators.required])),
                last_name: new FormControl('', Validators.compose([Validators.nullValidator])),
            })
        }
        await this.UserRoledropdownList();
        await this.UserById();
        this.helper.HideSpinner();
    }

    UserValidationMessages = {
        'user_role_id': [{ type: 'required', message: 'Please select user role.' },],
        'email': [{ type: 'required', message: 'Required.' }, { type: 'pattern', message: 'Invalid email' }],
        'password': [{ type: 'required', message: 'Required.' }, { type: 'minlength', message: 'At least 6 characters, but longer is better.' }],
        'mobile': [{ type: 'required', message: 'Mobile Number cannot be blank.' },],
        'first_name': [{ type: 'required', message: 'Name cannot be blank.' },],
    };

    async UserById() {
        debugger
        if (this.UserId != 0) {
            this.UserData = await this.service.GetById(this.UserId, `v1/User/ById`);
            console.log(this.UserData);
        }
    }


    validateInput(event: any) {
        const input = event.target;
        const regex = /^[a-zA-Z ]*$/;
        if (!regex.test(input.value)) {
            input.value = input.value.replace(/[^a-zA-Z ]/g, ''); 
            this.UserData.first_name = input.value;
        }
    }
    

   

    async UserRoledropdownList() {
        let res = await this.service.GetAll("v1/UserRole/List");
        this.UserRoledropdown = res;
        this.UserRoledropdown.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        if (this.UserId == 0) {
            this.UserData.user_role_id = this.UserRoledropdown[0]?.id;
        }
    }

    async SaveUser() {
        if (this.UserForm.valid == true) {
            this.helper.ShowSpinner();
            let res: any;
           
            if (this.UserData.id) {
                res = await this.service.CommonPut(this.UserData, `v1/User/Update/${this.UserData.id}`);
            }
            else {
                res = await this.service.CommonPost(this.UserData, "v1/User/Insert");
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("UserList");
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
            this.helper.validateAllFormFields(this.UserForm);
        }
    }









    

}

const routes: Routes = [
    { path: "", component: UserComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }

@NgModule({
    declarations: [UserComponent],
    imports: [
        CommonModule,
        UserRoutingModule,
        ModuleData,
        DropdownModule,
        TableModule,
        ButtonModule,
        PasswordModule,
        CardModule,
        InputTextModule,
        DividerModule
    ],
})
export class UserModule { }
