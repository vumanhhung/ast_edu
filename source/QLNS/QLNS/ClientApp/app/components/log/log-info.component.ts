import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { Log } from "../../models/log.model";
import { LogService } from "./../../services/log.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { LogComponent } from './log.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';

@Component({
  selector: "log-info",
  templateUrl: "./log-info.component.html",
  styleUrls: ["./log-info.component.css"]
})

export class LogInfoComponent implements OnInit {
  public autoCorrect: boolean = false;
  private isNew = false;
  private isSaving = false;
  private isExitsItems = false;
  private nameLogbefoEdit: string = "";
  private showValidationErrors: boolean = false;
  private uniqueId: string = Utilities.uniqueId();
  private LogEdit: Log = new Log();
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
  constructor(private alertService: AlertService, private gvService: LogService, @Inject(forwardRef(() => LogComponent)) private _parent: LogComponent) {
  }

  ngOnInit() {
    if (!this.isGeneralEditor) {
      this.loadData();
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.gvService.getLogByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
  }

  private onDataLoadSuccessful(obj: Log) {
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
    this.LogEdit = new Log();
    this.showValidationErrors = false;
    this.resetForm();
    this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
    this.alertService.resetStickyMessage();
    if (!this.isGeneralEditor)
      this.isEditMode = false;

    if (this.changesCancelledCallback)
      this.changesCancelledCallback();
  }

  //private save() {
  //  this.isSaving = true;
  //  if (this.isNew) {
  //    this.gvService.checkExitsItems(this.LogEdit.tenLog).subscribe(response => {
  //      if (response == false) {
  //        this.isExitsItems = response;
  //        this.LogEdit.trangThai = this.isStatusEditChange;
  //        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
  //        this.gvService.addnewLog(this.LogEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
  //      }
  //      else {
  //        this.isExitsItems = response;
  //        this.isSaving = false;
  //      }
  //    });
  //  }
  //  else {
  //    if (this.LogEdit.tenLog == this.nameLogbefoEdit) {
  //      this.isSaving = false;
  //      this.gvService.updateLog(this.LogEdit.logId, this.LogEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
  //      this.isExitsItems = false;
  //    }
  //    else {
  //      this.gvService.checkExitsItems(this.LogEdit.tenLog).subscribe(response => {
  //        if (response == false) {
  //          this.isExitsItems = response;
  //          this.LogEdit.trangThai = this.isStatusEditChange;
  //          this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
  //          this.gvService.updateLog(this.LogEdit.logId, this.LogEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
  //        }
  //        else {
  //          this.isExitsItems = response;
  //          this.isSaving = false;
  //        }
  //      });
  //    }
  //  }
  //}

  newLog() {
    this.isGeneralEditor = true;
    this.isNew = true;
    this.nameLogbefoEdit = "";
    this.showValidationErrors = true;    
    this.isStatusEditChange = false;
    this.LogEdit = new Log();
    this.edit();
    return this.LogEdit;
  }

  private saveSuccessHelper(obj?: Log) {
    if (obj)
      Object.assign(this.LogEdit, obj);

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
    this.LogEdit = new Log();
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

  //editLog(obj: Log) {
  //  if (obj) {
  //    this.isGeneralEditor = true;
  //    this.isNew = false;      
  //    this.nameLogbefoEdit = obj.tenLog;
  //    this.LogEdit = new Log();
  //    this.isStatusEditChange = obj.trangThai;
  //    Object.assign(this.LogEdit, obj);      
  //    this.edit();

  //    return this.LogEdit;
  //  }
  //  else {
  //    return this.newLog();
  //  }
  //}

  private edit() {
    if (!this.isGeneralEditor || !this.LogEdit) {
      this.LogEdit = new Log();
    }
    this.isEditMode = true;
    this.showValidationErrors = true;
  }

  private close() {
    this.LogEdit = new Log();
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
  private onTenLogChange(ten: string) {
    if (ten != null) {
      if (ten.length < 1) {
        this.isExitsItems = false;
      }
    }
  }
}