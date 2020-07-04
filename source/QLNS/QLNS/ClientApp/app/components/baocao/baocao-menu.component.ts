import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AccountService } from '../../services/account.service';
import { Permission } from '../../models/permission.model';


@Component({
    selector: 'baocao-menu',
    templateUrl: './baocao-menu.component.html',
    styleUrls: ['./baocao-menu.component.css'],
    animations: [fadeInOut]
})
export class BaoCaoMenuComponent {
    constructor(public configurations: ConfigurationService, private accountService: AccountService) {
    }    
    icon2 = require("../../assets/icon/report1.png");    
}
