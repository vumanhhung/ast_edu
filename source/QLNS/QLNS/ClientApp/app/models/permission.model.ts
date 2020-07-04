// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

export type PermissionNames =
    "View Users" | "Manage Users" |
    "View Roles" | "Manage Roles" | "Assign Roles";

export type PermissionValues =
    "hienvat.view" | "hienvat.new" | "hienvat.edit" | "hienvat.delete" |
    "baoquanhienvat.view" | "baoquanhienvat.new" | "baoquanhienvat.edit" | "baoquanhienvat.delete" |
    "hinhanhhienvat.view" | "hinhanhhienvat.new" | "hinhanhhienvat.delete" |
    "hienvatdichuyen.view" | "hienvatdichuyen.new" | "hienvatdichuyen.edit" | "hienvatdichuyen.delete" |
    "muontra.view" | "muontra.new" | "muontra.edit" | "muontra.delete" |
    "chuyenviennghiepvu.denghisoduyet" | "chuyenviennghiepvu.denghivuotcap" | "chuyenviennghiepvu.tiepnhandonvi" |
    "phophongphocuc.soduyet" | "phophongphocuc.tuchoisoduyet" | "phophongphocuc.duyetvuotcap" |
    "truongphongcuctruong.duyet" | "truongphongcuctruong.tuchoiduyet" |
    "bc.tct" |
    "danhmuc.view" | "danhmuc.manage" |   
    "donvi.view" | "donvi.manage" | "donvi.assign" |
    "users.view" | "users.manage" |
    "roles.view" | "roles.manage" | "roles.assign";

export class Permission {
    public static readonly xemHienVatPermission: PermissionValues = "hienvat.view";
    public static readonly suaHienVatPermission: PermissionValues = "hienvat.edit";
    public static readonly themHienVatPermission: PermissionValues = "hienvat.new";
    public static readonly xoaHienVatPermission: PermissionValues = "hienvat.delete";

    public static readonly xemBaoQuanHienVatPermission: PermissionValues = "baoquanhienvat.view";
    public static readonly suaBaoQuanHienVatPermission: PermissionValues = "baoquanhienvat.edit";
    public static readonly themBaoQuanHienVatPermission: PermissionValues = "baoquanhienvat.new";
    public static readonly xoaBaoQuanHienVatPermission: PermissionValues = "baoquanhienvat.delete";

    public static readonly xemHinhAnhHienVatPermission: PermissionValues = "hinhanhhienvat.view";
    public static readonly themHinhAnhHienVatPermission: PermissionValues = "hinhanhhienvat.new";    
    public static readonly xoaHinhAnhHienVatPermission: PermissionValues = "hinhanhhienvat.delete";

    public static readonly xemHienVatDiChuyenPermission: PermissionValues = "hienvatdichuyen.view";
    public static readonly suaHienVatDiChuyenPermission: PermissionValues = "hienvatdichuyen.edit";
    public static readonly themHienVatDiChuyenPermission: PermissionValues = "hienvatdichuyen.new";
    public static readonly xoaHienVatDiChuyenPermission: PermissionValues = "hienvatdichuyen.delete";

    public static readonly xemMuonTraPermission: PermissionValues = "muontra.view";
    public static readonly suaMuonTraPermission: PermissionValues = "muontra.edit";
    public static readonly themMuonTraPermission: PermissionValues = "muontra.new";
    public static readonly xoaMuonTraPermission: PermissionValues = "muontra.delete";

    public static readonly cvdnsdPermission: PermissionValues = "chuyenviennghiepvu.denghisoduyet";
    public static readonly cvdndvcPermission: PermissionValues = "chuyenviennghiepvu.denghivuotcap";
    public static readonly cvtndvPermission: PermissionValues = "chuyenviennghiepvu.tiepnhandonvi";

    public static readonly ppsdPermission: PermissionValues = "phophongphocuc.soduyet";
    public static readonly pptcsdPermission: PermissionValues = "phophongphocuc.tuchoisoduyet";
    public static readonly ppdvcPermission: PermissionValues = "phophongphocuc.duyetvuotcap";

    public static readonly tpdPermission: PermissionValues = "truongphongcuctruong.duyet";
    public static readonly tptcdPermission: PermissionValues = "truongphongcuctruong.tuchoiduyet";    

    public static readonly bcPermission: PermissionValues = "bc.tct";    

    public static readonly xemdmPermission: PermissionValues = "danhmuc.view";
    public static readonly chinhsuadmPermission: PermissionValues = "danhmuc.manage";    

    public static readonly xemdvPermission: PermissionValues = "donvi.view";
    public static readonly managedvPermission: PermissionValues = "donvi.manage";
    public static readonly nhomndPermission: PermissionValues = "donvi.assign";

    public static readonly viewUsersPermission: PermissionValues = "users.view";
    public static readonly manageUsersPermission: PermissionValues = "users.manage";

    public static readonly viewRolesPermission: PermissionValues = "roles.view";
    public static readonly manageRolesPermission: PermissionValues = "roles.manage";
    public static readonly assignRolesPermission: PermissionValues = "roles.assign";


    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}