import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { DoiTac } from "../../../models/doitac.model";
import { DoiTacService } from "../../../services/doitac.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { DoiTacComponent } from './doitac.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';

@Component({
  selector: "doitac-info",
  templateUrl: "./doitac-info.component.html",
  styleUrls: ["./doitac-info.component.css"]
})

export class DoiTacInfoComponent implements OnInit {
  public autoCorrect: boolean = false;
  private isNew = false;
  private isSaving = false;
  private isExitsItems = false;
  private nameDoiTacbefoEdit: string = "";
  private showValidationErrors: boolean = false;
  private uniqueId: string = Utilities.uniqueId();
  private DoiTacEdit: DoiTac = new DoiTac();
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
  constructor(private alertService: AlertService, private gvService: DoiTacService, @Inject(forwardRef(() => DoiTacComponent)) private _parent: DoiTacComponent) {
  }

  ngOnInit() {
    if (!this.isGeneralEditor) {
      this.loadData();
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.gvService.getDoiTacByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
  }

  private onDataLoadSuccessful(obj: DoiTac) {
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
    this.DoiTacEdit = new DoiTac();
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
      this.gvService.checkExitsItems(this.DoiTacEdit.tenDoiTac).subscribe(response => {
        if (response == false) {
          this.isExitsItems = response;
          this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
          this.gvService.addnewDoiTac(this.DoiTacEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
          this.isExitsItems = response;
          this.isSaving = false;
        }
      });
    }
    else {
      if (this.DoiTacEdit.tenDoiTac == this.nameDoiTacbefoEdit) {
        this.isSaving = false;
        this.gvService.updateDoiTac(this.DoiTacEdit.doiTacId, this.DoiTacEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        this.isExitsItems = false;
      }
      else {
        this.gvService.checkExitsItems(this.DoiTacEdit.tenDoiTac).subscribe(response => {
          if (response == false) {
            this.isExitsItems = response;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.gvService.updateDoiTac(this.DoiTacEdit.doiTacId, this.DoiTacEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
          }
          else {
            this.isExitsItems = response;
            this.isSaving = false;
          }
        });
      }
    }
  }

  newDoiTac() {
    this.isGeneralEditor = true;
    this.isNew = true;
    this.nameDoiTacbefoEdit = "";
    this.showValidationErrors = true;    
    this.isStatusEditChange = false;
    this.DoiTacEdit = new DoiTac();
    this.edit();
    return this.DoiTacEdit;
  }

  private saveSuccessHelper(obj?: DoiTac) {
    if (obj)
      Object.assign(this.DoiTacEdit, obj);

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
    this.DoiTacEdit = new DoiTac();
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

  editDoiTac(obj: DoiTac) {
    if (obj) {
      this.isGeneralEditor = true;
      this.isNew = false;      
      this.nameDoiTacbefoEdit = obj.tenDoiTac;
      this.DoiTacEdit = new DoiTac();
      Object.assign(this.DoiTacEdit, obj);      
      this.edit();

      return this.DoiTacEdit;
    }
    else {
      return this.newDoiTac();
    }
  }

  private edit() {
    if (!this.isGeneralEditor || !this.DoiTacEdit) {
      this.DoiTacEdit = new DoiTac();
    }
    this.isEditMode = true;
    this.showValidationErrors = true;
  }

  private close() {
    this.DoiTacEdit = new DoiTac();
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
  private onTenDoiTacChange(ten: string) {
    if (ten != null) {
      if (ten.length < 1) {
        this.isExitsItems = false;
      }
    }
  }
}