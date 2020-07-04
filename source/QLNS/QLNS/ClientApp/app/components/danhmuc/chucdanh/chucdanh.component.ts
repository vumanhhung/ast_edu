import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { ChucDanhService } from "../../../services/chucdanh.service";
import { ChucDanh } from "../../../models/chucdanh.model";
import { ChucDanhInfoComponent } from "./chucdanh-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, State, process } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: "chucdanh",
    templateUrl: "./chucdanh.component.html",
    styleUrls: ["./chucdanh.component.css"]
})

export class ChucDanhComponent implements OnInit, AfterViewInit {
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
        field: 'chucDanhId',
        dir: 'desc'
    }];

    public mySelection: number[] = [];
    public selectAllState: SelectAllCheckboxState = 'unchecked';
    private ChucDanhEdit: ChucDanh = new ChucDanh();
    rows: ChucDanh[] = [];
    rowsCache: ChucDanh[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    chucdanhEdit: ChucDanh;
    sourcechucdanh: ChucDanh;
    searchValue: string;

    @ViewChild('f')
    private form;


    @ViewChild('chucdanhEditor')
    ChucDanhEditor: ChucDanhInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private chucdanhService: ChucDanhService, public intl: IntlService) {
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
        this.ChucDanhEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.ChucDanhEditor.editorModal.hide();
        };

        this.ChucDanhEditor.changesCancelledCallback = () => {
            this.chucdanhEdit = null;
            this.sourcechucdanh = null;
            this.ChucDanhEditor.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcechucdanh) {
            Object.assign(this.sourcechucdanh, this.chucdanhEdit);
            this.chucdanhEdit = null;
            this.sourcechucdanh = null;
        }
        else {
            let objChucDanh = new ChucDanh();
            Object.assign(objChucDanh, this.chucdanhEdit);
            this.chucdanhEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objChucDanh).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objChucDanh);
            this.rows.splice(0, 0, objChucDanh);
            this.gridData = process(this.rows, this.state);
            
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.chucdanhService.getAllChucDanh().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: ChucDanh[]) {
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
            this.mySelection = this.rows.map((item) => item.chucDanhId);
            this.selectAllState = 'checked';
        } else {
            this.mySelection = [];
            this.selectAllState = 'unchecked';
        }

    }



    newChucDanh() {
        this.sourcechucdanh = null;
        this.chucdanhEdit = this.ChucDanhEditor.newChucDanh();
        this.chucdanhService.getMaxViTri().subscribe(results => {
            if (results) {
                this.chucdanhEdit.viTri = results.viTri + 1;
            }
            else {
                this.chucdanhEdit.viTri = 0
            }
        }, error => this.onDataLoadFailed(error));

        this.ChucDanhEditor.editorModal.show();
    }
    public ChangepopoverTitleStatus(row: ChucDanh) {
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
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.tenChucDanh, r.dienGiai));
        this.gridData = process(this.rows, this.state);
    }

    deleteMoreChucDanh() {
        if (this.mySelection.length > 0) {
            this.deleteMoreHelper(this.mySelection);
        }
        else {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage("Chú ý", `Không có bản ghi nào được chọn`, MessageSeverity.warn);
        }
    }

    deleteChucDanh(row: ChucDanh) {
        this.deleteHelper(row);
    }


    deleteMoreHelper(listId: number[]) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.chucdanhService.deleteMoreChucDanh(listId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                for (var i = 0; i < results.length; i++) {
                    this.rowsCache = this.rowsCache.filter(item => item.chucDanhId !== results[i].chucDanhId);
                    this.rows = this.rows.filter(item => item.chucDanhId !== results[i].chucDanhId);
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


    deleteHelper(row: ChucDanh) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
        this.chucdanhService.deleteChucDanh(row.chucDanhId)
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

    editChucDanh(row: ChucDanh) {
        this.sourcechucdanh = row;
        this.chucdanhEdit = this.ChucDanhEditor.editChucDanh(row);
        this.ChucDanhEditor.editorModal.show();
    }
    UpdateStatus(row: ChucDanh) {
        if (row.trangThai == true) {
            row.trangThai = false;
        }
        else {
            row.trangThai = true;
        }
        this.chucdanhService.updateChucDanh(row.chucDanhId, row).subscribe(response => this.saveSuccessHelper(row), error => this.saveFailedHelper(error));
    }
    private saveSuccessHelper(obj?: ChucDanh) {
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
