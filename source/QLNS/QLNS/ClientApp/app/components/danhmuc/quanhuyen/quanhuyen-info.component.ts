import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { QuanHuyen } from "../../../models/quanhuyen.model";
import { QuanHuyenService } from "./../../../services/quanhuyen.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { QuanHuyenComponent } from './quanhuyen.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';
import { TinhThanh } from '../../../models/tinhthanh.model';
import { TinhThanhService } from '../../../services/tinhthanh.service';

@Component({
    selector: "quanhuyen-info",
    templateUrl: "./quanhuyen-info.component.html",
    styleUrls: ["./quanhuyen-info.component.css"]
})

export class QuanHuyenInfoComponent implements OnInit {
    public autoCorrect: boolean = false;
    private isNew = false;
    private isSaving = false;
    private isExitsItems = false;
    private nameQuanHuyenbefoEdit: string = "";
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private QuanHuyenEdit: QuanHuyen = new QuanHuyen();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isStatusEditChange: boolean = false;
    tinhThanhFilter: TinhThanh[] = [];
    tinhThanhSelected: TinhThanh = new TinhThanh();
    tinhThanhChK: boolean = false;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;
    @ViewChild('editorModal')
    editorModal: ModalDirective;
    constructor(private alertService: AlertService, private gvService: QuanHuyenService, private tinhThanhService: TinhThanhService, @Inject(forwardRef(() => QuanHuyenComponent)) private _parent: QuanHuyenComponent) {
    }

    ngOnInit() {
        this.loadTinhThanh();
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getQuanHuyenByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    loadTinhThanh() {
        this.alertService.startLoadingMessage();
        this.tinhThanhService.getAllByStatus().subscribe(result => this.onDataLoadTinhThanhSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadTinhThanhSuccessful(obj: TinhThanh[]) {
        this.alertService.stopLoadingMessage();
        this.tinhThanhFilter = obj;
    }

    private onDataLoadSuccessful(obj: QuanHuyen) {
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
        this.QuanHuyenEdit = new QuanHuyen();
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
        if (!this.tinhThanhChK) {
            this.alertService.showMessage("Lỗi nhập liệu", "Vui lòng nhập tỉnh thành", MessageSeverity.error);
            this.isSaving = false;
        } else {
            this.isSaving = true;
            this.QuanHuyenEdit.tinhThanhId = this.tinhThanhSelected.tinhThanhId;
            this.QuanHuyenEdit.trangThai = this.isStatusEditChange;
            if (this.isNew) {
                this.gvService.checkExitsItems(this.QuanHuyenEdit.tenQuanHuyen).subscribe(response => {
                    if (response == false) {
                        this.isExitsItems = response;
                        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                        this.gvService.addnewQuanHuyen(this.QuanHuyenEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
                    }
                    else {
                        this.isExitsItems = response;
                        this.isSaving = false;
                    }
                });
            }
            else {
                if (this.QuanHuyenEdit.tenQuanHuyen == this.nameQuanHuyenbefoEdit) {
                    this.isSaving = false;
                    this.gvService.updateQuanHuyen(this.QuanHuyenEdit.quanHuyenId, this.QuanHuyenEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                    this.isExitsItems = false;
                }
                else {
                    this.gvService.checkExitsItems(this.QuanHuyenEdit.tenQuanHuyen).subscribe(response => {
                        if (response == false) {
                            this.isExitsItems = response;
                            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                            this.gvService.updateQuanHuyen(this.QuanHuyenEdit.quanHuyenId, this.QuanHuyenEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                        }
                        else {
                            this.isExitsItems = response;
                            this.isSaving = false;
                        }
                    });
                }
            }
        }
    }

    newQuanHuyen() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.tinhThanhChK = false;
        this.nameQuanHuyenbefoEdit = "";
        this.showValidationErrors = true;
        this.isStatusEditChange = false;
        this.QuanHuyenEdit = new QuanHuyen();
        this.QuanHuyenEdit.tinhThanhId = 0;
        this.edit();
        return this.QuanHuyenEdit;
    }

    private saveSuccessHelper(obj?: QuanHuyen) {
        if (obj)
            Object.assign(this.QuanHuyenEdit, obj);

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
        this.QuanHuyenEdit = new QuanHuyen();
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

    editQuanHuyen(obj: QuanHuyen) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.nameQuanHuyenbefoEdit = obj.tenQuanHuyen;
            this.tinhThanhSelected = this.tinhThanhFilter.find(r => r.tinhThanhId == obj.tinhThanhId);
            this.tinhThanhChK = true;
            this.QuanHuyenEdit = new QuanHuyen();
            this.isStatusEditChange = obj.trangThai;
            Object.assign(this.QuanHuyenEdit, obj);
            this.edit();

            return this.QuanHuyenEdit;
        }
        else {
            return this.newQuanHuyen();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.QuanHuyenEdit) {
            this.QuanHuyenEdit = new QuanHuyen();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.QuanHuyenEdit = new QuanHuyen();
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
    private onTenQuanHuyenChange(ten: string) {
        if (ten != null) {
            if (ten.length < 1) {
                this.isExitsItems = false;
            }
        }
    }
    tinhThanhChange(tinhthanh: TinhThanh) {
        if (tinhthanh != null) {
            this.tinhThanhChK = true;
        }
        else this.tinhThanhChK = false;
    }
}