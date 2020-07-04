import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { LogService } from "../../services/log.service";
import { Log } from "../../models/log.model";
import { LogInfoComponent } from "./log-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, process, State } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: "log",
    templateUrl: "./log.component.html",
    styleUrls: ["./log.component.css"]
})

export class LogComponent implements OnInit, AfterViewInit {
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
    private data: Object[];
    public allowUnsort = true;
    public sort: SortDescriptor[] = [];

    public mySelection: number[] = [];
    public selectAllState: SelectAllCheckboxState = 'unchecked';
    private LogEdit: Log = new Log();
    rows: Log[] = [];
    rowsCache: Log[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    logEdit: Log;
    sourcelog: Log;
    searchValue: string;

    @ViewChild('f')
    private form;


    //@ViewChild('logEditor')
    //LogEditor: LogInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private logService: LogService, public intl: IntlService) {
        
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
        //this.LogEditor.changesSavedCallback = () => {
        //    this.addNewToList();
        //    this.LogEditor.editorModal.hide();
        //};

        //this.LogEditor.changesCancelledCallback = () => {
        //    this.logEdit = null;
        //    this.sourcelog = null;
        //    this.LogEditor.editorModal.hide();
        //};
    }

    addNewToList() {
        if (this.sourcelog) {
            Object.assign(this.sourcelog, this.logEdit);
            this.logEdit = null;
            this.sourcelog = null;
        }
        else {
            let objLog = new Log();
            Object.assign(objLog, this.logEdit);
            this.logEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objLog).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objLog);
            this.rows.splice(0, 0, objLog);
            this.onSearchChanged(this.searchValue);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.logService.getAllLog().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: Log[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });
        this.gridData = process(obj, this.state);
        this.rowsCache = [...obj];
        this.rows = obj;
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
            this.mySelection = this.rows.map((item) => item.logID);
            this.selectAllState = 'checked';
        } else {
            this.mySelection = [];
            this.selectAllState = 'unchecked';
        }

    }

    SelectedValue(value: number) {
        this.pageSize = value; 
        this.gridData = process(this.rows, this.state);
    }

    onSearchChanged(value: string) {
        this.state.skip = 0;
        this.searchValue = value;
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.logID, r.tenModule, r.hanhDong, r.noiDung));
        this.gridData = process(this.rows, this.state);
    }

    deleteMoreLog() {
        if (this.mySelection.length > 0) {
            this.deleteMoreHelper(this.mySelection);
        }
        else {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage("Chú ý", `Không có bản ghi nào được chọn`, MessageSeverity.warn);
        }
    }

    deleteLog(row: Log) {
        this.deleteHelper(row);
    }


    deleteMoreHelper(listId: number[]) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;

        this.logService.deleteMoreLog(listId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                for (var i = 0; i < results.length; i++) {
                    this.rowsCache = this.rowsCache.filter(item => item.logID !== results[i].logID);
                    this.rows = this.rows.filter(item => item.logID !== results[i].logID);
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


    deleteHelper(row: Log) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
        this.logService.deleteLog(row.logID)
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

    private saveFailedHelper(error: any) {
        this.alertService.showStickyMessage("Update lỗi", "Không thể update bản ghi này do:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private refreshData() {
        this.loadData();
        this.state.skip = 0;
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage("Thành công", `Dữ liệu đã được làm mới`, MessageSeverity.info);
    }
}
