import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { GioiTinh } from "../../../models/gioitinh.model";
import { GioiTinhService } from "../../../services/gioitinh.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { GioiTinhComponent } from './gioitinh.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';

@Component({
  selector: "gioitinh-info",
  templateUrl: "./gioitinh-info.component.html",
  styleUrls: ["./gioitinh-info.component.css"]
})

export class GioiTinhInfoComponent implements OnInit {
  public autoCorrect: boolean = false;
  private isNew = false;
  private isSaving = false;
  private isExitsItems = false;
  private nameGioiTinhbefoEdit: string = "";
  private showValidationErrors: boolean = false;
  private uniqueId: string = Utilities.uniqueId();
  private GioiTinhEdit: GioiTinh = new GioiTinh();
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
  constructor(private alertService: AlertService, private gvService: GioiTinhService, @Inject(forwardRef(() => GioiTinhComponent)) private _parent: GioiTinhComponent) {
  }

  ngOnInit() {
    if (!this.isGeneralEditor) {
      this.loadData();
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.gvService.getGioiTinhByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
  }

  private onDataLoadSuccessful(obj: GioiTinh) {
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
    this.GioiTinhEdit = new GioiTinh();
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
    if (this.isNew) {
      this.gvService.checkExitsItems(this.GioiTinhEdit.tenGioiTinh).subscribe(response => {
        if (response == false) {
          this.isExitsItems = response;
          this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
          this.gvService.addnewGioiTinh(this.GioiTinhEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
          this.isExitsItems = response;
          this.isSaving = false;
        }
      });
    }
    else {
      if (this.GioiTinhEdit.tenGioiTinh == this.nameGioiTinhbefoEdit) {
        this.isSaving = false;
        this.gvService.updateGioiTinh(this.GioiTinhEdit.gioiTinhId, this.GioiTinhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        this.isExitsItems = false;
      }
      else {
        this.gvService.checkExitsItems(this.GioiTinhEdit.tenGioiTinh).subscribe(response => {
          if (response == false) {
            this.isExitsItems = response;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.gvService.updateGioiTinh(this.GioiTinhEdit.gioiTinhId, this.GioiTinhEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
          }
          else {
            this.isExitsItems = response;
            this.isSaving = false;
          }
        });
      }
    }
  }

  newGioiTinh() {
    this.isGeneralEditor = true;
    this.isNew = true;
    this.nameGioiTinhbefoEdit = "";
    this.showValidationErrors = true;    
    this.isStatusEditChange = false;
    this.GioiTinhEdit = new GioiTinh();
    this.edit();
    return this.GioiTinhEdit;
  }

  private saveSuccessHelper(obj?: GioiTinh) {
    if (obj)
      Object.assign(this.GioiTinhEdit, obj);

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
    this.GioiTinhEdit = new GioiTinh();
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

  editGioiTinh(obj: GioiTinh) {
    if (obj) {
      this.isGeneralEditor = true;
      this.isNew = false;      
      this.nameGioiTinhbefoEdit = obj.tenGioiTinh;
      this.GioiTinhEdit = new GioiTinh();
      Object.assign(this.GioiTinhEdit, obj);      
      this.edit();

      return this.GioiTinhEdit;
    }
    else {
      return this.newGioiTinh();
    }
  }

  private edit() {
    if (!this.isGeneralEditor || !this.GioiTinhEdit) {
      this.GioiTinhEdit = new GioiTinh();
    }
    this.isEditMode = true;
    this.showValidationErrors = true;
  }

  private close() {
    this.GioiTinhEdit = new GioiTinh();
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
  private onTenGioiTinhChange(ten: string) {
    if (ten != null) {
      if (ten.length < 1) {
        this.isExitsItems = false;
      }
    }
  }
}