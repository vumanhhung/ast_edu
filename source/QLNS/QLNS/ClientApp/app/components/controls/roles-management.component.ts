import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { RoleEditorComponent } from "./role-editor.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
    selector: 'roles-management',
    templateUrl: './roles-management.component.html',
    styleUrls: ['./roles-management.component.css']
})
export class RolesManagementComponent implements OnInit, AfterViewInit {
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
    rows: Role[] = [];
    rowsCache: Role[] = [];
    allPermissions: Permission[] = [];
    editedRole: Role;
    sourceRole: Role;
    editingRoleName: { name: string };
    loadingIndicator: boolean;
    searchValue: string;


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: ModalDirective;

    @ViewChild('roleEditor')
    roleEditor: RoleEditorComponent;

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

        //this.columns = [
        //  { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
        //  { prop: 'name', name: gT('roles.management.Name'), width: 200 },
        //  { prop: 'description', name: gT('roles.management.Description'), width: 350 },
        //  { prop: 'usersCount', name: gT('roles.management.Users'), width: 80 },
        //  { name: '', width: 130, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        //];

        this.loadData();
    }

    ngAfterViewInit() {

        this.roleEditor.changesSavedCallback = () => {
            this.addNewRoleToList();
            this.editorModal.hide();
        };

        this.roleEditor.changesCancelledCallback = () => {
            this.editedRole = null;
            this.sourceRole = null;
            this.editorModal.hide();
        };
    }


    addNewRoleToList() {        
        //if (this.sourceRole) {
        //    Object.assign(this.sourceRole, this.editedRole);

        //    let sourceIndex = this.rowsCache.indexOf(this.sourceRole, 0);
        //    if (sourceIndex > -1)
        //        Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);

        //    sourceIndex = this.rows.indexOf(this.sourceRole, 0);
        //    if (sourceIndex > -1)
        //        Utilities.moveArrayItem(this.rows, sourceIndex, 0);

        //    this.editedRole = null;
        //    this.sourceRole = null;
        //}
        //else {
        //    let role = new Role();
        //    Object.assign(role, this.editedRole);
        //    this.editedRole = null;

        //    let maxIndex = 0;
        //    for (let r of this.rowsCache) {
        //        if ((<any>r).index > maxIndex)
        //            maxIndex = (<any>r).index;
        //    }

        //    (<any>role).index = maxIndex + 1;

        //    this.rowsCache.splice(0, 0, role);
        //    this.rows.splice(0, 0, role);
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

        this.accountService.getRolesAndPermissions()
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                let roles = results[0];
                let permissions = results[1];

                roles.forEach((role, index, roles) => {
                    (<any>role).index = index + 1;
                });


                this.rowsCache = [...roles];
                this.rows = roles;

                this.allPermissions = permissions;
                this.loadItems();
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;

                    this.alertService.showStickyMessage("Tải lỗi", `Không thể truy suất dữ liệu nhóm người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }


    onSearchChanged(value: string) {
        this.searchValue = value;
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name, r.description));
        this.gridView = {
            data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
            total: this.rows.length
        };
    }


    onEditorModalHidden() {
        this.editingRoleName = null;
        this.roleEditor.resetForm(true);
    }


    newRole() {
        this.editingRoleName = null;
        this.sourceRole = null;
        this.editedRole = this.roleEditor.newRole(this.allPermissions);
        this.editorModal.show();
    }


    editRole(row: Role) {
        this.editingRoleName = { name: row.name };
        this.sourceRole = row;
        this.editedRole = this.roleEditor.editRole(row, this.allPermissions);
        this.editorModal.show();
    }

    deleteRole(row: Role) {
        this.deleteRoleHelper(row);
    }


    deleteRoleHelper(row: Role) {
        console.log(this.rows);
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.accountService.deleteRole(row)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                //console.log(this.rows);
                this.gridView = {
                    data: this.rows,
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


    get canManageRoles() {
        return this.accountService.userHasPermission(Permission.manageRolesPermission)
    }

    private refreshData() {
        this.loadData();
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage("Thành công", `Dữ liệu đã được làm mới`, MessageSeverity.info);
    }

}
