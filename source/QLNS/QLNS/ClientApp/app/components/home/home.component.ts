// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import 'hammerjs';
import { DonViService } from '../../services/donvi.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { DonVi } from '../../models/donvi.model';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [fadeInOut]
})
export class HomeComponent implements OnInit {
    count: number;
    public donvi: DonVi[] = [];
    public donviSelected: DonVi[] = [];
    public donviFilter: DonVi[] = [];
    user: User;
    is83: boolean = false;
    is2010: boolean = false;
    isShow: boolean = false;
    donviId: number;
    public listtrangthai: any;
    public listphanloai: any;
    public listchatlieu: any;
    public listthoiky: any;
    public listbaomat: any;
    public listdonvi: any;

    constructor(public configurations: ConfigurationService, private authService: AuthService, private alertService: AlertService, private donviService: DonViService
        , private accountService: AccountService) {

    }

    ngOnInit() {

        this.user = this.authService.currentUser;
        if (this.user != null) {
            this.donviService.getDonViByRole(this.user.id).subscribe(results => {
                this.alertService.stopLoadingMessage();
                this.donvi = results;
                var where = "DonViId IN (select tbl_RoleDonVi.DonViId from AspNetUsers inner join AspNetUserRoles on AspNetUsers.Id = AspNetUserRoles.UserId inner join AspNetRoles on AspNetUserRoles.RoleId = AspNetRoles.Id inner join tbl_RoleDonVi on AspNetRoles.Id = tbl_RoleDonVi.RoleId where AspNetUsers.Id = '" + this.user.id + "')";
                this.donviService.getItems(0, 0, where, "x").subscribe(results => {
                    this.donviFilter = results;
                    this.donviSelected = [];
                    for (var i = 0; i < this.donvi.length; i++) {
                        this.donviSelected.push(this.donvi[i]);
                        if (this.donvi[i]["items"] != null) {
                            for (var j = 0; j < this.donvi[i]["items"].length; j++) {
                                this.donviSelected.push(this.donvi[i]["items"][j]);
                                this.pickChild(this.donvi[i]["items"][j]);
                            }
                        }
                    }

                    //list du lieu
                }, error => { });

            }, error => { });
        }
    }

    pickChild(row: DonVi) {
        if (row["items"] != null) {
            for (var i = 0; i < row["items"].length; i++) {
                this.donviSelected.push(row["items"][i]);
                this.pickChild(row["items"][i]);
            }
        }
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu từ máy chủ.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    //get isCucDiSan() {
    //    this.accountService.getUser(this.accountService.currentUser.id).subscribe(r => {            
    //        this.donviService.getDonViByID(r.donViId).subscribe(r => {
    //            console.log(r);
    //            if (r.maDonViCha == 0) { return true; }
    //        }, e => { return false; });
    //    }, e => { return false; });        
    //    return false;
    //}
}

