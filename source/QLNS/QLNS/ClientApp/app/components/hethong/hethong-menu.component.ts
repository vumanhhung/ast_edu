// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AccountService } from '../../services/account.service';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'hethong-menu',
    templateUrl: './hethong-menu.component.html',
    styleUrls: ['./hethong-menu.component.css'],
    animations: [fadeInOut]
})
export class HeThongMenuComponent {
    constructor(public configurations: ConfigurationService, private accountService: AccountService) {
    }
    icon1 = require("../../assets/icon/thongtinchung.png");
    icon2 = require("../../assets/icon/donvihanhchinh.png");
    icon3 = require("../../assets/icon/chucvu.png");
    icon4 = require("../../assets/icon/cauhinh.png");
    icon5 = require("../../assets/icon/nguoidung.png");
    icon6 = require("../../assets/icon/nhomnguoidung.png");
    icon7 = require("../../assets/icon/hosodang.png");
    icon8 = require("../../assets/icon/ketquaxephang.png");
    icon9 = require("../../assets/icon/kynang.png");
    icon10 = require("../../assets/icon/chungchi.png");
    icon11 = require("../../assets/icon/quoctich.png");
    icon12 = require("../../assets/icon/khungcanh.png");
    icon13 = require("../../assets/icon/nhatky.png");
    icon14 = require("../../assets/icon/email.png");
    icon15 = require("../../assets/icon/sms.png");       

    get canViewDonVi() {
        return this.accountService.userHasPermission(Permission.xemdvPermission);
    }

    get canViewNguoiDung() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission);
    }

    get canViewNhomNguoiDung() {
        var user = this.accountService.currentUser;        
        return user.roles[0] == "SuperAdmin";
        //return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }

    get canViewQuyenDonVi() {
        return this.accountService.userHasPermission(Permission.nhomndPermission);
    }
}
