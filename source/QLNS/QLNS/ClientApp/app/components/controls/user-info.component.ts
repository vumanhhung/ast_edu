// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { Utilities } from '../../services/utilities';
import { User } from '../../models/user.model';
import { UserEdit } from '../../models/user-edit.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { DonVi } from '../../models/donvi.model';
import { DonViService } from '../../services/donvi.service';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: 'user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

    private isEditMode = false;
    private isNewUser = false;
    private isSaving = false;
    private isChangePassword = false;
    private isEditingSelf = false;
    private showValidationErrors = false;
    private editingUserName: string;
    private uniqueId: string = Utilities.uniqueId();
    private user: User = new User();
    private userEdit: UserEdit;
    private allRoles: Role[] = [];

    public formResetToggle = true;

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;





    @ViewChild('f')
    private form;

    //ViewChilds Required because ngIf hides template variables from global scope
    @ViewChild('userName')
    private userName;

    @ViewChild('userPassword')
    private userPassword;

    @ViewChild('email')
    private email;

    @ViewChild('currentPassword')
    private currentPassword;

    @ViewChild('newPassword')
    private newPassword;

    @ViewChild('confirmPassword')
    private confirmPassword;

    @ViewChild('roles')
    private roles;

    @ViewChild('rolesSelector')
    private rolesSelector;
        
    public donvi: DonVi[] = [];

    public isShowDropdown = false;
    public textDropDVC = "-- Chọn đơn vị --";
    public iconClass({ text, items }: any): any {
        return {
            'k-i-file-pdf': is(text, 'pdf'),
            'k-i-folder-open': items !== undefined,
            'k-i-html': is(text, 'html'),
            'k-i-window': items === undefined,
            'k-i-image': is(text, 'jpg|png'),
            'k-icon': true
        };
    }
    public expandedKeys: any[] = ['0'];
    public selectedKeys: string[] = [];
    public disabledKeys: any[] = [];
    public donviSelected: DonVi = new DonVi();
    public adminDonViId = 0;

    constructor(private alertService: AlertService, private accountService: AccountService, private donViService: DonViService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadCurrentUserData();
        }       

        this.donViService.getAllDonVi().subscribe(results => {
            this.donvi = results;
        }, error => { });
    }

    private loadCurrentUserData() {
        this.alertService.startLoadingMessage();

        if (this.canViewAllRoles) {
            this.accountService.getUserAndRoles().subscribe(results => this.onCurrentUserDataLoadSuccessful(results[0], results[1]), error => this.onCurrentUserDataLoadFailed(error));
        }
        else {
            this.accountService.getUser().subscribe(user => this.onCurrentUserDataLoadSuccessful(user, user.roles.map(x => new Role(x))), error => this.onCurrentUserDataLoadFailed(error));
        }
    }

    private onCurrentUserDataLoadSuccessful(user: User, roles: Role[]) {
        this.alertService.stopLoadingMessage();
        this.user = user;
        this.allRoles = roles;        
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);

        this.user = new User();
    }

    private getRoleByName(name: string) {
        return this.allRoles.find((r) => r.name == name)
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    public deletePasswordFromUser(user: UserEdit | User) {
        let userEdit = <UserEdit>user;

        delete userEdit.currentPassword;
        delete userEdit.newPassword;
        delete userEdit.confirmPassword;
    }

    private edit() {
        if (!this.isGeneralEditor) {
            this.isEditingSelf = true;
            this.userEdit = new UserEdit();
            Object.assign(this.userEdit, this.user);
        }
        else {
            if (!this.userEdit)
                this.userEdit = new UserEdit();

            this.isEditingSelf = this.accountService.currentUser ? this.userEdit.id == this.accountService.currentUser.id : false;
        }

        this.isEditMode = true;
        this.showValidationErrors = true;
        this.isChangePassword = false;
    }

    private save() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");

        //if (this.adminDonViId == 0) {
        //    if (this.donviSelected == null || this.donviSelected == undefined) { this.userEdit.donViId = null }
        //    else { this.userEdit.donViId = this.donviSelected.donViId; }
        //} else {
        //    this.userEdit.donViId = this.adminDonViId;
        //}        

        if (this.isNewUser) {
            this.accountService.newUser(this.userEdit).subscribe(user => this.saveSuccessHelper(user), error => this.saveFailedHelper(error));
        }
        else {
            this.accountService.updateUser(this.userEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        }
    }

    private saveSuccessHelper(user?: User) {
        //if (user[0].length > 1) {

        //} else {
        //    if (user[0] == "DuplicateUserName")
        //        alert(1);
        //    else alert(0);
        //}

        //console.log(user);

        this.testIsRoleUserCountChanged(this.user, this.userEdit);

        if (user)
            Object.assign(this.userEdit, user);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.isChangePassword = false;
        this.showValidationErrors = false;

        this.deletePasswordFromUser(this.userEdit);
        Object.assign(this.user, this.userEdit);
        this.userEdit = new UserEdit();
        this.resetForm();


        if (this.isGeneralEditor) {
            if (this.isNewUser)
                this.alertService.showMessage("Thành công", `Người dùng \"${this.user.userName}\" đã được tạo thành công`, MessageSeverity.success);
            else if (!this.isEditingSelf)
                this.alertService.showMessage("Thành công", `Thay đổi thông tin người dùng \"${this.user.userName}\" thành công`, MessageSeverity.success);
        }

        if (this.isEditingSelf) {
            this.alertService.showMessage("Thành công", "Cập nhật thông tin tài khoản thành công", MessageSeverity.success);
            this.refreshLoggedInUser();
        }

        this.isEditMode = false;


        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: string) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Lưu lỗi", "Các lỗi sau đã xảy ra trong quá trình lưu các thanh đổi:", MessageSeverity.error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private testIsRoleUserCountChanged(currentUser: User, editedUser: User) {

        let rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) == -1);
        let rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) == -1);

        let modifiedRoles = rolesAdded.concat(rolesRemoved);

        if (modifiedRoles.length)
            setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
    }

    private cancel() {
        if (this.isGeneralEditor)
            this.userEdit = this.user = new UserEdit();
        else
            this.userEdit = new UserEdit();

        this.showValidationErrors = false;
        this.resetForm();

        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();

        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private close() {
        this.userEdit = this.user = new UserEdit();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private refreshLoggedInUser() {
        this.accountService.refreshLoggedInUser()
            .subscribe(user => {
                this.loadCurrentUserData();
            },
                error => {
                    this.alertService.resetStickyMessage();
                    this.alertService.showStickyMessage("Không thẻ làm mới", "Đã xảy ra lỗi trong khi làm mới thông tin người dùng", MessageSeverity.error, error);
                });
    }

    private changePassword() {
        this.isChangePassword = true;
    }

    private unlockUser() {
        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện bỏ chặn người dùng...");


        this.accountService.unblockUser(this.userEdit.id)
            .subscribe(response => {
                this.isSaving = false;
                this.userEdit.isLockedOut = false;
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage("Thành công", "Bỏ chặn người dùng thành công", MessageSeverity.success);
            },
                error => {
                    this.isSaving = false;
                    this.alertService.stopLoadingMessage();
                    this.alertService.showStickyMessage("Lỗi", "Các lỗi sau xảy ra khi bỏ chặn người dùng:", MessageSeverity.error, error);
                    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
                });
    }

    resetForm(replace = false) {
        this.isShowDropdown = false;
        this.removeTextDrop();
        this.isChangePassword = false;

        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    newUser(allRoles: Role[]) {
        this.isGeneralEditor = true;
        this.isNewUser = true;

        this.allRoles = [...allRoles];
        this.editingUserName = null;
        this.user = this.userEdit = new UserEdit();
        this.userEdit.isEnabled = true;        
        this.userEdit.donViId = this.donvi.length > 0 ? this.donvi[0].donViId : 0;
        this.edit();

        return this.userEdit;
    }

    editUser(user: User, allRoles: Role[]) {
        if (user) {
            this.isGeneralEditor = true;
            this.isNewUser = false;

            this.setRoles(user, allRoles);
            this.editingUserName = user.userName;
            this.user = new User();
            this.userEdit = new UserEdit();
            Object.assign(this.user, user);
            Object.assign(this.userEdit, user);
            console.log(this.donvi);
            console.log(this.donviSelected);
            this.donViService.getDonViByID(this.userEdit.donViId).subscribe(result => {
                if (result.tenDonVi !== undefined) {
                    this.textDropDVC = result.tenDonVi;
                }
                else {
                    this.textDropDVC = "-- Chọn đơn vị --";
                }
                this.donviSelected = result;
                this.selectedKeys = [result.tenDonVi];
            }, error => { });
            
            this.edit();

            return this.userEdit;
        }
        else {
            return this.newUser(allRoles);
        }
    }

    displayUser(user: User, allRoles?: Role[]) {

        this.user = new User();
        Object.assign(this.user, user);
        this.deletePasswordFromUser(this.user);
        this.setRoles(user, allRoles);

        this.isEditMode = false;
    }

    private setRoles(user: User, allRoles?: Role[]) {

        this.allRoles = allRoles ? [...allRoles] : [];

        if (user.roles) {
            for (let ur of user.roles) {
                if (!this.allRoles.some(r => r.name == ur))
                    this.allRoles.unshift(new Role(ur));
            }
        }

        if (allRoles == null || this.allRoles.length != allRoles.length)
            setTimeout(() => this.rolesSelector.refresh());
    }

    get canViewAllRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }

    get canAssignRoles() {
        return true;
        //return this.accountService.userHasPermission(Permission.assignRolesPermission);
    }

    get viewDonVi() {
        var u = this.accountService.currentUser;
        return u.roles[0] == "SuperAdmin";
    }

    public openDrop() {
        this.isShowDropdown = true;
    }

    public handleSelection(row: DonVi): void {
        if (row != null) {
            this.isShowDropdown = false;
            this.textDropDVC = row.tenDonVi;
            this.selectedKeys = ["'" + row.tenDonVi + "'"];
            this.donviSelected = row;
        } else {
            this.donviSelected = null;
        }
    }

    removeTextDrop() {
        this.donviSelected = null;
        this.textDropDVC = "-- Chọn đơn vị --";
        this.selectedKeys = [];
    }
    public hiddenDrop() {
        if (this.isShowDropdown == false) {
            this.isShowDropdown = true;
        }
        else {
            this.isShowDropdown = false;
        }
    }

    public focusFunction(event) {
        if (this.isShowDropdown == false) {
            this.isShowDropdown = true;
        }
        else {
            this.isShowDropdown = false;
        }
    }
}
