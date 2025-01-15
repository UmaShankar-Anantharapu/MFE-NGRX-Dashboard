import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  private socket!: WebSocket;

  constructor() { }

  connect(url: string): Subject<any> {
    this.socket = new WebSocket(url);
    
    const observable = new Observable((observer) => {
      this.socket.onmessage = (event) => observer.next(JSON.parse(event.data));
      this.socket.onerror = (errorMsg) => observer.error(errorMsg);
      this.socket.onclose = () => observer.complete();
      return () => this.socket.close();
    })

    const subject = new Subject<any>();
    subject.subscribe((data) => {
      if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(data));
      }
  });

  return Subject.create(subject, observable);
  }
}
