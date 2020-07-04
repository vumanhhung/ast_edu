import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService } from "../../services/account.service";
import { Utilities } from "../../services/utilities";
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { UserEdit } from '../../models/user-edit.model';
import { UserInfoComponent } from "./user-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { AuthService } from '../../services/auth.service';
//const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);


@Component({
    selector: 'users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit, AfterViewInit {
    //Confirm info
    public popoverTitle: string = 'Bạn chắc chắn muốn xóa dữ liệu?';
    public popoverMessage: string = '';
    public popoverTitleStatus: string = 'Kích hoạt bản ghi';
    public cancelClicked: boolean = false;
    confirmText: string = '<i class="glyphicon glyphicon-ok"></i> Có';
    cancelText: string = '<i class="glyphicon glyphicon-remove"></i> Không';
    //Grid info
    public gridView: GridDataResult;
    public pageSize = 10;
    public skip = 0;
    private data: Object[];
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
        field: 'id',
        dir: 'desc'
    }];

    columns: any[] = [];
    rows: User[] = [];
    rowsCache: User[] = [];
    editedUser: UserEdit;
    sourceUser: UserEdit;
    editingUserName: { name: string };
    loadingIndicator: boolean;
    searchValue: string;
    allRoles: Role[] = [];
    user: User = new User();


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('userNameTemplate')
    userNameTemplate: TemplateRef<any>;

    @ViewChild('rolesTemplate')
    rolesTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('userEditor')
    userEditor: UserInfoComponent;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private accountService: AccountService) {
        this.loadItems();
    }

    //Grid 
    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadItems();
    }

    private loadItems(): void {
        this.gridView = {
            data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
            total: this.rows.length
        };
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.loadItems();
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);
        this.loadData();
    }

    ngAfterViewInit() {

        this.userEditor.changesSavedCallback = () => {
            this.addNewUserToList();
            this.editorModal.hide();
        };

        this.userEditor.changesCancelledCallback = () => {
            this.editedUser = null;
            this.sourceUser = null;
            this.editorModal.hide();
        };
    }

    addNewUserToList() {
        //if (this.sourceUser) {
        //    Object.assign(this.sourceUser, this.editedUser);

        //    let sourceIndex = this.rowsCache.indexOf(this.sourceUser, 0);
        //    if (sourceIndex > -1)
        //        Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);

        //    sourceIndex = this.rows.indexOf(this.sourceUser, 0);
        //    if (sourceIndex > -1)
        //        Utilities.moveArrayItem(this.rows, sourceIndex, 0);

        //    this.editedUser = null;
        //    this.sourceUser = null;
        //}
        //else {
        //    let user = new User();
        //    Object.assign(user, this.editedUser);
        //    this.editedUser = null;

        //    let maxIndex = 0;
        //    for (let u of this.rowsCache) {
        //        if ((<any>u).index > maxIndex)
        //            maxIndex = (<any>u).index;
        //    }

        //    (<any>user).index = maxIndex + 1;

        //    this.rowsCache.splice(0, 0, user);
        //    this.rows.splice(0, 0, user);
        //    this.rows = [...this.rows];
        //    this.loadItems();
        //    this.onSearchChanged(this.searchValue);
        //}
        this.loadData();
        this.onSearchChanged(this.searchValue);
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.accountService.getUser(this.accountService.currentUser.id).subscribe(r => {
            this.user = r;
        }, e => this.onDataLoadFailed(e));

        this.accountService.getUsersAndRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));        
    }


    onDataLoadSuccessful(users: User[], roles: Role[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        if (this.user.roles[0] != "SuperAdmin") {
            users = users.filter(u => u.donViId == this.user.donViId);
        }

        if (this.user.roles[0] == "AdminCuc") {
            roles = roles.filter(r => r.name == "AdminCuc" || r.name == "CucTruong" || r.name == "CucPho" || r.name == "ChuyenVienCuc");
        } else if (this.user.roles[0] == "AdminDonVi") {
            roles = roles.filter(r => r.name == "AdminDonVi" || r.name == "TruongPhong" || r.name == "PhoPhong" || r.name == "ChuyenVien");
        }

        users.forEach((user, index, users) => {
            (<any>user).index = index + 1;
        });

        this.rowsCache = [...users];
        this.rows = users;

        this.allRoles = roles;
        this.loadItems();

    }


    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy suất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    onSearchChanged(value: string) {
        this.searchValue = value;
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.userName, r.fullName, r.email, r.phoneNumber, r.jobTitle, r.roles));
        this.gridView = {
            data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
            total: this.rows.length
        };
    }

    onEditorModalHidden() {
        this.editingUserName = null;
        this.userEditor.resetForm(true);
    }

    newUser() {
        this.editingUserName = null;
        this.sourceUser = null;
        this.editedUser = this.userEditor.newUser(this.allRoles);
        if (this.user.roles[0] != "SuperAdmin") {
            this.userEditor.adminDonViId = this.user.donViId;
        } else {
            this.userEditor.adminDonViId = 0;
        }        
        this.editorModal.show();
    }

    editUser(row: UserEdit) {
        this.editingUserName = { name: row.userName };
        this.sourceUser = row;
        this.editedUser = this.userEditor.editUser(row, this.allRoles);
        if (this.user.roles[0] != "SuperAdmin") {
            this.userEditor.adminDonViId = this.user.donViId;
        } else {
            this.userEditor.adminDonViId = 0;
        }
        this.editorModal.show();
    }

    deleteUser(row: UserEdit) {
        this.deleteUserHelper(row);
    }

    deleteUserHelper(row: UserEdit) {

        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.accountService.deleteUser(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.gridView = {
                    data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
                    total: this.rows.length
                };
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }

    get canAssignRoles() {
        return this.accountService.userHasPermission(Permission.assignRolesPermission);
    }

    get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission)
    }

    get canManageUsers() {
        return this.accountService.userHasPermission(Permission.manageUsersPermission);
    }

    private refreshData() {
        this.loadData();
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage("Thành công", `Dữ liệu đã được làm mới`, MessageSeverity.info);
    }
}
