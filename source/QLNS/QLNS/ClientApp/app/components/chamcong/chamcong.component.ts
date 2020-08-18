import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";
import { ChamCongService } from "../../services/chamcong.service";
import { ChamCong } from "../../models/chamcong.model";
import { ChamCongInfoComponent } from "./chamcong-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, State, process } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: "chamcong",
    templateUrl: "./chamcong.component.html",
    styleUrls: ["./chamcong.component.css"]
})

export class ChamCongComponent implements OnInit, AfterViewInit {
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
        field: 'chamCongId',
        dir: 'desc'
    }];

    public mySelection: number[] = [];
    public selectAllState: SelectAllCheckboxState = 'unchecked';
    private ChamCongEdit: ChamCong = new ChamCong();
    rows: ChamCong[] = [];
    rowsCache: ChamCong[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    chamcongEdit: ChamCong;
    sourcechamcong: ChamCong;
    searchValue: string;

    @ViewChild('f')
    private form;

    constructor(private alertService: AlertService, private translationService: AppTranslationService, private chamcongService: ChamCongService, public intl: IntlService) {
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
        //this.ChamCongEditor.changesSavedCallback = () => {
        //    this.addNewToList();
        //    this.ChamCongEditor.editorModal.hide();
        //};

        //this.ChamCongEditor.changesCancelledCallback = () => {
        //    this.chamcongEdit = null;
        //    this.sourcechamcong = null;
        //    this.ChamCongEditor.editorModal.hide();
        //};
    }

    addNewToList() {
        if (this.sourcechamcong) {
            Object.assign(this.sourcechamcong, this.chamcongEdit);
            this.chamcongEdit = null;
            this.sourcechamcong = null;
        }
        else {
            let objChamCong = new ChamCong();
            Object.assign(objChamCong, this.chamcongEdit);
            this.chamcongEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objChamCong).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objChamCong);
            this.rows.splice(0, 0, objChamCong);
            this.gridData = process(this.rows, this.state);
            this.onSearchChanged(this.searchValue);
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.chamcongService.getAllChamCong().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(obj: ChamCong[]) {
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
            this.mySelection = this.rows.map((item) => item.chamCongId);
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
        this.searchValue = value;
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.chamCongId, r.tenHinhAnh));
        this.gridData = process(this.rows, this.state);
    }

    private saveSuccessHelper(obj?: ChamCong) {
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
