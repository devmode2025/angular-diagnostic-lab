// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RealTimeService, DataPoint } from '../../services/real-time.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h2>📊 Live Data Dashboard</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <h4>Total Data Points</h4>
          <p>{{ totalRows }}</p>
        </div>
        <div class="metric-card">
          <h4>Latest Value</h4>
          <p>{{ latestValue ?? '—' }}</p>
        </div>
        <div class="metric-card">
          <h4>Last Source</h4>
          <p>{{ lastSource ?? '—' }}</p>
        </div>
      </div>
      <div class="data-table">
        <h4>Recent Data Stream</h4>
        <table *ngIf="dataPoints.length > 0">
          <thead>
            <tr><th>ID</th><th>Source</th><th>Value</th><th>Timestamp</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let point of dataPoints | slice:-10">
              <td>{{ point.id }}</td>
              <td>{{ point.source }}</td>
              <td>{{ point.value }}</td>
              <td>{{ point.timestamp | date:'HH:mm:ss' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 1.5rem; background: #f5f5f5; border-radius: 8px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1rem 0; }
    .metric-card { background: white; padding: 1rem; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric-card p { font-size: 1.5rem; margin: 0.5rem 0 0; font-weight: bold; }
    .data-table { background: white; padding: 1rem; border-radius: 4px; }
    .data-table table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #e0e0e0; padding: 0.5rem; text-align: left; }
    .data-table td { padding: 0.5rem; border-bottom: 1px solid #eee; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Everything this instance has ever seen. Unbounded. On purpose.
  private allRows: DataPoint[] = [];

  // Only the last 10 are rendered.
  recentRows: DataPoint[] = [];

  get dataPoints(): DataPoint[] {
    return this.recentRows;
  }

  get latestValue(): DataPoint['value'] | null {
    return this.allRows.length ? this.allRows[this.allRows.length - 1].value : null;
  }

  get lastSource(): string | null {
    return this.allRows.length ? this.allRows[this.allRows.length - 1].source : null;
  }

  // True total for the metric card — climbs past 126, 500, 1000...
  get totalRows(): number { return this.allRows.length; }

  private destroy$ = new Subject<void>();

  constructor(private realTimeService: RealTimeService) {}

  ngOnInit(): void {
    this.realTimeService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Service already emits only new points (see service fix below)
        for (const point of data) {
          this.allRows.push(point);          // never trimmed
        }
        this.recentRows = this.allRows.slice(-10);  // display window
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}