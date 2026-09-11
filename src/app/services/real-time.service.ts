// src/app/services/real-time.service.ts
import { Injectable } from '@angular/core';
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
  // Data stream that updates every second.
  // Emits a single-element array containing only the newest point.
  private dataSubject = new BehaviorSubject<DataPoint[]>([]);
  public data$ = this.dataSubject.asObservable();

  private counter = 0;
  private sources = ['Alpha', 'Beta', 'Gamma', 'Delta'];

  constructor() {
    // Simulate a real-time data feed: one new point per second.
    interval(1000).subscribe(() => {
      this.generateDataPoint();
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

    // Emit only the new point.
    this.dataSubject.next([newPoint]);
  }
}