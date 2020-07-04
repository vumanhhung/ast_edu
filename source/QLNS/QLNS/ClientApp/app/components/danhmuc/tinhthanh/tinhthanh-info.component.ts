import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { TinhThanh } from "../../../models/tinhthanh.model";
import { TinhThanhService } from "./../../../services/tinhthanh.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { TinhThanhComponent } from './tinhthanh.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';

@Component({
    selector: "tinhthanh-info",
    templateUrl: "./tinhthanh-info.component.html",
    styleUrls: ["./tinhthanh-info.component.css"]
})

export class TinhThanhInfoComponent implements OnInit {
    public autoCorrect: boolean = false;
    private isNew = false;
    private isSaving = false;
    private isExitsItems = false;
    private nameTinhThanhbefoEdit: string = "";
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private TinhThanhEdit: TinhThanh = new TinhThanh();
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
    constructor(private alertService: AlertService, private gvService: TinhThanhService, @Inject(forwardRef(() => TinhThanhComponent)) private _parent: TinhThanhComponent) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getTinhThanhByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: TinhThanh) {
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
        this.TinhThanhEdit = new TinhThanh();
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
        this.TinhThanhEdit.trangThai = this.isStatusEditChange;
        if (this.isNew) {
            this.gvService.checkExitsItems(this.TinhThanhEdit.tenTinhThanh).subscribe(response => {
                if (response == false) {
                    this.isExitsItems = response;
                    this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                    this.gvService.addnewTinhThanh(this.TinhThanhEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
                }
                else {
                    this.isExitsItems = response;
                    this.isSaving = false;
                }
            });
        }
        else {
            if (this.TinhThanhEdit.tenTinhThanh == this.nameTinhThanhbefoEdit) {
                this.isSaving = false;
                this.gvService.updateTinhThanh(this.TinhThanhEdit.tinhThanhId, this.TinhThanhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                this.isExitsItems = false;
            }
            else {
                this.gvService.checkExitsItems(this.TinhThanhEdit.tenTinhThanh).subscribe(response => {
                    if (response == false) {
                        this.isExitsItems = response;
                        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                        this.gvService.updateTinhThanh(this.TinhThanhEdit.tinhThanhId, this.TinhThanhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                    }
                    else {
                        this.isExitsItems = response;
                        this.isSaving = false;
                    }
                });
            }
        }
    }

    newTinhThanh() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.nameTinhThanhbefoEdit = "";
        this.showValidationErrors = true;
        this.isStatusEditChange = false;
        this.TinhThanhEdit = new TinhThanh();
        this.edit();
        return this.TinhThanhEdit;
    }

    private saveSuccessHelper(obj?: TinhThanh) {
        if (obj)
            Object.assign(this.TinhThanhEdit, obj);

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
        this.TinhThanhEdit = new TinhThanh();
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

    editTinhThanh(obj: TinhThanh) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.nameTinhThanhbefoEdit = obj.tenTinhThanh;
            this.TinhThanhEdit = new TinhThanh();
            this.isStatusEditChange = obj.trangThai;
            Object.assign(this.TinhThanhEdit, obj);
            this.edit();

            return this.TinhThanhEdit;
        }
        else {
            return this.newTinhThanh();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.TinhThanhEdit) {
            this.TinhThanhEdit = new TinhThanh();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.TinhThanhEdit = new TinhThanh();
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
    private onTenTinhThanhChange(ten: string) {
        if (ten != null) {
            if (ten.length < 1) {
                this.isExitsItems = false;
            }
        }
    }
}