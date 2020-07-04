import { TinhThanh } from "./tinhthanh.model";

export class QuanHuyen {
    public quanHuyenId: number;
    public maQuanHuyen: string;
    public tenQuanHuyen: string;
    public phanLoai: string;
    public viTriHienThi: number;
    public tinhThanhId: number;
    public trangThai: boolean;
    public tinhThanhs: TinhThanh;

    constructor(quanHuyenId?: number, maQuanHuyen?: string, tenQuanHuyen?: string, phanLoai?: string, viTriHienThi?: number, tinhThanhId?: number, trangThai?: boolean) {
        this.quanHuyenId = quanHuyenId;
        this.maQuanHuyen = maQuanHuyen;
        this.tenQuanHuyen = tenQuanHuyen;
        this.phanLoai = phanLoai;
        this.viTriHienThi = viTriHienThi;
        this.tinhThanhId = tinhThanhId;
        this.trangThai = trangThai;
    }
}
