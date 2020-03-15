import { Injectable } from '@angular/core';
//import {Subject, Observable, Observer} from 'rxjs';
import * as Rx from 'rxjs-compat/Rx';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  private sub: Rx.Subject<MessageEvent>;

  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.sub) {
      this.sub = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.sub;
  }

  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
}
