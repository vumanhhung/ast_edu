import { RoleDonVi } from "./roledonvi.model";

export class DonVi {
    public donViId: number;
    public tenDonVi: string;
    public maDonViCha: number;
    public kyHieu: string;
    public subLv: number;
    public ngonNgu: string;
    public viTri: number;
    public dienGiai: string;
    public trangThai: boolean;
    public nguoiNhap: string;
    public ngayNhap: Date;
    public nguoiSua: string;
    public ngaySua: Date;
    public roleDonVi: RoleDonVi[];

    constructor(donViId?: number, tenDonVi?: string, maDonViCha?: number, kyHieu?: string, subLv?: number, ngonNgu?: string, viTri?: number, dienGiai?: string, trangThai?: boolean, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date) {
        this.donViId = donViId;
        this.tenDonVi = tenDonVi;
        this.maDonViCha = maDonViCha;
        this.kyHieu = kyHieu;
        this.subLv = subLv;
        this.ngonNgu = ngonNgu;
        this.viTri = viTri;
        this.dienGiai = dienGiai;
        this.trangThai = trangThai;
        this.nguoiNhap = nguoiNhap;
        this.ngayNhap = ngayNhap;
        this.nguoiSua = nguoiSua;
        this.ngaySua = ngaySua;
    }
}
