// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { NgModule, ErrorHandler, LOCALE_ID } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { SparklineModule } from '@progress/kendo-angular-charts';
import { IntlModule } from '@progress/kendo-angular-intl';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angularx-qrcode';
import { StarRatingModule } from 'angular-star-rating';
import 'bootstrap';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
//import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';

import { EqualValidator } from './directives/equal-validator.directive';
import { LastElementDirective } from './directives/last-element.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapToggleDirective } from './directives/bootstrap-toggle.directive';
import { BootstrapSelectDirective } from './directives/bootstrap-select.directive';
import { BootstrapDatepickerDirective } from './directives/bootstrap-datepicker.directive';
import { GroupByPipe } from './pipes/group-by.pipe';

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

import { BannerDemoComponent } from "./components/controls/banner-demo.component";
//import { TodoDemoComponent } from "./components/controls/todo-demo.component";
//import { StatisticsDemoComponent } from "./components/controls/statistics-demo.component";
import { NotificationsViewerComponent } from "./components/controls/notifications-viewer.component";
import { SearchBoxComponent } from "./components/controls/search-box.component";
import { UserInfoComponent } from "./components/controls/user-info.component";
import { UserPreferencesComponent } from "./components/controls/user-preferences.component";
import { UsersManagementComponent } from "./components/controls/users-management.component";
import { RolesManagementComponent } from "./components/controls/roles-management.component";
import { RoleEditorComponent } from "./components/controls/role-editor.component";
import { ListAppIconComponent } from "./components/listappicon/listappicon.component";
import { PopupModule } from "@progress/kendo-angular-popup";
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import '@progress/kendo-angular-intl/locales/vi/all';
import '@progress/kendo-angular-intl/locales/vi/calendar';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { DonViComponent } from "./components/danhmuc/donvi/donvi.component";
import { DonViInfoComponent } from "./components/danhmuc/donvi/donvi-info.component";
import { DonViService } from './services/donvi.service';
import { DonViEndpoint } from './services/donvi-endpoint.service';

import { TinhThanhComponent } from "./components/danhmuc/tinhthanh/tinhthanh.component";
import { TinhThanhInfoComponent } from "./components/danhmuc/tinhthanh/tinhthanh-info.component";
import { TinhThanhEndpoint } from "./services/tinhthanh-endpoint.service";
import { TinhThanhService } from "./services/tinhthanh.service";

import { RoleDonViComponent } from "./components/hethong/roledonvi.component";
import { RoleDonViService } from "./services/roledonvi.service";
import { RoleDonViEndpoint } from "./services/roledonvi-endpoint.service";
import { HeThongMenuComponent } from "./components/hethong/hethong-menu.component";

import { DanhMucComponent } from "./components/danhmuc/danhmuc.component";

import { FileUploadService } from './services/fileUpload.service';
import { FileUploadEnPoint } from './services/fileUpload-endpoint.service';
import { HoSoCaNhanComponent } from "./components/hethong/hosocanhan.component";
import { OnlyNumber } from "./components/controls/OnlyNumber";

import { LogComponent } from "./components/log/log.component";
import { LogEndpoint } from "./services/log-endpoint.service";
import { LogService } from "./services/log.service";

//Begin hungvm
import { ChucDanhComponent } from "./components/danhmuc/chucdanh/chucdanh.component";
import { ChucDanhInfoComponent } from "./components/danhmuc/chucdanh/chucdanh-info.component";
import { QuanHuyenComponent } from "./components/danhmuc/quanhuyen/quanhuyen.component";
import { QuanHuyenInfoComponent } from "./components/danhmuc/quanhuyen/quanhuyen-info.component";
import { ChucDanhEndpoint } from "./services/chucdanh-endpoint.service";
import { ChucDanhService } from "./services/chucdanh.service";
import { QuanHuyenEndpoint } from "./services/quanhuyen-endpoint.service";
import { QuanHuyenService } from "./services/quanhuyen.service";
//End hungvm

//Start tuyenlm
import { BaoCaoMenuComponent } from "./components/baocao/baocao-menu.component";
//End tuyenlm

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLanguageLoader
            }
        }),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'success', // set defaults here
            cancelButtonType: 'danger'
        }),
        NgxDatatableModule,
        ToastyModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        CarouselModule.forRoot(),
        ModalModule.forRoot(),
        IntlModule,
        ChartsModule,
        SparklineModule,
        GridModule,
        InputsModule,
        ExcelModule,
        PDFModule,
        TabStripModule,
        ButtonsModule,
        DatePickerModule,
        TimePickerModule,
        AngularDualListBoxModule,
        DropDownsModule,
        PDFExportModule,
        TreeViewModule,
        UploadModule,
        PopupModule,
        NgxBarcodeModule,
        QRCodeModule,
        StarRatingModule.forRoot()
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        SettingsComponent,
        UsersManagementComponent,
        UserInfoComponent,
        UserPreferencesComponent,
        RolesManagementComponent,
        RoleEditorComponent,
        AboutComponent,
        NotFoundComponent,
        NotificationsViewerComponent,
        SearchBoxComponent,
        BannerDemoComponent,
        EqualValidator,
        LastElementDirective,
        AutofocusDirective,
        BootstrapTabDirective,
        BootstrapToggleDirective,
        BootstrapSelectDirective,
        BootstrapDatepickerDirective,
        GroupByPipe,
        ListAppIconComponent,     
        DonViComponent,
        DonViInfoComponent,       
        RoleDonViComponent,
        HeThongMenuComponent,
        DanhMucComponent,        
        UserPreferencesComponent,        
        OnlyNumber,        
        LogComponent,
        HoSoCaNhanComponent,  
        TinhThanhComponent,
        TinhThanhInfoComponent, 
        ChucDanhComponent,
        ChucDanhInfoComponent,
        QuanHuyenComponent,
        QuanHuyenInfoComponent,
        ChucDanhComponent,
        ChucDanhInfoComponent,
        BaoCaoMenuComponent,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'vi-VN' },
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        { provide: ErrorHandler, useClass: AppErrorHandler },
        AlertService,
        ConfigurationService,
        AppTitleService,
        AppTranslationService,
        NotificationService,
        NotificationEndpoint,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        EndpointFactory,
        DonViService,
        DonViEndpoint,            
        RoleDonViService,
        RoleDonViEndpoint,        
        FileUploadEnPoint,
        FileUploadService,        
        LogEndpoint,
        LogService,
        TinhThanhEndpoint,
        TinhThanhService, 
        ChucDanhEndpoint,
        ChucDanhService,
        QuanHuyenEndpoint,
        QuanHuyenService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}




export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
