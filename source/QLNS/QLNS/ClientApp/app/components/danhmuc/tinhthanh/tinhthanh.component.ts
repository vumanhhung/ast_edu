import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { TinhThanhService } from "../../../services/tinhthanh.service";
import { TinhThanh } from "../../../models/tinhthanh.model";
import { TinhThanhInfoComponent } from "./tinhthanh-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, State, process } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { QuanHuyenService } from '../../../services/quanhuyen.service';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: "tinhthanh",
    templateUrl: "./tinhthanh.component.html",
    styleUrls: ["./tinhthanh.component.css"]
})

export class TinhThanhComponent implements OnInit, AfterViewInit {
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
        field: 'tinhThanhId',
        dir: 'desc'
    }];

    public mySelection: number[] = [];
    public selectAllState: SelectAllCheckboxState = 'unchecked';
    private TinhThanhEdit: TinhThanh = new TinhThanh();
    rows: TinhThanh[] = [];
    rowsCache: TinhThanh[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    tinhthanhEdit: TinhThanh;
    sourcetinhthanh: TinhThanh;
    searchValue: string;

    @ViewChild('f')
    private form;


    @ViewChild('tinhthanhEditor')
    TinhThanhEditor: TinhThanhInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private tinhthanhService: TinhThanhService, private quanhuyenService: QuanHuyenService, public intl: IntlService) {
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
        this.TinhThanhEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.TinhThanhEditor.editorModal.hide();
        };

        this.TinhThanhEditor.changesCancelledCallback = () => {
            this.tinhthanhEdit = null;
            this.sourcetinhthanh = null;
            this.TinhThanhEditor.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcetinhthanh) {
            Object.assign(this.sourcetinhthanh, this.tinhthanhEdit);
            this.tinhthanhEdit = null;
            this.sourcetinhthanh = null;
        }
        else {
            let objTinhThanh = new TinhThanh();
            Object.assign(objTinhThanh, this.tinhthanhEdit);
            this.tinhthanhEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objTinhThanh).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objTinhThanh);
            this.rows.splice(0, 0, objTinhThanh);
            this.gridData = process(this.rows, this.state);
            
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.tinhthanhService.getAllTinhThanh().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: TinhThanh[]) {
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
            this.mySelection = this.rows.map((item) => item.tinhThanhId);
            this.selectAllState = 'checked';
        } else {
            this.mySelection = [];
            this.selectAllState = 'unchecked';
        }

    }



    newTinhThanh() {
        this.sourcetinhthanh = null;
        this.tinhthanhEdit = this.TinhThanhEditor.newTinhThanh();
        this.tinhthanhService.getMaxViTri().subscribe(results => {
            if (results) {
                this.tinhthanhEdit.viTri = results.viTri + 1;
            }
            else {
                this.tinhthanhEdit.viTri = 0
            } }, error => this.onDataLoadFailed(error));

        this.TinhThanhEditor.editorModal.show();
    }
    public ChangepopoverTitleStatus(row: TinhThanh) {
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
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.tenTinhThanh));
        this.gridData = process(this.rows, this.state);
    }

    deleteMoreTinhThanh() {
        if (this.mySelection.length > 0) {
            var list = [];
            var where = "";
            this.quanhuyenService.getItems(0, 0, "TinhThanhId in (" + this.mySelection.toString() + ")", "x").subscribe(results => {
                for (var i = 0; i < this.mySelection.length; i++) {
                    var rows = results.filter(r => r.tinhThanhId == this.mySelection[i]);
                    if (rows.length == 0) {
                        list.push(this.mySelection[i]);
                    } else {
                        where += this.rowsCache.find(r => r.tinhThanhId == this.mySelection[i]).tenTinhThanh + ",";
                    }
                }
                this.deleteMoreHelper(list);
                if (where.length > 0) {
                    this.alertService.showMessage("Chú ý", `Tỉnh thành:` + where.substr(0, where.length -1) + ` có dữ liệu liên kết, không thể xóa !`, MessageSeverity.warn);
                }
            })
        }
        else {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage("Chú ý", `Không có bản ghi nào được chọn`, MessageSeverity.warn);
        }
    }

    deleteTinhThanh(row: TinhThanh) {
        this.quanhuyenService.checkExitsTinhThanh(row.tinhThanhId).subscribe(results => {
            if (results.length == 0) {
                this.deleteHelper(row);
            } else {
                this.alertService.showMessage("Chú ý", `Tỉnh thành có dữ liệu liên kết, không thể xóa !`, MessageSeverity.warn);
            }
        })
    }


    deleteMoreHelper(listId: number[]) {
        console.log(listId);
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.tinhthanhService.deleteMoreTinhThanh(listId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                for (var i = 0; i < results.length; i++) {
                    this.rowsCache = this.rowsCache.filter(item => item.tinhThanhId !== results[i].tinhThanhId);
                    this.rows = this.rows.filter(item => item.tinhThanhId !== results[i].tinhThanhId);
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


    deleteHelper(row: TinhThanh) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
        this.tinhthanhService.deleteTinhThanh(row.tinhThanhId)
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

    editTinhThanh(row: TinhThanh) {
        this.sourcetinhthanh = row;
        this.tinhthanhEdit = this.TinhThanhEditor.editTinhThanh(row);
        this.TinhThanhEditor.editorModal.show();
    }
    UpdateStatus(row: TinhThanh) {
        if (row.trangThai == true) {
            row.trangThai = false;
        }
        else {
            row.trangThai = true;
        }
        this.tinhthanhService.updateTinhThanh(row.tinhThanhId, row).subscribe(response => this.saveSuccessHelper(row), error => this.saveFailedHelper(error));
    }
    private saveSuccessHelper(obj?: TinhThanh) {
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
