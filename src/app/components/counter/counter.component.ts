// src/app/components/counter/counter.component.ts
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-counter',
  template: `
    <div class="counter-container">
      <h3>Live Counter</h3>
      <p>Count: {{ count }}</p>
      <p>Last Update: {{ lastUpdate | date:'HH:mm:ss' }}</p>
      <div class="badge">Live</div>
    </div>
  `,
  styles: [`
    .counter-container { padding: 1.5rem; background: #f0f9f0; border-radius: 8px; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; margin-top: 0.5rem; background: #4caf50; color: white; }
  `]
})
export class CounterComponent implements OnInit, OnDestroy {
  count = 0;
  lastUpdate = new Date();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.count++;
        this.lastUpdate = new Date();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}