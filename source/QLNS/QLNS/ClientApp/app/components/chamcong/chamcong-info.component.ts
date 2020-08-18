import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { ChamCong } from "../../models/chamcong.model";
import { ChamCongService } from "./../../services/chamcong.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { ChamCongComponent } from './chamcong.component';
import { Inject } from '@angular/core';
import { forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileInfo, FileRestrictions, UploadEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { FileUploadService } from '../../services/fileUpload.service';
import { LogService } from '../../services/log.service';
import { RemoveEvent } from '@progress/kendo-angular-grid';
import { Log } from '../../models/log.model';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: "chamcong-info",
    templateUrl: "./chamcong-info.component.html",
    styleUrls: ["./chamcong-info.component.css"]
})

export class ChamCongInfoComponent implements OnInit {
    public autoCorrect: boolean = false;
    private isNew = false;
    private isSaving = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private ChamCongEdit: ChamCong = new ChamCong();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isStatusEditChange: boolean = false;

    //biến cho image
    private URLfile: string = "";
    public events: string[] = [];
    public soFileLoi: number = 0;
    public stringRandom: string;
    public fileName: string;
    public srcDataImg: any;
    multiUpload = false;
    listFile: string[] = [];
    public imagePreviews: FileInfo[] = [];
    public uploadRestrictions: FileRestrictions = {
        allowedExtensions: ['.jpg', '.png', ".jpeg"],
        maxFileSize: 4444194304,
    };

    date: string = "";
    user: User;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;
    @ViewChild('editorModal')
    editorModal: ModalDirective;
    constructor(private alertService: AlertService, private gvService: ChamCongService, private router: Router, private route: ActivatedRoute, private fileUploadService: FileUploadService,
        private logService: LogService, private accountService: AccountService, private authService: AuthService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.accountService.getUser(this.authService.currentUser.id).subscribe(results => {
            this.user = results;
            this.alertService.stopLoadingMessage();
        }, error => { });
    }

    private onDataLoadSuccessful(obj: ChamCong) {
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
        this.ChamCongEdit = new ChamCong();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        this.editorModal.hide();
    }

    private save() {
        if (this.soFileLoi > 0) {
            this.alertService.showMessage("Cảnh báo", "File được chọn không đúng yêu cầu. Vui lòng chọn lại", MessageSeverity.error);
        }
        else {
            let k_file_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-upload-selected") as HTMLCollectionOf<HTMLElement>;
            if (k_file_name.length > 0) {
                k_file_name[0].click();
            }
            else {
                this.alertService.showMessage("Cảnh báo", "Vui lòng nhập file", MessageSeverity.error);
            }
        }
    }

    newChamCong() {
        this.isGeneralEditor = true;
        this.isNew = true;
        this.showValidationErrors = true;
        this.isStatusEditChange = false;
        this.date = this.formatDate(new Date());
        this.ChamCongEdit = new ChamCong();
        this.edit();
        return this.ChamCongEdit;
    }

    private saveSuccessHelper(obj?: ChamCong) {
        if (obj)
            Object.assign(this.ChamCongEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành công", `Thực hiện chấm công thành công`, MessageSeverity.success);
                //this._parent.loadData();
            }
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.ChamCongEdit = new ChamCong();
        this.resetForm();
        this.isEditMode = false;

        this.router.navigate(['./chamcong/']);
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

    editChamCong(obj: ChamCong) {
        if (obj) {
            this.isGeneralEditor = true;
            this.isNew = false;
            this.ChamCongEdit = new ChamCong();
            Object.assign(this.ChamCongEdit, obj);
            this.edit();

            return this.ChamCongEdit;
        }
        else {
            return this.newChamCong();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.ChamCongEdit) {
            this.ChamCongEdit = new ChamCong();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.ChamCongEdit = new ChamCong();
        this.showValidationErrors = false;
        this.resetForm();
        this.isEditMode = false;

        this.editorModal.hide();
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

    //cập nhật ảnh nếu có
    //xóa ảnh
    public removeEventHandler(event: RemoveEvent) {
        this.soFileLoi -= 1;
    }

    uploadEventHandler(e: UploadEvent, value: string) {
        this.stringRandom = Utilities.RandomText(10);
        e.data = {
            stringRandom: this.stringRandom,
            urlSever: value + "/img"
        };
        //Lưu file url sever để lưu vào DB
        e.files.forEach((file) => {
            this.URLfile = (value + "/img/" + this.stringRandom + "_" + file.name);
        });
    }

    public selectEventHandler(e: SelectEvent): void {
        this.URLfile = "";
        const that = this;
        e.files.forEach((file) => {
            if (!file.validationErrors) {
                const reader = new FileReader();
                reader.onload = function (ev: any) {
                    const image: any = {
                        src: ev.target.result,
                        uid: file.uid
                    };
                    // base64 là cái src. that.srcDataImg lưu base 64 của ảnh
                    that.srcDataImg = image.src;
                    that.imagePreviews.unshift(image);
                };
                reader.readAsDataURL(file.rawFile);
                this.soFileLoi = 0;
            }
            else {
                this.alertService.showMessage("Cảnh báo", "Có file được chọn không đúng yêu cầu", MessageSeverity.error);
                this.soFileLoi += 1;
            }
        });
    }

    public completeEventHandler(event) {
        //Khi file được gửi đi đến sever xong thì tiến hành update vào database
        console.log("Hoàn thành:" + this.URLfile);
        var splitText = this.URLfile.split('/');

        this.ChamCongEdit.duongDan = this.URLfile;
        this.ChamCongEdit.donViId = this.user.donViId;
        this.ChamCongEdit.nguoiTao = this.user.userName;
        this.ChamCongEdit.ngayTao = this.formatDateToString(new Date());
        this.ChamCongEdit.tenHinhAnh = splitText[4].toString();

        this.isSaving = true;
        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
        if (this.isNew) {
            this.gvService.addnewChamCong(this.ChamCongEdit).subscribe(results => {
                var log = new Log();
                log.nguoiThucHien = this.accountService.currentUser.userName;
                log.tenModule = "Quản lý chấm công";
                log.hanhDong = "Chấm công";
                log.noiDung = "Chấm công";
                this.logService.addnewLog(log).subscribe(r => {
                    this.saveSuccessHelper(results);
                }, e => console.log(e));
            }, error => this.saveFailedHelper(error));
        }
    }

    clearFile(fileName: string) {
        //Xóa file
        this.fileUploadService.deleteImagesbyPath([this.URLfile]).subscribe(response => {
            this.alertService.showMessage("Thông báo", "Đã xóa file " + fileName, MessageSeverity.success);
            this.URLfile = "";
            this.listFile.splice(this.listFile.indexOf(fileName, 0), 1);
        }, error => this.saveFailedHelper(error));
    }

    formatDateToString(date: Date) {
        var dateFormat = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00.000";
        return dateFormat;
    }

    formatDate(date: Date) {
        var dateFormat = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        return dateFormat;
    }
}