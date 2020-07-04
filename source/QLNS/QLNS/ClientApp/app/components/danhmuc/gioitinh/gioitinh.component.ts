import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { GioiTinhService } from "../../../services/gioitinh.service";
import { GioiTinh } from "../../../models/gioitinh.model";
import { GioiTinhInfoComponent } from "./gioitinh-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
  selector: "gioitinh",
  templateUrl: "./gioitinh.component.html",
  styleUrls: ["./gioitinh.component.css"]
})

export class GioiTinhComponent implements OnInit, AfterViewInit {
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
    field: 'gioiTinhId',
    dir: 'desc'
  }];

  public mySelection: number[] = [];
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  private GioiTinhEdit: GioiTinh = new GioiTinh();
  rows: GioiTinh[] = [];
  rowsCache: GioiTinh[] = [];
  loadingIndicator: boolean;
  public formResetToggle = true;
  gioitinhEdit: GioiTinh;
  sourcegioitinh: GioiTinh;
  searchValue: string;

  @ViewChild('f')
  private form;


  @ViewChild('gioitinhEditor')
  GioiTinhEditor: GioiTinhInfoComponent;
  constructor(private alertService: AlertService, private translationService: AppTranslationService, private gioitinhService: GioiTinhService, public intl: IntlService) {
    this.loadItems();
  }

  //Grid 

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
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
    this.GioiTinhEditor.changesSavedCallback = () => {
      this.addNewToList();
      this.GioiTinhEditor.editorModal.hide();
    };

    this.GioiTinhEditor.changesCancelledCallback = () => {
      this.gioitinhEdit = null;
      this.sourcegioitinh = null;
      this.GioiTinhEditor.editorModal.hide();
    };
  }

  addNewToList() {
    if (this.sourcegioitinh) {
      Object.assign(this.sourcegioitinh, this.gioitinhEdit);
      this.gioitinhEdit = null;
      this.sourcegioitinh = null;
    }
    else {
      let objGioiTinh = new GioiTinh();
      Object.assign(objGioiTinh, this.gioitinhEdit);
      this.gioitinhEdit = null;

      let maxIndex = 0;
      for (let u of this.rowsCache) {
        if ((<any>u).index > maxIndex)
          maxIndex = (<any>u).index;
      }

      (<any>objGioiTinh).index = maxIndex + 1;

      this.rowsCache.splice(0, 0, objGioiTinh);
      this.rows.splice(0, 0, objGioiTinh);
      this.loadItems();
      this.onSearchChanged(this.searchValue);
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.gioitinhService.getAllGioiTinh().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
  }

  onDataLoadSuccessful(obj: GioiTinh[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    obj.forEach((item, index, obj) => {
      (<any>item).index = index + 1;
    });

    this.rowsCache = [...obj];
    this.rows = obj;
    this.loadItems();
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
      this.mySelection = this.rows.map((item) => item.gioiTinhId);
      this.selectAllState = 'checked';
    } else {
      this.mySelection = [];
      this.selectAllState = 'unchecked';
    }

  }



  newGioiTinh() {    
    this.sourcegioitinh = null;
    this.gioitinhEdit = this.GioiTinhEditor.newGioiTinh();

    this.GioiTinhEditor.editorModal.show();
    }

  SelectedValue(value: number) {
    this.pageSize = value;
    this.loadItems();
  }

  onSearchChanged(value: string) {
    this.searchValue = value;
    this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.gioiTinhId, r.tenGioiTinh));
    this.gridView = {
      data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
      total: this.rows.length
    };
  }

  deleteMoreGioiTinh() {
    if (this.mySelection.length > 0) {
      this.deleteMoreHelper(this.mySelection);
    }
    else {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      this.alertService.showMessage("Chú ý", `Không có bản ghi nào được chọn`, MessageSeverity.warn);
    }
  }

  deleteGioiTinh(row: GioiTinh) {
    this.deleteHelper(row);
  }


  deleteMoreHelper(listId: number[]) {
    this.alertService.startLoadingMessage("Đang thực hiện xóa...");
    this.loadingIndicator = true;

    this.gioitinhService.deleteMoreGioiTinh(listId)
      .subscribe(results => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        for (var i = 0; i < results.length; i++) {
          this.rowsCache = this.rowsCache.filter(item => item.gioiTinhId !== results[i].gioiTinhId);
          this.rows = this.rows.filter(item => item.gioiTinhId !== results[i].gioiTinhId);
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


  deleteHelper(row: GioiTinh) {
    this.alertService.startLoadingMessage("Đang thực hiện xóa...");
    this.loadingIndicator = true;    
    this.gioitinhService.deleteGioiTinh(row.gioiTinhId)
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

  editGioiTinh(row: GioiTinh) {    
    this.sourcegioitinh = row;
    this.gioitinhEdit = this.GioiTinhEditor.editGioiTinh(row);
    this.GioiTinhEditor.editorModal.show();
    }

  private saveSuccessHelper(obj?: GioiTinh) {
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
