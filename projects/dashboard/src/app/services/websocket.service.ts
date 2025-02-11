import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private dataSetSubscriptions: { [key: string]: boolean } = {};
  public updatedData: Subject<any> = new Subject<any>()
  public updatedData$:Observable<any> = this.updatedData.asObservable();
  constructor() {}
  url = 'ws://10.91.97.111:8080'

  /**
   * Connect to the WebSocket server
   * @param url WebSocket server URL
   */
  connect(url: string = 'ws://10.91.97.111:8080'): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        // console.log('Connected to WebSocket server');
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        // console.log('WebSocket connection closed');
        this.ws = null;
        this.dataSetSubscriptions = {};
      };
    }
  }

  /**
   * Subscribe to a module
   * @param moduleName Name of the module to subscribe to
   */
  subscribeToDataSet(dataSetId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const subscribeMessage = JSON.stringify({
        event: 'subscribe',
        module: dataSetId,
      });

      this.ws.send(subscribeMessage);
      // console.log(`Sent subscription for module: ${dataSetId}`);
      this.dataSetSubscriptions[dataSetId] = true;
    } else {
      console.warn('WebSocket is not open. Cannot subscribe.');
    }
  }

  /**
   * Unsubscribe from a module
   * @param moduleName Name of the module to unsubscribe from
   */
  unsubscribeFromModule(dataSetId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.dataSetSubscriptions[dataSetId]) {
      const unsubscribeMessage = JSON.stringify({
        event: 'unsubscribe',
        module: dataSetId,
      });

      this.ws.send(unsubscribeMessage);
      // console.log(`Sent unsubscription for module: ${dataSetId}`);
      delete this.dataSetSubscriptions[dataSetId];
    } else {
      console.warn(`Cannot unsubscribe. Module "${dataSetId}" is not subscribed or WebSocket is not open.`);
    }
  }

  /**
   * Handle incoming WebSocket messages
   * @param data Message data from the WebSocket server
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      if (message.module && this.dataSetSubscriptions[message.module]) {
        this.updatedData.next(message)
      } else {
        console.warn('Received message for unsubscribed module or invalid data:', message);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Close the WebSocket connection
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      // console.log('WebSocket connection closed manually.');
    }
  }
}
