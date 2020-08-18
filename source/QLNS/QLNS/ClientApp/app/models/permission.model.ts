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
    "chamcong.view" | "chamcong.new" | "chamcong.del" | "bc.tct" |
    "danhmuc.view" | "danhmuc.manage" |   
    "donvi.view" | "donvi.manage" | "donvi.assign" |
    "users.view" | "users.manage" |
    "roles.view" | "roles.manage" | "roles.assign";

export class Permission {
    public static readonly xemChamCongPermission: PermissionValues = "chamcong.view"; 
    public static readonly newChamCongPermission: PermissionValues = "chamcong.new"; 
    public static readonly delChamCongPermission: PermissionValues = "chamcong.del"; 

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