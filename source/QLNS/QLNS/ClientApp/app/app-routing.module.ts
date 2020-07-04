import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { DonViComponent } from './components/danhmuc/donvi/donvi.component';
import { TinhThanhComponent } from './components/danhmuc/tinhthanh/tinhthanh.component';
import { RoleDonViComponent } from './components/hethong/roledonvi.component';
import { HeThongMenuComponent } from './components/hethong/hethong-menu.component';
import { DanhMucComponent } from './components/danhmuc/danhmuc.component';
import { UsersManagementComponent } from './components/controls/users-management.component';
import { RolesManagementComponent } from './components/controls/roles-management.component';
import { UserPreferencesComponent } from './components/controls/user-preferences.component';
import { UserInfoComponent } from './components/controls/user-info.component';
import { LogComponent } from './components/log/log.component';
import { HoSoCaNhanComponent } from './components/hethong/hosocanhan.component';
import { QuanHuyenComponent } from './components/danhmuc/quanhuyen/quanhuyen.component';

import { BaoCaoMenuComponent } from './components/baocao/baocao-menu.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: "", component: HomeComponent, canActivate: [AuthGuard], data: { title: "Trang chủ" } },
            { path: "login", component: LoginComponent, data: { title: "Đăng nhập" } },
            { path: "settings", component: SettingsComponent, canActivate: [AuthGuard], data: { title: "Cấu hình" } },
            { path: "about", component: AboutComponent, data: { title: "Giới thiệu" } },
            { path: "home", redirectTo: "/", pathMatch: "full" },
            { path: "donvi", component: DonViComponent, data: { title: "Quản lý sơ đồ tổ chức" } },
            { path: "roledonvi", component: RoleDonViComponent, canActivate: [AuthGuard], data: { title: "Phân quyền nhóm người dùng đơn vị" } },
            { path: "hethong", component: HeThongMenuComponent, data: { title: "Quản trị hệ thống" } },
            { path: "danhmuc", component: DanhMucComponent, data: { title: "Quản trị danh mục" } },
            { path: "users", component: UsersManagementComponent, canActivate: [AuthGuard], data: { title: "Quản lý người dùng" } },
            { path: "roles", component: RolesManagementComponent, canActivate: [AuthGuard], data: { title: "Quản lý nhóm người dùng" } },
            { path: "userinfo", component: HoSoCaNhanComponent, canActivate: [AuthGuard], data: { title: "Hồ sơ cá nhân" } },
            { path: "log", component: LogComponent, data: { title: "Báo cáo thao tác" } },

            //begin hungvm
            { path: "tinhthanh", component: TinhThanhComponent, canActivate: [AuthGuard], data: { title: "Danh mục Tỉnh thành" } },
            { path: "quanhuyen", component: QuanHuyenComponent, canActivate: [AuthGuard], data: { title: "Danh mục quận huyện" } },
            //End hungvm


            //menu báo cáo
            { path: "baocao", component: BaoCaoMenuComponent, data: { title: "Báo cáo" } }, 

            //Thêm trước dòng này
            { path: "**", component: NotFoundComponent, data: { title: "Không tìm thấy Trang" } }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AppRoutingModule { }