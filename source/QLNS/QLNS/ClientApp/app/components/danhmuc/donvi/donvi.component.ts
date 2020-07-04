import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DonViInfoComponent } from "./donvi-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { Utilities } from '../../../services/utilities';
import { DonVi } from '../../../models/donvi.model';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from '../../../services/app-translation.service';
import { DonViService } from '../../../services/donvi.service';
import { Permission } from '../../../models/permission.model';
import { AccountService } from '../../../services/account.service';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: "donvi",
    templateUrl: "./donvi.component.html",
    styleUrls: ["./donvi.component.css"]
})

export class DonViComponent implements OnInit, AfterViewInit {
    static srcDataImg: any;
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
    public randomString: string = Utilities.RandomText(10);
    //Confirm info
    public popoverTitle: string = 'Bạn chắc chắn muốn xóa?';
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
        field: 'donViId',
        dir: 'desc'
    }];

    public mySelection: number[] = [];
    public selectAllState: SelectAllCheckboxState = 'unchecked';
    private DonViEdit: DonVi = new DonVi();
    rows: DonVi[] = [];
    rowsCache: DonVi[] = [];
    loadingIndicator: boolean;
    public formResetToggle = true;
    donviEdit: DonVi;
    sourcedonvi: DonVi;
    searchValue: string;

    @ViewChild('f')
    private form;

    @Input() customTemplate: TemplateRef<any>;
    @Input() appendToBody: boolean = false;


    @ViewChild('donviEditor')
    DonViEditor: DonViInfoComponent;
    constructor(private alertService: AlertService, private translationService: AppTranslationService, private donviService: DonViService, public intl: IntlService, private accountService: AccountService) {
        //this.loadItems();
    }

    //Grid 

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadItems();
    }


    openDonVi() {
        for (var i = 0; i < this.rows.length; i++) {
            this.expandedKeys.push(i.toString());
            if (this.rows[i]["items"] != null) {
                this.expandChild(i.toString(), this.rows[i]);
            }
        }
    }

    closeDonVi() {
        this.expandedKeys = [];
    }

    expandChild(nameP: string, pItem: DonVi) {
        for (var i = 0; i < pItem["items"].length; i++) {
            this.expandedKeys.push(nameP + "_" + i.toString());
            if (pItem["items"][i].items != null) {
                this.expandChild(nameP + "_" + i.toString(), pItem["items"][i]);
            }
        }
    }

    nonActiveItem(dataItem: DonVi) {
        alert(dataItem.donViId)
    }
    ActiveItem(dataItem: DonVi) {
        alert(dataItem.donViId)
    }

    private loadItems(): void {
        this.gridView = {
            data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
            total: this.rows.length
        };
    }
    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.loadItems();
    }


    ngOnInit() {
        let gT = (key: string) => this.translationService.getTranslation(key);
        this.loadData();
    }

    ngAfterViewInit() {
        this.DonViEditor.changesSavedCallback = () => {
            this.addNewToList();
            this.DonViEditor.editorModal.hide();
        };

        this.DonViEditor.changesCancelledCallback = () => {
            this.donviEdit = null;
            this.sourcedonvi = null;
            this.DonViEditor.editorModal.hide();
        };
    }

    addNewToList() {
        if (this.sourcedonvi) {
            Object.assign(this.sourcedonvi, this.donviEdit);
            this.donviEdit = null;
            this.sourcedonvi = null;
        }
        else {
            let objDonVi = new DonVi();
            Object.assign(objDonVi, this.donviEdit);
            this.donviEdit = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>objDonVi).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, objDonVi);
            this.rows.splice(0, 0, objDonVi);
           
        }

        this.loadData();
        this.loadItems();
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.donviService.getAllDonVi().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
    }



    onDataLoadSuccessful(obj: DonVi[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        obj.forEach((item, index, obj) => {
            (<any>item).index = index + 1;
        });

        this.rowsCache = [...obj];
        this.rows = obj;
        this.openDonVi();
        //this.loadItems();
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
            this.mySelection = this.rows.map((item) => item.donViId);
            this.selectAllState = 'checked';
        } else {
            this.mySelection = [];
            this.selectAllState = 'unchecked';
        }

    }

    newDonVi() {
        this.DonViEditor.donvi = this.rows;
        this.donviEdit = this.DonViEditor.newDonVi();
        this.DonViEditor.editorModal.show();
    }
    public ChangepopoverTitleStatus(row: DonVi) {
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
        this.loadItems();
    }



    deleteDonVi(row: DonVi) {
        this.deleteHelper(row);
    }

    deleteHelper(row: DonVi) {
        this.alertService.startLoadingMessage("Đang thực hiện xóa...");
        this.loadingIndicator = true;
        this.donviService.deleteDonVi(row.donViId)
            .subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
                this.loadData();
                this.alertService.showMessage("Thành công", `Thực hiện xóa thành công`, MessageSeverity.success);
            },
                error => {
                    this.alertService.stopLoadingMessage();
                    this.loadingIndicator = false;
                    this.alertService.showStickyMessage("Xóa lỗi", `Đã xảy ra lỗi khi xóa.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
                        MessageSeverity.error, error);
                });
    }

    editDonVi(row: DonVi) {
        this.sourcedonvi = row;
        this.DonViEditor.donvi = this.rows.filter((item) => item.donViId !== row.donViId);
        this.DonViEditor.donvi = this.rows.filter(item => item.maDonViCha !== row.donViId);

        this.DonViEditor.donvi = this.rows.filter(item => item.donViId !== row.donViId);
        this.DonViEditor.donvi = this.rows.filter(item => item.maDonViCha !== row.donViId);
        this.donviEdit = this.DonViEditor.editDonVi(row);
        this.DonViEditor.editorModal.show();
    }

    UpdateStatus(row: DonVi) {
        if (row.trangThai == true) {
            row.trangThai = false;
        }
        else {
            row.trangThai = true;
        }

        this.donviService.updateDonVi(row.donViId, row).subscribe(response => this.saveSuccessHelper(row), error => this.saveFailedHelper(error));
    }

    private saveSuccessHelper(obj?: DonVi) {
        if (obj.trangThai == true) {
            this.popoverTitleStatus = "Kích hoạt bản ghi";
        }
        else {
            this.popoverTitleStatus = "Ngừng kích hoạt bản ghi";
        }

        this.alertService.stopLoadingMessage();
        this.alertService.showMessage("Thành công", `${this.popoverTitleStatus} thành công`, MessageSeverity.success);
        this.loadData();
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

    get canManageDonVi() {
        return this.accountService.userHasPermission(Permission.managedvPermission);
    }
}
