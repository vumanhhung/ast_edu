// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChildren, AfterViewInit, QueryList, ElementRef } from "@angular/core";
import { Router, NavigationStart } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { AlertService, AlertDialog, DialogType, AlertMessage, MessageSeverity } from '../services/alert.service';
import { NotificationService } from "../services/notification.service";
import { AppTranslationService } from "../services/app-translation.service";
import { AccountService } from '../services/account.service';
import { LocalStoreManager } from '../services/local-store-manager.service';
import { AppTitleService } from '../services/app-title.service';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../services/configuration.service';
import { Permission } from '../models/permission.model';
import { LoginComponent } from "../components/login/login.component";
import * as $ from 'jquery';
import { DonVi } from "../models/donvi.model";
import { DonViService } from "../services/donvi.service";
import { Log } from "../models/log.model";
import { LogService } from "../services/log.service";
import { forEach } from "@angular/router/src/utils/collection";

var alertify: any = require('../assets/scripts/alertify.js');


@Component({
    selector: "quick-app",
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css', '../styles.css', '../themes.css', '../kendo.common.min.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
    count1: number;
    count2: number;
    count3: number;
    count4: number;
    count5: number;
    activeRouterLinkLevel1 = "1.1";
    activeRouterLink = 0;
    isAppLoaded: boolean;
    isUserLoggedIn: boolean;
    shouldShowLoginModal: boolean;
    removePrebootScreen: boolean;
    newNotificationCount = 0;
    appTitle = "";
    //userInfo = "";
    //userEmail = "";
    //fullNamex = "";
    appLogo = require("../assets/images/logo.png");
    appLogo1 = require("../assets/images/logo1.png");
    userIcon = require("../assets/images/avatar.png");
    stickyToasties: number[] = [];

    dataLoadingConsecutiveFailurs = 0;
    notificationsLoadingSubscription: any;

    public donvi: DonVi[] = [];
    public donviSelected: DonVi[] = [];
    public donviFilter: DonVi[] = [];

    @ViewChildren('loginModal,loginControl')
    modalLoginControls: QueryList<any>;

    loginModal: ModalDirective;
    loginControl: LoginComponent;


    get notificationsTitle() {

        let gT = (key: string) => this.translationService.getTranslation(key);

        if (this.newNotificationCount)
            return `${gT("app.Notifications")} (${this.newNotificationCount} ${gT("app.New")})`;
        else
            return gT("app.Notifications");
    }


    constructor(storageManager: LocalStoreManager, private toastyService: ToastyService, private toastyConfig: ToastyConfig, private donviService: DonViService, private logService: LogService,
        private accountService: AccountService, private alertService: AlertService, private notificationService: NotificationService, private appTitleService: AppTitleService, private authService: AuthService, private translationService: AppTranslationService, public configurations: ConfigurationService, public router: Router) {

        storageManager.initialiseStorageSyncListener();

        translationService.addLanguages(["en", "fr", "de", "pt", "ar", "ko"]);
        translationService.setDefaultLanguage('en');


        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
        this.toastyConfig.limit = 100;
        this.toastyConfig.showClose = true;

        this.appTitleService.appName = this.appTitle;
    }


    ngAfterViewInit() {
        this.modalLoginControls.changes.subscribe((controls: QueryList<any>) => {
            controls.forEach(control => {
                if (control) {
                    if (control instanceof LoginComponent) {
                        this.loginControl = control;
                        this.loginControl.modalClosedCallback = () => this.loginModal.hide();
                    }
                    else {
                        this.loginModal = control;
                        this.loginModal.show();
                    }
                }
            });
        });
    }


    onLoginModalShown() {
        this.alertService.showStickyMessage("Phiên hết hạn", "Phiên của bạn đã hết hạn. Xin vui lòng đăng nhập lại", MessageSeverity.info);
    }


    onLoginModalHidden() {
        this.alertService.resetStickyMessage();
        this.loginControl.reset();
        this.shouldShowLoginModal = false;

        if (this.authService.isSessionExpired)
            this.alertService.showStickyMessage("Phiên hết hạn", "Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại để gia hạn phiên làm việc của bạn", MessageSeverity.warn);
    }


    onLoginModalHide() {
        this.alertService.resetStickyMessage();
    }


    ngOnInit() {
        var month: number = new Date().getMonth() + 1;
        var year: number = new Date().getFullYear();
        this.isUserLoggedIn = this.authService.isLoggedIn;

        // 1 sec to ensure all the effort to get the css animation working is appreciated :|, Preboot screen is removed .5 sec later
        setTimeout(() => this.isAppLoaded = true, 1000);
        setTimeout(() => this.removePrebootScreen = true, 1500);

        setTimeout(() => {
            if (this.isUserLoggedIn) {
                this.alertService.resetStickyMessage();
                //if (!this.authService.isSessionExpired)
                this.alertService.showMessage("Login", `Chào mừng ${this.userName} đã trở lại!`, MessageSeverity.default);
                //else
                //    this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again", MessageSeverity.warn);
            }
        }, 2000);


        this.alertService.getDialogEvent().subscribe(alert => this.showDialog(alert));
        this.alertService.getMessageEvent().subscribe(message => this.showToast(message, false));
        this.alertService.getStickyMessageEvent().subscribe(message => this.showToast(message, true));

        this.authService.reLoginDelegate = () => this.shouldShowLoginModal = true;

        this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
            this.isUserLoggedIn = isLoggedIn;


            if (this.isUserLoggedIn) {
                this.initNotificationsLoading();
            }
            else {
                this.unsubscribeNotifications();
            }

            setTimeout(() => {
                if (!this.isUserLoggedIn) {
                    this.alertService.showMessage("Kết thúc phiên!", "", MessageSeverity.default);
                }
            }, 500);
            if (this.authService.currentUser != null) {
                //for (var i = 0; i < this.authService.currentUser.roles.length; i++) {
                //    switch (this.authService.currentUser.roles[i]) {
                //        case "ChuyenVien":
                //            this.router.navigate(['./chuyenvien']);
                //            break;
                //        case "PhoPhong":
                //            this.router.navigate(['./phophong']);
                //            break;
                //        case "TruongPhong":
                //            this.router.navigate(['./truongphong']);
                //            break;
                //        case "ChuyenVienCuc":
                //            this.router.navigate(['./chuyenviencuc']);
                //            break;
                //        case "CucTruong":
                //            this.router.navigate(['./cuctruong']);
                //            break;
                //        case "CucPho":
                //            this.router.navigate(['./cucpho']);
                //            break;
                //    }
                //}
            }
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                let url = (<NavigationStart>event).url;

                if (url !== url.toLowerCase()) {
                    this.router.navigateByUrl((<NavigationStart>event).url.toLowerCase());
                }
            }
        });
    }


    ngOnDestroy() {
        this.unsubscribeNotifications();
    }


    private unsubscribeNotifications() {
        if (this.notificationsLoadingSubscription)
            this.notificationsLoadingSubscription.unsubscribe();
    }



    initNotificationsLoading() {

        this.notificationsLoadingSubscription = this.notificationService.getNewNotificationsPeriodically()
            .subscribe(notifications => {
                this.dataLoadingConsecutiveFailurs = 0;
                this.newNotificationCount = notifications.filter(n => !n.isRead).length;
            },
                error => {
                    this.alertService.logError(error);

                    if (this.dataLoadingConsecutiveFailurs++ < 20)
                        setTimeout(() => this.initNotificationsLoading(), 5000);
                    else
                        this.alertService.showStickyMessage("Tải lỗi", "Đang thực hiện tải thông báo mới từ máy chủ không thành công!", MessageSeverity.error);
                });
    }


    markNotificationsAsRead() {

        let recentNotifications = this.notificationService.recentNotifications;

        if (recentNotifications.length) {
            this.notificationService.readUnreadNotification(recentNotifications.map(n => n.id), true)
                .subscribe(response => {
                    for (let n of recentNotifications) {
                        n.isRead = true;
                    }

                    this.newNotificationCount = recentNotifications.filter(n => !n.isRead).length;
                },
                    error => {
                        this.alertService.logError(error);
                        this.alertService.showMessage("Thông báo lỗi", "Đánh dấu thông báo đã đọc không thành công", MessageSeverity.error);

                    });
        }
    }



    showDialog(dialog: AlertDialog) {

        alertify.set({
            labels: {
                ok: dialog.okLabel || "OK",
                cancel: dialog.cancelLabel || "Cancel"
            }
        });

        switch (dialog.type) {
            case DialogType.alert:
                alertify.alert(dialog.message);

                break
            case DialogType.confirm:
                alertify
                    .confirm(dialog.message, (e) => {
                        if (e) {
                            dialog.okCallback();
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    });

                break;
            case DialogType.prompt:
                alertify
                    .prompt(dialog.message, (e, val) => {
                        if (e) {
                            dialog.okCallback(val);
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    }, dialog.defaultValue);

                break;
        }
    }





    showToast(message: AlertMessage, isSticky: boolean) {

        if (message == null) {
            for (let id of this.stickyToasties.slice(0)) {
                this.toastyService.clear(id);
            }

            return;
        }

        let toastOptions: ToastOptions = {
            title: message.summary,
            msg: message.detail,
            timeout: isSticky ? 0 : 4000
        };


        if (isSticky) {
            toastOptions.onAdd = (toast: ToastData) => this.stickyToasties.push(toast.id);

            toastOptions.onRemove = (toast: ToastData) => {
                let index = this.stickyToasties.indexOf(toast.id, 0);

                if (index > -1) {
                    this.stickyToasties.splice(index, 1);
                }

                toast.onAdd = null;
                toast.onRemove = null;
            };
        }


        switch (message.severity) {
            case MessageSeverity.default: this.toastyService.default(toastOptions); break
            case MessageSeverity.info: this.toastyService.info(toastOptions); break;
            case MessageSeverity.success: this.toastyService.success(toastOptions); break;
            case MessageSeverity.error: this.toastyService.error(toastOptions); break
            case MessageSeverity.warn: this.toastyService.warning(toastOptions); break;
            case MessageSeverity.wait: this.toastyService.wait(toastOptions); break;
        }
    }





    logout() {
        var log = new Log();
        log.tenModule = "Đăng xuất";
        log.hanhDong = "Đăng xuất";
        log.noiDung = "Đăng xuất tài khoản " + this.userName;
        log.nguoiThucHien = this.userName;

        this.logService.addnewLog(log).subscribe(result => console.log(result), error => console.log(error));
        this.authService.logout();
        this.authService.redirectLogoutUser();
    }


    //getYear() {
    //    return new Date().getUTCFullYear();
    //}


    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


    get fullName(): string {
        return this.authService.currentUser ? this.authService.currentUser.fullName : "";
    }

    get groupName(): string {
        return this.authService.currentUser ? this.authService.currentUser.roles[0] : "";
    }



    get chamcongP() {
        return this.accountService.userHasPermission(Permission.xemChamCongPermission);
    }

    get baocaoP() {
        return this.accountService.userHasPermission(Permission.bcPermission);
    }

    get danhmucP() {
        return this.accountService.userHasPermission(Permission.xemdmPermission);
    }

    get hethongP() {
        if (this.authService.currentUser != null) {
            if (this.authService.currentUser.roles[0] == "SuperAdmin"
                || this.authService.currentUser.roles[0] == "AdminCuc"
                || this.authService.currentUser.roles[0] == "AdminDonVi") {
                return true;
            }
        }
        return false;
    }

    public setRouterLinkActive(routerLink: number) {
        this.activeRouterLink = routerLink;
        if (routerLink == 10) {
            this.activeRouterLinkLevel1 = "9.1";
        }
        setTimeout(function () {
            var a = $(".active .dropdown-menu-fw");
            if (a != null && a.length > 0) {
                if (a.length >= 2) {
                    $("#header").css("margin-bottom", a.height() * (a.length / 2))
                }
                else {
                    $("#header").css("margin-bottom", a.height() * (a.length))
                }
            }
        }, 100);
    }

    pickChild(row: DonVi) {
        if (row["items"] != null) {
            for (var i = 0; i < row["items"].length; i++) {
                this.donviSelected.push(row["items"][i]);
                this.pickChild(row["items"][i]);
            }
        }
    }
}
