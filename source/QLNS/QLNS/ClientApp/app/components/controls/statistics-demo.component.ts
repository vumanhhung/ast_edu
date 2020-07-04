//// ======================================
//// Author: Ebenezer Monney
//// Email:  info@ebenmonney.com
//// Copyright (c) 2017 www.ebenmonney.com
//// 
//// ==> Gun4Hire: contact@ebenmonney.com
//// ======================================

//import { Component, OnInit, OnDestroy } from '@angular/core';
//import { AlertService, DialogType, AlertMessage, MessageSeverity } from '../../services/alert.service';
//import { Utilities } from '../../services/utilities';
//import { MonHoc } from '../../models/monhoc.model';
//import { HeDaoTaoService } from "../../services/hedaotao.service";
//import { DiemService } from "../../services/diem.service";
//import { Hedaotao } from '../../models/hedaotao.model';
//import { ThongKeHome } from '../../models/thongkehome.model';
//require('chart.js');



//@Component({
//    selector: 'statistics-demo',
//    templateUrl: './statistics-demo.component.html',
//    styleUrls: ['./statistics-demo.component.css']
//})
//export class StatisticsDemoComponent implements OnInit, OnDestroy {
//    public thongke: ThongKeHome = new ThongKeHome();
//    public namhocs: Array<{ text: string, value: string }> = [
//        { text: "2017-2018", value: "2017-2018" },
//        { text: "2018-2019", value: "2018-2019" },
//        { text: "2019-2020", value: "2019-2020" },
//        { text: "2020-2021", value: "2020-2021" },
//        { text: "2021-2022", value: "2021-2022" },
//        { text: "2022-2023", value: "2022-2023" },
//        { text: "2023-2024", value: "2023-2024" },
//        { text: "2024-2025", value: "2024-2025" }
//    ];

//    chartData: Array<any> = [
//        { data: [this.thongke.xuatsac1, this.thongke.xuatsac2], label: 'Xuất sắc' },
//        { data: [this.thongke.gioi1, this.thongke.gioi2], label: 'Giỏi' },
//        { data: [this.thongke.kha1, this.thongke.kha2], label: 'Khá' },
//        { data: [this.thongke.tbk1, this.thongke.tbk2], label: 'TB Khá' },
//        { data: [this.thongke.tb1, this.thongke.tb2], label: 'TB' },
//        { data: [this.thongke.khongdat1, this.thongke.khongdat2], label: 'Không đạt' }
//    ];
//    chartLabels: Array<any> = ['Học kỳ 1', 'Học kỳ 2'];
//    chartOptions: any = {
//        responsive: true,
//        title: {
//            display: false,
//            fontSize: 16,
//            text: 'Important Stuff'
//        }
//    };
//    chartColors: Array<any> = [
//        { // grey
//            backgroundColor: 'rgba(148,159,177,0.2)',
//            borderColor: 'rgba(148,159,177,1)',
//            pointBackgroundColor: 'rgba(148,159,177,1)',
//            pointBorderColor: '#fff',
//            pointHoverBackgroundColor: '#fff',
//            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//        },
//        { // dark grey
//            backgroundColor: 'rgba(77,83,96,0.2)',
//            borderColor: 'rgba(77,83,96,1)',
//            pointBackgroundColor: 'rgba(77,83,96,1)',
//            pointBorderColor: '#fff',
//            pointHoverBackgroundColor: '#fff',
//            pointHoverBorderColor: 'rgba(77,83,96,1)'
//        },
//        { // something else
//            backgroundColor: 'rgba(128,128,128,0.2)',
//            borderColor: 'rgba(128,128,128,1)',
//            pointBackgroundColor: 'rgba(128,128,128,1)',
//            pointBorderColor: '#fff',
//            pointHoverBackgroundColor: '#fff',
//            pointHoverBorderColor: 'rgba(128,128,128,0.8)'
//        }
//    ];
//    chartLegend: boolean = true;
//    chartType: string = 'line';
//    public namhoc: string = "2017-2018";
//    public MonHocs: MonHoc[] = [];
//    public hedaotaos: Hedaotao[] = [];
//    public hedaotaoid: number = 1;
    
