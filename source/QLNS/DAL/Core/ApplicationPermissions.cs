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

        public const string HienVat = "Hồ sơ hiện vật";
        public static ApplicationPermission XemHienVat = new ApplicationPermission("Xem hồ sơ", "hienvat.view", HienVat, "Quyền xem danh sách hồ sơ hiện vật");
        public static ApplicationPermission ThemHienVat = new ApplicationPermission("Tạo hồ sơ", "hienvat.new", HienVat, "Quyền tạo hồ sơ hiện vật");
        public static ApplicationPermission SuaHienVat = new ApplicationPermission("Sửa hồ sơ", "hienvat.edit", HienVat, "Quyền sửa hồ sơ hiện vật");
        public static ApplicationPermission XoaHienVat = new ApplicationPermission("Xóa hồ sơ", "hienvat.delete", HienVat, "Quyền xóa hồ sơ hiện vật");

        public const string BaoQuanHienVat = "Bảo quản hiện vật";
        public static ApplicationPermission XemBaoQuanHienVat = new ApplicationPermission("Xem tình trạng bảo quản", "baoquanhienvat.view", BaoQuanHienVat, "Quyền xem danh sách tình trạng bảo quản");
        public static ApplicationPermission ThemBaoQuanHienVat = new ApplicationPermission("Thêm tình trạng bảo quản ", "baoquanhienvat.new", BaoQuanHienVat, "Quyền thêm mới tình trạng bảo quản");
        public static ApplicationPermission SuaBaoQuanHienVat = new ApplicationPermission("Sửa tình trạng bảo quản", "baoquanhienvat.edit", BaoQuanHienVat, "Quyền sửa tình trạng bảo quản");
        public static ApplicationPermission XoaBaoQuanHienVat = new ApplicationPermission("Xóa tình trạng bảo quản", "baoquanhienvat.delete", BaoQuanHienVat, "Quyền xóa tình trạng bảo quản");

        public const string HinhAnhHienVat = "Hình ảnh hiện vật";
        public static ApplicationPermission XemHinhAnhHienVat = new ApplicationPermission("Danh sách hình ảnh", "hinhanhhienvat.view", HinhAnhHienVat, "Quyền xem danh sách hình ảnh");
        public static ApplicationPermission ThemHinhAnhHienVat = new ApplicationPermission("Thêm mới hình ảnh", "hinhanhhienvat.new", HinhAnhHienVat, "Quyền thêm mới hình ảnh");        
        public static ApplicationPermission XoaHinhAnhHienVat = new ApplicationPermission("Xóa hình ảnh", "hinhanhhienvat.delete", HinhAnhHienVat, "Quyền xóa hình ảnh");

        public const string HienVatDiChuyen = "Hiện vật di chuyển";
        public static ApplicationPermission XemHienVatDiChuyen = new ApplicationPermission("Danh sách di chuyển", "hienvatdichuyen.view", HienVatDiChuyen, "Quyền xem danh sách nhật ký di chuyển");
        public static ApplicationPermission ThemHienVatDiChuyen = new ApplicationPermission("Thêm nhật ký di chuyển", "hienvatdichuyen.new", HienVatDiChuyen, "Quyền thêm mới nhật ký di chuyển");
        public static ApplicationPermission SuaHienVatDiChuyen = new ApplicationPermission("Sửa nhật ký di chuyển", "hienvatdichuyen.edit", HienVatDiChuyen, "Quyền sửa nhật ký di chuyển");
        public static ApplicationPermission XoaHienVatDiChuyen = new ApplicationPermission("Xóa nhật ký di chuyển", "hienvatdichuyen.delete", HienVatDiChuyen, "Quyền xóa nhật ký di chuyển");
        
        public const string MuonTra = "Mượn trả";
        public static ApplicationPermission XemMuonTra = new ApplicationPermission("Danh sách mượn trả", "muontra.view", MuonTra, "Quyền xem danh sách nhật ký mượn trả");
        public static ApplicationPermission ThemMuonTra = new ApplicationPermission("Thêm nhật ký mượn trả", "muontra.new", MuonTra, "Quyền thêm mới nhật ký mượn trả");
        public static ApplicationPermission SuaMuonTra = new ApplicationPermission("Sửa nhật ký mượn trả", "muontra.edit", MuonTra, "Quyền sửa nhật ký mượn trả");
        public static ApplicationPermission XoaMuonTra = new ApplicationPermission("Xóa nhật ký mượn trả", "muontra.delete", MuonTra, "Quyền xóa nhật ký mượn trả");

        public const string ChuyenVienNghiepVu = "Chuyên viên (nghiệp vụ)";
        public static ApplicationPermission DeNghiSoDuyet = new ApplicationPermission("Đề nghị sơ duyệt", "chuyenviennghiepvu.denghisoduyet", ChuyenVienNghiepVu, "Quyền Đề nghị sơ duyệt");
        public static ApplicationPermission DeNghiDuyetVuotCap = new ApplicationPermission("Đề nghị duyệt vượt cấp", "chuyenviennghiepvu.denghivuotcap", ChuyenVienNghiepVu, "Quyền Đề nghị duyệt vượt cấp");
        public static ApplicationPermission TiepNhanHoSoDonVi = new ApplicationPermission("Tiếp nhận hồ sơ đơn vị", "chuyenviennghiepvu.tiepnhandonvi", ChuyenVienNghiepVu, "Quyền Tiếp nhận hồ sơ đơn vị");

        public const string PhoPhongPhoCuc = "Phó phòng - phó cục";
        public static ApplicationPermission SoDuyetHoSo = new ApplicationPermission("Sơ duyệt hồ sơ", "phophongphocuc.soduyet", PhoPhongPhoCuc, "Quyền Sơ duyệt hồ sơ");
        public static ApplicationPermission TuChoiSoDuyet = new ApplicationPermission("Từ chối sơ duyệt", "phophongphocuc.tuchoisoduyet", PhoPhongPhoCuc, "Quyền từ chối sơ duyệt hồ sơ");
        public static ApplicationPermission DuyetVuotCap = new ApplicationPermission("Duyệt vượt cấp", "phophongphocuc.duyetvuotcap", PhoPhongPhoCuc, "Quyền duyệt vượt cấp");

        public const string TruongPhongCucTruong = "Trưởng phòng - cục trưởng";
        public static ApplicationPermission DuyetHoSo = new ApplicationPermission("Duyệt hồ sơ", "truongphongcuctruong.duyet", TruongPhongCucTruong, "Quyền duyệt hồ sơ");
        public static ApplicationPermission TuChoiDuyet = new ApplicationPermission("Từ chối duyệt", "truongphongcuctruong.tuchoiduyet", TruongPhongCucTruong, "Quyền từ chối duyệt hồ sơ");        

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
                XemHienVat,ThemHienVat,SuaHienVat,XoaHienVat,
                XemBaoQuanHienVat,ThemBaoQuanHienVat,SuaBaoQuanHienVat,XoaBaoQuanHienVat,
                XemHinhAnhHienVat,ThemHinhAnhHienVat,XoaHinhAnhHienVat,
                XemHienVatDiChuyen,ThemHienVatDiChuyen,SuaHienVatDiChuyen,XoaHienVatDiChuyen,
                XemMuonTra,ThemMuonTra,SuaMuonTra,XoaMuonTra,
                DeNghiSoDuyet,DeNghiDuyetVuotCap,TiepNhanHoSoDonVi,
                SoDuyetHoSo,TuChoiSoDuyet,DuyetVuotCap,
                DuyetHoSo,TuChoiDuyet,
                XemBaoCao,
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
