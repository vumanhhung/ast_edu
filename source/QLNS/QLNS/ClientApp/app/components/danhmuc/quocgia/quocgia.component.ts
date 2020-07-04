import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { Utilities } from "../../../services/utilities";
import { QuocGiaService } from "../../../services/quocgia.service";
import { QuocGia } from "../../../models/quocgia.model";
import { QuocGiaInfoComponent } from "./quocgia-info.component";
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
  selector: "quocgia",
  templateUrl: "./quocgia.component.html",
  styleUrls: ["./quocgia.component.css"]
})

export class QuocGiaComponent implements OnInit, AfterViewInit {
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
    field: 'quocGiaId',
    dir: 'desc'
  }];

  public mySelection: number[] = [];
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  private QuocGiaEdit: QuocGia = new QuocGia();
  rows: QuocGia[] = [];
  rowsCache: QuocGia[] = [];
  loadingIndicator: boolean;
  public formResetToggle = true;
  quocgiaEdit: QuocGia;
  sourcequocgia: QuocGia;
  searchValue: string;

  @ViewChild('f')
  private form;


  @ViewChild('quocgiaEditor')
  QuocGiaEditor: QuocGiaInfoComponent;
  constructor(private alertService: AlertService, private translationService: AppTranslationService, private quocgiaService: QuocGiaService, public intl: IntlService) {
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
    this.QuocGiaEditor.changesSavedCallback = () => {
      this.addNewToList();
      this.QuocGiaEditor.editorModal.hide();
    };

    this.QuocGiaEditor.changesCancelledCallback = () => {
      this.quocgiaEdit = null;
      this.sourcequocgia = null;
      this.QuocGiaEditor.editorModal.hide();
    };
  }

  addNewToList() {
    if (this.sourcequocgia) {
      Object.assign(this.sourcequocgia, this.quocgiaEdit);
      this.quocgiaEdit = null;
      this.sourcequocgia = null;
    }
    else {
      let objQuocGia = new QuocGia();
      Object.assign(objQuocGia, this.quocgiaEdit);
      this.quocgiaEdit = null;

      let maxIndex = 0;
      for (let u of this.rowsCache) {
        if ((<any>u).index > maxIndex)
          maxIndex = (<any>u).index;
      }

      (<any>objQuocGia).index = maxIndex + 1;

      this.rowsCache.splice(0, 0, objQuocGia);
      this.rows.splice(0, 0, objQuocGia);
      this.loadItems();
      this.onSearchChanged(this.searchValue);
    }
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.quocgiaService.getAllQuocGia().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
  }

  onDataLoadSuccessful(obj: QuocGia[]) {
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
      this.mySelection = this.rows.map((item) => item.quocGiaId);
      this.selectAllState = 'checked';
    } else {
      this.mySelection = [];
      this.selectAllState = 'unchecked';
    }

  }



  newQuocGia() {    
    this.sourcequocgia = null;
    this.quocgiaEdit = this.QuocGiaEditor.newQuocGia();

    this.QuocGiaEditor.editorModal.show();
    }

  SelectedValue(value: number) {
    this.pageSize = value;
    this.loadItems();
  }

  onSearchChanged(value: string) {
    this.searchValue = value;
    this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.quocGiaId, r.tenQuocGia));
    this.gridView = {
      data: orderBy(this.rows.slice(this.skip, this.skip + this.pageSize), this.sort),
      total: this.rows.length
    };
  }

  deleteMoreQuocGia() {
    if (this.mySelection.length > 0) {
      this.deleteMoreHelper(this.mySelection);
    }
    else {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      this.alertService.showMessage("Chú ý", `Không có bản ghi nào được chọn`, MessageSeverity.warn);
    }
  }

  deleteQuocGia(row: QuocGia) {
    this.deleteHelper(row);
  }


  deleteMoreHelper(listId: number[]) {
    this.alertService.startLoadingMessage("Đang thực hiện xóa...");
    this.loadingIndicator = true;

    this.quocgiaService.deleteMoreQuocGia(listId)
      .subscribe(results => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        for (var i = 0; i < results.length; i++) {
          this.rowsCache = this.rowsCache.filter(item => item.quocGiaId !== results[i].quocGiaId);
          this.rows = this.rows.filter(item => item.quocGiaId !== results[i].quocGiaId);
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


  deleteHelper(row: QuocGia) {
    this.alertService.startLoadingMessage("Đang thực hiện xóa...");
    this.loadingIndicator = true;    
    this.quocgiaService.deleteQuocGia(row.quocGiaId)
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

  editQuocGia(row: QuocGia) {    
    this.sourcequocgia = row;
    this.quocgiaEdit = this.QuocGiaEditor.editQuocGia(row);
    this.QuocGiaEditor.editorModal.show();
    }

  private saveSuccessHelper(obj?: QuocGia) {
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
