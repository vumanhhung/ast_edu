import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Utilities } from '../../../services/utilities';
import { QuocGia } from "../../../models/quocgia.model";
import { QuocGiaService } from "../../../services/quocgia.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { QuocGiaComponent } from './quocgia.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';

@Component({
  selector: "quocgia-info",
  templateUrl: "./quocgia-info.component.html",
  styleUrls: ["./quocgia-info.component.css"]
})

export class QuocGiaInfoComponent implements OnInit {
  public autoCorrect: boolean = false;
  private isNew = false;
  private isSaving = false;
  private isExitsItems = false;
  private nameQuocGiabefoEdit: string = "";
  private showValidationErrors: boolean = false;
  private uniqueId: string = Utilities.uniqueId();
  private QuocGiaEdit: QuocGia = new QuocGia();
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
  constructor(private alertService: AlertService, private gvService: QuocGiaService, @Inject(forwardRef(() => QuocGiaComponent)) private _parent: QuocGiaComponent) {
  }

  ngOnInit() {
    if (!this.isGeneralEditor) {
      this.loadData();
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.gvService.getQuocGiaByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
  }

  private onDataLoadSuccessful(obj: QuocGia) {
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
    this.QuocGiaEdit = new QuocGia();
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
      this.gvService.checkExitsItems(this.QuocGiaEdit.tenQuocGia).subscribe(response => {
        if (response == false) {
          this.isExitsItems = response;
          this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
          this.gvService.addnewQuocGia(this.QuocGiaEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
        }
        else {
          this.isExitsItems = response;
          this.isSaving = false;
        }
      });
    }
    else {
      if (this.QuocGiaEdit.tenQuocGia == this.nameQuocGiabefoEdit) {
        this.isSaving = false;
        this.gvService.updateQuocGia(this.QuocGiaEdit.quocGiaId, this.QuocGiaEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
        this.isExitsItems = false;
      }
      else {
        this.gvService.checkExitsItems(this.QuocGiaEdit.tenQuocGia).subscribe(response => {
          if (response == false) {
            this.isExitsItems = response;
            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
            this.gvService.updateQuocGia(this.QuocGiaEdit.quocGiaId, this.QuocGiaEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
          }
          else {
            this.isExitsItems = response;
            this.isSaving = false;
          }
        });
      }
    }
  }

  newQuocGia() {
    this.isGeneralEditor = true;
    this.isNew = true;
    this.nameQuocGiabefoEdit = "";
    this.showValidationErrors = true;    
    this.isStatusEditChange = false;
    this.QuocGiaEdit = new QuocGia();
    this.edit();
    return this.QuocGiaEdit;
  }

  private saveSuccessHelper(obj?: QuocGia) {
    if (obj)
      Object.assign(this.QuocGiaEdit, obj);

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
    this.QuocGiaEdit = new QuocGia();
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

  editQuocGia(obj: QuocGia) {
    if (obj) {
      this.isGeneralEditor = true;
      this.isNew = false;      
      this.nameQuocGiabefoEdit = obj.tenQuocGia;
      this.QuocGiaEdit = new QuocGia();
      Object.assign(this.QuocGiaEdit, obj);      
      this.edit();

      return this.QuocGiaEdit;
    }
    else {
      return this.newQuocGia();
    }
  }

  private edit() {
    if (!this.isGeneralEditor || !this.QuocGiaEdit) {
      this.QuocGiaEdit = new QuocGia();
    }
    this.isEditMode = true;
    this.showValidationErrors = true;
  }

  private close() {
    this.QuocGiaEdit = new QuocGia();
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
  private onTenQuocGiaChange(ten: string) {
    if (ten != null) {
      if (ten.length < 1) {
        this.isExitsItems = false;
      }
    }
  }
}