import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { ChucDanh } from "../../../models/chucdanh.model";
import { ChucDanhService } from "./../../../services/chucdanh.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { ChucDanhComponent } from './chucdanh.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';

@Component({
    selector: "chucdanh-info",
    templateUrl: "./chucdanh-info.component.html",
    styleUrls: ["./chucdanh-info.component.css"]
})

export class ChucDanhInfoComponent implements OnInit {
    public autoCorrect: boolean = false;
    private isNew = false;
    private isSaving = false;
    private isExitsItems = false;
    private nameChucDanhbefoEdit: string = "";
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private ChucDanhEdit: ChucDanh = new ChucDanh();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isStatusEditChange: boolean = false;
    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;
    @ViewChild('editorModal')
    editorModal: ModalDirective;
    constructor(private alertService: AlertService, private gvService: ChucDanhService, @Inject(forwardRef(() => ChucDanhComponent)) private _parent: ChucDanhComponent) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getChucDanhByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: ChucDanh) {
        this.alertService.stopLoadingMessage();
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    resetForm(replace = false) {

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

    private cancel() {
        this.ChucDanhEdit = new ChucDanh();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }

    private save() {
        this.isSaving = true;
        this.ChucDanhEdit.trangThai = this.isStatusEditChange;
        if (this.isNew) {
            this.gvService.checkExitsItems(this.ChucDanhEdit.tenChucDanh).subscribe(response => {
                if (response == false) {
                    this.isExitsItems = response;
                    this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                    this.gvService.addnewChucDanh(this.ChucDanhEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
                }
                else {
                    this.isExitsItems = response;
                    this.isSaving = false;
                }
            });
        }
        else {
            if (this.ChucDanhEdit.tenChucDanh == this.nameChucDanhbefoEdit) {
                this.isSaving = false;
                this.gvService.updateChucDanh(this.ChucDanhEdit.chucDanhId, this.ChucDanhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                this.isExitsItems = false;
            }
            else {
                this.gvService.checkExitsItems(this.ChucDanhEdit.tenChucDanh).subscribe(response => {
                    if (response == false) {
                        this.isExitsItems = response;
                        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                        this.gvService.updateChucDanh(this.ChucDanhEdit.chucDanhId, this.ChucDanhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                    }
                    else {
                        this.isExitsItems = response;
                        this.isSaving = false;
                    }
                });
            }
        }
    }

    newChucDanh() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.nameChucDanhbefoEdit = "";
        this.showValidationErrors = true;
        this.isStatusEditChange = false;
        this.ChucDanhEdit = new ChucDanh();
        this.edit();
        return this.ChucDanhEdit;
    }

    private saveSuccessHelper(obj?: ChucDanh) {
        if (obj)
            Object.assign(this.ChucDanhEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công`, MessageSeverity.success);
                //this._parent.loadData();
            }
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.ChucDanhEdit = new ChucDanh();
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Ghi lỗi", "Các lỗi dưới đây đã xảy ra trong khi lưu các thay đổi của bạn:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);

        if (this.changesFailedCallback)
            this.changesFailedCallback();
    }

    private showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    editChucDanh(obj: ChucDanh) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.nameChucDanhbefoEdit = obj.tenChucDanh;
            this.ChucDanhEdit = new ChucDanh();
            this.isStatusEditChange = obj.trangThai;
            Object.assign(this.ChucDanhEdit, obj);
            this.edit();

            return this.ChucDanhEdit;
        }
        else {
            return this.newChucDanh();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.ChucDanhEdit) {
            this.ChucDanhEdit = new ChucDanh();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.ChucDanhEdit = new ChucDanh();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        if (this.changesSavedCallback)
            this.changesSavedCallback();
    }
    onEditorModalHidden() {
        this.resetForm(true);
    }
    private changeStatusEdit() {
        if (this.isStatusEditChange == false) {
            this.isStatusEditChange = true;
        }
        else {
            this.isStatusEditChange = false;
        }
    }
    private onTenChucDanhChange(ten: string) {
        if (ten != null) {
            if (ten.length < 1) {
                this.isExitsItems = false;
            }
        }
    }
}