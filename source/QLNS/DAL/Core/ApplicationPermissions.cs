// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;

namespace DAL.Core
{
    public static class ApplicationPermissions
    {
        public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

        public const string ChamCong = "Quản lý chấm công";
        public static ApplicationPermission XemChamCong = new ApplicationPermission("Xem hồ sơ", "chamcong.view", ChamCong, "Quyền xem danh sách chấm công");
        public static ApplicationPermission ThemChamCong = new ApplicationPermission("Thêm hồ sơ", "chamcong.new", ChamCong, "Quyền thêm danh sách chấm công");
        public static ApplicationPermission XoaChamCong = new ApplicationPermission("Xóa hồ sơ", "chamcong.del", ChamCong, "Quyền xóa danh sách chấm công");
        
        public const string BaoCao = "Khai thác báo cáo";
        public static ApplicationPermission XemBaoCao = new ApplicationPermission("Báo cáo tổng công ty", "bc.tct", BaoCao, "Quyền khai thác báo cáo");                    

        public const string DonVi = "Quản lý đơn vị, phòng ban";
        public static ApplicationPermission XemDonVi = new ApplicationPermission("Danh sách đơn vị", "donvi.view", DonVi, "Quyền xem danh sách đơn vị, phòng ban");
        public static ApplicationPermission ManageDonVi = new ApplicationPermission("Thêm, sửa, xóa đơn vị", "donvi.manage", DonVi, "Quyền thêm mới, chỉnh sửa thông tin, xóa đơn vị, phòng ban");
        public static ApplicationPermission AssignDonVi = new ApplicationPermission("Phân quyền đơn vị nhóm người dùng", "donvi.assign", DonVi, "Quyền gán đơn vị cho nhóm người dùng");        

        public const string RolesPermissionGroupName = "Quản lý nhóm người dùng";
        public static ApplicationPermission ViewRoles = new ApplicationPermission("Danh sách nhóm người dùng", "roles.view", RolesPermissionGroupName, "Quyền xem danh sách nhóm người dùng");
        public static ApplicationPermission ManageRoles = new ApplicationPermission("Thêm, sửa, xóa nhóm người dùng", "roles.manage", RolesPermissionGroupName, "Quyền thêm mới, chỉnh sửa thông tin, xóa nhóm người dùng");
        public static ApplicationPermission AssignRoles = new ApplicationPermission("Phân quyền chức năng nhóm người dùng", "roles.assign", RolesPermissionGroupName, "Quyền gán chức năng cho nhóm người dùng");

        public const string UsersPermissionGroupName = "Quản lý người dùng";
        public static ApplicationPermission ViewUsers = new ApplicationPermission("Danh sách người dùng", "users.view", UsersPermissionGroupName, "Quyền xem danh sách người dùng");
        public static ApplicationPermission ManageUsers = new ApplicationPermission("Thêm, sửa, xóa người dùng", "users.manage", UsersPermissionGroupName, "Quyền thêm mới, chỉnh sửa thông tin, xóa người dùng");

        public const string DanhMuc = "Quản lý danh mục";
        public static ApplicationPermission XemDanhMuc = new ApplicationPermission("Danh sách các danh mục", "danhmuc.view", DanhMuc, "Quyền xem danh sách các danh mục");
        public static ApplicationPermission QuanLyDanhMuc = new ApplicationPermission("Thêm, sửa, xóa các danh mục", "danhmuc.manage", DanhMuc, "Quyền thêm mới, chỉnh sửa thông tin, xóa các danh mục");

        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                XemChamCong, ThemChamCong, XoaChamCong, XemBaoCao,
                XemDanhMuc,QuanLyDanhMuc,                
                ViewUsers,ManageUsers,
                ViewRoles,ManageRoles,AssignRoles,
                XemDonVi,ManageDonVi,AssignDonVi

            };

            AllPermissions = allPermissions.AsReadOnly();
        }

        public static ApplicationPermission GetPermissionByName(string permissionName)
        {
            return AllPermissions.Where(p => p.Name == permissionName).FirstOrDefault();
        }

        public static ApplicationPermission GetPermissionByValue(string permissionValue)
        {
            return AllPermissions.Where(p => p.Value == permissionValue).FirstOrDefault();
        }

        public static string[] GetAllPermissionValues()
        {
            return AllPermissions.Select(p => p.Value).ToArray();
        }

        public static string[] GetAdministrativePermissionValues()
        {
            return new string[] { ManageUsers, ManageRoles, AssignRoles };
        }
    }





    public class ApplicationPermission
    {
        public ApplicationPermission()
        { }

        public ApplicationPermission(string name, string value, string groupName, string description = null)
        {
            Name = name;
            Value = value;
            GroupName = groupName;
            Description = description;
        }



        public string Name { get; set; }
        public string Value { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }


        public override string ToString()
        {
            return Value;
        }


        public static implicit operator string(ApplicationPermission permission)
        {
            return permission.Value;
        }
    }
}
