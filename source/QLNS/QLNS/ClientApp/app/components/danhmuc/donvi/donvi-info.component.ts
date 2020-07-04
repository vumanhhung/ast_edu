import { Component, OnInit, ViewChild, Input, forwardRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Host } from '@angular/core';
import { DonViComponent } from './donvi.component';
import { Inject } from '@angular/core';
import { FileRestrictions, FileInfo, SelectEvent, UploadEvent, SuccessEvent } from '@progress/kendo-angular-upload';
import { RemoveEvent } from '@progress/kendo-angular-grid';
import { FileUploadService } from '../../../services/fileUpload.service';
import { Utilities } from '../../../services/utilities';
import { DonVi } from '../../../models/donvi.model';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { DonViService } from '../../../services/donvi.service';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);
interface Item {
    text: string,
    value: number
}
@Component({
    selector: "donvi-info",
    templateUrl: "./donvi-info.component.html",
    styleUrls: ["./donvi-info.component.css"]
})

export class DonViInfoComponent implements OnInit {
    private URLfile: string = "";
    public events: string[] = [];
    public imagePreviews: FileInfo[] = [];
    public uploadRestrictions: FileRestrictions = {
        allowedExtensions: ['.jpg', '.png', '.pdf', ".rar", ".txt", ".jpeg", ".docx", ".doc", ".xls", ".xlsx", ".gif"],
        maxFileSize: 4444194304,
    };
    public stringRandom: string;
    public srcDataImg: any;
    public soFileLoi: number = 0;
    multiUpload = false;
    listFile: string[] = [];
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
    public expandedKeys: any[] = ['0'];
    public selectedKeys: any[] = [];
    public disabledKeys: any[] = [];

