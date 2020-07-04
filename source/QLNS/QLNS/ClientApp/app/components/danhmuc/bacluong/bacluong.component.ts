import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { BacLuongService } from "../../../services/bacluong.service";
import { BacLuong } from "../../../models/bacluong.model";
import { BacLuongInfoComponent } from "./bacluong-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, State, process } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: "bacluong",
    templateUrl: "./bacluong.component.html",
    styleUrls: ["./bacluong.component.css"]
})

export class BacLuongComponent implements OnInit, AfterViewInit {
    public randomString: string = Utilities.RandomText(10);
    //Confirm info
    public popoverTitle: string = 'Bạn chắc chắn muốn xóa dữ liệu?';
    public popoverMessage: string = '';
    public popoverTitleStatus: string = 'Kích hoạt bản ghi';
    public cancelClicked: boolean = false;
    confirmText: string = '<i class="glyphicon glyphicon-ok"></i> Có';
    cancelText: string = '<i class="glyphicon glyphicon-remove"></i> Không';
    //Grid info
    public gridView: GridDataResult;
    public pageSize = 10;
    public skip = 0;
    private data: Object[];
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
        field: 'bacLuongId',
        dir: 'desc'
    }];

    public mySelection: number[] = [];
    public selectAllState: SelectAllCheckboxState = 'unchecked';
    private BacLuongEdit: BacLuong = new BacLuong();
    rows: BacLuong[] = [];
    rowsCache: BacLuong[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    bacluongEdit: BacLuong;
    sourcebacluong: BacLuong;
    searchValue: string;

    @ViewChild('f')
    private form;


    @ViewChild('bacluongEditor')
    BacLuongEditor: BacLuongInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private bacluongService: BacLuongService, public intl: IntlService) {
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
        this.BacLuongEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.BacLuongEditor.editorModal.hide();
        };

        this.BacLuongEditor.changesCancelledCallback = () => {
            this.bacluongEdit = null;
            this.sourcebacluong = null;
            this.BacLuongEditor.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcebacluong) {
            Object.assign(this.sourcebacluong, this.bacluongEdit);
            this.bacluongEdit = null;
            this.sourcebacluong = null;
        }
        else {
            let objBacLuong = new BacLuong();
            Object.assign(objBacLuong, this.bacluongEdit);
            this.bacluongEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objBacLuong).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objBacLuong);
            this.rows.splice(0, 0, objBacLuong);
            this.gridData = process(this.rows, this.state);
            this.onSearchChanged(this.searchValue);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.bacluongService.getAllBacLuong().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: BacLuong[]) {
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
            this.mySelection = this.rows.map((item) => item.bacLuongId);
            this.selectAllState = 'checked';
        } else {
            this.mySelection = [];
            this.selectAllState = 'unchecked';
        }

    }



    newBacLuong() {
        this.sourcebacluong = null;
        this.bacluongEdit = this.BacLuongEditor.newBacLuong();

        this.BacLuongEditor.editorModal.show();
    }

    SelectedValue(value: number) {
        this.pageSize = value;
        this.gridData = process(this.rows, this.state);
    }

    onSearchChanged(value: string) {
        this.searchValue = value;
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.bacLuongId, r.tenBacLuong));
        this.gridView = {
            data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
            total: this.rows.length
        };
    }

    deleteMoreBacLuong() {
        if (this.mySelection.length > 0) {
            this.deleteMoreHelper(this.mySelection);
        }
        else {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage("Chú ý", `Không có bản ghi nào được chọn`, MessageSeverity.warn);
        }
    }

    deleteBacLuong(row: BacLuong) {
        this.deleteHelper(row);
    }


    deleteMoreHelper(listId: number[]) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.bacluongService.deleteMoreBacLuong(listId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                for (var i = 0; i < results.length; i++) {
                    this.rowsCache = this.rowsCache.filter(item => item.bacLuongId !== results[i].bacLuongId);
                    this.rows = this.rows.filter(item => item.bacLuongId !== results[i].bacLuongId);
                }
                this.gridView = {
                    data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
                    total: this.rows.length
                };
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }


    deleteHelper(row: BacLuong) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
        this.bacluongService.deleteBacLuong(row.bacLuongId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.gridView = {
                    data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
                    total: this.rows.length
                };
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }

    editBacLuong(row: BacLuong) {
        this.sourcebacluong = row;
        this.bacluongEdit = this.BacLuongEditor.editBacLuong(row);
        this.BacLuongEditor.editorModal.show();
    }

    private saveSuccessHelper(obj?: BacLuong) {
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
