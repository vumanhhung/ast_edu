import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { QuanHuyenService } from "../../../services/quanhuyen.service";
import { QuanHuyen } from "../../../models/quanhuyen.model";
import { QuanHuyenInfoComponent } from "./quanhuyen-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, State, process } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: "quanhuyen",
    templateUrl: "./quanhuyen.component.html",
    styleUrls: ["./quanhuyen.component.css"]
})

export class QuanHuyenComponent implements OnInit, AfterViewInit {
    public randomString: string = Utilities.RandomText(10);
    //Confirm info
    public popoverTitle: string = 'Bạn chắc chắn muốn xóa dữ liệu?';
    public popoverMessage: string = '';
    public popoverTitleStatus: string = 'Kích hoạt bản ghi';
    public cancelClicked: boolean = false;
    confirmText: string = '<i class="glyphicon glyphicon-ok"></i> Có';
    cancelText: string = '<i class="glyphicon glyphicon-remove"></i> Không';
    //Grid info
    public pageSize = 10;
    public skip = 0;
    private data: Object[];
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
        field: 'quanHuyenId',
        dir: 'desc'
    }];

    public mySelection: number[] = [];
    public selectAllState: SelectAllCheckboxState = 'unchecked';
    private QuanHuyenEdit: QuanHuyen = new QuanHuyen();
    rows: QuanHuyen[] = [];
    rowsCache: QuanHuyen[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    quanhuyenEdit: QuanHuyen;
    sourcequanhuyen: QuanHuyen;
    searchValue: string;

    @ViewChild('f')
    private form;


    @ViewChild('quanhuyenEditor')
    QuanHuyenEditor: QuanHuyenInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private quanhuyenService: QuanHuyenService, public intl: IntlService) {
        this.gridData = process(this.rows, this.state);
    }

    //Grid 
    public state: State = {
        skip: 0,
        take: this.pageSize
    };

    public gridData: GridDataResult = process(this.rows, this.state);

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.rows, this.state);
    }

    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);
        this.loadData();
    }

    ngAfterViewInit() {
        this.QuanHuyenEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.QuanHuyenEditor.editorModal.hide();
        };

        this.QuanHuyenEditor.changesCancelledCallback = () => {
            this.quanhuyenEdit = null;
            this.sourcequanhuyen = null;
            this.QuanHuyenEditor.editorModal.hide();
        };
    }

    addNewToList() {
        this.loadData();
        if (this.sourcequanhuyen) {
            Object.assign(this.sourcequanhuyen, this.quanhuyenEdit);
            this.quanhuyenEdit = null;
            this.sourcequanhuyen = null;
        }
        else {
            let objQuanHuyen = new QuanHuyen();
            Object.assign(objQuanHuyen, this.quanhuyenEdit);
            this.quanhuyenEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objQuanHuyen).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objQuanHuyen);
            this.rows.splice(0, 0, objQuanHuyen);
            this.gridData = process(this.rows, this.state);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.quanhuyenService.getAllQuanHuyen().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: QuanHuyen[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
        this.gridData = process(this.rows, this.state);
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }


    public onSelectedKeysChange(e) {
        const len = this.mySelection.length;

        if (len === 0) {
            this.selectAllState = 'unchecked';
        } else if (len > 0 && len < this.rows.length) {
            this.selectAllState = 'indeterminate';
        } else {
            this.selectAllState = 'checked';
        }
    }

    public onSelectAllChange(checkedState: SelectAllCheckboxState) {
        if (checkedState === 'checked') {
            this.mySelection = this.rows.map((item) => item.quanHuyenId);
            this.selectAllState = 'checked';
        } else {
            this.mySelection = [];
            this.selectAllState = 'unchecked';
        }

    }



    newQuanHuyen() {
        this.sourcequanhuyen = null;
        this.quanhuyenEdit = this.QuanHuyenEditor.newQuanHuyen();
        this.quanhuyenService.getMaxViTri().subscribe(results => {
            if (results) {
                this.quanhuyenEdit.viTriHienThi = results.viTriHienThi + 1;
            }
            else {
                this.quanhuyenEdit.viTriHienThi = 0
            }
        }, error => this.onDataLoadFailed(error));

        this.QuanHuyenEditor.editorModal.show();
    }
    public ChangepopoverTitleStatus(row: QuanHuyen) {
        if (row.trangThai == false) {
            this.popoverTitleStatus = "Kích hoạt bản ghi";
        }
        else {
            this.popoverTitleStatus = "Ngừng kích hoạt bản ghi";
        }
        return this.popoverTitleStatus + "?";
    }

    SelectedValue(value: number) {
        this.pageSize = value;
        this.gridData = process(this.rows, this.state);
    }

    onSearchChanged(value: string) {
        this.searchValue = value;
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.tinhThanhs.tenTinhThanh, r.tenQuanHuyen));
        this.gridData = process(this.rows, this.state);
    }

    deleteMoreQuanHuyen() {
        if (this.mySelection.length > 0) {
            this.deleteMoreHelper(this.mySelection);
        }
        else {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage("Chú ý", `Không có bản ghi nào được chọn`, MessageSeverity.warn);
        }
    }

    deleteQuanHuyen(row: QuanHuyen) {
        this.deleteHelper(row);
    }


    deleteMoreHelper(listId: number[]) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.quanhuyenService.deleteMoreQuanHuyen(listId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                for (var i = 0; i < results.length; i++) {
                    this.rowsCache = this.rowsCache.filter(item => item.quanHuyenId !== results[i].quanHuyenId);
                    this.rows = this.rows.filter(item => item.quanHuyenId !== results[i].quanHuyenId);
                }
                this.gridData = process(this.rows, this.state);
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }


    deleteHelper(row: QuanHuyen) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
        this.quanhuyenService.deleteQuanHuyen(row.quanHuyenId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.gridData = process(this.rows, this.state);
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }

    editQuanHuyen(row: QuanHuyen) {
        this.sourcequanhuyen = row;
        this.quanhuyenEdit = this.QuanHuyenEditor.editQuanHuyen(row);
        this.QuanHuyenEditor.editorModal.show();
    }
    UpdateStatus(row: QuanHuyen) {
        if (row.trangThai == true) {
            row.trangThai = false;
        }
        else {
            row.trangThai = true;
        }
        this.quanhuyenService.updateQuanHuyen(row.quanHuyenId, row).subscribe(response => this.saveSuccessHelper(row), error => this.saveFailedHelper(error));
    }
    private saveSuccessHelper(obj?: QuanHuyen) {
        if (obj.trangThai == true) {
            this.popoverTitleStatus = "Kích hoạt bản ghi";
        }
        else {
            this.popoverTitleStatus = "Ngừng kích hoạt bản ghi";
        }
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage("Thành công", `${this.popoverTitleStatus} thành công`, MessageSeverity.success);
    }
    private saveFailedHelper(error: any) {
        this.alertService.showStickyMessage("Update lỗi", "Không thể update bản ghi này do:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private refreshData() {
        this.loadData();
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage("Thành công", `Dữ liệu đã được làm mới`, MessageSeverity.info);
    }
}
