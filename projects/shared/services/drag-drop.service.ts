import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensures it works as a singleton
})
export class DragDropService {
  private dragStartSubject = new Subject<any>();
  private dragEndSubject = new Subject<any>();

  dragStart(data: any) {
    this.dragStartSubject.next(data);
  }

  dragEnd(data: any) {
    this.dragEndSubject.next(data);
  }

  getDragStart() {
    return this.dragStartSubject.asObservable();
  }

  getDragEnd() {
    return this.dragEndSubject.asObservable();
  }
}