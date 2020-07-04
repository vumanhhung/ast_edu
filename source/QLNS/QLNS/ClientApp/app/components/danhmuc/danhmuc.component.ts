// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'danhmuc',
  templateUrl: './danhmuc.component.html',
  styleUrls: ['./danhmuc.component.css'],
    animations: [fadeInOut]
})
export class DanhMucComponent {
    constructor(public configurations: ConfigurationService, private authService: AuthService) {
  }
    icon1 = require("../../assets/icon/vanhoa.png");
    icon3 = require("../../assets/icon/chucdanh.png");
    icon4 = require("../../assets/icon/chungchivanbang.png");
    icon5 = require("../../assets/icon/employee.png");
    icon6 = require("../../assets/icon/hocvi.png");
    icon7 = require("../../assets/icon/hosodang.png");
    icon8 = require("../../assets/icon/hosodang.png");
    icon9 = require("../../assets/icon/kynang.png");
    icon10 = require("../../assets/icon/chungchi.png");
    icon11 = require("../../assets/icon/quoctich.png");
    icon12 = require("../../assets/icon/khungcanh.png");
    icon13 = require("../../assets/icon/dvt.png");
    icon14 = require("../../assets/icon/bactho.png");
    icon15 = require("../../assets/icon/thongtinchung.png");
    icon16 = require("../../assets/icon/chuyenmon.png");
    icon17 = require("../../assets/icon/chuyennganh.png");
    icon18 = require("../../assets/icon/danhhieu.png");
    icon19 = require("../../assets/icon/chungchivanbang.png");
    icon34 = require("../../assets/icon/tinhthanh.png");

    get superuser() {
        if (this.authService.currentUser != null) {
            for (var i = 0; i < this.authService.currentUser.roles.length; i++) {
                if (this.authService.currentUser.roles[i].toString() == "SuperAdmin")
                    return true;
            }
        }
        return false;
    }
}
