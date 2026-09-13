// src/app/services/real-time.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

export interface DataPoint {
  id: number;
  timestamp: Date;
  value: number;
  source: string;
  payload: string;
}

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {
  private dataSubject = new BehaviorSubject<DataPoint[]>([]);
  public data$ = this.dataSubject.asObservable();

  private counter = 0;
  private sources = ['Alpha', 'Beta', 'Gamma', 'Delta'];

  constructor(private zone: NgZone) {
    // Run the interval outside Angular's zone so it doesn't trigger
    // change detection on every tick. Re-enter the zone only when
    // there's actually new data to push.
    this.zone.runOutsideAngular(() => {
      interval(1000).subscribe(() => {
        this.zone.run(() => {
          this.generateDataPoint();
        });
      });
    });
  }

  private generateDataPoint(): void {
    this.counter++;
    const newPoint: DataPoint = {
      id: this.counter,
      timestamp: new Date(),
      value: Math.round(Math.random() * 100),
      source: this.sources[this.counter % this.sources.length],
      payload: 'x'.repeat(512)
    };

    this.dataSubject.next([newPoint]);
  }
}