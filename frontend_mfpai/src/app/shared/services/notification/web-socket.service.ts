import { Injectable } from '@angular/core';
import { Observable, retry, share } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly messages = new Observable<string>(observer => {
    const socket = new SockJS(`${environment.apiUrl}ws`);
    const client = Stomp.over(socket);
    client.debug = () => {};
    client.connect({}, () => {
      if (observer.closed) {
        client.disconnect(() => {});
        return;
      }
      client.subscribe('/topic/notifications', message => observer.next(message.body));
      // Refresh after initial connection and reconnection to catch missed notifications.
      observer.next('{}');
    }, error => observer.error(error));
    return () => {
      if (client.connected) client.disconnect(() => {});
      else socket.close();
    };
  }).pipe(retry({ delay: 5000 }), share());

  connect(): Observable<string> {
    return this.messages;
  }
}
