export class Log {
		public logID: number;
		public tenModule: string;
		public hanhDong: string;
		public noiDung: string;
		public nguoiThucHien: string;
		public ngayThucHien: Date;
    
    constructor(logID?: number, tenModule?: string, hanhDong?: string, noiDung?: string, nguoiThucHien?: string, ngayThucHien?: Date)
    {
				this.logID = logID;
				this.tenModule = tenModule;
				this.hanhDong = hanhDong;
				this.noiDung = noiDung;
				this.nguoiThucHien = nguoiThucHien;
				this.ngayThucHien = ngayThucHien;
    }
}
