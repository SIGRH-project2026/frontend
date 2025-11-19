import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';


@Injectable({
  providedIn: 'root'
})


export class WebSocketService {
    private stompClient: any;
    apiUrl: string = environment.apiUrl;
      endpoint : string = 'ws'
    constructor() { }

    connect(): Observable<string> {
        const socket = new SockJS(`${this.apiUrl}${this.endpoint}`);
        this.stompClient = Stomp.over(socket);
        return new Observable(observer => {
            this.stompClient.connect({}, () => {
                this.stompClient.subscribe('/topic/notifications', (message: any) => {
                    observer.next(message.body);
                });
            });
        });
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }
}
