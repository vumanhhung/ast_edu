import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { RoleDonViService } from "../../services/roledonvi.service";
import { RoleDonVi } from "../../models/roledonvi.model";
import { DonVi } from '../../models/donvi.model';
import { DonViService } from '../../services/donvi.service';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);
import { Role } from '../../models/role.model';
import { AccountService } from '../../services/account.service';

@Component({
    selector: "roledonvi",
    templateUrl: "./roledonvi.component.html",
    styleUrls: ["./roledonvi.component.css"]
})

export class RoleDonViComponent implements OnInit {
    //TReeview Icon
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
    public expandedKeys: any[] = [];
    //Confirm info
    public popoverTitle: string = 'Bạn chắc chắn muốn xóa?';
    public popoverMessage: string = '';
    public popoverTitleStatus: string = 'Kích hoạt bản ghi';
    public cancelClicked: boolean = false;
    confirmText: string = '<i class="glyphicon glyphicon-ok"></i> Có';
    cancelText: string = '<i class="glyphicon glyphicon-remove"></i> Không';

    @Input() customTemplate: TemplateRef<any>;
    @Input() appendToBody: boolean = false;

    rows: DonVi[] = [];
    roles: Role[] = [];

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private roledonviService: RoleDonViService, private donviService: DonViService, private accountService: AccountService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.donviService.getAllDonVi().subscribe(results => {
            this.alertService.stopLoadingMessage();
            this.rows = results;
            this.openDonVi();
            this.accountService.getRoles().subscribe(r => {
                this.roles = r;
            }, err => {
                this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu nhóm người dùng từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(err)}"`,
                    MessageSeverity.error, err);
            });

        }, error => {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu đơn vị từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                MessageSeverity.error, error);
        });
    }

    openDonVi() {
        for (var i = 0; i < this.rows.length; i++) {
            this.expandedKeys.push(i.toString());
            if (this.rows[i]["items"] != null) {
                this.expandChild(i.toString(), this.rows[i]);
            }
        }
    }

    closeDonVi() {
        this.expandedKeys = [];
    }

    expandChild(nameP: string, pItem: DonVi) {
        for (var i = 0; i < pItem["items"].length; i++) {
            this.expandedKeys.push(nameP + "_" + i.toString());
            if (pItem["items"][i].items != null) {
                this.expandChild(nameP + "_" + i.toString(), pItem["items"][i]);
            }
        }
    }

    UpdateRoles(donvi: DonVi, role: Role) {
        //alert(row.tenDonVi + "," + role.name);
        this.alertService.startLoadingMessage();
        var roleDonVi: RoleDonVi[] = donvi.roleDonVi;
        if (roleDonVi != null) {
            var r = roleDonVi.find(o => o.roleId == role.id);
            if (r != null) {
                console.log(donvi);
                this.roledonviService.deleteRoleDonVi(r.roleDonViId).subscribe(response => {
                    donvi.roleDonVi.splice(donvi.roleDonVi.indexOf(r), 1);
                    this.alertService.stopLoadingMessage();
                    this.alertService.showStickyMessage("Thành công", `Hủy quyền nhóm người dùng thành công!`, MessageSeverity.success);
                }, err => {
                    this.alertService.stopLoadingMessage();
                    this.alertService.showStickyMessage("Tải lỗi", `Không thể cập nhật quyền.\r\nLỗi: "${Utilities.getHttpResponseMessage(err)}"`,
                        MessageSeverity.error, err);
                });
            } else {
                this.InsertRoleDonVi(donvi, role, false);
            }
        } else {
            this.InsertRoleDonVi(donvi, role, true);
        }
    }

    InsertRoleDonVi(donvi: DonVi, role: Role, nullData: boolean) {
        var obj: RoleDonVi = new RoleDonVi();
        obj.donViId = donvi.donViId;
        obj.roleId = role.id;
        obj.roleName = role.name;
        console.log(obj);
        this.roledonviService.addnewRoleDonVi(obj).subscribe(r => {
            if (nullData) {
                donvi.roleDonVi = [];
            }
            donvi.roleDonVi.push(r);
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage("Thành công", `Gán nhóm người dùng vào đơn vị thành công!`, MessageSeverity.success);
        }, err => {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage("Tải lỗi", `Không thể cập nhật quyền.\r\nLỗi: "${Utilities.getHttpResponseMessage(err)}"`,
                MessageSeverity.error, err);
        });
    }

    public chk(donvi: DonVi, role: Role) {
        var roleDonVi: RoleDonVi[] = donvi["roleDonVi"];
        if (roleDonVi != null) {
            var r = roleDonVi.find(o => o.roleId == role.id);
            if (r != null) {
                return true;
            } else return false;
        } else return false;
    }
}
