// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';


@Injectable()
export class NotificationEndpoint {

    private demoNotifications = [
        {
            "id": 1,
            "header": "Thông báo nhập điểm môn: Nguyên lý cơ bản CN Mác- Lê nin HP I",
            "body": "Thông báo nhập điểm môn: Nguyên lý cơ bản CN Mác- Lê nin HP I",
            "isRead": true,
            "isPinned": true,
            "date": "2017-05-28T16:29:13.5877958"
        },
        {
            "id": 2,
            "header": "Thông báo nhập điểm môn: Luật hành chính, luật quốc tế",
            "body": "Thông báo nhập điểm môn: Luật hành chính, luật quốc tế",
            "isRead": false,
            "isPinned": false,
            "date": "2017-05-28T19:54:42.4144502"
        },
        {
            "id": 3,
            "header": "Thông báo nhập điểm môn: Thông tin liên lạc trong phòng cháy",
            "body": "Thông báo nhập điểm môn: Thông tin liên lạc trong phòng cháy",
            "isRead": false,
            "isPinned": false,
            "date": "2017-05-30T11:13:42.4144502"
        }
    ];



    getNotificationEndpoint<T>(notificationId: number): Observable<T> {

        let notification = this.demoNotifications.find(val => val.id == notificationId);
        let response: HttpResponse<T>;

        if (notification) {
            response = this.createResponse<T>(notification, 200);
        }
        else {
            response = this.createResponse<T>(null, 404);
        }

        return Observable.of(response.body);
    }



    getNotificationsEndpoint<T>(page: number, pageSize: number): Observable<T> {

        let notifications = this.demoNotifications;
        let response = this.createResponse<T>(this.demoNotifications, 200);

        return Observable.of(response.body);
    }



    getUnreadNotificationsEndpoint<T>(userId?: string): Observable<T> {

        let unreadNotifications = this.demoNotifications.filter(val => !val.isRead);
        let response = this.createResponse<T>(unreadNotifications, 200);

        return Observable.of(response.body);
    }



    getNewNotificationsEndpoint<T>(lastNotificationDate?: Date): Observable<T> {

        let unreadNotifications = this.demoNotifications;
        let response = this.createResponse<T>(unreadNotifications, 200);

        return Observable.of(response.body);
    }



    getPinUnpinNotificationEndpoint<T>(notificationId: number, isPinned?: boolean, ): Observable<T> {

        let notification = this.demoNotifications.find(val => val.id == notificationId);
        let response: HttpResponse<T>;

        if (notification) {
            response = this.createResponse<T>(null, 204);

            if (isPinned == null)
                isPinned = !notification.isPinned;

            notification.isPinned = isPinned;
            notification.isRead = true;
        }
        else {
            response = this.createResponse<T>(null, 404);
        }


        return Observable.of(response.body);
    }



    getReadUnreadNotificationEndpoint<T>(notificationIds: number[], isRead: boolean, ): Observable<T> {

        for (let notificationId of notificationIds) {

            let notification = this.demoNotifications.find(val => val.id == notificationId);

            if (notification) {
                notification.isRead = isRead;
            }
        }

        let response = this.createResponse<T>(null, 204);
        return Observable.of(response.body);
    }



    getDeleteNotificationEndpoint<T>(notificationId: number): Observable<T> {

        let notification = this.demoNotifications.find(val => val.id == notificationId);
        let response: HttpResponse<T>;

        if (notification) {
            this.demoNotifications = this.demoNotifications.filter(val => val.id != notificationId)
            response = this.createResponse<T>(notification, 200);
        }
        else {
            response = this.createResponse<T>(null, 404);
        }

        return Observable.of(response.body);
    }



    private createResponse<T>(body, status: number) {
        return new HttpResponse<T>({ body: body, status: status });
    }
}