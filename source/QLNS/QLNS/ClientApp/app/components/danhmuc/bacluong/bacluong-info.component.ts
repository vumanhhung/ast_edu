import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { BacLuong } from "../../../models/bacluong.model";
import { BacLuongService } from "../../../services/bacluong.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { BacLuongComponent } from './bacluong.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';

@Component({
  selector: "bacluong-info",
  templateUrl: "./bacluong-info.component.html",
  styleUrls: ["./bacluong-info.component.css"]
})

export class BacLuongInfoComponent implements OnInit {
  public autoCorrect: boolean = false;
  private isNew = false;
  private isSaving = false;
  private isExitsItems = false;
  private nameBacLuongbefoEdit: string = "";
  private showValidationErrors: boolean = false;
  private uniqueId: string = Utilities.uniqueId();
  private BacLuongEdit: BacLuong = new BacLuong();
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
  constructor(private alertService: AlertService, private gvService: BacLuongService, @Inject(forwardRef(() => BacLuongComponent)) private _parent: BacLuongComponent) {
  }

  ngOnInit() {
    if (!this.isGeneralEditor) {
      this.loadData();
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.gvService.getBacLuongByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
  }

  private onDataLoadSuccessful(obj: BacLuong) {
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
    this.BacLuongEdit = new BacLuong();
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
      this.gvService.checkExitsItems(this.BacLuongEdit.tenBacLuong).subscribe(response => {
        if (response == false) {
          this.isExitsItems = response;
          this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
          this.gvService.addnewBacLuong(this.BacLuongEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
          this.isExitsItems = response;
          this.isSaving = false;
        }
      });
    }
    else {
      if (this.BacLuongEdit.tenBacLuong == this.nameBacLuongbefoEdit) {
        this.isSaving = false;
        this.gvService.updateBacLuong(this.BacLuongEdit.bacLuongId, this.BacLuongEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        this.isExitsItems = false;
      }
      else {
        this.gvService.checkExitsItems(this.BacLuongEdit.tenBacLuong).subscribe(response => {
          if (response == false) {
            this.isExitsItems = response;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.gvService.updateBacLuong(this.BacLuongEdit.bacLuongId, this.BacLuongEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
          }
          else {
            this.isExitsItems = response;
            this.isSaving = false;
          }
        });
      }
    }
  }

  newBacLuong() {
    this.isGeneralEditor = true;
    this.isNew = true;
    this.nameBacLuongbefoEdit = "";
    this.showValidationErrors = true;    
    this.isStatusEditChange = false;
    this.BacLuongEdit = new BacLuong();
    this.edit();
    return this.BacLuongEdit;
  }

  private saveSuccessHelper(obj?: BacLuong) {
    if (obj)
      Object.assign(this.BacLuongEdit, obj);

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
    this.BacLuongEdit = new BacLuong();
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

  editBacLuong(obj: BacLuong) {
    if (obj) {
      this.isGeneralEditor = true;
      this.isNew = false;      
      this.nameBacLuongbefoEdit = obj.tenBacLuong;
      this.BacLuongEdit = new BacLuong();
      Object.assign(this.BacLuongEdit, obj);      
      this.edit();

      return this.BacLuongEdit;
    }
    else {
      return this.newBacLuong();
    }
  }

  private edit() {
    if (!this.isGeneralEditor || !this.BacLuongEdit) {
      this.BacLuongEdit = new BacLuong();
    }
    this.isEditMode = true;
    this.showValidationErrors = true;
  }

  private close() {
    this.BacLuongEdit = new BacLuong();
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
  private onTenBacLuongChange(ten: string) {
    if (ten != null) {
      if (ten.length < 1) {
        this.isExitsItems = false;
      }
    }
  }
}