//    timerReference: any;



//    constructor(private alertService: AlertService, private hedaotaoService: HeDaoTaoService, private diemService: DiemService) {
//    }


//    ngOnInit() {
//        this.loadThongke();        
//        this.loadData();
//    }

//    ngOnDestroy() {
//        clearInterval(this.timerReference);
//    }

//    loadThongke() {
//        this.diemService.thongketrangchu(this.hedaotaoid, this.namhoc).subscribe(result => this.onDataLoadSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
//    }

//    loadData() {
//        this.alertService.startLoadingMessage();
//        this.hedaotaoService.getAllHedaotao().subscribe(result => this.onDataLoadHedaotaoSuccessful(result), error => this.onCurrentUserDataLoadFailed(error));
//    }

//    private onDataLoadHedaotaoSuccessful(obj: Hedaotao[]) {
//        this.alertService.stopLoadingMessage();
//        this.hedaotaos = obj;
//    }

//    private onDataLoadSuccessful(obj: ThongKeHome[]) {
//        this.alertService.stopLoadingMessage();
//        this.thongke = obj[0];
//        this.chartData = [
//            { data: [this.thongke.xuatsac1, this.thongke.xuatsac2], label: 'Xuất sắc' },
//            { data: [this.thongke.gioi1, this.thongke.gioi2], label: 'Giỏi' },
//            { data: [this.thongke.kha1, this.thongke.kha2], label: 'Khá' },
//            { data: [this.thongke.tbk1, this.thongke.tbk2], label: 'TB Khá' },
//            { data: [this.thongke.tb1, this.thongke.tb2], label: 'TB' },
//            { data: [this.thongke.khongdat1, this.thongke.khongdat2], label: 'Không đạt' }
//        ];
//    }

//    private onCurrentUserDataLoadFailed(error: any) {
//        this.alertService.stopLoadingMessage();
//        this.alertService.showStickyMessage("Tải lỗi", `Không thể truy xuất dữ liệu người dùng từ máy chủ.\r\nLỗi: "${Utilities.getHttpResponseMessage(error)}"`,
//            MessageSeverity.error, error);
//    }

//    randomize(): void {
//        let _chartData: Array<any> = new Array(this.chartData.length);
//        for (let i = 0; i < this.chartData.length; i++) {
//            _chartData[i] = { data: new Array(this.chartData[i].data.length), label: this.chartData[i].label };

//            for (let j = 0; j < this.chartData[i].data.length; j++) {
//                _chartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
//            }
//        }

//        this.chartData = _chartData;
//    }


//    changeChartType(type: string) {
//        this.chartType = type;
//    }

//    showMessage(msg: string): void {
//        this.alertService.showMessage("Demo", msg, MessageSeverity.info);
//    }

//    showDialog(msg: string): void {
//        this.alertService.showDialog(msg, DialogType.prompt, (val) => this.configure(true, val), () => this.configure(false));
//    }

//    configure(response: boolean, value?: string) {

//        if (response) {

//            this.alertService.showStickyMessage("Simulating...", "", MessageSeverity.wait);

//            setTimeout(() => {

//                this.alertService.resetStickyMessage();
//                this.alertService.showMessage("Demo", `Your settings was successfully configured to \"${value}\"`, MessageSeverity.success);
//            }, 2000);
//        }
//        else {
//            this.alertService.showMessage("Demo", "Operation cancelled by user", MessageSeverity.default);
//        }
//    }



//    // events
//    chartClicked(e: any): void {
//        console.log(e);
//    }

//    chartHovered(e: any): void {
//        console.log(e);
//    }

//    SelectedGroupValue(value: number) {
//        this.hedaotaoid = value;
//        this.loadThongke();
//    }

//    SelectednamHoc(value: string) {
//        this.namhoc = value;
//        this.loadThongke();
//    }
//}