    public autoCorrect: boolean = false;
    private isNew = false;
    private isSaving = false;
    private isExitsItems = false;
    private nameDonVibefoEdit: string = "";
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private DonViEdit: DonVi = new DonVi();
    public value: Date = new Date();
    public formResetToggle = true;
    private isEditMode = false;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;
    public isStatusEditChange: boolean = false;
    public donvi: DonVi[];
    public donvichaId: DonVi;
    public donvichaExist: DonVi;
    public isShowDropdown = false;
    public textDropDVC = "-- Chọn đơn vị cha --";

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;
    @ViewChild('editorModal')
    editorModal: ModalDirective;
    constructor(private alertService: AlertService, private gvService: DonViService
        //, private fileUploadService: FileUploadService
    ) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.gvService.getDonViByID().subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
    }

    private onDataLoadSuccessful(obj: DonVi) {
        this.alertService.stopLoadingMessage();
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }


    uploadEventHandler(e: UploadEvent, value: string) {
        this.stringRandom = Utilities.RandomText(10);
        e.data = {
            stringRandom: this.stringRandom,
            urlSever: value
        };
        //Lưu file url sever để lưu vào DB
        e.files.forEach((file) => {
            this.URLfile += ("*!<=*ParamsSpilitItems*=>*!" + value + "/" + this.stringRandom + "_" + file.name);
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
            }
            else {
                this.alertService.showMessage("Cảnh báo", "Có file được chọn không đúng yêu cầu", MessageSeverity.error);
                this.soFileLoi += 1;
            }
        });
    }

    public removeEventHandler(event: RemoveEvent) {
        this.soFileLoi -= 1;
    }
    public completeEventHandler(event) {
        //Khi file được gửi đi đến sever xong thì tiến hành update vào database
        console.log("Hoàn thành:" + this.URLfile);
        this.isSaving = true;
        if (this.isNew) {
            this.gvService.checkExitsItems(this.DonViEdit.tenDonVi).subscribe(response => {
                if (response == false) {
                    this.isExitsItems = response;
                    this.DonViEdit.trangThai = this.isStatusEditChange;
                    if (this.URLfile.length > 0) {
                        //this.DonViEdit.subLv = this.URLfile;
                    }
                    if (this.donvichaId.donViId != undefined) {
                        this.DonViEdit.maDonViCha = this.donvichaId.donViId;
                    }
                    else {
                        this.DonViEdit.maDonViCha = 0;
                    }
                    this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                    this.gvService.addnewDonVi(this.DonViEdit).subscribe(results => this.saveSuccessHelper(results), error => this.saveFailedHelper(error));
                }
                else {
                    this.isExitsItems = response;
                    this.isSaving = false;
                }
            });
        }
        else {
            if (this.DonViEdit.tenDonVi == this.nameDonVibefoEdit) {
                this.isSaving = false;
                if (this.donvichaId.donViId != undefined) {
                    this.DonViEdit.maDonViCha = this.donvichaId.donViId;
                }
                else {
                    this.DonViEdit.maDonViCha = 0;
                }
                //if (this.URLfile.length > 0) {
                //    if (this.multiUpload == false) {//Nếu upload muilti là false . Xóa ảnh cũ, Up đè ảnh mới lên
                //        //Xóa ảnh cũ
                //        //var j: JSON;
                //        //j.stringify({"fdsf":"dsfsdf"})
                //        this.fileUploadService.deleteFileByPath(Utilities.LayMangChuoi(this.DonViEdit.duongDanThuMuc, "")).subscribe(response => {
                //            console.log("Xóa ảnh cũ thành công");
                //        }
                //            , error => this.saveFailedHelper(error));
                //        this.DonViEdit.duongDanThuMuc = this.URLfile;
                //    }
                //    else {//Nếu upload muilti là true . add ảnh mới vào danh sách ảnh cũ
                //        this.DonViEdit.duongDanThuMuc = this.DonViEdit.duongDanThuMuc + this.URLfile;
                //    }
                //}
                this.gvService.updateDonVi(this.DonViEdit.donViId, this.DonViEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                this.isExitsItems = false;
            }
            else {
                this.gvService.checkExitsItems(this.DonViEdit.tenDonVi).subscribe(response => {
                    if (response == false) {
                        this.isExitsItems = response;
                        //alert(this.donvichaId.donViId)
                        if (this.donvichaId.donViId != undefined) {
                            this.DonViEdit.maDonViCha = this.donvichaId.donViId;
                        }
                        else {
                            this.DonViEdit.maDonViCha = 0;
                        }
                        this.DonViEdit.trangThai = this.isStatusEditChange;
                        //if (this.URLfile.length > 0) {
                        //    if (this.multiUpload == false) {//Nếu upload muilti là false . Xóa ảnh cũ, Up đè ảnh mới lên
                        //        //Xóa ảnh cũ
                        //        this.fileUploadService.deleteFileByPath(Utilities.LayMangChuoi(this.DonViEdit.duongDanThuMuc, "")).subscribe(response => {
                        //            console.log("Xóa ảnh cũ thành công");
                        //        }
                        //            , error => this.saveFailedHelper(error));
                        //        this.DonViEdit.duongDanThuMuc = this.URLfile;
                        //    }
                        //    else {
                        //        this.DonViEdit.duongDanThuMuc = this.DonViEdit.duongDanThuMuc + this.URLfile;
                        //    }
                        //}
                        this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                        this.gvService.updateDonVi(this.DonViEdit.donViId, this.DonViEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
                    }
                    else {
                        this.isExitsItems = response;
                        this.isSaving = false;
                    }
                });
            }
        }
        this.loadData();
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

    public handleSelection(row: DonVi): void {
        this.isShowDropdown = false;
        this.textDropDVC = row.tenDonVi;
        this.selectedKeys = ["'" + row.tenDonVi + "'"];
        this.donvichaId = row;
    }
    removeTextDrop() {
        this.donvichaId = null;
        this.textDropDVC = "-- Chọn đơn vị cha --";
        this.selectedKeys = [];
    }
    public hiddenDrop() {
        if (this.isShowDropdown == false) {
            this.isShowDropdown = true;
        }
        else {
            this.isShowDropdown = false;
        }
    }

    public focusFunction(event) {
        if (this.isShowDropdown == false) {
            this.isShowDropdown = true;
        }
        else {
            this.isShowDropdown = false;
        }
    }


    loadImgList(id: number) {
        //this.fileUploadService.LoadListFile(id, "/pic/donvi/").subscribe(response => {
        //  this.listFile = response[0]["value"]["value"];
        //  console.log(this.listFile)
        //}, error => this.saveFailedHelper(error));
    }
    //clearFile(fileName: string, idItem: number) {
    //    //Update lại DB trước khi xóa file
    //    this.DonViEdit.duongDanThuMuc = this.DonViEdit.duongDanThuMuc.replace("*!<=*ParamsSpilitItems*=>*!/pic/donvi/" + fileName, "");
    //    this.gvService.updateDonVi(this.DonViEdit.donViId, this.DonViEdit).subscribe(response => {
    //        console.log("Đã update lại đường dẫn");
    //    }, error => this.saveFailedHelper(error));
    //    //Xóa file
    //    this.fileUploadService.deleteFileByPath(["/pic/donvi/" + fileName, ""]).subscribe(response => {
    //        this.alertService.showMessage("Thông báo", "Đã xóa file " + fileName, MessageSeverity.success);
    //        this.loadImgList(idItem);
    //    }
    //        , error => this.saveFailedHelper(error));
    //}

    private cancel() {
        this.DonViEdit = new DonVi();
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
        //Check nếu còn file chọn lên mà lỗi thì bắt xóa
        if (this.soFileLoi > 0) {
            this.alertService.showMessage("Cảnh báo", "Có file được chọn không đúng yêu cầu. Vui lòng xóa những file này trước khi thực hiện update", MessageSeverity.error);
        }
        //Nếu hết lỗi mà có fiel up lên thỏa mãn
        else {
            let k_file_name: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("k-upload-selected") as HTMLCollectionOf<HTMLElement>;
            if (k_file_name.length > 0) {
                k_file_name[0].click();
            }
            //Nếu không có file được chọn
            else {
                this.isSaving = true;
                //this.DonViEdit.subLv = "/";
                if (this.donvichaId != null && this.donvichaId.donViId != undefined) {
                    this.DonViEdit.maDonViCha = this.donvichaId.donViId;
                }
                else {
                    this.DonViEdit.maDonViCha = 0;
                }
                if (this.DonViEdit.maDonViCha == 0) {
                    this.DonViEdit.subLv = 1;
                } else {
                    this.DonViEdit.subLv = this.donvichaId.subLv + 1;
                }
                if (this.isNew) {
                    this.gvService.checkExitsItems(this.DonViEdit.tenDonVi, this.DonViEdit.maDonViCha.toString()).subscribe(response => {
                        if (response == false) {
                            this.isExitsItems = response;
                            this.DonViEdit.trangThai = this.isStatusEditChange;

                            //if (this.donvichaId.donViId != undefined) {
                            //    this.DonViEdit.maDonViCha = this.donvichaId.donViId;
                            //}
                            //else {
                            //    this.DonViEdit.maDonViCha = 0;
                            //}
                            this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                            this.gvService.addnewDonVi(this.DonViEdit).subscribe(results => {
                                this.updateDonVi(results);
                                this.saveSuccessHelper(results);
                            }, error => this.saveFailedHelper(error));
                        }
                        else {
                            this.isExitsItems = response;
                            this.isSaving = false;
                        }
                    });
                }
                else {
                    this.DonViEdit.trangThai = this.isStatusEditChange;
                    if (this.DonViEdit.tenDonVi == this.nameDonVibefoEdit) {
                        this.isSaving = false;
                        //if (this.donvichaId.donViId != undefined) {
                        //    this.DonViEdit.maDonViCha = this.donvichaId.donViId;
                        //}
                        //else {
                        //    this.DonViEdit.maDonViCha = 0;
                        //}
                        this.gvService.updateDonVi(this.DonViEdit.donViId, this.DonViEdit).subscribe(response => {
                            this.updateDonVi(this.DonViEdit);
                            this.saveSuccessHelper();
                        }, error => this.saveFailedHelper(error));
                        this.isExitsItems = false;
                    }
                    else {
                        this.gvService.checkExitsItems(this.DonViEdit.tenDonVi, this.DonViEdit.maDonViCha.toString()).subscribe(response => {
                            if (response == false) {
                                this.isExitsItems = response;
                                //alert(this.donvichaId.donViId)
                                //if (this.donvichaId.donViId != undefined) {
                                //    this.DonViEdit.maDonViCha = this.donvichaId.donViId;
                                //}
                                //else {
                                //    this.DonViEdit.maDonViCha = 0;
                                //}                                
                                this.alertService.startLoadingMessage("Đang thực hiện lưu thay đổi...");
                                this.gvService.updateDonVi(this.DonViEdit.donViId, this.DonViEdit).subscribe(response => {
                                    this.updateDonVi(this.DonViEdit);
                                    this.saveSuccessHelper();
                                }, error => this.saveFailedHelper(error));                                
                            }
                            else {
                                this.isExitsItems = response;
                                this.isSaving = false;
                            }
                        });
                    }
                }
                this.loadData();
            }
        }
    }

    updateDonVi(row: DonVi) {
        console.log(this.donvichaExist);
        console.log(this.donvichaId);
        if (this.donvichaId.subLv == 1 || this.donvichaId.subLv == 2) {
            if (this.donvichaId.ngonNgu == null) {
                this.donvichaId.ngonNgu = this.donvichaId.donViId + "," + row.donViId.toString();
            } else {
                if (this.donvichaExist.donViId != this.donvichaId.donViId) {
                    this.donvichaExist.ngonNgu = this.donvichaExist.ngonNgu.replace("," + row.donViId, '');
                    this.donvichaId.ngonNgu = this.donvichaId.ngonNgu + "," + row.donViId.toString();
                    this.gvService.updateDonVi(this.donvichaExist.donViId, this.donvichaExist).subscribe(r => { }, e => { });
                } else {
                    this.donvichaId.ngonNgu = this.donvichaId.ngonNgu + "," + row.donViId.toString();
                }
            }
            this.gvService.updateDonVi(this.donvichaId.donViId, this.donvichaId).subscribe(r => { }, e => { });
        }
        if (row.subLv == 1 || row.subLv == 2) {
            row.ngonNgu = row.donViId.toString();
            this.gvService.updateDonVi(this.DonViEdit.donViId, this.DonViEdit).subscribe(r => { }, e => { });
        }
    }

    newDonVi() {
        this.donvichaId = new DonVi();
        this.selectedKeys = [];
        this.disabledKeys = [];
        this.textDropDVC = "-- Chọn đơn vị cha --";
        this.isShowDropdown = false;
        this.isGeneralEditor = true;
        this.isNew = true;
        this.nameDonVibefoEdit = "";
        this.showValidationErrors = true;
        this.isStatusEditChange = false;
        this.DonViEdit = new DonVi();
        this.DonViEdit.maDonViCha = 0;
        this.DonViEdit.viTri = 0;
        this.edit();
        return this.DonViEdit;
    }

    private saveSuccessHelper(obj?: DonVi) {
        if (obj)
            Object.assign(this.DonViEdit, obj);

        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.showValidationErrors = false;
        if (this.isGeneralEditor) {
            if (this.isNew) {
                this.alertService.showMessage("Thành công", `Thực hiện thêm mới thành công`, MessageSeverity.success);
            }
            else
                this.alertService.showMessage("Thành công", `Thực hiện thay đổi thông tin thành công`, MessageSeverity.success);
        }
        this.DonViEdit = new DonVi();
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

    editDonVi(obj: DonVi) {
        if (obj) {
            this.gvService.getDonViByID(obj.maDonViCha).subscribe(result => {
                if (result.tenDonVi !== undefined) {
                    this.textDropDVC = result.tenDonVi;
                }
                else {
                    this.textDropDVC = "-- Chọn đơn vị cha --";
                }

                this.donvichaId = result;
                this.donvichaExist = result;
                this.selectedKeys = [result.tenDonVi];
            }, error => this.onCurrentUserDataLoadFailed(error));
            this.isShowDropdown = false;
            this.disabledKeys = [obj.tenDonVi];
            this.isGeneralEditor = true;
            this.isNew = false;
            this.nameDonVibefoEdit = obj.tenDonVi;
            this.loadImgList(obj.donViId);
            this.DonViEdit = new DonVi();
            this.isStatusEditChange = obj.trangThai;
            Object.assign(this.DonViEdit, obj);
            this.edit();

            return this.DonViEdit;
        }
        else {
            return this.newDonVi();
        }
    }

    private edit() {
        if (!this.isGeneralEditor || !this.DonViEdit) {
            this.DonViEdit = new DonVi();
        }
        this.isEditMode = true;
        this.showValidationErrors = true;
    }

    private close() {
        this.DonViEdit = new DonVi();
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
    private onTenDonViChange(ten: string) {
        if (ten != null) {
            if (ten.length < 1) {
                this.isExitsItems = false;
            }
        }
    }
}
